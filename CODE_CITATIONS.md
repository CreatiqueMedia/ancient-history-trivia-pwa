# Code Citations and Attributions

This document tracks third-party code, configurations, and inspirations used in the Ancient History PWA project.

## License Compliance

This project respects open-source licenses and provides proper attribution for all external code used.

---

## DLight.js Framework Documentation

**Repository:** [dlight-js/homepage](https://github.com/dlight-js/homepage)
**License:** MIT License
**Files Referenced:** 
- `apps/homepage/public/docs/basic-usages/best-practices.md`
- `apps/homepage/public/docs/zh/basic-usages/best-practices.md`

### Tailwind CSS IntelliSense Configuration

The following VS Code configuration for Tailwind CSS IntelliSense was referenced from DLight.js documentation:

```json
{
  "tailwindCSS.experimental.classRegex": [
    ["clsx\\(([^)]*)\\)", "(?:'|\"|`)([^']*)(?:'|\"|`)"],
    ["class\\(([^)]*)\\)", "(?:'|\"|`)([^']*)(?:'|\"|`)"]
  ]
}
```

**Usage:** This configuration enables Tailwind CSS IntelliSense for dynamic class names in clsx utility functions and standard class attributes.

**Application in Project:** Used in `.vscode/settings.json` to enhance development experience with Tailwind CSS autocomplete.

---

## Tailwind CSS

**Website:** [https://tailwindcss.com/](https://tailwindcss.com/)
**License:** MIT License
**Documentation:** [Tailwind CSS Docs](https://tailwindcss.com/docs)

### Usage in Project
- Utility-first CSS framework for styling
- Responsive design system
- Component styling throughout the application

---

## Vite

**Repository:** [vitejs/vite](https://github.com/vitejs/vite)
**License:** MIT License
**Documentation:** [Vite Guide](https://vitejs.dev/guide/)

### Usage in Project
- Build tool and development server
- PWA plugin integration
- TypeScript compilation
- Asset optimization

---

## React

**Repository:** [facebook/react](https://github.com/facebook/react)
**License:** MIT License
**Documentation:** [React Docs](https://reactjs.org/docs)

### Usage in Project
- Core UI framework
- Component architecture
- State management with Context API
- Hooks for lifecycle management

---

## TypeScript

**Repository:** [microsoft/TypeScript](https://github.com/microsoft/TypeScript)
**License:** Apache License 2.0
**Documentation:** [TypeScript Handbook](https://www.typescriptlang.org/docs/)

### Usage in Project
- Type safety throughout the application
- Interface definitions
- Enhanced development experience

---

## React Router

**Repository:** [remix-run/react-router](https://github.com/remix-run/react-router)
**License:** MIT License
**Documentation:** [React Router Docs](https://reactrouter.com/)

### Usage in Project
- Client-side routing
- Navigation between screens
- Browser history management

---

## VS Code Extensions Referenced

### Tailwind CSS IntelliSense
**Extension ID:** `bradlc.vscode-tailwindcss`
**Publisher:** Brad Cornes
**Marketplace:** [VS Code Marketplace](https://marketplace.visualstudio.com/items?itemName=bradlc.vscode-tailwindcss)

**Usage:** Enhanced autocomplete and linting for Tailwind CSS classes

---

## Ancient History Trivia Original Project

**Repository:** [CreatiqueMedia/ancient-history-trivia](https://github.com/CreatiqueMedia/ancient-history-trivia)
**License:** [Check repository for license information]

### Attribution
This PWA is a web adaptation of the original React Native "Ancient History Trivia" application. The conversion maintains the core functionality while adapting the interface for web and mobile browsers.

**Original Features Adapted:**
- Quiz mechanics and flow
- Question database structure
- Settings and statistics tracking
- Achievement system concept
- Store/bundle system architecture

**Modifications Made:**
- Complete rewrite for web technologies (React + Vite)
- Responsive web design instead of native mobile
- PWA capabilities added
- Different state management approach using React Context
- Web-optimized UI components

---

## Development Tools and Configurations

### PostCSS
**Repository:** [postcss/postcss](https://github.com/postcss/postcss)
**License:** MIT License
**Usage:** CSS processing and Tailwind CSS integration

### ESLint
**Repository:** [eslint/eslint](https://github.com/eslint/eslint)
**License:** MIT License
**Usage:** Code linting and quality assurance

---

## License Compatibility

All dependencies and referenced code are compatible with this project's open-source nature. The majority of dependencies use MIT License, which is permissive and allows for commercial and non-commercial use.

---

## Updates and Maintenance

This document should be updated whenever new third-party code, libraries, or configurations are integrated into the project. Regular reviews ensure compliance with all licensing requirements.

**Last Updated:** June 9, 2025
**Maintainer:** Project Development Team
