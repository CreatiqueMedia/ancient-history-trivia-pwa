import { Routes, Route } from 'react-router-dom';
import { useEffect } from 'react';
import { SettingsProvider } from './context/SettingsContext';
import { StatsProvider } from './context/StatsContext';
import { QuizProvider } from './context/QuizContext';
import { ThemeProvider } from './context/ThemeContext';
import { PurchaseProvider } from './context/PurchaseContext';
// Use AuthContext for production with real Firebase auth, MockAuthContext for development
import { AuthProvider } from './context/AuthContext';
import HomeScreen from './screens/HomeScreen.tsx';
import QuizScreen from './screens/QuizScreen.tsx';
import ResultsScreen from './screens/ResultsScreen.tsx';
import StoreScreen from './screens/StoreScreen.tsx';
import StatsScreen from './screens/StatsScreen.tsx';
import SettingsScreen from './screens/SettingsScreen.tsx';
import AchievementsScreen from './screens/AchievementsScreen.tsx';
import SubscriptionScreen from './screens/SubscriptionScreen.tsx';
import UserProfileScreen from './screens/UserProfileScreen.tsx';
import AboutScreen from './screens/AboutScreen.tsx';
import Layout from './components/Layout.tsx';
import LoadingSpinner from './components/LoadingSpinner.tsx';
import ProtectedRoute from './components/ProtectedRoute.tsx';
import { analyticsService } from './services/AnalyticsService';
import { notificationService } from './services/NotificationService';
import { errorHandler } from './services/ErrorHandlingService';

// AppContent component to handle auth loading state
const AppContent = () => {
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
        <Route path="/subscription" element={<SubscriptionScreen />} />
        <Route path="/profile" element={<UserProfileScreen />} />
        <Route path="/about" element={<AboutScreen />} />
      </Routes>
    </Layout>
  );
};

function App() {
  // Initialize services on app startup
  useEffect(() => {
    const initializeServices = async () => {
      console.log('[App] Initializing services...');
      
      try {
        // Initialize analytics
        analyticsService.initSession();
        analyticsService.trackPageView('app_start');
        
        // Initialize notifications
        await notificationService.initialize();
        
        // Register service worker for PWA features
        if ('serviceWorker' in navigator) {
          try {
            const registration = await navigator.serviceWorker.register('/sw.js');
            console.log('[App] Service worker registered:', registration.scope);
            
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
        
        // Track app initialization success
        analyticsService.trackFeatureUsage('app_initialization', 'success');
        console.log('[App] All services initialized successfully');
        
      } catch (error) {
        console.error('[App] Service initialization failed:', error);
        errorHandler.handleGenericError(error, 'app-initialization');
        analyticsService.trackError('App initialization failed', 'startup');
      }
    };

    initializeServices();
  }, []);

  return (
    <ThemeProvider>
      <AuthProvider>
        <SettingsProvider>
          <StatsProvider>
            <PurchaseProvider>
              <QuizProvider>
                <AppContent />
              </QuizProvider>
            </PurchaseProvider>
          </StatsProvider>
        </SettingsProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
