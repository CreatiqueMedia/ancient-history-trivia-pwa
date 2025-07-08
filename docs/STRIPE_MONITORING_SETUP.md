# Stripe Dashboard Monitoring Setup Guide

## Setting Up Stripe Dashboard Alerts

### 1. Login to Stripe Dashboard
- Go to: https://dashboard.stripe.com/
- Login with your Stripe account

### 2. Configure Payment Alerts

#### Failed Payment Alerts
1. **Go to Settings > Notifications**
2. **Click "Add endpoint" for webhooks**
3. **Add these events:**
   - `payment_intent.payment_failed`
   - `invoice.payment_failed` 
   - `charge.failed`

#### Chargeback/Dispute Alerts
1. **In Notifications settings**
2. **Enable email alerts for:**
   - `charge.dispute.created`
   - `charge.dispute.updated`
   - High-risk transactions

#### Revenue Monitoring
1. **Go to Home > Overview**
2. **Set up custom date ranges**
3. **Monitor key metrics:**
   - Gross volume
   - Net revenue
   - Success rate
   - Failed payment rate

### 3. Webhook Monitoring (Optional Advanced Setup)

If you want real-time notifications:

```javascript
// Add to your backend (if you have one)
app.post('/webhook', (req, res) => {
  const event = req.body;
  
  switch (event.type) {
    case 'payment_intent.payment_failed':
      // Send alert (email, Slack, etc.)
      console.error('Payment failed:', event.data.object);
      break;
    case 'charge.dispute.created':
      // Critical alert for chargebacks
      console.error('CHARGEBACK:', event.data.object);
      break;
  }
  
  res.json({received: true});
});
```

### 4. Key Metrics to Monitor

#### Daily Checks
- [ ] Payment success rate (should be >95%)
- [ ] Failed payment reasons
- [ ] New disputes/chargebacks
- [ ] Revenue vs. previous day

#### Weekly Checks  
- [ ] Customer churn rate
- [ ] Average transaction value
- [ ] Geographic transaction patterns
- [ ] Payment method performance

#### Monthly Checks
- [ ] Monthly Recurring Revenue (MRR)
- [ ] Customer Lifetime Value (CLV)
- [ ] Payment gateway costs
- [ ] Fraud/risk analysis

### 5. Alert Thresholds

**🟡 Warning Alerts:**
- Payment failure rate >5%
- Daily revenue drop >20%
- Unusual geographic activity

**🔴 Critical Alerts:**
- Payment failure rate >10%
- Any chargeback/dispute
- Daily revenue drop >50%
- Suspected fraud activity

### 6. Emergency Response

**If Payment Failures Spike:**
1. Check Stripe status page
2. Review recent code deployments
3. Check payment form functionality
4. Contact Stripe support if needed

**If Chargeback Received:**
1. Immediate email notification
2. Review transaction details
3. Gather evidence for dispute
4. Respond within 7 days

## Dashboard URLs

- **Main Dashboard**: https://dashboard.stripe.com/
- **Payment Analytics**: https://dashboard.stripe.com/analytics/overview
- **Disputes**: https://dashboard.stripe.com/disputes
- **Webhooks**: https://dashboard.stripe.com/webhooks
- **Notifications**: https://dashboard.stripe.com/settings/notifications
