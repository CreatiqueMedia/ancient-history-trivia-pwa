# 🔥 FIRESTORE PREVENTION SYSTEM

## 🚨 ZERO TOLERANCE FOR FIRESTORE REFERENCES 🚨

This file contains automated patterns to catch and prevent Firestore mistakes.

## 🛡️ FORBIDDEN PATTERNS (NEVER USE):

### **Imports:**
```typescript
// ❌ FORBIDDEN - Will break build
import { ... } from 'firebase/firestore'
import { getFirestore, ... } from 'firebase/firestore'
import firestore from '...'
```

### **Service References:**
```typescript
// ❌ FORBIDDEN - These services were DELETED
TrialService
FirestoreQuestionService  
PurchaseContentDeliveryService
```

### **Code Patterns:**
```typescript
// ❌ FORBIDDEN - No database operations
getFirestore()
collection()
doc()
addDoc()
setDoc()
getDoc()
getDocs()
onSnapshot()
```

### **Suggestions:**
```
❌ "Let's use Firestore to store..."
❌ "We can create a Firestore collection..."
❌ "Store this in the database..."
❌ "Add firestore to firebase.json..."
```

## ✅ REQUIRED REPLACEMENTS:

### **Storage Solutions:**
```typescript
// ✅ REQUIRED - Use these instead
localStorage.setItem()
localStorage.getItem()
// Stripe metadata
// Bundled data files
```

### **Service References:**
```typescript
// ✅ REQUIRED - Current services
StripeTrialService           // localStorage trials
LocalQuestionService         // bundled + cached questions  
StripePurchaseContentService // Stripe + localStorage purchases
```

### **Suggestions:**
```
✅ "We'll use localStorage to store..."
✅ "We'll bundle this data in the app..."
✅ "We'll store this in Stripe metadata..."
✅ "Using StripeTrialService for..."
```

## 🎯 ENFORCEMENT RULES:

1. **Before any code suggestion:** Scan for forbidden patterns
2. **Before any import:** Verify it's not Firestore
3. **Before any storage logic:** Confirm localStorage/Stripe approach
4. **After any change:** Test with yarn run build

## 🚨 VIOLATION RESPONSE:

If forbidden patterns detected:
1. STOP immediately
2. Replace with allowed alternatives
3. Reference this prevention system
4. Apologize for the mistake

---

**This system exists because Firestore references have caused repeated build failures and user frustration. Following it ensures a working Stripe-only solution.**
