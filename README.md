# 🏛️ Ancient History Trivia PWA

## 🚨 FOR AI DEVELOPERS: READ FIRST 🚨
**Before making ANY changes to this project:**
- Read `/.ai-guardrails/RESPONSE_PROTOCOL.md`
- Check `/AI_SYSTEM_PROMPT.md` 
- Follow `/MANDATORY_CHECKLIST.md`
- **Architecture**: Stripe-only (NO Firestore)
- **Services**: StripeTrialService, LocalQuestionService, StripePurchaseContentService

---

A Progressive Web App (PWA) for testing your knowledge of ancient civilizations and historical events. Originally converted from a React Native app to work seamlessly on both mobile devices and web browsers.

## ✨ Features

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

## 🛠️ Tech Stack

- **Frontend**: React 18 with TypeScript
- **Build Tool**: Vite 5
- **Styling**: Tailwind CSS 3
- **PWA**: Vite PWA Plugin with Workbox
- **Icons**: Heroicons & Lucide React
- **Routing**: React Router 6
- **State Management**: React Context API
- **Package Manager**: Yarn (npm blocked)

## 📋 Quick Navigation
- [🚀 Getting Started](#-getting-started)
- [🔧 Development](#-development)  
- [🧪 Testing](#-testing)
- [🚀 Deployment](#-deployment)
- [💰 Business Strategy](#-business-strategy)
- [🔒 Security](#-security)
- [🤝 Contributing](#-contributing)

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- Yarn (NPM is blocked - see [Package Manager Policy](#package-manager-policy))
- Firebase account
- Stripe account

### Quick Setup
```bash
# Clone the repository
git clone <your-repo-url>
cd ancient-history-trivia-pwa

# Install dependencies (yarn only)
yarn install

# Set up environment
cp .env.example .env.local
# Edit .env.local with your Firebase and Stripe configuration

# Start development server
yarn dev
```

### Environment Configuration
Create `.env.local` with:
```bash
# Firebase Configuration
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id

# Stripe Configuration (use test keys for development)
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_...
```

### Testing Payments (Stripe Test Mode)

The app includes Stripe payment integration in test mode for safe testing:

**💳 Stripe Test Card Numbers:**
- **Successful Payment**: `4242 4242 4242 4242`
- **Expiration**: Any future date (e.g., `12/25`)
- **CVC**: Any 3 digits (e.g., `123`)
- **ZIP**: Any postal code (e.g., `12345`)

**🛡️ Safe Testing**: All payments use Stripe test mode - no real money is charged!

---

## 🔧 Development

### Package Manager Policy
This project **strictly enforces Yarn usage**. NPM is blocked and will cause installation failures.

**Why Yarn Only?**
- Lock file consistency for reproducible builds
- Better performance and dependency resolution
- Enhanced security vulnerability handling
- Team consistency across all environments

### Project Structure
```
src/
├── components/          # Reusable UI components
├── screens/            # Main application screens
├── context/            # React context providers
├── hooks/              # Custom React hooks
├── services/           # Business logic and API calls
├── config/             # Configuration files
├── data/               # Question data and bundles
├── types/              # TypeScript type definitions
└── utils/              # Utility functions

tests/                  # E2E tests with Playwright
docs/                   # Documentation
public/                 # Static assets
```

### Development Commands
```bash
yarn dev              # Start development server
yarn build            # Production build
yarn preview          # Preview production build
yarn test             # Run E2E tests
yarn lint             # Lint code
yarn clean            # Clean caches and artifacts
```

### Code Quality
- TypeScript strict mode enabled
- ESLint and Prettier configured
- Husky pre-commit hooks
- Automated testing with Playwright

---

## 🧪 Testing

### E2E Testing with Playwright
Comprehensive end-to-end tests covering:

**Authentication Flows:**
- ✅ Auth modal display for unauthenticated users
- ✅ Login/logout functionality
- ✅ Session persistence across page reloads

**Payment Flows:**
- ✅ Bundle purchase flows (Easy, Medium, Hard packs)
- ✅ Subscription purchase flows (Monthly, Annual)
- ✅ Payment success/cancellation handling
- ✅ Stripe redirect integration
- ✅ Content access after purchase

**Content Access:**
- ✅ Sample quiz access without authentication
- ✅ Protected content requiring authentication
- ✅ Proper UI state management

### Running Tests
```bash
# Run all E2E tests
yarn test

# Run tests in headed mode (see browser)
yarn test:headed

# Run specific test file
yarn playwright test tests/purchase-flows.spec.ts

# Generate test report
yarn test:report
```

### Test Coverage
- **Authentication**: 100% critical paths covered
- **Payment Integration**: Complete Stripe flow validation
- **Content Access**: All access control scenarios tested
- **Error Handling**: Network failures and edge cases covered

---

## 🚀 Deployment

### Production Build
```bash
# Create production build
yarn build

# Preview production build locally
yarn preview
```

### Firebase Hosting
```bash
# Deploy to Firebase
firebase deploy

# Deploy hosting only
firebase deploy --only hosting
```

### Environment Setup
1. **Development**: Use `.env.local` with test Stripe keys
2. **Production**: Use Firebase environment config with live Stripe keys

### Pre-deployment Checklist
- [ ] All E2E tests passing
- [ ] Production build successful
- [ ] Environment variables configured
- [ ] Stripe webhooks configured
- [ ] Firebase security rules updated
- [ ] Performance audit completed

---

## 💰 Business Strategy

### Revenue Model
**Target**: $500K-$880K annual revenue through Educational App Empire strategy

### Monetization Streams
1. **One-time Bundle Purchases**
   - Easy Pack: $9.99
   - Medium Pack: $14.99  
   - Hard Pack: $19.99
   - Complete Bundle: $34.99

2. **Subscription Model**
   - Monthly Pro: $9.99/month
   - Annual Pro: $79.99/year (33% savings)

3. **Specialized Topic Packs**
   - Ancient Egypt: $12.99
   - Ancient Rome: $12.99
   - Ancient Greece: $12.99

### Growth Strategy
- **Zero-cost marketing** through organic channels
- **Template-based expansion** to other educational topics
- **Progressive feature releases** to increase engagement
- **Community-driven content** for long-term growth

### Key Metrics
- **Conversion Rate**: Target 3-5% for free-to-paid
- **Retention**: 70% monthly retention for subscribers
- **ARPU**: $15-25 average revenue per user
- **Customer Acquisition Cost**: Keep under $10 through organic growth

---

## 🔒 Security

### Authentication Security
- Firebase Authentication with Google OAuth
- Secure session management
- Protected routes and API endpoints
- Input validation and sanitization

### Payment Security
- Stripe secure payment processing
- No sensitive payment data stored locally
- HTTPS enforcement in production
- Webhook signature verification

### Data Protection
- Minimal data collection (privacy by design)
- GDPR compliance considerations
- Secure environment variable handling
- Regular security audits

### Best Practices Implemented
- Content Security Policy (CSP) headers
- XSS protection
- CSRF protection through SameSite cookies
- Regular dependency updates for security patches

---

## 🤝 Contributing

### Getting Started
1. Fork the repository
2. Clone your fork: `git clone https://github.com/your-username/ancient-history-pwa.git`
3. Install dependencies: `yarn install`
4. Set up environment: Copy `.env.example` to `.env.local` and configure
5. Start development: `yarn dev`
6. Make your changes
7. Test thoroughly: `yarn test && yarn build`
8. Submit a pull request

### Development Workflow
- **Feature branches**: Use descriptive names (e.g., `feature/new-quiz-mode`)
- **Commit messages**: Follow conventional commits format
- **Code review**: All PRs require review before merge
- **Testing**: E2E tests must pass before merge

### Code Standards
- TypeScript strict mode
- ESLint configuration compliance
- Prettier formatting
- Component documentation with JSDoc
- Test coverage for new features

### Bug Reports
When reporting bugs, include:
- Steps to reproduce
- Expected vs actual behavior
- Browser/device information
- Screenshots if applicable
- Console errors

### Feature Requests
- Check existing issues first
- Provide detailed use case
- Consider implementation complexity
- Align with project goals

---

## 📚 Additional Documentation

For detailed guides, see the [`docs/`](./docs/) folder:

- **[🚀 Quick Start Guide](./docs/GETTING_STARTED.md)** - Get up and running in 5 minutes
- **[🧪 Testing Guide](./docs/TESTING_GUIDE.md)** - E2E testing with Playwright
- **[🤝 Contributing Guide](./docs/CONTRIBUTING.md)** - How to contribute to the project
- **[🔒 Security Guide](./docs/SECURITY.md)** - Security best practices and policies
- **[💰 Marketing Strategy](./docs/MARKETING_STRATEGY.md)** - Zero-cost growth strategy

## 🎮 App Screens

1. **Home Screen**: Dashboard with quick stats and featured topics
2. **Quiz Screen**: Interactive quiz with timer and progress
3. **Results Screen**: Detailed results with performance breakdown
4. **Store Screen**: Browse and unlock question bundles
5. **Stats Screen**: Comprehensive statistics and progress tracking
6. **Settings Screen**: Theme, audio, and app preferences
7. **Achievements Screen**: Gamified achievement system

## 📱 PWA Features

- **Offline Support**: Questions and core functionality work offline
- **Install Prompt**: Can be installed as a native app
- **Service Worker**: Automatic updates and caching
- **Responsive**: Mobile-first design with desktop optimization
- **Fast Loading**: Optimized assets and lazy loading

## 🎨 Styling & CSS

This project uses Tailwind CSS for styling with PostCSS processing:

- **Tailwind CSS**: Utility-first CSS framework for rapid UI development
- **PostCSS**: CSS post-processor that handles Tailwind compilation
- **Custom CSS**: Additional styles in `src/index.css` using `@layer` directive
- **Dark Mode**: Built-in dark/light theme switching
- **Responsive Design**: Mobile-first approach with desktop breakpoints

### VS Code Integration

The project includes VS Code settings (`.vscode/settings.json`) that:
- Disable default CSS validation to prevent Tailwind directive warnings
- Enable Tailwind CSS IntelliSense for TypeScript/React files
- Provide proper autocomplete for Tailwind classes
- Support Emmet completions in TypeScript files

## 🏗️ Data Structure

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

## 🔄 Content Management

Question bundles are managed through the Stripe + Firebase content delivery system:

### Content Generation
- Questions are generated dynamically after purchase through the PurchaseContentDeliveryService
- Each bundle contains exactly 100 questions with proper difficulty distribution
- Standard bundles follow 33/33/34 (Easy/Medium/Hard) formula
- Difficulty packs contain 100% of their specified level

### Content Delivery
- Stripe webhooks trigger content generation after successful purchase
- Content is cached locally for offline access
- Users get immediate access to purchased bundles
- Sample quiz buttons always use the correct questions for each bundle

## 🚀 Technical Resources

### Documentation Links
- [React Documentation](https://react.dev/)
- [Vite Build Tool](https://vitejs.dev/)
- [Firebase Documentation](https://firebase.google.com/docs)
- [Stripe API Reference](https://stripe.com/docs/api)
- [Playwright Testing](https://playwright.dev/)

### Project Links
- **Live App**: https://ancient-history-trivia.web.app
- **Repository**: [GitHub Repository URL]
- **Issue Tracker**: [GitHub Issues URL]

## 📄 License

This project is licensed under the MIT License. See [LICENSE.md](./LICENSE.md) for third-party attributions and compatibility information.

## 🙏 Acknowledgments

- Original React Native app concept
- Ancient history content curation
- Icon designs and visual assets
- Open source libraries and tools used

---

Built with ⚡ Vite and ❤️ for history enthusiasts

*Last Updated: August 2025*
