import React, { useState, useEffect, Suspense, lazy } from 'react';
import { Routes, Route } from 'react-router-dom';
// import { useRegisterSW } from 'virtual:pwa-register/react';
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider } from './context/AuthContext';
import { QuizProvider } from './context/QuizContext';
import { PurchaseProvider } from './context/PurchaseContext';
import { StatsProvider } from './context/StatsContext';
import { SettingsProvider } from './context/SettingsContext';
import { TrialProvider } from './context/TrialContext';
import { GameProvider } from './context/GameContext';
import { SoundProvider } from './context/SoundContext';
import { AppStateProvider } from './context/AppStateContext';
import { ServiceWorkerProvider } from './context/ServiceWorkerContext';
import Layout from './components/Layout';
import { lazyWithPreload, preloadCriticalRoutes } from './utils/lazyLoading';
import { RouteLoadingFallback } from './components/LazyLoadingFallbacks';
import { performanceMonitor, checkPerformanceBudget } from './utils/performance';

// Lazy load heavy components with preloading
const HomePage = lazyWithPreload(() => import('./screens/HomeScreen'));
const QuizPage = lazyWithPreload(() => import('./screens/QuizScreen'));
const ResultsPage = lazyWithPreload(() => import('./screens/ResultsScreen'));
const ProfilePage = lazyWithPreload(() => import('./screens/UserProfileScreen'));
const SettingsPage = lazyWithPreload(() => import('./screens/SettingsScreen'));
const LeaderboardPage = lazyWithPreload(() => import('./pages/LeaderboardPage'));
const AchievementsPage = lazyWithPreload(() => import('./screens/AchievementsScreen'));
const StorePage = lazyWithPreload(() => import('./screens/StoreScreen'));
const StatsPage = lazyWithPreload(() => import('./screens/StatsScreen'));
const BillingPage = lazyWithPreload(() => import('./screens/BillingScreen'));

// Less critical pages - regular lazy loading
const PrivacyPolicyPage = lazy(() => import('./pages/PrivacyPolicyPage'));
const TermsOfServicePage = lazy(() => import('./pages/TermsOfServicePage'));
const AboutPage = lazy(() => import('./screens/AboutScreen'));
const ContactPage = lazy(() => import('./pages/ContactPage'));
const AdminPage = lazy(() => import('./pages/AdminPage'));
const LoginPage = lazy(() => import('./pages/LoginPage'));
const RegisterPage = lazy(() => import('./pages/RegisterPage'));
const ResetPasswordPage = lazy(() => import('./pages/ResetPasswordPage'));
const VerifyEmailPage = lazy(() => import('./pages/VerifyEmailPage'));
const UnauthorizedPage = lazy(() => import('./pages/UnauthorizedPage'));
const MaintenancePage = lazy(() => import('./pages/MaintenancePage'));
const NotFoundPage = lazy(() => import('./pages/NotFoundPage'));
const SuccessPage = lazy(() => import('./screens/SuccessScreen'));

// Component to handle online/offline state
const OnlineStatusHandler: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isOnline, setIsOnline] = React.useState(navigator.onLine);

  React.useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  return (
    <>
      {!isOnline && (
        <div className="bg-red-500 text-white p-2 text-center">
          You are currently offline
        </div>
      )}
      {children}
    </>
  );
};

// Component to handle app loading state
const AppLoadingHandler: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Remove artificial loading delay that might cause refresh loops
  return <>{children}</>;
};

// App routes component
const AppRoutes: React.FC = () => {
  // Preload critical routes after component mounts
  React.useEffect(() => {
    preloadCriticalRoutes([
      HomePage,
      QuizPage,
      ResultsPage,
      ProfilePage,
      SettingsPage
    ]);
  }, []);

  return (
    <Layout>
      <Suspense fallback={<RouteLoadingFallback />}>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/quiz" element={<QuizPage />} />
          <Route path="/quiz/:bundleId" element={<QuizPage />} />
          <Route path="/quiz/daily-challenge" element={<QuizPage />} />
          <Route path="/results" element={<ResultsPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/settings" element={<SettingsPage />} />
          <Route path="/stats" element={<StatsPage />} />
          <Route path="/billing" element={<BillingPage />} />
          <Route path="/leaderboard" element={<LeaderboardPage />} />
          <Route path="/achievements" element={<AchievementsPage />} />
          <Route path="/store" element={<StorePage />} />
          <Route path="/success" element={<SuccessPage />} />
          <Route path="/privacy" element={<PrivacyPolicyPage />} />
          <Route path="/terms" element={<TermsOfServicePage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/admin" element={<AdminPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/reset-password" element={<ResetPasswordPage />} />
          <Route path="/verify-email" element={<VerifyEmailPage />} />
          <Route path="/unauthorized" element={<UnauthorizedPage />} />
          <Route path="/maintenance" element={<MaintenancePage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </Suspense>
    </Layout>
  );
};

// Context providers wrapper
const AppProviders: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <ThemeProvider>
      <AppStateProvider>
        <AuthProvider>
          <SettingsProvider>
            <SoundProvider>
              <QuizProvider>
                <GameProvider>
                  <StatsProvider>
                    <PurchaseProvider>
                      <TrialProvider>
                        <ServiceWorkerProvider>
                          {children}
                        </ServiceWorkerProvider>
                      </TrialProvider>
                    </PurchaseProvider>
                  </StatsProvider>
                </GameProvider>
              </QuizProvider>
            </SoundProvider>
          </SettingsProvider>
        </AuthProvider>
      </AppStateProvider>
    </ThemeProvider>
  );
};

const App: React.FC = () => {
  // Initialize performance monitoring
  React.useEffect(() => {
    // Check performance budget after initial load
    setTimeout(() => {
      const violations = checkPerformanceBudget();
      if (violations.length > 0 && process.env.NODE_ENV === 'development') {
        console.warn('Performance budget violations detected:', violations);
      }
    }, 3000); // Check after 3 seconds

    // Track app initialization
    performanceMonitor.markFeatureUsage('app_initialization');
  }, []);

  return (
    <AppProviders>
      <AppLoadingHandler>
        <OnlineStatusHandler>
          <AppRoutes />
        </OnlineStatusHandler>
      </AppLoadingHandler>
    </AppProviders>
  );
};

export default App;
