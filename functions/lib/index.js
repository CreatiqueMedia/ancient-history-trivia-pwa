"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getSubscriptionStatus = exports.stripeWebhook = exports.createCheckoutSession = void 0;
const functions = require("firebase-functions");
const admin = require("firebase-admin");
const stripe_1 = require("stripe");
const cors = require("cors");
// Initialize Firebase Admin
admin.initializeApp();
// Initialize Stripe with secret key from environment
const stripe = new stripe_1.default(functions.config().stripe.secret_key, {
    apiVersion: '2023-10-16',
});
// CORS configuration
const corsHandler = cors({ origin: true });
/**
 * Create Stripe Checkout Session
 * This function creates a secure checkout session for payments
 */
exports.createCheckoutSession = functions.https.onRequest((req, res) => {
    corsHandler(req, res, async () => {
        try {
            if (req.method !== 'POST') {
                res.status(405).json({ error: 'Method not allowed' });
                return;
            }
            // Verify user authentication
            const authHeader = req.headers.authorization;
            if (!authHeader || !authHeader.startsWith('Bearer ')) {
                res.status(401).json({ error: 'Unauthorized' });
                return;
            }
            const idToken = authHeader.split('Bearer ')[1];
            const decodedToken = await admin.auth().verifyIdToken(idToken);
            const userId = decodedToken.uid;
            const { priceId, planType, successUrl, cancelUrl } = req.body;
            if (!priceId || !planType || !successUrl || !cancelUrl) {
                res.status(400).json({
                    error: 'Missing required fields: priceId, planType, successUrl, cancelUrl'
                });
                return;
            }
            // Create checkout session
            const session = await stripe.checkout.sessions.create({
                customer_email: decodedToken.email,
                client_reference_id: userId,
                line_items: [
                    {
                        price: priceId,
                        quantity: 1,
                    },
                ],
                mode: planType.includes('monthly') || planType.includes('annual') || planType.includes('biennial')
                    ? 'subscription'
                    : 'payment',
                success_url: successUrl,
                cancel_url: cancelUrl,
                metadata: {
                    userId: userId,
                    planType: planType,
                    email: decodedToken.email || '',
                },
                allow_promotion_codes: true,
                billing_address_collection: 'auto',
                tax_id_collection: {
                    enabled: true,
                },
            });
            res.status(200).json({
                sessionId: session.id,
                url: session.url
            });
        }
        catch (error) {
            console.error('Error creating checkout session:', error);
            res.status(500).json({
                error: 'Failed to create checkout session',
                details: error instanceof Error ? error.message : 'Unknown error'
            });
        }
    });
});
/**
 * Handle Stripe Webhooks
 * This function processes webhook events from Stripe
 */
exports.stripeWebhook = functions.https.onRequest((req, res) => {
    try {
        const sig = req.headers['stripe-signature'];
        const webhookSecret = functions.config().stripe.webhook_secret;
        let event;
        try {
            // Verify webhook signature
            event = stripe.webhooks.constructEvent(req.body, sig, webhookSecret);
        }
        catch (error) {
            console.error('Webhook signature verification failed:', error);
            res.status(400).send(`Webhook Error: ${error}`);
            return;
        }
        // Handle the event
        try {
            switch (event.type) {
                case 'checkout.session.completed':
                    handleCheckoutCompleted(event.data.object);
                    break;
                case 'customer.subscription.created':
                    handleSubscriptionCreated(event.data.object);
                    break;
                case 'customer.subscription.updated':
                    handleSubscriptionUpdated(event.data.object);
                    break;
                case 'customer.subscription.deleted':
                    handleSubscriptionDeleted(event.data.object);
                    break;
                case 'invoice.payment_succeeded':
                    handlePaymentSucceeded(event.data.object);
                    break;
                case 'invoice.payment_failed':
                    handlePaymentFailed(event.data.object);
                    break;
                default:
                    console.log(`Unhandled event type: ${event.type}`);
            }
            res.status(200).json({ received: true });
        }
        catch (error) {
            console.error('Error handling webhook:', error);
            res.status(500).json({ error: 'Webhook handler failed' });
        }
    }
    catch (error) {
        console.error('Webhook processing error:', error);
        res.status(500).json({ error: 'Webhook processing failed' });
    }
});
/**
 * Handle successful checkout completion
 */
async function handleCheckoutCompleted(session) {
    var _a;
    const userId = session.client_reference_id;
    const planType = (_a = session.metadata) === null || _a === void 0 ? void 0 : _a.planType;
    if (!userId || !planType) {
        console.error('Missing userId or planType in checkout session');
        return;
    }
    try {
        // Update user's purchase status in Firestore
        const userRef = admin.firestore().collection('users').doc(userId);
        const updateData = {
            lastPurchase: admin.firestore.FieldValue.serverTimestamp(),
            stripeCustomerId: session.customer,
        };
        if (planType.includes('monthly') || planType.includes('annual') || planType.includes('biennial')) {
            // Subscription purchase
            updateData.subscriptionStatus = 'active';
            updateData.subscriptionType = planType;
            updateData.subscriptionId = session.subscription;
        }
        else {
            // One-time bundle purchase
            updateData[`bundles.${planType}`] = {
                purchased: true,
                purchaseDate: admin.firestore.FieldValue.serverTimestamp(),
                sessionId: session.id,
            };
        }
        await userRef.set(updateData, { merge: true });
        console.log(`Purchase processed for user ${userId}, plan: ${planType}`);
    }
    catch (error) {
        console.error('Error updating user purchase status:', error);
    }
}
/**
 * Handle subscription creation
 */
async function handleSubscriptionCreated(subscription) {
    const customerId = subscription.customer;
    try {
        // Find user by Stripe customer ID
        const usersRef = admin.firestore().collection('users');
        const userQuery = await usersRef.where('stripeCustomerId', '==', customerId).get();
        if (userQuery.empty) {
            console.error('No user found for customer ID:', customerId);
            return;
        }
        const userDoc = userQuery.docs[0];
        await userDoc.ref.update({
            subscriptionStatus: subscription.status,
            subscriptionId: subscription.id,
            subscriptionCurrentPeriodStart: new Date(subscription.current_period_start * 1000),
            subscriptionCurrentPeriodEnd: new Date(subscription.current_period_end * 1000),
        });
        console.log(`Subscription created for customer ${customerId}`);
    }
    catch (error) {
        console.error('Error handling subscription creation:', error);
    }
}
/**
 * Handle subscription updates
 */
async function handleSubscriptionUpdated(subscription) {
    const customerId = subscription.customer;
    try {
        const usersRef = admin.firestore().collection('users');
        const userQuery = await usersRef.where('stripeCustomerId', '==', customerId).get();
        if (userQuery.empty) {
            console.error('No user found for customer ID:', customerId);
            return;
        }
        const userDoc = userQuery.docs[0];
        await userDoc.ref.update({
            subscriptionStatus: subscription.status,
            subscriptionCurrentPeriodStart: new Date(subscription.current_period_start * 1000),
            subscriptionCurrentPeriodEnd: new Date(subscription.current_period_end * 1000),
        });
        console.log(`Subscription updated for customer ${customerId}`);
    }
    catch (error) {
        console.error('Error handling subscription update:', error);
    }
}
/**
 * Handle subscription deletion/cancellation
 */
async function handleSubscriptionDeleted(subscription) {
    const customerId = subscription.customer;
    try {
        const usersRef = admin.firestore().collection('users');
        const userQuery = await usersRef.where('stripeCustomerId', '==', customerId).get();
        if (userQuery.empty) {
            console.error('No user found for customer ID:', customerId);
            return;
        }
        const userDoc = userQuery.docs[0];
        await userDoc.ref.update({
            subscriptionStatus: 'canceled',
            subscriptionCanceledAt: admin.firestore.FieldValue.serverTimestamp(),
        });
        console.log(`Subscription canceled for customer ${customerId}`);
    }
    catch (error) {
        console.error('Error handling subscription deletion:', error);
    }
}
/**
 * Handle successful payments
 */
async function handlePaymentSucceeded(invoice) {
    const customerId = invoice.customer;
    try {
        const usersRef = admin.firestore().collection('users');
        const userQuery = await usersRef.where('stripeCustomerId', '==', customerId).get();
        if (userQuery.empty) {
            console.error('No user found for customer ID:', customerId);
            return;
        }
        const userDoc = userQuery.docs[0];
        await userDoc.ref.update({
            lastPaymentSucceeded: admin.firestore.FieldValue.serverTimestamp(),
            subscriptionStatus: 'active',
        });
        console.log(`Payment succeeded for customer ${customerId}`);
    }
    catch (error) {
        console.error('Error handling payment success:', error);
    }
}
/**
 * Handle failed payments
 */
async function handlePaymentFailed(invoice) {
    const customerId = invoice.customer;
    try {
        const usersRef = admin.firestore().collection('users');
        const userQuery = await usersRef.where('stripeCustomerId', '==', customerId).get();
        if (userQuery.empty) {
            console.error('No user found for customer ID:', customerId);
            return;
        }
        const userDoc = userQuery.docs[0];
        await userDoc.ref.update({
            lastPaymentFailed: admin.firestore.FieldValue.serverTimestamp(),
            subscriptionStatus: 'past_due',
        });
        console.log(`Payment failed for customer ${customerId}`);
    }
    catch (error) {
        console.error('Error handling payment failure:', error);
    }
}
/**
 * Get user's subscription status
 */
exports.getSubscriptionStatus = functions.https.onCall(async (data, context) => {
    // Verify user authentication
    if (!context.auth) {
        throw new functions.https.HttpsError('unauthenticated', 'User must be authenticated');
    }
    const userId = context.auth.uid;
    try {
        const userDoc = await admin.firestore().collection('users').doc(userId).get();
        if (!userDoc.exists) {
            return {
                isPremium: false,
                subscriptionStatus: 'none',
                bundles: {}
            };
        }
        const userData = userDoc.data();
        return {
            isPremium: (userData === null || userData === void 0 ? void 0 : userData.subscriptionStatus) === 'active',
            subscriptionStatus: (userData === null || userData === void 0 ? void 0 : userData.subscriptionStatus) || 'none',
            subscriptionType: (userData === null || userData === void 0 ? void 0 : userData.subscriptionType) || null,
            bundles: (userData === null || userData === void 0 ? void 0 : userData.bundles) || {},
            subscriptionCurrentPeriodEnd: userData === null || userData === void 0 ? void 0 : userData.subscriptionCurrentPeriodEnd,
        };
    }
    catch (error) {
        console.error('Error getting subscription status:', error);
        throw new functions.https.HttpsError('internal', 'Failed to get subscription status');
    }
});
//# sourceMappingURL=index.js.map