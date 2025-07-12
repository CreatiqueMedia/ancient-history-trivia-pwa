# Contributing to Ancient History Trivia PWA

First off, thank you for considering contributing to the Ancient History Trivia PWA! It's people like you that make this educational tool better for everyone.

## 🚀 Quick Start

1. **Fork the repository**
2. **Clone your fork**: `git clone https://github.com/your-username/ancient-history-pwa.git`
3. **Install dependencies**: `yarn install` (npm is blocked)
4. **Set up environment**: Copy `.env.template` to `.env.development` and configure
5. **Start development**: `yarn dev`
6. **Make your changes**
7. **Test thoroughly**: `yarn test && yarn build`
8. **Submit a pull request**

## 🎯 How to Contribute

### 🐛 Reporting Bugs

Before creating bug reports, please check the issue list as you might find that the bug has already been reported. When creating a bug report, include as many details as possible using our bug report template.

### ✨ Suggesting Features

Feature suggestions are welcome! Please use our feature request template and provide:
- Clear description of the feature
- Use case and benefits
- Implementation ideas (if any)

### 📚 Contributing Questions

We're always looking for high-quality historical questions! Please:
- Use our question content template
- Ensure historical accuracy
- Provide reliable sources
- Follow AP-level difficulty standards

### 💻 Code Contributions

1. **Pick an issue** from our issue tracker or create a new one
2. **Comment on the issue** to let others know you're working on it
3. **Fork and clone** the repository
4. **Create a branch**: `git checkout -b feature/your-feature-name`
5. **Make your changes** following our coding standards
6. **Write tests** for new functionality
7. **Test everything**: `yarn test && yarn build`
8. **Commit your changes**: Use conventional commit messages
9. **Push and create a PR**: Use our PR template

## 📋 Development Guidelines

### 🛠️ Tech Stack Requirements

- **React 18+** with TypeScript
- **Vite 5** for build tooling
- **Tailwind CSS 3** for styling
- **Yarn only** (npm is blocked)
- **Firebase** for backend services
- **PWA** standards compliance

### 🎨 Code Style

- **TypeScript**: Strict mode enabled
- **ESLint**: Follow existing configuration
- **Prettier**: Auto-formatting enabled
- **Naming**: Use descriptive, camelCase names
- **Comments**: Document complex logic and historical facts

### 🧪 Testing Standards

- **Unit tests**: For utility functions and components
- **Integration tests**: For user workflows
- **PWA tests**: Offline functionality, installation
- **Accessibility**: WCAG 2.1 AA compliance
- **Performance**: Bundle size and loading metrics

### 📱 PWA Requirements

All changes must maintain PWA functionality:
- **Offline support**: Core features work without internet
- **Installability**: App can be installed on devices
- **Performance**: Fast loading and smooth interactions
- **Responsive**: Works on all screen sizes

## 🎓 Content Guidelines

### 📖 Question Standards

- **Accuracy**: All facts must be historically accurate
- **Sources**: Provide academic or reliable sources
- **Difficulty**: Maintain AP-level (Advanced Placement) standards
- **Diversity**: Cover various ancient civilizations
- **Formats**: Support multiple choice, true/false, fill-in-blank

### 🏛️ Covered Civilizations

- Ancient Greece
- Ancient Rome  
- Ancient Egypt
- Ancient China
- Mesopotamia
- Ancient India
- Ancient Persia
- Maya Civilization

### 📚 Source Requirements

Acceptable sources include:
- Academic textbooks
- Peer-reviewed journal articles
- University course materials
- Reputable historical organizations
- Primary source translations

## 🔒 Security Guidelines

- **No secrets**: Never commit API keys or sensitive data
- **Environment variables**: Use `.env` files properly
- **Dependencies**: Keep packages updated
- **CSP**: Maintain Content Security Policy compliance

## 🌍 Internationalization

While currently English-only, consider:
- Using translation-ready strings
- Avoiding hardcoded text in components
- Supporting RTL languages in the future

## 🚀 Deployment Process

1. **Development**: Test locally with `yarn dev`
2. **Build**: Verify with `yarn build`
3. **Preview**: Check with `yarn preview`
4. **Deploy**: Automatic deployment via GitHub Actions
5. **Verify**: Test on live site

## 📝 Commit Message Convention

Use conventional commits:

```
type(scope): description

[optional body]

[optional footer]
```

Types:
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes
- `refactor`: Code refactoring
- `test`: Adding tests
- `chore`: Maintenance tasks

Examples:
- `feat(quiz): add new question format support`
- `fix(pwa): resolve offline caching issue`
- `docs(readme): update installation instructions`

## 🏆 Recognition

Contributors will be:
- Listed in our contributors section
- Credited in release notes
- Recognized for significant contributions

## 📞 Getting Help

- **Documentation**: Read our [comprehensive docs](./docs/COMPREHENSIVE_PROJECT_DOCUMENTATION.md)
- **Issues**: Use our issue templates
- **Discussions**: Join GitHub Discussions
- **Questions**: Ask in setup help issues

## 📄 License

By contributing, you agree that your contributions will be licensed under the same license as the project.

## 🎉 Thank You!

Your contributions help make learning ancient history more engaging and accessible. Every bug report, feature suggestion, question submission, and code contribution makes a difference!

---

**Remember**: Quality over quantity. We prefer fewer, well-tested contributions over many rushed ones.
