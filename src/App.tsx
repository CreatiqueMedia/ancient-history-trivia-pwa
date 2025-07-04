import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { useEffect } from 'react';
import { SettingsProvider } from './context/SettingsContext';
import { StatsProvider } from './context/StatsContext';
import { QuizProvider } from './context/QuizContext';
import { ThemeProvider } from './context/ThemeContext';
import { PurchaseProvider } from './context/PurchaseContext';
// Use Firebase authentication everywhere now that GitHub Pages domain is authorized
import { AuthProvider } from './context/AuthContext';
import { useFirebaseAuth, getServiceWorkerPath } from './config/environment';
import PaymentProvider from './components/PaymentProvider';
import PaymentModal from './components/PaymentModal';
import HomeScreen from './screens/HomeScreen.tsx';
import QuizScreen from './screens/QuizScreen.tsx';
import ResultsScreen from './screens/ResultsScreen.tsx';
import StoreScreen from './screens/StoreScreen.tsx';
import StatsScreen from './screens/StatsScreen.tsx';
import SettingsScreen from './screens/SettingsScreen.tsx';
import AchievementsScreen from './screens/AchievementsScreen.tsx';
// SubscriptionScreen import removed
import UserProfileScreen from './screens/UserProfileScreen.tsx';
import BillingHistoryScreen from './screens/BillingHistoryScreen.tsx';
import AboutScreen from './screens/AboutScreen.tsx';
import EmailLinkHandler from './screens/EmailLinkHandler.tsx';
import SuccessScreen from './screens/SuccessScreen.tsx';
import Layout from './components/Layout.tsx';
import LoadingSpinner from './components/LoadingSpinner.tsx';
import ProtectedRoute from './components/ProtectedRoute.tsx';
import { analyticsService } from './services/AnalyticsService';
import { notificationService } from './services/NotificationService';
import { errorHandler } from './services/ErrorHandlingService';
import { QuestionService } from './services/QuestionService';
import ErrorBoundary from './components/ErrorBoundary';

// AppContent component to handle auth loading state
const AppContent = () => {
  // Add error boundary and debugging for GitHub Pages
  const [hasError, setHasError] = React.useState(false);
  const [errorMessage, setErrorMessage] = React.useState('');

  React.useEffect(() => {
    // Handle Firebase auth redirect if stuck on auth handler page
    if (window.location.pathname.includes('/__/auth/handler')) {
      // Wait a moment for Firebase to handle the redirect automatically
      setTimeout(() => {
        // If still on the auth handler page after 3 seconds, manually redirect
        if (window.location.pathname.includes('/__/auth/handler')) {
          window.location.href = '/';
        }
      }, 3000);
    }

    // Add global error handler
    const handleError = (event: ErrorEvent) => {
      console.error('[App] Global error:', event.error);
      setHasError(true);
      setErrorMessage(event.error?.message || 'Unknown error');
    };

    const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
      console.error('[App] Unhandled promise rejection:', event.reason);
      setHasError(true);
      setErrorMessage(event.reason?.message || 'Promise rejection');
    };

    window.addEventListener('error', handleError);
    window.addEventListener('unhandledrejection', handleUnhandledRejection);

    return () => {
      window.removeEventListener('error', handleError);
      window.removeEventListener('unhandledrejection', handleUnhandledRejection);
    };
  }, []);

  // Check for errors before rendering

  if (hasError) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-center p-8">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Something went wrong</h1>
          <p className="text-gray-600 mb-4">{errorMessage}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="bg-blue-600 text-white px-4 py-2 rounded"
          >
            Reload Page
          </button>
        </div>
      </div>
    );
  }

  return (
    <Layout>
      <Routes>
        <Route path="/" element={<HomeScreen />} />
        <Route path="/quiz/:bundleId?" element={<QuizScreen />} />
        <Route path="/results" element={<ResultsScreen />} />
        <Route path="/store" element={<StoreScreen />} />
        <Route path="/stats" element={
          <ProtectedRoute>
            <StatsScreen />
          </ProtectedRoute>
        } />
        <Route path="/settings" element={<SettingsScreen />} />
        <Route path="/achievements" element={
          <ProtectedRoute>
            <AchievementsScreen />
          </ProtectedRoute>
        } />
        {/* /subscription route removed */}
        <Route path="/profile" element={<UserProfileScreen />} />
        <Route path="/billing" element={
          <ProtectedRoute>
            <BillingHistoryScreen />
          </ProtectedRoute>
        } />
        <Route path="/about" element={<AboutScreen />} />
        <Route path="/success" element={<SuccessScreen />} />
        <Route path="/auth/signin" element={<EmailLinkHandler />} />
        {/* Specific route for auth handlers only */}
        <Route path="/__/auth/*" element={<HomeScreen />} />
      </Routes>
    </Layout>
  );
};

function App() {
  // Now using Firebase Auth everywhere since GitHub Pages domain is authorized
  // Using Firebase AuthProvider on all platforms

  // Initialize services on app startup
  useEffect(() => {
    const initializeServices = async () => {
      // Initialize services
      
      try {
        // Initialize analytics
        analyticsService.initSession();
        analyticsService.trackPageView('app_start');
        
        // Initialize notifications
        await notificationService.initialize();
        
        // Initialize QuestionService for on-demand question loading
        await QuestionService.initialize();
        
        // Temporarily disable service worker for GitHub Pages to fix the loading issue
        // TODO: Fix PWA service worker configuration for GitHub Pages
        /*
        // Register service worker for PWA features
        if ('serviceWorker' in navigator) {
          try {
            const swPath = getServiceWorkerPath();
            // Register service worker
            const registration = await navigator.serviceWorker.register(swPath);
            // Service worker registered successfully
            
            // Listen for service worker messages
            navigator.serviceWorker.addEventListener('message', (event) => {
              if (event.data?.type === 'ANALYTICS_EVENT') {
                analyticsService.trackFeatureUsage('service_worker_event', event.data.eventName);
              }
            });
          } catch (error) {
            console.error('[App] Service worker registration failed:', error);
            errorHandler.handleGenericError(error, 'service-worker-registration');
          }
        }
        */
        
        // Track app initialization success
        analyticsService.trackFeatureUsage('app_initialization', 'success');
        // All services initialized successfully
        
      } catch (error) {
        console.error('[App] Service initialization failed:', error);
        errorHandler.handleGenericError(error, 'app-initialization');
        analyticsService.trackError('App initialization failed', 'startup');
      }
    };

    initializeServices();
  }, []);

  return (
    <ErrorBoundary>
      <ThemeProvider>
        <AuthProvider>
          <SettingsProvider>
            <StatsProvider>
              <PaymentProvider>
                <PurchaseProvider>
                  <QuizProvider>
                    <AppContent />
                  </QuizProvider>
                </PurchaseProvider>
              </PaymentProvider>
            </StatsProvider>
          </SettingsProvider>
        </AuthProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
