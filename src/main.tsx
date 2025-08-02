import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App.tsx'
import ErrorBoundary from './components/ErrorBoundary.tsx'
import FallbackApp from './components/FallbackApp.tsx'
import './index.css'

// Performance optimization: defer non-critical imports
const deferredImports = () => {
  // Defer performance monitoring in production
  if (import.meta.env.PROD) {
    import('./services/PerformanceMonitor').then((module) => {
      // PerformanceMonitor has static initialize method
      if (module.PerformanceMonitor && module.PerformanceMonitor.initialize) {
        module.PerformanceMonitor.initialize();
      }
    });
  }
};

// Start deferred imports after initial render
setTimeout(deferredImports, 100);

// Determine the base path for routing
const isGitHubPages = window.location.hostname.includes('github.io');
const basePath = isGitHubPages ? '/ancient-history-trivia-pwa' : '';

// Router future flags to suppress warnings
const routerFuture = {
  v7_startTransition: true,
  v7_relativeSplatPath: true,
};

const rootElement = document.getElementById('root');
if (!rootElement) {
  console.error('❌ Root element not found!');
} else {
  try {
    // Clear the initial loading state first
    const loadingElement = rootElement.querySelector('.loading-spinner');
    if (loadingElement) {
      loadingElement.remove();
    }
    
    ReactDOM.createRoot(rootElement).render(
      <ErrorBoundary fallback={<FallbackApp />}>
        <BrowserRouter basename={basePath} future={routerFuture}>
          <App />
        </BrowserRouter>
      </ErrorBoundary>
    );
  } catch (error) {
    console.error('[Main] Failed to render main app, using fallback:', error);
    ReactDOM.createRoot(rootElement).render(
      <FallbackApp />
    );
  }
}
