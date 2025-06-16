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
  ArrowRightOnRectangleIcon
} from '@heroicons/react/24/outline';
import { 
  HomeIcon as HomeIconSolid,
  ChartBarIcon as ChartBarIconSolid,
  CogIcon as CogIconSolid,
  TrophyIcon as TrophyIconSolid,
  ShoppingBagIcon as ShoppingBagIconSolid
} from '@heroicons/react/24/solid';
import { useAuth } from '../context/MockAuthContext';
import AuthModal from './AuthModal';
import { Logo } from './Logo';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const { user, userProfile, logout } = useAuth();
  
  const navItems = [
    { 
      path: '/', 
      label: 'Home', 
      icon: HomeIcon, 
      iconSolid: HomeIconSolid 
    },
    { 
      path: '/stats', 
      label: 'Stats', 
      icon: ChartBarIcon, 
      iconSolid: ChartBarIconSolid 
    },
    { 
      path: '/store', 
      label: 'Store', 
      icon: ShoppingBagIcon, 
      iconSolid: ShoppingBagIconSolid 
    },
    { 
      path: '/achievements', 
      label: 'Awards', 
      icon: TrophyIcon, 
      iconSolid: TrophyIconSolid
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
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Desktop Header with Toggle */}
      <header className="hidden md:block bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 sticky top-0 z-40">
        <div className="flex items-center justify-between px-4 py-3">
          <div className="flex items-center">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            >
              {sidebarOpen ? (
                <XMarkIcon className="w-6 h-6 text-gray-600 dark:text-gray-400" />
              ) : (
                <Bars3Icon className="w-6 h-6 text-gray-600 dark:text-gray-400" />
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
                  <Link
                    to="/subscription"
                    className="bg-primary-100 dark:bg-primary-900 text-primary-700 dark:text-primary-300 px-3 py-1 rounded-full text-sm font-medium hover:bg-primary-200 dark:hover:bg-primary-800 transition-colors"
                  >
                    {userProfile.subscription === 'scholar' ? '📚 Scholar' : 
                     userProfile.subscription === 'historian' ? '🏛️ Historian' : 
                     userProfile.subscription === 'academy' ? '👑 Academy' : 'Pro'}
                  </Link>
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
                    {userProfile?.displayName || 'User'}
                  </span>
                </Link>

                {/* Logout Button */}
                <button
                  onClick={handleLogout}
                  className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
                  title="Sign Out"
                >
                  <ArrowRightOnRectangleIcon className="w-5 h-5" />
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-3">
                <button
                  onClick={() => setAuthModalOpen(true)}
                  className="text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors"
                >
                  Sign In
                </button>
                <button
                  onClick={() => setAuthModalOpen(true)}
                  className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                >
                  Sign Up
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Desktop Sidebar */}
        <aside className={`hidden md:block fixed left-0 top-0 h-full bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 z-30 transition-transform duration-300 ease-in-out ${
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

        {/* Overlay for mobile */}
        {sidebarOpen && (
          <div 
            className="md:hidden fixed inset-0 bg-black bg-opacity-50 z-20"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Main Content */}
        <main className={`flex-1 transition-all duration-300 ease-in-out ${
          sidebarOpen ? 'md:ml-64' : 'md:ml-0'
        } pb-20 md:pb-6`}>
          <div className="md:pt-20">
            {children}
          </div>
        </main>
      </div>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 md:hidden z-50">
        <div className="flex justify-around items-center py-2">
          {navItems.map(({ path, label, icon: Icon, iconSolid: IconSolid }) => {
            const active = isActive(path);
            const IconComponent = active ? IconSolid : Icon;
            
            return (
              <Link
                key={path}
                to={path}
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
        </div>
      </nav>

      {/* Auth Modal */}
      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        initialMode="login"
      />
    </div>
  );
};

export default Layout;
