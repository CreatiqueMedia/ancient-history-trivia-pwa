# 🚨 PROJECT ARCHITECTURE - CRITICAL GUIDANCE 🚨

## ⚠️ **ABSOLUTELY NO FIRESTORE** ⚠️

This project **DOES NOT USE FIRESTORE** and **NEVER SHOULD**.

### **❌ NEVER DO THIS:**
- ❌ Import anything from `firebase/firestore`
- ❌ Create services that use `getFirestore()`, `doc()`, `setDoc()`, `getDoc()`
- ❌ Add Firestore to firebase.json
- ❌ Suggest adding Firestore for any reason
- ❌ Try to "fix" missing Firestore dependencies

### **✅ ALWAYS USE INSTEAD:**
- ✅ **Stripe** for all payment and subscription management
- ✅ **localStorage** for trial tracking and caching
- ✅ **Firebase Auth** for user authentication only
- ✅ **Firebase Hosting** for deployment only

---

## 🏗️ **CURRENT ARCHITECTURE**

### **Core Stack:**
```
┌─────────────────────────────────────────┐
│  FRONTEND (React/TypeScript/Vite)      │
├─────────────────────────────────────────┤
│  Firebase Auth (Google, Apple, Email)  │
├─────────────────────────────────────────┤
│  Stripe (Payments & Subscriptions)     │
├─────────────────────────────────────────┤
│  localStorage (Trials & Cache)         │
├─────────────────────────────────────────┤
│  Firebase Hosting (Static Deploy)      │
└─────────────────────────────────────────┘
```

### **Data Management:**
- **User Auth**: Firebase Auth
- **Subscriptions**: Stripe Customer Portal + Webhooks
- **Trials**: `StripeTrialService` (localStorage)
- **Questions**: `LocalQuestionService` (bundled + cached)
- **Purchases**: `StripePurchaseContentService` (localStorage + Stripe)

---

## 📁 **SERVICE ARCHITECTURE**

### **✅ CURRENT SERVICES (USE THESE):**

#### **`StripeTrialService.ts`**
- Manages 3-day free trials
- Uses localStorage for persistence
- Methods: `startTrial()`, `isInTrial()`, `getTrialStatus()`, `endTrial()`

#### **`LocalQuestionService.ts`**
- Serves questions from bundled data
- Uses localStorage for caching
- Methods: `getQuestionsForBundle()`, `hasQuestionsForBundle()`

#### **`StripePurchaseContentService.ts`**
- Tracks purchases via Stripe webhooks
- Uses localStorage for purchase records
- Methods: `recordPurchase()`, `isPurchased()`, `getQuestionsForPurchase()`

### **❌ DELETED SERVICES (NEVER RECREATE):**
- ~~`TrialService.ts`~~ → Use `StripeTrialService`
- ~~`FirestoreQuestionService.ts`~~ → Use `LocalQuestionService`
- ~~`PurchaseContentDeliveryService.ts`~~ → Use `StripePurchaseContentService`

---

## 🔧 **IMPORT PATTERNS**

### **✅ CORRECT IMPORTS:**
```typescript
// Authentication
import { auth } from '../config/firebase';
import { useAuth } from '../hooks/useAuth';

// Trials
import { StripeTrialService } from '../services/StripeTrialService';

// Questions
import { LocalQuestionService } from '../services/LocalQuestionService';

// Purchases
import { StripePurchaseContentService } from '../services/StripePurchaseContentService';
```

### **❌ NEVER IMPORT:**
```typescript
// ❌ FIRESTORE - NEVER USE
import { db } from '../config/firebase';
import { getFirestore, doc, setDoc } from 'firebase/firestore';

// ❌ OLD SERVICES - DELETED
import { TrialService } from '../services/TrialService';
import { FirestoreQuestionService } from '../services/FirestoreQuestionService';
import { PurchaseContentDeliveryService } from '../services/PurchaseContentDeliveryService';
```

---

## 🎯 **KEY COMPONENTS STATUS**

### **`BillingScreen.tsx`** ✅
- Uses `StripeTrialService` for trial management
- Shows FREE/PAID status correctly
- All action buttons functional
- **NO FIRESTORE DEPENDENCIES**

### **`PurchaseContext.tsx`** ✅
- Uses `StripeTrialService.isInTrial()` for premium checks
- Real-time subscription updates via localStorage events
- **NO FIRESTORE DEPENDENCIES**

### **Firebase Config** ✅
- **Auth only**: `getAuth()`, `GoogleAuthProvider`, `OAuthProvider`
- **NO FIRESTORE**: No `getFirestore()` or Firestore imports
- **Hosting ready**: Works with `firebase deploy --only hosting`

---

## 🚀 **DEPLOYMENT PROCESS**

### **Build & Deploy:**
```bash
yarn run build          # ✅ Should work without Firestore
firebase deploy --only hosting  # ✅ Hosting only, no database
```

### **firebase.json Configuration:**
```json
{
  "functions": { ... },
  "hosting": { ... }
  // ❌ NO "firestore" section
}
```

---

## 🛡️ **TROUBLESHOOTING GUIDE**

### **If Build Fails:**
1. **Check for Firestore imports** - Remove any `firebase/firestore` imports
2. **Check service references** - Use new services only
3. **Check firebase.json** - Should not have `firestore` section

### **If Deployment Fails:**
1. Use `firebase deploy --only hosting`
2. **Never deploy functions or firestore**
3. If Firestore API error, ignore it - we don't use it

### **If Features Break:**
- **Trials**: Check `StripeTrialService` localStorage data
- **Questions**: Use `LocalQuestionService` methods
- **Purchases**: Check Stripe webhook configuration

---

## 📋 **FEATURE CHECKLIST**

### **✅ Working Features:**
- [x] User authentication (Google, Apple, Email)
- [x] Free trial management (3-day localStorage trials)
- [x] Subscription billing via Stripe
- [x] Question delivery (sample + full sets)
- [x] Billing screen shows correct status
- [x] Real-time subscription updates
- [x] PWA functionality

### **🔄 Data Flow:**
```
User Login → Firebase Auth
Trial Start → StripeTrialService → localStorage
Purchase → Stripe → Webhook → StripePurchaseContentService
Questions → LocalQuestionService → Bundled Data
```

---

## 🎯 **WHEN ADDING NEW FEATURES:**

### **✅ DO:**
- Use Stripe for any payment-related features
- Use localStorage for client-side persistence
- Use Firebase Auth for user management
- Use bundled data for content delivery

### **❌ DON'T:**
- Add Firestore for any reason
- Create database-dependent services
- Suggest "real-time" features that need a database
- Add server-side data persistence beyond Stripe

---

## 📞 **SUPPORT RESOURCES**

- **Stripe Documentation**: https://stripe.com/docs
- **Firebase Auth**: https://firebase.google.com/docs/auth
- **Firebase Hosting**: https://firebase.google.com/docs/hosting
- **This Project Docs**: `/docs/` folder

---

## 🔄 **LAST UPDATED**
- **Date**: August 12, 2025
- **Architecture**: Stripe-only (Firestore removed)
- **Status**: ✅ Working - **DO NOT CHANGE**

---

**🚨 REMEMBER: This app works perfectly WITHOUT Firestore. Keep it that way! 🚨**
