# 🚀 Quick Start Guide

Welcome! This guide will help you get the Ancient History Trivia PWA up and running quickly.

## ⚡ 5-Minute Setup

### 1. Clone & Install
```bash
git clone <repository-url>
cd ancient-history-trivia-pwa
yarn install
```

### 2. Environment Setup
```bash
cp .env.example .env.local
# Edit .env.local with your Firebase and Stripe configuration
```

### 3. Start Development
```bash
yarn dev
```

Visit `http://localhost:5173` - you should see the app running!

## 🎯 Next Steps

### Immediate Customization
1. **App Name**: Update `package.json` name and `index.html` title
2. **Logo**: Replace files in `public/logos/`
3. **Content**: Edit questions in `src/data/questions.ts`
4. **Colors**: Update Tailwind config for your brand

### Firebase Setup (Required for full functionality)
1. Create Firebase project at [console.firebase.google.com](https://console.firebase.google.com)
2. Enable Authentication, Firestore, and Hosting
3. Copy config to `.env.development`
4. Deploy rules: `firebase deploy --only firestore:rules`

### Optional Features
- **Payments**: Set up Stripe for premium content
- **Analytics**: Add Google Analytics tracking ID
- **Custom Domain**: Configure Firebase hosting with your domain

## 📚 Full Documentation

For complete setup instructions, see:
- **[Comprehensive Documentation](./docs/COMPREHENSIVE_PROJECT_DOCUMENTATION.md)**
- **[Template README](./TEMPLATE_README.md)**
- **[Contributing Guide](./CONTRIBUTING.md)**

## 🎨 Content Customization

### Replace Sample Questions
Edit `src/data/questions.ts`:
```typescript
export const questions: Question[] = [
  {
    id: 1,
    text: "Your custom question here?",
    type: "multiple-choice",
    options: ["A", "B", "C", "D"],
    correctAnswer: "A",
    explanation: "Your explanation...",
    difficulty: "medium",
    category: "your-category"
  }
  // Add more questions...
];
```

### Update App Branding
1. **Manifest**: Edit `public/manifest.webmanifest`
2. **Title**: Update `index.html` and `package.json`
3. **Theme**: Modify `tailwind.config.js`
4. **Logos**: Replace PNG/SVG files in `public/logos/`

## 🚀 Deployment

### Firebase Hosting (Recommended)
```bash
yarn build
firebase deploy
```

### Other Options
- **Vercel**: Connect GitHub repo for auto-deploy
- **Netlify**: Drag & drop the `dist` folder
- **GitHub Pages**: Use GitHub Actions workflow

## ❓ Need Help?

- **Issues**: Use our issue templates
- **Questions**: Check documentation first
- **Bugs**: Report with details and screenshots
- **Features**: Submit feature requests

## ✨ What's Included

✅ **Modern Tech Stack**: React 18, TypeScript, Vite  
✅ **PWA Ready**: Offline support, installable  
✅ **Responsive Design**: Mobile-first approach  
✅ **Firebase Integration**: Auth, database, hosting  
✅ **Payment System**: Stripe integration ready  
✅ **Testing Suite**: Unit and E2E tests  
✅ **Security**: CSP headers, best practices  
✅ **Documentation**: Comprehensive guides  

## 🎉 You're Ready!

Your template is now set up and ready for customization. Start by updating the questions and branding, then gradually add your own features.

**Happy coding! 🚀**

---

*This template was created to help educators and developers build engaging quiz applications quickly and efficiently.*
