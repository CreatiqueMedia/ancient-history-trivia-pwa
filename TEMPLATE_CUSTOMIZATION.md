# 🔧 Template Customization Checklist

## Required Changes for Each New Project

### ✅ **1. Project Identity (5 minutes)**

#### **package.json**
```json
{
  "name": "{{PROJECT_NAME}}",
  "description": "{{PROJECT_DESCRIPTION}}",
  "author": "{{YOUR_NAME}}",
  "homepage": "{{PROJECT_URL}}"
}
```

#### **index.html**
```html
<title>{{APP_TITLE}}</title>
<meta name="description" content="{{APP_DESCRIPTION}}">
<meta name="author" content="{{YOUR_NAME}}">
```

#### **public/manifest.json**
```json
{
  "name": "{{APP_NAME}}",
  "short_name": "{{SHORT_NAME}}",
  "description": "{{APP_DESCRIPTION}}"
}
```

### ✅ **2. Firebase Configuration (10 minutes)**

#### **firebase.json**
```json
{
  "projects": {
    "default": "{{FIREBASE_PROJECT_ID}}"
  }
}
```

#### **.env.development**
```bash
VITE_FIREBASE_PROJECT_ID={{FIREBASE_PROJECT_ID}}
VITE_FIREBASE_API_KEY={{FIREBASE_API_KEY}}
VITE_FIREBASE_AUTH_DOMAIN={{PROJECT_ID}}.firebaseapp.com
VITE_FIREBASE_STORAGE_BUCKET={{PROJECT_ID}}.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID={{SENDER_ID}}
VITE_FIREBASE_APP_ID={{APP_ID}}
VITE_FIREBASE_MEASUREMENT_ID={{MEASUREMENT_ID}}
```

#### **.env.production**
```bash
# Same as development but with production values
VITE_STRIPE_LIVE_PUBLISHABLE_KEY={{STRIPE_LIVE_KEY}}
VITE_ENABLE_ANALYTICS=true
VITE_USE_MOCK_AUTH=false
VITE_USE_MOCK_PAYMENTS=false
```

### ✅ **3. Stripe Configuration (if using payments)**

#### **src/config/payment.ts**
```typescript
export const STRIPE_CONFIG = {
  testPublishableKey: '{{STRIPE_TEST_KEY}}',
  livePublishableKey: '{{STRIPE_LIVE_KEY}}',
  products: [
    {
      id: '{{PRODUCT_ID}}',
      name: '{{PRODUCT_NAME}}',
      price: {{PRICE}},
      // Customize your pricing structure
    }
  ]
};
```

### ✅ **4. Content Customization (30 minutes)**

#### **Replace Domain-Specific Content:**

**src/types/index.ts**
```typescript
// Replace with your data models
export interface {{YourDataType}} {
  // Define your application's data structure
}
```

**src/screens/**
```typescript
// Replace screen components:
- HomeScreen.tsx → Your home screen
- QuizScreen.tsx → Your main feature screen
- StoreScreen.tsx → Your store/catalog screen
- ProfileScreen.tsx → User profile (can keep as-is)
```

**src/services/**
```typescript
// Adapt services for your business logic:
- QuizService.ts → Your core service
- PaymentService.ts → (keep if using payments)
- AnalyticsService.ts → (keep for tracking)
```

**src/components/**
```typescript
// Customize UI components:
- QuizCard.tsx → Your content card component
- BundleCard.tsx → Your product card component
- Navigation.tsx → (keep but customize menu items)
```

### ✅ **5. Branding & Assets (10 minutes)**

#### **Replace Visual Assets:**
```bash
public/logos/          # Replace with your logos
public/favicon.ico     # Replace with your favicon
src/assets/           # Replace with your images
```

#### **Update Color Scheme:**
```css
/* In src/index.css - update CSS variables */
:root {
  --primary-color: {{YOUR_PRIMARY_COLOR}};
  --secondary-color: {{YOUR_SECONDARY_COLOR}};
  --accent-color: {{YOUR_ACCENT_COLOR}};
}
```

### ✅ **6. Testing Configuration (5 minutes)**

#### **tests/**
```typescript
// Update test scenarios for your app:
- Replace "Ancient History Trivia" with your app name
- Update test URLs and endpoints
- Adapt test scenarios to your features
```

#### **playwright.config.ts**
```typescript
// Update base URL for testing
use: {
  baseURL: 'http://localhost:5173', // or your test URL
}
```

### ✅ **7. Documentation (5 minutes)**

#### **Update README.md**
```markdown
# {{PROJECT_NAME}}

{{PROJECT_DESCRIPTION}}

## About
{{DETAILED_PROJECT_DESCRIPTION}}
```

#### **docs/ folder**
```bash
# Update documentation files:
- Replace "Ancient History Trivia" with your project name
- Update URLs and project-specific references
- Adapt marketing and outreach documents
```

## 🚀 Quick Reference Commands

### **Setup New Project:**
```bash
# Clone template
git clone -b template {{REPO_URL}} {{NEW_PROJECT_NAME}}
cd {{NEW_PROJECT_NAME}}

# Install dependencies
yarn install

# Create new repository
git remote set-url origin {{NEW_REPO_URL}}

# Initial commit
git add .
git commit -m "Initial commit from PWA template"
git push -u origin main
```

### **Development:**
```bash
# Start development server
yarn dev

# Build for production
yarn build

# Run tests
yarn test:e2e

# Deploy to Firebase
firebase deploy
```

## 🔍 Template Verification

### **Before Deployment - Check:**
- [ ] All {{PLACEHOLDER}} values replaced
- [ ] Firebase project configured
- [ ] Stripe keys updated (if using payments)
- [ ] App name and branding updated
- [ ] Tests passing with new configuration
- [ ] Environment variables set correctly
- [ ] All placeholder content replaced

### **After Deployment - Verify:**
- [ ] App loads correctly at your domain
- [ ] Authentication works
- [ ] Payment processing works (if applicable)
- [ ] Analytics tracking active
- [ ] PWA features functional
- [ ] Mobile responsive design
- [ ] Security headers active

## 💡 Template Tips

### **Keep These As-Is:**
- Authentication system (AuthContext, AuthModal)
- Security utilities (rate limiting, input validation)
- Analytics service (just update tracking events)
- PWA infrastructure (service worker, manifest)
- Testing framework (just update test scenarios)

### **Customize These:**
- Business logic services
- UI components and screens
- Data models and types
- Styling and branding
- Content and copy

### **Common Pitfalls:**
- Forgetting to update Firebase project ID
- Not replacing Stripe keys for payments
- Leaving placeholder content in production
- Not updating test scenarios
- Missing environment variable updates

---

**Use this checklist to ensure proper template customization for each new project!**
