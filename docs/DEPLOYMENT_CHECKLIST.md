# Ancient History Trivia App Deployment Checklist

This document provides a comprehensive checklist of completed tasks and remaining manual steps required to deploy the Ancient History Trivia app as:
1. A Progressive Web App (PWA) using Stripe for payments
2. Native iOS and Android apps using RevenueCat for in-app purchases

## Table of Contents

- [Completed Tasks](#completed-tasks)
  - [Core App Development](#core-app-development)
  - [Payment Processing](#payment-processing)
  - [Question Storage Solution](#question-storage-solution)
  - [Documentation](#documentation)
- [Remaining Manual Steps](#remaining-manual-steps)
  - [Supabase Setup](#supabase-setup)
  - [Stripe Setup](#stripe-setup)
  - [RevenueCat Setup](#revenuecat-setup)
  - [PWA Deployment](#pwa-deployment)
  - [App Store Deployment](#app-store-deployment)
  - [Google Play Store Deployment](#google-play-store-deployment)
  - [Post-Deployment](#post-deployment)

## Completed Tasks

### Core App Development

- [x] Core app functionality implemented
- [x] User interface and experience design
- [x] Authentication system using Firebase
- [x] Question and quiz functionality
- [x] Bundle management system
- [x] Platform detection utility for different environments
- [x] Offline support architecture
- [x] **33 AP-Level HARD Questions Implementation** ⭐ **NEW MAJOR FEATURE**
  - [x] 33 Advanced Placement level ancient history questions
  - [x] Perfect 33/33/33 format distribution (11 MC + 11 TF + 11 FIB)
  - [x] Global coverage: Greece, Rome, Egypt, China, Mesopotamia, India, Persia, Maya
  - [x] Enhanced Quiz Service with intelligent question selection
  - [x] Format detection and distribution algorithms
  - [x] Production deployment at https://ancient-history-trivia.web.app/quiz

### Payment Processing

- [x] Hybrid payment approach designed (Stripe for web/PWA, RevenueCat for app stores)
- [x] Payment configuration in `src/config/payment.ts`
- [x] Stripe integration for web/PWA
  - [x] Payment form component
  - [x] Payment modal component
  - [x] Stripe provider component
- [x] RevenueCat integration architecture for app stores
  - [x] Platform-specific purchase flow
  - [x] Purchase context integration
- [x] Purchase context with unified API for both payment systems

### Question Storage Solution

- [x] Supabase integration designed to replace Firestore
- [x] Database schema designed
- [x] Storage bucket configuration designed
- [x] QuestionService implementation for on-demand loading
- [x] Bundle upload script created
- [x] Local caching mechanism for offline access

### UX Enhancements (NEW)

- [x] Daily Challenges System
  - [x] DailyChallengeService with streak tracking
  - [x] DailyChallengeCard component for home screen
  - [x] Themed daily content with consistent generation
  - [x] Reward system with XP, badges, and streak bonuses
  - [x] Smart notification scheduling
- [x] Enhanced Question Explanations
  - [x] ExplanationModal with tabbed interface
  - [x] Rich explanation types with historical context
  - [x] Image gallery with lightbox functionality
  - [x] External learning resources integration
  - [x] Bookmark and share functionality
- [x] Free Trial System
  - [x] TrialService for trial management
  - [x] TrialBanner component with dynamic messaging
  - [x] Usage tracking and conversion analytics
  - [x] Intelligent subscription recommendations
  - [x] Urgency-based conversion prompts
- [x] Enhanced Type System
  - [x] Comprehensive type definitions in `src/types/enhancements.ts`
  - [x] Support for future features (learning paths, community challenges)
- [x] Improved Home Screen Integration
  - [x] Trial banner prominently displayed
  - [x] Daily challenge card featured
  - [x] Seamless integration with existing features

### Documentation

- [x] Payment implementation plan (`docs/PAYMENT_IMPLEMENTATION_PLAN.md`)
- [x] Purchasing and app store guide (`docs/PURCHASING_AND_APP_STORE_GUIDE.md`)
- [x] Payment testing guide (`docs/PAYMENT_TESTING_GUIDE.md`)
- [x] Question storage solution (`docs/QUESTION_STORAGE_SOLUTION.md`)
- [x] Supabase setup guide (`docs/SUPABASE_SETUP.md`)
- [x] Revenue projections (`docs/REVENUE_PROJECTIONS.md`)
- [x] UX enhancement recommendations (`docs/UX_ENHANCEMENT_RECOMMENDATIONS.md`)
- [x] UX enhancements implementation summary (`docs/UX_ENHANCEMENTS_IMPLEMENTED.md`)
- [x] Deployment checklist (this document)

## Remaining Manual Steps

### Supabase Setup

- [ ] Create Supabase account
- [ ] Create new Supabase project
- [ ] Set up database tables:
  - [ ] `bundles` table
  - [ ] `questions` table
  - [ ] `user_purchases` table
  - [ ] `user_subscriptions` table
- [ ] Create storage bucket for question bundles
- [ ] Configure Row-Level Security (RLS) policies
- [ ] Add Supabase credentials to environment variables:
  - [ ] `VITE_SUPABASE_URL`
  - [ ] `VITE_SUPABASE_ANON_KEY`
- [ ] Run bundle upload script to populate Supabase

### Stripe Setup

- [x] **Stripe Test Mode Configured** - App currently uses test key `pk_test_51NxSampleKeyForTestingPurposesOnly`
- [x] **Test Card Numbers Available** - Use `4242 4242 4242 4242` for successful test payments
- [x] **Safe Testing Environment** - No real money charges in test mode
- [ ] Create production Stripe account (when ready for live payments)
- [ ] Set up Stripe products and prices:
  - [ ] Bundle products (one for each bundle)
  - [ ] Subscription products (monthly, annual, biennial)
- [ ] Configure webhook endpoints
- [ ] Set up Stripe customer portal (for subscription management)
- [ ] Add production Stripe API keys to environment variables:
  - [ ] `VITE_STRIPE_PUBLISHABLE_KEY`
- [ ] Create Firebase Cloud Functions for Stripe integration:
  - [ ] Payment intent creation
  - [ ] Subscription creation
  - [ ] Webhook handling

**Testing Instructions**: Use Stripe test card `4242 4242 4242 4242` with any future expiration, any 3-digit CVC, and any ZIP code. See [docs/PAYMENT_TESTING_GUIDE.md](docs/PAYMENT_TESTING_GUIDE.md) for complete testing instructions.

### RevenueCat Setup

- [ ] Create RevenueCat account
- [ ] Configure products in RevenueCat dashboard:
  - [ ] Bundle products
  - [ ] Subscription products
- [ ] Link RevenueCat to App Store Connect
- [ ] Link RevenueCat to Google Play Console
- [ ] Add RevenueCat API keys to environment variables
- [ ] Install RevenueCat SDK when packaging for app stores

### PWA Deployment

- [ ] Configure PWA manifest file
- [ ] Create service worker for offline functionality
- [ ] Generate app icons in various sizes
- [ ] Set up HTTPS for production domain
- [ ] Configure Firebase Hosting
- [ ] Deploy to production domain
- [ ] Test PWA installation on various devices
- [ ] Verify Stripe payments work in production

### App Store Deployment

- [ ] Obtain Apple Developer Program membership ($99/year)
- [ ] Obtain DUNS number (if you don't have one)
- [ ] Create App ID in Apple Developer Portal
- [ ] Configure app capabilities in Developer Portal
- [ ] Create app listing in App Store Connect:
  - [ ] App information
  - [ ] Screenshots
  - [ ] App icon
  - [ ] Privacy policy
- [ ] Configure in-app purchases in App Store Connect
- [ ] Package app using Capacitor or similar tool
- [ ] Test in-app purchases in sandbox environment
- [ ] Submit for App Store review

### Google Play Store Deployment

- [ ] Create Google Play Developer account ($25 one-time fee)
- [ ] Create app listing in Google Play Console:
  - [ ] App information
  - [ ] Screenshots
  - [ ] App icon
  - [ ] Privacy policy
- [ ] Configure in-app products in Play Console
- [ ] Package app using Capacitor or similar tool
- [ ] Test in-app purchases in test environment
- [ ] Submit for Google Play review

### Post-Deployment

- [ ] Set up monitoring for all systems
- [ ] Configure analytics to track conversions
- [ ] Implement A/B testing for purchase flows
- [ ] Create backup and recovery procedures
- [ ] Set up automated testing for payment systems
- [ ] Create customer support procedures for payment issues

## Additional Business Requirements

### Apple App Store Requirements

- [ ] Obtain DUNS number from Dun & Bradstreet
  - Visit [D&B D-U-N-S Request Service](https://www.dnb.com/duns-number/get-a-duns.html)
  - Process can take 5-10 business days
- [ ] Complete Apple's tax and banking information
- [ ] Prepare privacy policy URL
- [ ] Complete App Privacy information in App Store Connect
- [ ] Prepare app review information (test account, etc.)

### Google Play Store Requirements

- [ ] Complete Google's merchant account setup
- [ ] Set up tax information in Google Play Console
- [ ] Create content rating questionnaire
- [ ] Complete data safety section
- [ ] Prepare app review information (test account, etc.)

### Legal Requirements

- [ ] Create Terms of Service
- [ ] Create Privacy Policy
- [ ] Create Subscription Terms (if offering subscriptions)
- [ ] Ensure GDPR compliance (for European users)
- [ ] Ensure CCPA compliance (for California users)
- [ ] Set up necessary cookie notices for web version

## Resources

- [Apple Developer Program](https://developer.apple.com/programs/)
- [Google Play Console](https://play.google.com/console/about/)
- [Stripe Documentation](https://stripe.com/docs)
- [RevenueCat Documentation](https://docs.revenuecat.com/)
- [Supabase Documentation](https://supabase.com/docs)
- [Firebase Documentation](https://firebase.google.com/docs)
- [PWA Documentation](https://web.dev/progressive-web-apps/)

## Notes

- The app is currently set up with the architecture and code for both payment systems, but the actual accounts, products, and API keys need to be configured.
- The Supabase integration is designed but requires an actual Supabase account and project setup.
- For app store submissions, plan for a review period of 1-3 days for each platform.
- RevenueCat offers a free tier that should be sufficient for initial launch.
- Stripe charges per transaction (2.9% + $0.30 for US transactions).
- Consider setting up a staging environment to test the entire payment flow before going to production.
