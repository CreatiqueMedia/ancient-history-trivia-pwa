# 🚀 Production Deployment Guide
**Ancient History PWA - Complete Deployment Checklist**

---

## 📋 **Pre-Deployment Checklist**

### **1. Environment Setup**
- [ ] Create production Firebase project
- [ ] Set up Google Analytics 4 property
- [ ] Configure Stripe/PayPal payment accounts
- [ ] Set up email service (SendGrid/EmailJS)
- [ ] Configure error tracking (Sentry)
- [ ] Set up notification service (FCM)

### **2. Environment Variables**
- [ ] Copy `.env.example` to `.env.production`
- [ ] Fill in all production API keys and secrets
- [ ] Verify all required environment variables are set
- [ ] Test environment variable loading

### **3. Code Preparation**
- [ ] Switch from `MockAuthContext` to `AuthContext` in `App.tsx`
- [ ] Update Firebase configuration in `src/config/firebase.ts`
- [ ] Enable all production features in `src/config/production.ts`
- [ ] Remove debug logging and console statements
- [ ] Optimize bundle size and performance

---

## 🔧 **Firebase Setup**

### **Create Firebase Project**
```bash
# Install Firebase CLI
npm install -g firebase-tools

# Login to Firebase
firebase login

# Initialize Firebase project
firebase init

# Select:
# - Authentication
# - Firestore Database
# - Hosting
# - Storage
# - Functions (optional)
```

### **Configure Authentication**
1. **Enable Sign-in Methods:**
   - Google
   - Facebook
   - Apple
   - Email/Password
   - Anonymous

2. **Add Authorized Domains:**
   - `yourdomain.com`
   - `www.yourdomain.com`

3. **Configure OAuth Consent Screen**

### **Firestore Security Rules**
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users can read/write their own profile
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Quiz results are user-specific
    match /quiz-results/{userId}/results/{resultId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Public question data
    match /questions/{document=**} {
      allow read: if true;
      allow write: if false; // Admin only
    }
  }
}
```

---

## 💳 **Payment Integration**

### **Stripe Setup**
1. **Create Stripe Account**
2. **Get API Keys:**
   - Publishable key: `pk_live_...`
   - Secret key: `sk_live_...`
   - Webhook secret: `whsec_...`

3. **Configure Webhooks:**
   ```
   Endpoint: https://yourdomain.com/api/stripe/webhook
   Events:
   - customer.subscription.created
   - customer.subscription.updated
   - customer.subscription.deleted
   - invoice.payment_succeeded
   - invoice.payment_failed
   ```

### **Subscription Products**
Create products in Stripe Dashboard:
- **Scholar**: $4.99/month
- **Historian**: $8.99/month
- **Academy**: $79.99 (one-time)

---

## 📧 **Email Service Setup**

### **SendGrid Configuration**
1. **Create SendGrid Account**
2. **Verify Domain**
3. **Create API Key**
4. **Set up Templates:**
   - Welcome email
   - Password reset
   - Subscription confirmation
   - Trial reminder

### **Email Templates**
Upload HTML templates to SendGrid:
```bash
# Use templates from src/services/EmailTemplateService.ts
# Convert to SendGrid format with dynamic variables
```

---

## 📊 **Analytics Setup**

### **Google Analytics 4**
1. **Create GA4 Property**
2. **Install gtag:**
   ```html
   <!-- Add to public/index.html -->
   <script async src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX"></script>
   <script>
     window.dataLayer = window.dataLayer || [];
     function gtag(){dataLayer.push(arguments);}
     gtag('js', new Date());
     gtag('config', 'G-XXXXXXXXXX');
   </script>
   ```

3. **Configure Enhanced Ecommerce:**
   - Track subscription purchases
   - Monitor conversion funnels
   - Set up custom events

### **Custom Events Tracking**
Events automatically tracked by AnalyticsService:
- `sign_up` - User registration
- `login` - User sign in
- `subscription_start` - New subscription
- `quiz_complete` - Quiz completion
- `achievement_unlock` - Achievement unlocked

---

## 🔔 **Push Notifications**

### **Firebase Cloud Messaging**
1. **Generate VAPID Keys:**
   ```bash
   # In Firebase Console > Project Settings > Cloud Messaging
   # Generate Web Push certificate
   ```

2. **Update Service Worker:**
   ```javascript
   // public/sw.js already configured
   // Add your VAPID key to environment variables
   ```

3. **Request Permission:**
   ```javascript
   // Handled by NotificationService.ts
   await notificationService.requestPermission();
   ```

---

## 🚀 **Build & Deployment**

### **Build for Production**
```bash
# Install dependencies
yarn install

# Build production bundle
yarn build

# Test production build locally
yarn preview
```

### **Deploy to Vercel**
```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
vercel

# Configure environment variables in Vercel dashboard
# Set custom domain
```

### **Deploy to Netlify**
```bash
# Build command: yarn build
# Publish directory: dist
# Environment variables: Set in Netlify dashboard
```

### **Deploy to Firebase Hosting**
```bash
# Build the app
yarn build

# Deploy to Firebase
firebase deploy --only hosting

# Set custom domain in Firebase console
```

---

## 🔒 **Security Configuration**

### **Content Security Policy**
Add to `public/index.html`:
```html
<meta http-equiv="Content-Security-Policy" content="
  default-src 'self';
  script-src 'self' 'unsafe-inline' https://www.googletagmanager.com;
  connect-src 'self' https://*.firebase.com https://*.googleapis.com https://api.stripe.com;
  img-src 'self' data: https:;
  style-src 'self' 'unsafe-inline';
">
```

### **HTTPS Configuration**
- [ ] SSL certificate installed
- [ ] HTTP to HTTPS redirect configured
- [ ] HSTS headers enabled
- [ ] Firebase Auth domains use HTTPS

---

## 📱 **PWA Configuration**

### **Web App Manifest**
Update `public/manifest.json`:
```json
{
  "name": "Ancient History Trivia",
  "short_name": "AncientHistory",
  "description": "Test your knowledge of ancient civilizations",
  "start_url": "/",
  "display": "standalone",
  "background_color": "#1a202c",
  "theme_color": "#667eea",
  "icons": [
    {
      "src": "/icon-192.png",
      "sizes": "192x192",
      "type": "image/png"
    },
    {
      "src": "/icon-512.svg",
      "sizes": "512x512",
      "type": "image/svg+xml"
    }
  ]
}
```

### **Service Worker**
- [ ] Service worker registered (`public/sw.js`)
- [ ] Offline functionality working
- [ ] Cache strategies implemented
- [ ] Push notifications enabled

---

## 🧪 **Testing**

### **Pre-Production Tests**
```bash
# Run all tests
yarn test

# Build and test production bundle
yarn build && yarn preview

# Test PWA features
# - Offline mode
# - Add to home screen
# - Push notifications

# Test authentication flows
# - Google sign-in
# - Facebook sign-in
# - Email sign-up/sign-in
# - Password reset

# Test subscription flows
# - Free to paid upgrade
# - Trial expiration
# - Payment failure handling

# Test quiz functionality
# - Bundle access control
# - Progress tracking
# - Achievement unlocking
```

### **Performance Testing**
```bash
# Lighthouse audit
npx lighthouse https://yourdomain.com --view

# WebPageTest
# https://www.webpagetest.org/

# Google PageSpeed Insights
# https://pagespeed.web.dev/
```

---

## 📈 **Monitoring & Analytics**

### **Key Metrics to Track**
- **User Acquisition:**
  - Daily/Monthly Active Users
  - Registration conversion rate
  - Traffic sources

- **User Engagement:**
  - Session duration
  - Quiz completion rate
  - Daily/weekly retention

- **Revenue Metrics:**
  - Trial-to-paid conversion
  - Monthly Recurring Revenue
  - Customer Lifetime Value
  - Churn rate

- **Technical Metrics:**
  - Page load times
  - Error rates
  - App crash rates
  - API response times

### **Dashboard Setup**
1. **Google Analytics 4:**
   - Custom dashboard for PWA metrics
   - E-commerce tracking for subscriptions
   - User behavior flow analysis

2. **Firebase Analytics:**
   - User engagement metrics
   - Crash-free users
   - App performance

3. **Stripe Dashboard:**
   - Revenue tracking
   - Subscription metrics
   - Payment failure rates

---

## 🔧 **Post-Deployment Tasks**

### **Immediate (Day 1)**
- [ ] Verify all features working in production
- [ ] Test authentication flows
- [ ] Test payment processing
- [ ] Check analytics data collection
- [ ] Monitor error rates
- [ ] Test push notifications

### **Week 1**
- [ ] Monitor user registration rates
- [ ] Track conversion funnel performance
- [ ] Review error logs and fix issues
- [ ] Optimize based on real user data
- [ ] Set up monitoring alerts

### **Month 1**
- [ ] Analyze user behavior patterns
- [ ] A/B test subscription pricing
- [ ] Optimize conversion rates
- [ ] Plan feature updates
- [ ] Gather user feedback

---

## 🆘 **Troubleshooting**

### **Common Issues**

**Authentication Issues:**
```bash
# Check Firebase configuration
# Verify authorized domains
# Check OAuth consent screen
```

**Payment Issues:**
```bash
# Verify Stripe webhook endpoints
# Check payment method requirements
# Test with Stripe test cards
```

**PWA Issues:**
```bash
# Check service worker registration
# Verify manifest.json
# Test offline functionality
```

**Performance Issues:**
```bash
# Analyze bundle size
yarn build --analyze

# Check for memory leaks
# Optimize images and assets
# Enable gzip compression
```

---

## 📞 **Support & Maintenance**

### **Monitoring Tools**
- **Uptime:** UptimeRobot or Pingdom
- **Performance:** New Relic or DataDog
- **Errors:** Sentry
- **User Sessions:** LogRocket or FullStory

### **Backup Strategy**
- **Database:** Daily Firebase exports
- **Code:** Git repository with tags
- **Configuration:** Environment variable backups
- **Analytics:** Regular data exports

### **Update Strategy**
- **Hot Fixes:** Immediate deployment for critical issues
- **Feature Updates:** Weekly releases
- **Major Updates:** Monthly with user communication
- **Security Updates:** Immediate deployment

---

**🎉 Deployment Complete!**
**Monitor your metrics and iterate based on user feedback.**

**Last Updated:** June 10, 2025  
**Next Review:** Post-launch analysis (1 week)
