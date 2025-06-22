import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App.tsx'
import FallbackApp from './components/FallbackApp.tsx'
import './index.css'

// Determine the base path for routing
const isGitHubPages = window.location.hostname.includes('github.io');
const basePath = isGitHubPages ? '/ancient-history-trivia-pwa' : '';

// Environment setup for routing

const rootElement = document.getElementById('root');
if (!rootElement) {
  console.error('❌ Root element not found!');
} else {
  // Initialize React app
  
  // Error boundary component
  class ErrorBoundary extends React.Component<{children: React.ReactNode}, {hasError: boolean}> {
    constructor(props: {children: React.ReactNode}) {
      super(props);
      this.state = { hasError: false };
    }

    static getDerivedStateFromError() {
      return { hasError: true };
    }

    componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
      console.error('[ErrorBoundary] Caught error:', error, errorInfo);
    }

    render() {
      if (this.state.hasError) {
        return <FallbackApp />;
      }

      return this.props.children;
    }
  }

  try {
    ReactDOM.createRoot(rootElement).render(
      <ErrorBoundary>
        <BrowserRouter basename={basePath}>
          <App />
        </BrowserRouter>
      </ErrorBoundary>
    )
  } catch (error) {
    console.error('[Main] Failed to render main app, using fallback:', error);
    ReactDOM.createRoot(rootElement).render(
      <FallbackApp />
    );
  }
}
