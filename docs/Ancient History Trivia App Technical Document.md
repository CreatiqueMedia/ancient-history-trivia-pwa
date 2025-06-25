# Ancient History Trivia App – Technical Documentation

## Overview

The Ancient History Trivia PWA is a cross-platform, production-grade Progressive Web App designed for web, Android, and iOS. It delivers curated, versioned trivia question bundles to users, supports offline play, and is optimized for app store submission. The app is built with React, TypeScript, Vite, Tailwind CSS, and leverages Supabase Storage for cloud-based question delivery.

---

## Architecture & Tech Stack

- **Frontend:** React 18 (TypeScript)
- **Build Tool:** Vite 5
- **Styling:** Tailwind CSS 3
- **PWA:** Vite PWA Plugin, Workbox
- **Cloud Storage:** Supabase Storage (for question bundles)
- **Routing:** React Router 6
- **State Management:** React Context API
- **Testing:** Vitest, manual QA
- **CI/CD:** GitHub Actions (for docs, bundle compliance, and release automation)

---

## Core Functionality

### 1. Question Bundles & Data Delivery
- **Quarterly, Versioned Bundles:** New question bundles are generated and delivered every quarter. Each bundle is versioned (e.g., `trivia-bundles-2025-Q3.json`).
- **Cloud Delivery:** Bundles are uploaded to Supabase Storage and fetched at runtime by the app. No local question redundancy.
- **Format Packs:** Special bundles containing only one question type (True/False, Multiple Choice, or Fill-in-the-Blank).
- **Redundancy Avoidance:** The quarterly release workflow ensures no question is repeated across versions using metadata (e.g., `usedInVersions`).

### 2. App Features
- **Quiz Engine:** Interactive quizzes with timer, progress, and answer feedback.
- **Achievements & Stats:** Tracks user progress, achievements, and statistics.
- **Question Store:** Users can browse and unlock bundles.
- **Sample Quiz:** Always uses the correct, current questions for each bundle.
- **Offline Support:** Service worker caches only the current bundle/session for optimal performance.
- **Dark/Light Mode:** Automatic and user-selectable theme switching.
- **Accessibility:** Semantic HTML, ARIA roles, keyboard navigation, and screen reader support.

### 3. Automation & CLI Workflow
- **Export Script:** `scripts/export-bundles.ts` generates balanced, non-redundant bundles.
- **Upload Script:** `scripts/upload-bundles-to-supabase.ts` uploads bundles to Supabase Storage.
- **Quarterly Release CLI:** `scripts/quarterly-release.ts` automates export, redundancy check, upload, and changelog update.
- **README Compliance:** Automated script and GitHub Action ensure documentation is always up to date.

---

## Data Model

### Question
```typescript
interface Question {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
  difficulty: 'easy' | 'medium' | 'hard';
  category: string;
  region: string;
  period: string;
  tags: string[];
}
```

### Bundle
```typescript
interface QuestionBundle {
  id: string;
  name: string;
  description: string;
  category: string;
  subcategory: string;
  price: number;
  questionCount: number;
  questions: Question[];
  sampleQuestions: number[];
  isPremium: boolean;
  isOwned: boolean;
  difficulty: 'easy' | 'medium' | 'hard';
  format: 'Multiple Choice' | 'True/False' | 'Fill-in-the-Blank' | 'Mixed';
  ...
}
```

---

## Key Scripts & Automation

### Export Bundles (`scripts/export-bundles.ts`)
- Exports all non-format bundles with a balanced mix of question types.
- Exports format packs as single-type bundles.
- Ensures no question redundancy across versions.

### Upload Bundles (`scripts/upload-bundles-to-supabase.ts`)
- Uploads the exported JSON bundle to Supabase Storage.
- Requires `SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY` as environment variables.

### Quarterly Release CLI (`scripts/quarterly-release.ts`)
- Runs export, redundancy check, upload, and changelog update in sequence.
- Can be integrated into CI/CD for fully automated releases.

### README Compliance (`scripts/check-readme-compliance.ts`)
- Checks for required documentation sections and fails CI if missing.

---

## PWA & App Store Readiness

- **Manifest:** Store-compliant, includes all required icons and metadata.
- **Service Worker:** Caches only current bundle/session, supports offline play, and background sync.
- **Lighthouse Audits:** App meets PWA, accessibility, and performance standards (90+ scores).
- **Privacy & Security:** No secrets in source, privacy policy and terms included, GDPR/CCPA compliant.
- **App Store Submission:**
  - Android: TWA via Bubblewrap or PWABuilder
  - iOS: Capacitor or Cordova
  - Web: Firebase Hosting

---

## Developer Workflow

1. **Add/Update Questions:** Edit files in `src/data/`.
2. **Export Bundles:** Run `yarn ts-node scripts/export-bundles.ts`.
3. **Upload Bundles:** Run `yarn ts-node scripts/upload-bundles-to-supabase.ts` with required env vars.
4. **Quarterly Release:** Run `yarn ts-node scripts/quarterly-release.ts` for full automation.
5. **Test:** Run the app locally and verify new bundles.
6. **CI/CD:** All scripts and compliance checks run automatically on push/PR.

---

## Advanced Features

- **Redundancy Check:** CLI ensures no question is repeated across quarterly bundles.
- **Changelog Automation:** CLI can update `CHANGELOG.md` with each release.
- **Localization:** Designed for easy translation and i18n support.
- **Accessibility:** WCAG 2.1 AA compliance, keyboard and screen reader friendly.
- **Security:** Follows OWASP PWA guidelines, uses environment variables for all secrets.

---

## Backend, Question Delivery, and Automation Processes

### Backend & Cloud Storage
- **Supabase Storage** is used as the backend for question bundle delivery. All versioned bundles are uploaded to a Supabase Storage bucket, which acts as a secure, scalable, and CDN-backed file store.
- **No direct database** is used for question delivery; all question data is delivered as static JSON bundles, ensuring fast, cacheable, and reliable access.
- **Security:** Only the app (with public read access) and automation scripts (with service role key) can upload/update bundles. Secrets are never exposed in the client.

### Question Delivery Process
1. **Bundle Generation:** On each quarterly release, the export script generates new bundles with a balanced mix of question types and no redundancy.
2. **Cloud Upload:** The upload script pushes the new bundle to Supabase Storage, versioned by quarter (e.g., `trivia-bundles-2025-Q3.json`).
3. **App Fetch:** On app launch or when a user selects a bundle, the app fetches the latest bundle from Supabase Storage via HTTPS.
4. **Caching:** The service worker caches only the current bundle/session for offline play, not all historical data.
5. **On-Demand Loading:** Only the selected bundle is loaded into memory, optimizing performance and reducing device storage use.

### Question Automation & Version Release
- **Automated CLI Workflow:** The quarterly release CLI (`scripts/quarterly-release.ts`) automates export, redundancy check, upload, and changelog update.
- **Redundancy Check:** Ensures no question is repeated across versions by tracking a `usedInVersions` property for each question.
- **Versioning:** Each bundle is named and versioned by quarter/year. Rollbacks are possible by uploading a previous bundle version.
- **CI/CD Integration:** GitHub Actions can run the full workflow on a schedule or on demand, ensuring timely, error-free releases.

---

## User Purchase & Subscription Processes

### Purchasing Bundle Packs
- **In-App Store:** Users browse available bundles in the app's Store screen.
- **Purchase Flow:**
  1. User selects a bundle and initiates purchase.
  2. On web: Payment is handled via Stripe or a similar provider (if enabled).
  3. On Android/iOS: Purchase is handled via Google Play Billing or Apple In-App Purchase APIs, using TWA (Android) or Capacitor/Cordova (iOS) wrappers.
  4. On success, the app unlocks the bundle for the user and updates their entitlements locally and/or via a backend endpoint (if user accounts are enabled).
- **Entitlement Persistence:** Purchases are stored in local storage and, if user accounts are enabled, synced to the cloud for cross-device access.
- **Restoring Purchases:** Users can restore purchases on new devices by logging in (if accounts are enabled) or using platform-specific restore flows.

### Purchasing & Managing Subscriptions
- **Subscription Options:** Users can subscribe to unlock all bundles and premium features (monthly, annual, biennial).
- **Subscription Flow:**
  1. User selects a subscription plan in the Store screen.
  2. On web: Subscription is handled via Stripe Checkout or similar.
  3. On Android: Subscription is handled via Google Play Billing (TWA with Digital Asset Links and Play Billing Library integration).
  4. On iOS: Subscription is handled via Apple In-App Purchase APIs (Capacitor/Cordova plugin integration).
  5. On success, the app unlocks all premium content and features for the user.
- **Subscription Management:**
  - **Web:** Users can manage/cancel subscriptions via the payment provider's customer portal (e.g., Stripe Customer Portal).
  - **Android:** Users manage/cancel subscriptions via the Google Play Store app (Subscriptions section).
  - **iOS:** Users manage/cancel subscriptions via the Apple App Store (Apple ID > Subscriptions).
- **Entitlement Sync:** The app checks subscription status on launch and after purchase/cancellation events, updating access accordingly.
- **Platform Integration:**
  - **Android:** TWA apps use Play Billing via a bridge or associated native module. Digital Asset Links are required for Play Store compliance.
  - **iOS:** Capacitor/Cordova plugins provide access to StoreKit APIs for in-app purchases and subscriptions.
  - **Compliance:** All purchase flows comply with Apple/Google guidelines, including user-initiated cancellation and refund support.

---

## Use Cases

### 1. User Purchases a Bundle Pack
- User opens Store, selects a bundle, and taps "Buy".
- On mobile, the native store purchase dialog appears; on web, a payment form is shown.
- After successful payment, the bundle is unlocked and available for play.
- Purchase is persisted locally and (if logged in) in the user's cloud account.

### 2. User Purchases a Subscription
- User selects a subscription plan (monthly/annual/biennial) in the Store.
- Native or web payment flow is triggered.
- On success, all premium content is unlocked.
- Subscription status is checked on every app launch and after any purchase/cancellation event.

### 3. User Cancels Subscription
- User navigates to the platform's subscription management (Google Play or Apple App Store) or, on web, the payment provider's portal.
- User cancels the subscription.
- On next app launch or entitlement check, the app detects the cancellation and revokes premium access at the end of the billing period.

### 4. Quarterly Question Release
- Developer runs the quarterly release CLI.
- New bundles are generated, checked for redundancy, uploaded to Supabase, and changelog is updated.
- App fetches the new bundle on next launch, delivering fresh content to all users.

---

## File Structure (Key Folders)

- `src/components/` – UI components
- `src/context/` – React Context providers
- `src/data/` – Question data, bundles, and sample questions
- `src/screens/` – Main app screens
- `src/types/` – TypeScript types
- `scripts/` – Automation and CLI scripts
- `public/` – Static assets, manifest, service worker, and exported bundles
- `docs/` – Technical and developer documentation

---

## Contribution & Support

- Use feature branches and PRs for all changes.
- Run `yarn lint` and ensure all tests pass before submitting.
- Follow code style and documentation standards.
- For help, open a GitHub issue or contact the maintainer.

---

## Potential Points of Failure & Vulnerability

### 1. Cloud Storage & Delivery
- **Public Read Access:** If Supabase Storage bucket permissions are misconfigured, sensitive data could be exposed. Only question bundles should be public; all secrets must remain private.
- **Service Role Key Exposure:** If the Supabase service role key is accidentally committed or leaked, attackers could overwrite or delete bundles. Always use environment variables and never commit secrets.
- **Bundle Corruption:** If a bundle is corrupted or incomplete during upload, users may experience errors or missing questions. Use checksums or version validation in CI/CD.

### 2. Payment & Entitlement
- **Payment Provider Integration:** Bugs or misconfigurations in Stripe, Google Play, or Apple IAP integration could result in failed purchases, double charges, or ungranted entitlements.
- **Entitlement Sync:** If local storage is cleared or cloud sync fails, users may lose access to purchased content. Always provide a restore purchases option and robust error handling.
- **Subscription Status Drift:** If the app fails to check for subscription cancellations or expirations, users may retain access after cancellation. Ensure regular entitlement checks on app launch and after purchase events.

### 3. Automation & Release
- **Redundancy Check Failure:** If the redundancy check script is bypassed or fails, duplicate questions could appear in multiple bundles, reducing content value.
- **CI/CD Misconfiguration:** If GitHub Actions or automation scripts are misconfigured, releases may be incomplete, documentation may be out of date, or broken bundles may be published.

### 4. PWA & App Store Compliance
- **Manifest/Service Worker Issues:** Incorrect manifest or service worker config can break offline support, installability, or app store acceptance.
- **Platform Policy Changes:** Apple/Google may change in-app purchase or TWA/Capacitor requirements, breaking purchase flows or causing store rejections.

### 5. Security & Privacy
- **XSS/Injection:** If user-generated content is ever introduced (e.g., user-submitted questions), sanitize all inputs to prevent XSS or injection attacks.
- **Data Privacy:** Ensure privacy policy and terms are always up to date and that user data (if any) is handled per GDPR/CCPA.
- **Dependency Vulnerabilities:** Outdated or vulnerable npm packages could introduce security risks. Run `yarn audit` regularly and update dependencies.

### 6. User Experience
- **Network Failures:** If the user is offline and the bundle is not cached, quiz play will fail. Ensure clear error messages and robust offline handling.
- **Device Compatibility:** Unhandled edge cases on certain browsers or devices may cause UI or functional bugs. Test on a wide range of platforms.

---

## Security Vulnerabilities & Mitigation Strategies

### 1. Secret Exposure
- **Threat:** Accidental commit or leak of Supabase service role keys or payment provider secrets.
- **Mitigation:**
  - Use environment variables for all secrets.
  - Add `.env` and secret files to `.gitignore`.
  - Use secret scanning tools and enable GitHub secret scanning.

### 2. Insecure Cloud Storage
- **Threat:** Misconfigured Supabase Storage bucket exposes sensitive data or allows unauthorized writes.
- **Mitigation:**
  - Set bucket to public read, private write.
  - Only allow uploads/updates via automation scripts using service role keys.
  - Regularly audit bucket permissions.

### 3. Payment/Entitlement Attacks
- **Threat:** Users spoof purchase or subscription status via local storage manipulation or intercepted network calls.
- **Mitigation:**
  - Validate all entitlements server-side if user accounts are enabled.
  - Use secure, signed tokens for entitlement checks.
  - Never trust client-only state for premium access.

### 4. Dependency Vulnerabilities
- **Threat:** Outdated or vulnerable npm packages introduce exploits (e.g., XSS, RCE).
- **Mitigation:**
  - Run `yarn audit` and `npm audit` regularly.
  - Enable Dependabot or similar automated dependency update tools.
  - Review and update dependencies frequently.

### 5. XSS & Injection
- **Threat:** If user-generated content is ever allowed (e.g., user-submitted questions), attackers could inject scripts or malicious data.
- **Mitigation:**
  - Sanitize and validate all user input.
  - Use libraries like DOMPurify for HTML sanitization.
  - Escape all dynamic content in the UI.

### 6. Data Privacy & Compliance
- **Threat:** Mishandling user data could violate GDPR, CCPA, or other privacy laws.
- **Mitigation:**
  - Provide clear privacy policy and terms of service.
  - Allow users to request data deletion or export.
  - Store only minimal, necessary user data.

### 7. PWA/Service Worker Risks
- **Threat:** Service worker bugs could expose cached data or allow cache poisoning.
- **Mitigation:**
  - Use trusted libraries (e.g., Workbox) for service worker logic.
  - Regularly update and audit service worker code.
  - Limit cache scope to only necessary assets and bundles.

### 8. Platform-Specific Threats
- **Threat:** Changes in Apple/Google store policies or vulnerabilities in TWA/Capacitor plugins.
- **Mitigation:**
  - Monitor platform policy updates.
  - Use official, well-maintained plugins for in-app purchases.
  - Test purchase/cancellation flows after every major update.

---

## Production Readiness Checklist

- [ ] All required icons and manifest fields are present and store-compliant
- [ ] Service worker is configured for offline support and caches only current bundle/session
- [ ] Privacy policy and terms are included and linked in the app and manifest
- [ ] Lighthouse audit scores (PWA, performance, accessibility) are 90+
- [ ] All automation scripts (export, upload, quarterly release, compliance) are present and documented
- [ ] Supabase Storage bucket permissions: public read, private write; no secrets in source
- [ ] Payment and subscription flows are tested on web, Android (TWA), and iOS (Capacitor/Cordova)
- [ ] Digital Asset Links are set up for TWA (Android)
- [ ] App Store assets (screenshots, icons, splash screens) are included for iOS/Android
- [ ] All dependencies are up to date and pass `yarn audit`
- [ ] Accessibility: semantic HTML, ARIA roles, keyboard navigation, screen reader support
- [ ] All user data (if any) is handled per GDPR/CCPA and privacy policy
- [ ] CI/CD workflows run and pass on every push/PR
- [ ] Manual QA performed on all target platforms (web, Android, iOS)
- [ ] Rollback/versioning procedures are documented and tested
- [ ] All known issues are reviewed and resolved or documented

---

## Automated Production Readiness Tools & CI Integration

To ensure the app meets industry standards for quality, performance, and compliance, integrate the following automated tools into your workflow and CI/CD pipeline:

### 1. Lighthouse CI (Web/PWA)
- **Purpose:** Automated audits for PWA compliance, performance, accessibility, SEO, and best practices.
- **Setup:**
  - Install: `yarn add -D @lhci/cli`
  - Add `lighthouserc.js` config (see sample below).
  - Add a CI step to run: `yarn lhci autorun`.
- **Sample Config (`lighthouserc.js`):**
  ```js
  module.exports = {
    ci: {
      collect: {
        url: ['https://your-deployed-app-url.com'],
        startServerCommand: 'yarn build && yarn preview',
      },
      assert: {
        assertions: {
          'categories:performance': ['error', {minScore: 0.9}],
          'categories:accessibility': ['error', {minScore: 0.9}],
          'categories:best-practices': ['error', {minScore: 0.9}],
          'categories:pwa': ['error', {minScore: 0.9}],
        },
      },
      upload: {target: 'temporary-public-storage'},
    },
  };
  ```
- **Best Practice:** Fail the build if any score is below 90.

### 2. Google Play Console Pre-Launch Report (Android)
- **Purpose:** Automated device testing, security, and accessibility checks for Android apps.
- **Setup:**
  - Upload your TWA APK/AAB to the Play Console (internal test track).
  - Enable Pre-Launch Reports in the Play Console.
  - Review results for crashes, UI issues, and security warnings.
- **Best Practice:** Block release if critical issues are found.

### 3. Xcode Build/Test Automation (iOS)
- **Purpose:** Automated build, test, and compliance checks for iOS apps.
- **Setup:**
  - Use Xcode Cloud, GitHub Actions, or Fastlane for automation.
  - Example command: `xcodebuild -workspace YourApp.xcworkspace -scheme YourApp -sdk iphoneos -configuration AppStoreDistribution archive`
  - Run UI and unit tests: `xcodebuild test -scheme YourApp -destination 'platform=iOS Simulator,name=iPhone 14'`
- **Best Practice:** Require all tests to pass and archive to succeed before release.

### 4. CI/CD Integration Example (GitHub Actions)
- **Lighthouse CI:** Add a job to `.github/workflows/ci.yml`:
  ```yaml
  - name: Run Lighthouse CI
    run: yarn lhci autorun
  ```
- **Android/iOS:** Add jobs to build and upload artifacts for Play Console/Xcode Cloud.

---

## Step-by-Step: Running Production Readiness & Industry Tools

Follow these steps to ensure your app is production-ready and meets industry standards for web, Android, and iOS deployment:

### 1. Run the Automated Production Readiness Script

1. Open a terminal in your project root.
2. Run:
   ```
   yarn ts-node scripts/production-ready-check/production_ready_check.ts
   ```
   - This script checks for manifest, service worker, privacy policy, bundle presence, dependency vulnerabilities, CI config, and more.
   - Review the output. All checks must pass for production readiness.

### 2. Run Lighthouse CI (Web/PWA)

1. Install Lighthouse CI (if not already):
   ```
   yarn add -D @lhci/cli
   ```
2. Ensure you have a `lighthouserc.js` config file in your project root (see sample in this document).
3. Build and preview your app:
   ```
   yarn build && yarn preview
   ```
4. In a new terminal, run:
   ```
   yarn lhci autorun
   ```
   - This will run automated audits for PWA, performance, accessibility, and best practices.
   - The build should fail if any score is below 90.

### 3. Run Google Play Console Pre-Launch Report (Android)

1. Build your TWA APK/AAB using Bubblewrap or PWABuilder.
2. Go to the Google Play Console and upload your APK/AAB to the internal test track.
3. Enable Pre-Launch Reports in the Play Console.
4. Wait for the automated device, accessibility, and security tests to complete.
5. Review the results for crashes, UI issues, and security warnings.
6. Block release if any critical issues are found.

### 4. Run Xcode Build/Test Automation (iOS)

1. Open your project in Xcode or set up Xcode Cloud/Fastlane.
2. Build and archive your app:
   ```
   xcodebuild -workspace YourApp.xcworkspace -scheme YourApp -sdk iphoneos -configuration AppStoreDistribution archive
   ```
3. Run UI and unit tests:
   ```
   xcodebuild test -scheme YourApp -destination 'platform=iOS Simulator,name=iPhone 14'
   ```
4. Ensure all tests pass and the archive succeeds before submitting to the App Store.

### 5. Integrate All Checks into CI/CD (Recommended)

- Add jobs to your `.github/workflows/ci.yml` to run the readiness script, Lighthouse CI, and (optionally) build/test jobs for Android/iOS.
- Example for Lighthouse CI:
  ```yaml
  - name: Run Lighthouse CI
    run: yarn lhci autorun
  ```

---

**Tip:** Always perform manual QA on real devices (web, Android, iOS) and use official checklists from Google/Apple for final pre-launch review.
