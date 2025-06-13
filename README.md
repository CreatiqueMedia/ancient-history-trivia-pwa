# Ancient History Trivia PWA

A Progressive Web App (PWA) for testing your knowledge of ancient civilizations and historical events. Originally converted from a React Native app to work seamlessly on both mobile devices and web browsers.

## Features

- 🏛️ **Ancient History Questions**: Curated questions about ancient civilizations
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
