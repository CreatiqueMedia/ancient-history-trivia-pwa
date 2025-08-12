# 🤖 AI ASSISTANT INSTRUCTIONS

## 🚨 **CRITICAL - READ FIRST** 🚨

**This project uses Stripe-only architecture. NEVER suggest or add Firestore.**

---

## 📋 **BEFORE MAKING ANY CHANGES:**

### **1. Always Check Current Architecture:**
- Read `/docs/PROJECT_ARCHITECTURE.md` first
- This app uses: Firebase Auth + Stripe + localStorage + Hosting
- This app **NEVER** uses: Firestore, Database, Server-side storage

### **2. Service Reference Guide:**
```typescript
// ✅ USE THESE SERVICES:
StripeTrialService      // Trial management (localStorage)
LocalQuestionService    // Question delivery (bundled data)
StripePurchaseContentService // Purchase tracking (Stripe + localStorage)

// ❌ NEVER REFERENCE THESE (DELETED):
TrialService           // Replaced with StripeTrialService
FirestoreQuestionService // Replaced with LocalQuestionService
PurchaseContentDeliveryService // Replaced with StripePurchaseContentService
```

### **3. Import Patterns:**
```typescript
// ✅ CORRECT:
import { StripeTrialService } from '../services/StripeTrialService';
import { auth } from '../config/firebase';

// ❌ NEVER USE:
import { db } from '../config/firebase';
import { getFirestore } from 'firebase/firestore';
```

---

## 🛠️ **WHEN USER ASKS FOR FEATURES:**

### **Data Storage Questions:**
- **User asks**: "Store user data" → **Answer**: Use localStorage or Stripe metadata
- **User asks**: "Real-time updates" → **Answer**: Use localStorage events or Stripe webhooks
- **User asks**: "Database" → **Answer**: This app doesn't use databases, use Stripe + localStorage

### **Trial/Subscription Features:**
- **Always use**: `StripeTrialService` for trials
- **Always use**: Stripe Customer Portal for billing management
- **Never suggest**: Creating new database tables or Firestore collections

### **Question/Content Features:**
- **Always use**: `LocalQuestionService` for question delivery
- **Questions are**: Bundled in the app and cached in localStorage
- **Never suggest**: Storing questions in a database

---

## 🔧 **COMMON TASKS & SOLUTIONS:**

### **Adding New Features:**
1. **Check**: Does this need data persistence?
2. **If yes**: Can localStorage handle it?
3. **If no**: Can Stripe metadata handle it?
4. **Never**: Add Firestore or database solutions

### **Debugging Build Issues:**
1. **First check**: Any Firestore imports?
2. **Remove**: Any `firebase/firestore` references
3. **Use**: `yarn run build` to test
4. **Deploy**: `firebase deploy --only hosting`

### **User Authentication:**
- **Use**: Firebase Auth (Google, Apple, Email)
- **Store user data**: In Stripe customer records
- **Track sessions**: Use Firebase Auth state

### **Payment/Billing:**
- **Use**: Stripe for everything payment-related
- **Trials**: `StripeTrialService` (localStorage-based)
- **Subscriptions**: Stripe Customer Portal + webhooks
- **Invoices**: Stripe-generated

---

## 📁 **FILE ORGANIZATION:**

### **Services Directory:**
```
src/services/
├── StripeTrialService.ts        ✅ Use for trials
├── LocalQuestionService.ts      ✅ Use for questions  
├── StripePurchaseContentService.ts ✅ Use for purchases
├── AnalyticsService.ts          ✅ Firebase Analytics
├── NotificationService.ts       ✅ Push notifications
└── EmailTemplateService.ts      ✅ Email templates
```

### **Config:**
```
src/config/
└── firebase.ts                  ✅ Auth + Hosting only (NO Firestore)
```

---

## 🚀 **DEPLOYMENT CHECKLIST:**

### **Before Every Deploy:**
- [ ] `yarn run build` succeeds
- [ ] No Firestore imports in build output  
- [ ] Use `firebase deploy --only hosting`
- [ ] Test billing screen shows correct status

### **If Deploy Fails:**
- **Firestore API error**: Ignore (we don't use it)
- **Build error**: Check for old service imports
- **Function error**: Deploy hosting only

---

## 🎯 **SUCCESS CRITERIA:**

### **User sees working app with:**
- [x] Authentication works
- [x] Free trials work (localStorage)
- [x] Billing screen shows correct status
- [x] Subscriptions work via Stripe
- [x] Questions load properly
- [x] No console errors
- [x] PWA features work

### **Code quality:**
- [x] No Firestore imports anywhere
- [x] Uses correct service names
- [x] Builds without errors
- [x] Deploys to hosting only

---

## 🆘 **IF USER IS FRUSTRATED:**

### **Acknowledge & Apologize:**
"I understand your frustration. I should have checked the project architecture first."

### **Provide Clear Fix:**
1. Explain what went wrong
2. Show the correct approach
3. Reference this documentation
4. Test the solution

### **Prevent Future Issues:**
"I've documented this to prevent similar issues in the future."

---

## 📚 **DOCUMENTATION HIERARCHY:**

1. **PROJECT_ARCHITECTURE.md** - Technical architecture overview
2. **AI_ASSISTANT_INSTRUCTIONS.md** - This file (AI guidance)
3. **COMPREHENSIVE_PROJECT_DOCUMENTATION.md** - Detailed project docs
4. **MILESTONE_WORKING_STATE.md** - Project milestones
5. **STRIPE_LIVE_SETUP.md** - Stripe configuration

---

## 🔄 **KEEP THIS UPDATED:**

When making significant changes:
1. Update PROJECT_ARCHITECTURE.md
2. Update this file if needed
3. Test all changes
4. Document any new patterns

---

**🎯 GOAL: Keep this app working smoothly with Stripe-only architecture!**
