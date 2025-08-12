# 🤖 INSTANT AI REFERENCE CARD

## 📋 BEFORE EVERY RESPONSE - MUST READ:

**1. PROJECT TYPE:** Stripe-only PWA (NO DATABASE)
**2. SERVICES:** StripeTrialService, LocalQuestionService, StripePurchaseContentService  
**3. STORAGE:** localStorage + Stripe + bundled data ONLY
**4. FORBIDDEN:** Any Firestore imports or references

## 🚨 QUICK CHECKS:

### User wants data storage?
- ❌ "Store in Firestore/database"
- ✅ "Store in localStorage" or "Store in Stripe metadata"

### User wants trials?
- ❌ TrialService (DELETED)
- ✅ StripeTrialService

### User wants questions?
- ❌ FirestoreQuestionService (DELETED)  
- ✅ LocalQuestionService

### User wants purchases?
- ❌ PurchaseContentDeliveryService (DELETED)
- ✅ StripePurchaseContentService

### Build errors?
- ❌ Add Firestore to fix
- ✅ Remove Firestore imports, use yarn run build

## 📝 RESPONSE TEMPLATE:
```
✅ ARCHITECTURE VERIFIED:
- Task: [user request]
- Solution: [localStorage/Stripe/bundled approach]
- Service: [StripeTrialService/LocalQuestionService/etc]

[provide solution]
```

---
**This card prevents Firestore mistakes that have caused user frustration.**
