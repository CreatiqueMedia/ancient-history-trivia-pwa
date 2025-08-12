# 🔒 AI RESPONSE PROTOCOL - ANCIENT HISTORY TRIVIA PWA

## 🚨 MANDATORY HEADER FOR EVERY AI RESPONSE 🚨

**EVERY AI RESPONSE MUST START WITH THIS VERIFICATION:**

```
✅ ARCHITECTURE VERIFIED:
- Project: Ancient History Trivia PWA  
- Architecture: Firebase Auth + Stripe + localStorage + Hosting
- NO DATABASE: No Firestore, No server storage
- Services: StripeTrialService, LocalQuestionService, StripePurchaseContentService
- Task: [DESCRIBE USER REQUEST]
- Solution Approach: [localStorage/Stripe/bundled data approach]
```

## 🛡️ MANDATORY CHECKS BEFORE EVERY RESPONSE

### **1. READ THESE FILES FIRST:**
```
□ /MANDATORY_CHECKLIST.md
□ /AI_SYSTEM_PROMPT.md  
□ /docs/PROJECT_ARCHITECTURE.md
```

### **2. TASK CLASSIFICATION:**
```
□ Data storage request → localStorage/Stripe solution
□ Trial/subscription request → StripeTrialService
□ Question/content request → LocalQuestionService  
□ Build/deploy issue → Remove Firestore imports, don't add them
□ Service integration → Use Stripe*/Local* services only
```

### **3. FORBIDDEN RESPONSE PATTERNS:**
```
❌ "Let's use Firestore for..."
❌ "We can store this in the database..."
❌ "Import from 'firebase/firestore'"
❌ "Create a Firestore collection..."
❌ "Add firestore to firebase.json..."
❌ Reference to TrialService, FirestoreQuestionService, PurchaseContentDeliveryService
```

### **4. REQUIRED RESPONSE PATTERNS:**
```
✅ "We'll use localStorage for..."
✅ "We'll store this in Stripe metadata..."
✅ "We'll bundle this data in the app..."
✅ "Using StripeTrialService for trials..."
✅ "Using LocalQuestionService for questions..."
✅ "Using StripePurchaseContentService for purchases..."
```

## 🎯 SUCCESS CRITERIA

**Every response must:**
1. Start with the verification header
2. Use only approved services (Stripe*, Local*)
3. Suggest only localStorage/Stripe/bundled solutions
4. Include testing reminder (yarn run build)
5. Zero Firestore references

## 🚨 ESCALATION PROTOCOL

**If user reports repeated Firestore mistakes:**
1. STOP and read this entire file
2. Acknowledge the mistake immediately
3. Provide the correct Stripe/localStorage solution
4. Commit to following this protocol strictly

---

**This protocol exists because Firestore mistakes have caused significant frustration. Following it precisely prevents those issues.**
