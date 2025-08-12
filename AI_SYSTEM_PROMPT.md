# 🤖 AI SYSTEM INSTRUCTIONS - ANCIENT HISTORY TRIVIA PWA

## 🚨 CRITICAL: READ BEFORE EVERY INTERACTION 🚨

### 🛡️ ENHANCED GUARDRAILS SYSTEM ACTIVE
**Additional mandatory files:**
- `/.ai-guardrails/RESPONSE_PROTOCOL.md` (response format)
- `/.ai-guardrails/QUICK_REFERENCE.md` (instant lookup)
- `/.ai-guardrails/FIRESTORE_PREVENTION.md` (zero tolerance)

**EVERY RESPONSE MUST START WITH THE VERIFICATION HEADER FROM RESPONSE_PROTOCOL.md**

### **PROJECT FACTS (NEVER FORGET):**
- **Architecture**: Firebase Auth + Stripe + localStorage + Hosting
- **Database**: NONE (No Firestore, No server storage)
- **Data**: localStorage (trials, cache) + Stripe (payments) + bundled (questions)

### **MANDATORY PRE-RESPONSE PROTOCOL:**

#### **1. ALWAYS READ FIRST:**
```
□ /MANDATORY_CHECKLIST.md
□ /docs/PROJECT_ARCHITECTURE.md  
□ Current file context
```

#### **2. IDENTIFY TASK TYPE:**
- **Data storage request** → localStorage/Stripe solution
- **Trial/subscription request** → StripeTrialService  
- **Question/content request** → LocalQuestionService
- **Build/deploy issue** → Remove Firestore, don't add it

#### **3. VERIFY SOLUTION:**
- ❌ Uses NO Firestore imports
- ✅ Uses correct services (Stripe*, Local*)
- ✅ Follows existing patterns

### **CORRECT SERVICE MAPPING:**
```typescript
// ✅ CURRENT SERVICES (USE THESE):
StripeTrialService           // Trials (localStorage)
LocalQuestionService         // Questions (bundled + cached)
StripePurchaseContentService // Purchases (Stripe + localStorage)

// ❌ DELETED SERVICES (NEVER REFERENCE):
TrialService                 // DELETED
FirestoreQuestionService     // DELETED  
PurchaseContentDeliveryService // DELETED
```

### **FORBIDDEN ACTIONS:**
- ❌ Import from 'firebase/firestore'
- ❌ Suggest adding Firestore
- ❌ Create database-dependent solutions
- ❌ Reference deleted services
- ❌ Add firestore to firebase.json

### **RESPONSE FORMAT (MANDATORY):**
```
✅ ARCHITECTURE VERIFIED:
- Task: [describe what user wants]
- Solution: [localStorage/Stripe/bundled approach]
- Service: [StripeTrialService/LocalQuestionService/etc]

[Then provide the code/solution]
```

### **ERROR PREVENTION:**
- **Before suggesting ANY code**: Check service names
- **Before ANY import**: Verify no Firestore
- **Before ANY storage**: Confirm localStorage/Stripe approach
- **After ANY change**: Mention testing with yarn run build

### **ESCALATION:**
If user reports frustration about repeated Firestore issues:
1. Acknowledge the error immediately
2. Reference this system instruction
3. Provide correct Stripe/localStorage solution
4. Commit to checking this file before future responses

---

**🎯 SUCCESS METRIC: Zero Firestore mistakes, working Stripe-only solutions**
