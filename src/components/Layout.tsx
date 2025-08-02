import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  HomeIcon, 
  ChartBarIcon, 
  CogIcon, 
  TrophyIcon,
  ShoppingBagIcon,
  Bars3Icon,
  XMarkIcon,
  UserIcon,
  ArrowRightOnRectangleIcon,
  InformationCircleIcon,
  ChatBubbleLeftRightIcon,
  CreditCardIcon
} from '@heroicons/react/24/outline';
import { 
  HomeIcon as HomeIconSolid,
  ChartBarIcon as ChartBarIconSolid,
  CogIcon as CogIconSolid,
  TrophyIcon as TrophyIconSolid,
  ShoppingBagIcon as ShoppingBagIconSolid,
  InformationCircleIcon as InformationCircleIconSolid,
  CreditCardIcon as CreditCardIconSolid
} from '@heroicons/react/24/solid';
import { useAuth } from '../hooks/useAuth';
import AuthModal from './AuthModal';
import FeedbackModal from './FeedbackModal';
import { Logo } from './Logo';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false); // Start with sidebar closed by default
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [feedbackModalOpen, setFeedbackModalOpen] = useState(false);
  const { user, userProfile, logout } = useAuth();

  // Close auth modal when user becomes authenticated
  React.useEffect(() => {
    if (user && authModalOpen) {
      setAuthModalOpen(false);
    }
  }, [user, authModalOpen]);
  
  const navItems = [
    { 
      path: '/', 
      label: 'Home', 
      icon: HomeIcon, 
      iconSolid: HomeIconSolid 
    },
    ...(user ? [
      { 
        path: '/stats', 
        label: 'Stats', 
        icon: ChartBarIcon, 
        iconSolid: ChartBarIconSolid 
      }
    ] : []),
    { 
      path: '/store', 
      label: 'Store', 
      icon: ShoppingBagIcon, 
      iconSolid: ShoppingBagIconSolid 
    },
    ...(user ? [
      { 
        path: '/achievements', 
        label: 'Awards', 
        icon: TrophyIcon, 
        iconSolid: TrophyIconSolid
      },
      { 
        path: '/billing', 
        label: 'Billing', 
        icon: CreditCardIcon, 
        iconSolid: CreditCardIconSolid
      }
    ] : []),
    { 
      path: '/about', 
      label: 'About', 
      icon: InformationCircleIcon, 
      iconSolid: InformationCircleIconSolid
    },
    { 
      path: '/settings', 
      label: 'Settings', 
      icon: CogIcon, 
      iconSolid: CogIconSolid 
    }
  ];

  const handleLogout = async () => {
    try {
      await logout();
      setSidebarOpen(false);
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const isActive = (path: string) => {
    if (path === '/') {
      return location.pathname === '/';
    }
    return location.pathname.startsWith(path);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col">
      {/* Mobile Header */}
      <header className="block lg:hidden bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 sticky top-0 z-40" data-testid="mobile-header">
        <div className="flex items-center justify-between px-4 py-3">
          <div className="flex items-center">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors mr-3"
              title={sidebarOpen ? "Close Navigation" : "Open Navigation"}
            >
              {sidebarOpen ? (
                <XMarkIcon className="w-6 h-6 text-gray-600 dark:text-gray-400" />
              ) : (
                <Bars3Icon className="w-6 h-6 text-gray-600 dark:text-gray-400" />
              )}
            </button>
            <Logo size={24} className="mr-2" />
            <h1 className="text-lg font-bold text-gray-900 dark:text-white">
              Ancient History
            </h1>
          </div>

          {/* Mobile User Profile Section */}
          <div className="flex items-center space-x-2">
            {user ? (
              <div className="flex items-center space-x-2">
                {/* Subscription Badge - Compact */}
                {userProfile?.subscription && userProfile.subscription !== 'free' && (
                  <span className="bg-primary-100 dark:bg-primary-900 text-primary-700 dark:text-primary-300 px-2 py-1 rounded text-xs font-medium">
                    {userProfile.subscription === 'pro_monthly' ? '⭐' :
                     userProfile.subscription === 'pro_annual' ? '🏆' : 'Pro'}
                  </span>
                )}
                
                {/* User Avatar - Compact */}
                <Link to="/profile" className="flex items-center">
                  {userProfile?.photoURL ? (
                    <img
                      src={userProfile.photoURL}
                      alt={userProfile.displayName}
                      className="w-6 h-6 rounded-full"
                    />
                  ) : (
                    <div className="w-6 h-6 bg-primary-600 rounded-full flex items-center justify-center">
                      <UserIcon className="w-4 h-4 text-white" />
                    </div>
                  )}
                </Link>
              </div>
            ) : (
              <button
                onClick={() => setAuthModalOpen(true)}
                className="text-sm font-medium text-primary-600 dark:text-primary-400"
              >
                Sign In
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Desktop Header with Toggle */}
      <header className="hidden lg:block bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 sticky top-0 z-40" data-testid="desktop-header">
        <div className="flex items-center justify-between px-4 py-3">
          <div className="flex items-center">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors border border-gray-200 dark:border-gray-600 shadow-sm bg-white dark:bg-gray-800 mr-3"
              title={sidebarOpen ? "Close Navigation Menu" : "Open Navigation Menu"}
            >
              {sidebarOpen ? (
                <XMarkIcon className="w-6 h-6 text-gray-700 dark:text-gray-300" />
              ) : (
                <Bars3Icon className="w-6 h-6 text-gray-700 dark:text-gray-300" />
              )}
            </button>
            <div className="flex items-center ml-3">
              <Logo size={32} className="mr-3" />
              <h1 className="text-xl font-bold text-gray-900 dark:text-white">
                Ancient History Trivia
              </h1>
            </div>
          </div>

          {/* User Profile Section */}
          <div className="flex items-center space-x-4">
            {user ? (
              <div className="flex items-center space-x-3">
                {/* Subscription Badge */}
                {userProfile?.subscription && userProfile.subscription !== 'free' && (
                  <span
                    className="bg-primary-100 dark:bg-primary-900 text-primary-700 dark:text-primary-300 px-3 py-1 rounded-full text-sm font-medium"
                  >
                    {userProfile.subscription === 'pro_monthly' ? '⭐ Pro Monthly' :
                     userProfile.subscription === 'pro_annual' ? '🏆 Pro Annual' : 'Pro'}
                  </span>
                )}
                
                {/* User Avatar/Name */}
                <Link to="/profile" className="flex items-center space-x-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg px-2 py-1 transition-colors">
                  {userProfile?.photoURL ? (
                    <img
                      src={userProfile.photoURL}
                      alt={userProfile.displayName}
                      className="w-8 h-8 rounded-full"
                    />
                  ) : (
                    <div className="w-8 h-8 bg-primary-600 rounded-full flex items-center justify-center">
                      <UserIcon className="w-5 h-5 text-white" />
                    </div>
                  )}
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    {userProfile?.displayName || user?.displayName || user?.email || 'User'}
                  </span>
                </Link>

                {/* Logout Button */}
                <button
                  onClick={handleLogout}
                  className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors bg-red-100 hover:bg-red-200 rounded"
                  title="Sign Out"
                >
                  <ArrowRightOnRectangleIcon className="w-5 h-5" />
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-3">
                <button
                  onClick={() => {
                    if (!user) {
                      setAuthModalOpen(true);
                    }
                  }}
                  className="text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors"
                >
                  Sign In
                </button>
                <button
                  onClick={() => {
                    if (!user) {
                      setAuthModalOpen(true);
                    }
                  }}
                  className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                >
                  Sign Up
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      <div className="flex flex-1"> {/* Changed to flex-1 to allow footer to stick to bottom */}
        {/* Desktop Sidebar */}
        <aside className={`hidden lg:block fixed left-0 top-0 h-full bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 z-30 transition-transform duration-300 ease-in-out ${
          sidebarOpen ? 'translate-x-0 w-64' : '-translate-x-full w-0'
        }`}>
          <div className="pt-20 h-full overflow-y-auto">
            <nav className="mt-6">
              {navItems.map(({ path, label, icon: Icon, iconSolid: IconSolid }) => {
                const active = isActive(path);
                const IconComponent = active ? IconSolid : Icon;
                
                return (
                  <Link
                    key={path}
                    to={path}
                    data-testid={`nav-${label.toLowerCase().replace(/\s+/g, '-')}`}
                    onClick={() => setSidebarOpen(false)} // Close sidebar on mobile after click
                    className={`flex items-center px-6 py-3 text-sm font-medium transition-colors ${
                      active
                        ? 'text-primary-600 dark:text-primary-400 bg-primary-50 dark:bg-primary-900/20 border-r-2 border-primary-600 dark:border-primary-400'
                        : 'text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-gray-700'
                    }`}
                  >
                    <IconComponent className="w-5 h-5 mr-3" />
                    {label}
                  </Link>
                );
              })}
            </nav>
          </div>
        </aside>

        {/* Mobile Sidebar */}
        <aside className={`lg:hidden fixed left-0 top-0 h-full bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 z-40 transition-transform duration-300 ease-in-out ${
          sidebarOpen ? 'translate-x-0 w-64' : '-translate-x-full w-0'
        }`}>
          <div className="pt-16 h-full overflow-y-auto">
            <nav className="mt-6">
              {navItems.map(({ path, label, icon: Icon, iconSolid: IconSolid }) => {
                const active = isActive(path);
                const IconComponent = active ? IconSolid : Icon;
                
                return (
                  <Link
                    key={path}
                    to={path}
                    data-testid={`mobile-sidebar-${label.toLowerCase().replace(/\s+/g, '-')}`}
                    onClick={() => setSidebarOpen(false)} // Close sidebar after click
                    className={`flex items-center px-6 py-3 text-sm font-medium transition-colors ${
                      active
                        ? 'text-primary-600 dark:text-primary-400 bg-primary-50 dark:bg-primary-900/20 border-r-2 border-primary-600 dark:border-primary-400'
                        : 'text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-gray-700'
                    }`}
                  >
                    <IconComponent className="w-5 h-5 mr-3" />
                    {label}
                  </Link>
                );
              })}
              
              {/* Mobile Sidebar Auth/Logout */}
              {user ? (
                <button
                  onClick={() => {
                    handleLogout();
                    setSidebarOpen(false);
                  }}
                  className="flex items-center px-6 py-3 text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-gray-700 w-full transition-colors"
                >
                  <ArrowRightOnRectangleIcon className="w-5 h-5 mr-3" />
                  Sign Out
                </button>
              ) : (
                <button
                  onClick={() => {
                    setAuthModalOpen(true);
                    setSidebarOpen(false);
                  }}
                  className="flex items-center px-6 py-3 text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-gray-700 w-full transition-colors"
                >
                  <UserIcon className="w-5 h-5 mr-3" />
                  Sign In
                </button>
              )}
            </nav>
          </div>
        </aside>

        {/* Overlay for mobile and desktop when sidebar is open */}
        {sidebarOpen && (
          <div 
            className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:z-20"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Main Content */}
        <main className={`flex-1 transition-all duration-300 ease-in-out ${
          sidebarOpen ? 'lg:ml-64' : 'lg:ml-0'
        } pb-20 lg:pb-6 overflow-y-auto`}>
          <div className="pt-0 lg:pt-20 min-h-full">
            {children}
          </div>
        </main>
      </div>

      {/* Mobile Footer */}
      <footer className="block lg:hidden bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 py-3 px-4 mb-20">
        <div className="text-center">
          <div className="flex justify-center mb-2">
            <Logo size={24} className="opacity-80" />
          </div>
          <p className="text-xs text-gray-600 dark:text-gray-400">
            &copy; {new Date().getFullYear()} Ancient History Trivia
          </p>
        </div>
      </footer>

      {/* Desktop Footer */}
      <footer className="hidden lg:block bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 py-4 px-6">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center">
            <Logo size={48} className="mr-2" />
            <p className="text-sm text-gray-600 dark:text-gray-400">
              &copy; {new Date().getFullYear()} Ancient History Trivia. All rights reserved.
            </p>
          </div>
        </div>
      </footer>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 lg:hidden z-50" data-testid="bottom-nav">
        <div className="flex justify-around items-center py-2">
          {navItems.map(({ path, label, icon: Icon, iconSolid: IconSolid }) => {
            const active = isActive(path);
            const IconComponent = active ? IconSolid : Icon;
            
            return (
              <Link
                key={path}
                to={path}
                data-testid={`mobile-nav-${label.toLowerCase().replace(/\s+/g, '-')}`}
                className={`flex flex-col items-center py-2 px-3 min-w-0 flex-1 ${
                  active 
                    ? 'text-primary-600 dark:text-primary-400' 
                    : 'text-gray-500 dark:text-gray-400'
                }`}
              >
                <IconComponent className="w-6 h-6 mb-1" />
                <span className="text-xs font-medium truncate">{label}</span>
              </Link>
            );
          })}
          
          {/* Mobile Auth/Logout Button */}
          {user ? (
            <button
              onClick={handleLogout}
              className="flex flex-col items-center py-2 px-3 min-w-0 flex-1 text-gray-500 dark:text-gray-400"
              title="Sign Out"
            >
              <ArrowRightOnRectangleIcon className="w-6 h-6 mb-1" />
              <span className="text-xs font-medium truncate">Logout</span>
            </button>
          ) : (
            <button
              onClick={() => {
                if (!user) {
                  setAuthModalOpen(true);
                }
              }}
              className="flex flex-col items-center py-2 px-3 min-w-0 flex-1 text-gray-500 dark:text-gray-400"
            >
              <UserIcon className="w-6 h-6 mb-1" />
              <span className="text-xs font-medium truncate">Sign In</span>
            </button>
          )}
        </div>
      </nav>

      {/* Auth Modal */}
      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        initialMode="login"
      />

      {/* Feedback Modal */}
      <FeedbackModal
        isOpen={feedbackModalOpen}
        onClose={() => setFeedbackModalOpen(false)}
      />

      {/* Floating Feedback Button */}
      <button
        onClick={() => setFeedbackModalOpen(true)}
        className="fixed bottom-24 lg:bottom-8 right-4 bg-primary-600 hover:bg-primary-700 text-white p-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-200 z-40"
        title="Send Feedback"
      >
        <ChatBubbleLeftRightIcon className="w-6 h-6" />
      </button>
    </div>
  );
};

export default Layout;
