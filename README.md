# Ancient History Trivia PWA

A Progressive Web App (PWA) for testing your knowledge of ancient civilizations and historical events. Originally converted from a React Native app to work seamlessly on both mobile devices and web browsers.

## Features

- 🎓 **33 AP-Level HARD Questions**: Free quiz with Advanced Placement level ancient history questions
- 📝 **Perfect Format Distribution**: 11 Multiple Choice + 11 True/False + 11 Fill-in-Blank questions
- 🏛️ **Global Ancient History Coverage**: Questions spanning Greece, Rome, Egypt, China, Mesopotamia, India, Persia, and Maya
- 📱 **Progressive Web App**: Works offline and can be installed on devices
- 🌙 **Dark/Light Mode**: Automatic theme switching with user preference
- 📊 **Statistics Tracking**: Track your progress and performance
- 🏆 **Achievements System**: Unlock achievements as you learn
- 🛒 **Question Store**: Browse and unlock different question bundles
- 📱 **Responsive Design**: Optimized for mobile and desktop
- ⚡ **Fast Performance**: Built with Vite for optimal loading

## Tech Stack

- **Frontend**: React 18 with TypeScript
- **Build Tool**: Vite 5
- **Styling**: Tailwind CSS 3
- **PWA**: Vite PWA Plugin with Workbox
- **Icons**: Heroicons & Lucide React
- **Routing**: React Router 6
- **State Management**: React Context API
- **Package Manager**: Yarn (npm blocked)

## Getting Started

### Prerequisites

- Node.js 18+
- Yarn 1.22+

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd ancient-history-pwa

# Install dependencies (npm is blocked - use yarn only)
yarn install

# Start development server
yarn dev

# Build for production
yarn build

# Preview production build
yarn preview
```

### Testing Payments (Stripe Test Mode)

The app includes Stripe payment integration in test mode for safe testing:

**💳 Stripe Test Card Numbers:**
- **Successful Payment**: `4242 4242 4242 4242`
- **Expiration**: Any future date (e.g., `12/25`)
- **CVC**: Any 3 digits (e.g., `123`)
- **ZIP**: Any postal code (e.g., `12345`)

**🛡️ Safe Testing**: All payments use Stripe test mode - no real money is charged!

For complete payment testing instructions, see [docs/PAYMENT_TESTING_GUIDE.md](docs/PAYMENT_TESTING_GUIDE.md).

### Development Commands

```bash
yarn dev      # Start development server
yarn build    # Build for production
yarn preview  # Preview production build
yarn lint     # Run ESLint
```

## Project Structure

```
src/
├── components/        # Reusable UI components
├── context/          # React Context providers
├── data/             # Question data and bundles
├── screens/          # Main application screens
├── types/            # TypeScript type definitions
├── App.tsx           # Main application component
├── main.tsx          # Application entry point
└── index.css         # Global styles
```

## Screens

1. **Home Screen**: Dashboard with quick stats and featured topics
2. **Quiz Screen**: Interactive quiz with timer and progress
3. **Results Screen**: Detailed results with performance breakdown
4. **Store Screen**: Browse and unlock question bundles
5. **Stats Screen**: Comprehensive statistics and progress tracking
6. **Settings Screen**: Theme, audio, and app preferences
7. **Achievements Screen**: Gamified achievement system

## PWA Features

- **Offline Support**: Questions and core functionality work offline
- **Install Prompt**: Can be installed as a native app
- **Service Worker**: Automatic updates and caching
- **Responsive**: Mobile-first design with desktop optimization
- **Fast Loading**: Optimized assets and lazy loading

## Configuration

### Environment Variables

No environment variables required for basic functionality.

### PWA Configuration

PWA settings can be modified in `vite.config.ts`:

- Manifest settings (name, icons, theme colors)
- Service worker configuration
- Caching strategies
- Offline behavior

### CSS and Styling

This project uses Tailwind CSS for styling with PostCSS processing:

- **Tailwind CSS**: Utility-first CSS framework for rapid UI development
- **PostCSS**: CSS post-processor that handles Tailwind compilation
- **Custom CSS**: Additional styles in `src/index.css` using `@layer` directive
- **Dark Mode**: Built-in dark/light theme switching
- **Responsive Design**: Mobile-first approach with desktop breakpoints

#### VS Code Integration

The project includes VS Code settings (`.vscode/settings.json`) that:
- Disable default CSS validation to prevent Tailwind directive warnings
- Enable Tailwind CSS IntelliSense for TypeScript/React files
- Provide proper autocomplete for Tailwind classes
- Support Emmet completions in TypeScript files

If you see CSS warnings for `@tailwind` or `@apply` directives, ensure you have the Tailwind CSS IntelliSense extension installed.

#### Custom Styles

Custom component styles are defined in `src/index.css` using Tailwind's `@layer components`:

```css
@layer components {
  .btn-primary {
    @apply bg-primary-600 hover:bg-primary-700 text-white font-medium py-3 px-6 rounded-lg transition-colors duration-200;
  }
  .card {
    @apply bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700;
  }
}
```

## Data Structure

### Question Format

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
  timesPeriod: string;
  tags: string[];
}
```

### Question Bundles

Questions are organized into thematic bundles (e.g., "Ancient Egypt", "Roman Empire") with different difficulty levels and premium options.

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run tests and linting
5. Submit a pull request

## License

This project is licensed under the MIT License. See [LICENSES.md](./LICENSES.md) for third-party attributions and compatibility information.

## Acknowledgments

- Original React Native app concept
- Ancient history content curation
- Icon designs and visual assets
- Open source libraries and tools used

---

Built with ⚡ Vite and ❤️ for history enthusiasts

---

# Quarterly Trivia Bundle Delivery & Cloud Integration

## Automated Quarterly Release Workflow

This project is designed for seamless, versioned delivery of new trivia question bundles every quarter. The workflow is fully automated and cloud-based for future-proofing and app store compliance.

### 1. Exporting Bundles

- Use the script at `scripts/export-bundles.ts` to export all non-format question bundles.
- Each bundle contains exactly 100 questions, evenly mixed between true/false, fill-in-the-blank, and multiple choice.
- Format Packs are excluded from this export.
- The script outputs a versioned JSON file (e.g., `public/trivia-bundles-2025-Q3.json`).

**Run:**
```bash
yarn ts-node scripts/export-bundles.ts
```

### 2. Uploading to Supabase Storage

- Use the script at `scripts/upload-bundles-to-supabase.ts` to upload the exported JSON file to your Supabase Storage bucket.
- Requires environment variables `SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY` (see your Supabase project settings).
- The file is versioned for easy rollback and automation.

**Run:**
```bash
SUPABASE_URL=... SUPABASE_SERVICE_ROLE_KEY=... yarn ts-node scripts/upload-bundles-to-supabase.ts
```

### 3. App Integration

- The app fetches the latest bundle from Supabase Storage at runtime.
- Sample quiz buttons always use the correct questions for each bundle.
- All navigation and data loading is robust and future-proof.

### 4. Quarterly Release Checklist

- [ ] Update or add new questions in `src/data/`
- [ ] Run the export script to generate the new bundle JSON
- [ ] Upload the bundle to Supabase Storage
- [ ] Test the app with the new bundle (web and mobile)
- [ ] Announce the new release to users

---

# App Store Submission Guide

## PWA & App Store Readiness

- Manifest and service worker are present and optimized for store requirements
- All assets (icons, screenshots, privacy policy) are included in `public/`
- App meets Lighthouse PWA, accessibility, and performance standards
- Android: Use TWA (Trusted Web Activity) for Play Store submission
- iOS: Use Capacitor or Cordova for App Store submission
- Privacy policy and terms are included and linked in the app

## Submission Steps

1. **Android (Google Play Store):**
   - Use Bubblewrap or PWABuilder to generate a TWA APK/AAB
   - Upload to Google Play Console
   - Complete store listing, privacy, and content rating

2. **iOS (Apple App Store):**
   - Use Capacitor or Cordova to wrap the PWA as a native app
   - Build and archive with Xcode
   - Upload via App Store Connect
   - Complete store listing, privacy, and content rating

3. **Web:**
   - Deploy to Firebase Hosting (see `firebase.json`)
   - Ensure HTTPS and service worker registration

---

# Best Practices & Maintenance

- All automation scripts are in `scripts/` and documented
- Use versioned filenames for bundles to enable rollback and auditing
- Keep Supabase credentials secure (never commit to source control)
- Run Lighthouse audits before each release
- Regularly update dependencies and test on all target platforms

---

# FAQ

**Q: How do I add a new bundle or update questions?**
A: Edit the relevant files in `src/data/`, then run the export and upload scripts as described above.

**Q: How do I roll back to a previous bundle version?**
A: Upload the previous JSON file to Supabase Storage with the desired versioned filename.

**Q: How do I test the app with a new bundle before release?**
A: Upload the bundle to a test bucket or use a local build with the new JSON file in `public/`.

---

# Advanced Quality, Security, and Community

## Lighthouse Audit & Accessibility

- Run Lighthouse in Chrome DevTools (Audits tab) to check PWA, performance, accessibility, and SEO.
- Address all critical and recommended issues before each release.
- Accessibility: All interactive elements are keyboard-accessible and screen-reader friendly. Report issues via GitHub.

## Testing & Quality Assurance

- Manual QA: Test all flows (quiz, store, achievements, settings) on web and mobile.
- Automated tests: (Add/expand as needed in `src/tests/`)
- Report bugs via GitHub Issues with clear steps and screenshots.

## Security Best Practices

- Never commit Supabase or Firebase secrets to source control.
- Use environment variables for all credentials.
- Review dependencies for vulnerabilities regularly (`yarn audit`).
- Follow OWASP PWA security guidelines.

## Changelog & Release Notes

- Maintain a `CHANGELOG.md` with version, date, and summary of changes for each release.
- Summarize new features, bug fixes, and breaking changes.

## Contact & Support

- For help, open an issue on GitHub or contact the maintainer via the repository profile.
- Feature requests and feedback are welcome!

## Localization & Internationalization

- The app is designed for easy translation. To add a new language:
  1. Fork the repo and add translation files in `src/i18n/` (if present).
  2. Submit a pull request with your translations.
- Contact the maintainer to coordinate new language support.

## Accessibility Statement

- This app aims to meet WCAG 2.1 AA standards.
- If you encounter accessibility barriers, please open an issue or contact support.

## Contribution Guidelines (Expanded)

- Use conventional commit messages (e.g., `feat:`, `fix:`, `docs:`).
- Run `yarn lint` and ensure all tests pass before submitting a PR.
- Follow the code style in existing files (TypeScript, functional React, Tailwind CSS).
- All new features should include documentation and, if possible, tests.

## Known Issues & Roadmap

- See [GitHub Issues](../../issues) for current bugs and feature requests.
- Planned: More question bundles, advanced analytics, user accounts, and multi-language support.
- Contributions to the roadmap are welcome!

---

# Mobile & PWA Best Practices (Apple, Android, Web)

## General PWA Best Practices
- Ensure manifest includes all required icons (192x192, 512x512, SVG, etc.) and is store-compliant.
- Use a service worker for offline support, caching, and background sync.
- Test with Lighthouse for PWA, performance, and accessibility scores of 90+.
- Use HTTPS everywhere (required for service workers and app stores).
- Provide a clear privacy policy and terms of service, linked in the app and manifest.
- Use semantic HTML and ARIA roles for accessibility.
- Optimize images and assets for fast loading on mobile networks.
- Support both portrait and landscape orientations if possible.
- Use responsive design and test on a range of device sizes.

## Android (Google Play Store)
- Use Trusted Web Activity (TWA) via Bubblewrap or PWABuilder to wrap your PWA as an Android app.
- Add Play Store-specific assets: screenshots, feature graphic, app icon, and privacy policy.
- Set up Digital Asset Links for TWA verification.
- Test install/uninstall, push notifications, and offline mode on real Android devices.
- Complete Play Console listing: content rating, privacy, and accessibility declarations.
- Use Play Integrity API or SafetyNet for anti-abuse if needed.

## iOS (Apple App Store)
- Use Capacitor or Cordova to wrap your PWA as a native iOS app.
- Add iOS-specific icons and splash screens (all required sizes).
- Test install, offline mode, and push notifications (if supported) on real iPhones/iPads.
- Ensure the app works well with iOS gestures (swipe, back, home indicator).
- Use WKWebView for best performance and compliance.
- Complete App Store Connect listing: screenshots, privacy, content rating, and accessibility.
- Follow Apple’s Human Interface Guidelines for navigation, touch targets, and color contrast.
- Ensure the app does not use forbidden APIs or private entitlements.

## Store Compliance & User Experience
- Provide onboarding for first-time users.
- Prompt for install (Add to Home Screen) and explain benefits.
- Handle permissions (notifications, storage) with clear user prompts.
- Support deep linking and universal links for sharing content.
- Regularly update the app and bundles to maintain store ranking and user engagement.
- Monitor crash/error analytics and user feedback for continuous improvement.

## Security & Privacy
- Use secure, short-lived tokens for API access.
- Never expose private keys or secrets in the app bundle.
- Comply with GDPR, CCPA, and other privacy regulations as required.
- Allow users to request data deletion or export.

## Testing & QA
- Test on a wide range of devices (Android, iOS, Chrome, Safari, Firefox, Edge).
- Use emulators and real devices for comprehensive coverage.
- Run accessibility audits and manual screen reader tests.
- Validate install/uninstall, offline/online transitions, and update flows.

---

# Professional Footer

---

**Ancient History Trivia PWA**

- Built for the future of education and fun.
- Open source, community-driven, and privacy-focused.
- © 2025-present. All rights reserved.

---
