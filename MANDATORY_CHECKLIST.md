# 🚨 MANDATORY PRE-TASK CHECKLIST 🚨

## ⚠️ READ THIS BEFORE EVERY SINGLE CODE CHANGE ⚠️

### **STEP 1: ARCHITECTURE CHECK (REQUIRED)**
```
□ This project uses: Firebase Auth + Stripe + localStorage + Hosting
□ This project NEVER uses: Firestore, Database, Server storage
□ I have read /docs/PROJECT_ARCHITECTURE.md
□ I understand this is a Stripe-only app
```

### **STEP 2: SERVICE VERIFICATION (REQUIRED)**
```
□ For trials: Use StripeTrialService (NOT TrialService)
□ For questions: Use LocalQuestionService (NOT FirestoreQuestionService)  
□ For purchases: Use StripePurchaseContentService (NOT PurchaseContentDeliveryService)
□ NO imports from 'firebase/firestore'
```

### **STEP 3: COMMON TASKS GUIDE (REQUIRED)**

#### **User wants data storage:**
- ❌ NEVER suggest: Firestore, database, server storage
- ✅ ALWAYS suggest: localStorage, Stripe metadata, bundled data

#### **User wants trials/subscriptions:**
- ❌ NEVER use: TrialService, database trials
- ✅ ALWAYS use: StripeTrialService (localStorage-based)

#### **User wants questions/content:**
- ❌ NEVER use: FirestoreQuestionService, database storage
- ✅ ALWAYS use: LocalQuestionService (bundled + cached)

#### **Build/Deploy issues:**
- ❌ NEVER add: Firestore to fix build errors
- ✅ ALWAYS use: yarn run build && firebase deploy --only hosting

### **STEP 4: FINAL VERIFICATION (REQUIRED)**
```
□ No Firestore imports in my changes
□ Using correct service names (Stripe*, Local*)
□ Solution uses localStorage/Stripe/bundled data only
□ Will test with yarn run build
```

---

## 🛡️ **EMERGENCY STOP CONDITIONS**

### **IF USER MENTIONS:**
- "Database" → STOP → Use localStorage/Stripe instead
- "Real-time sync" → STOP → Use localStorage events/Stripe webhooks
- "Store data" → STOP → Check if localStorage/Stripe can handle it
- "Firestore error" → STOP → Remove Firestore, don't add it

### **IF I WANT TO:**
- Add Firestore → STOP → Read this checklist again
- Create database service → STOP → Use existing Stripe/Local services
- Import from 'firebase/firestore' → STOP → Use auth/hosting only
- Fix "missing db" error → STOP → Remove the dependency

---

## 📋 **RESPONSE TEMPLATE (USE THIS)**

### **Before ANY code change, I must say:**
```
✅ ARCHITECTURE CHECK:
- Confirmed: Stripe-only app (no Firestore)
- Service: Using [StripeTrialService/LocalQuestionService/etc]
- Approach: [localStorage/Stripe/bundled data]
```

### **Then provide the solution.**

---

## 🔄 **TESTING REQUIREMENTS**

### **After every change:**
1. Run `yarn run build` to verify no Firestore errors
2. Check that services use correct names (Stripe*, Local*)
3. Verify no new Firestore imports added

---

**🚨 FAILURE TO FOLLOW THIS CHECKLIST = BROKEN APP 🚨**

**💡 REMEMBER: This app works perfectly WITHOUT Firestore. Keep it that way!**
