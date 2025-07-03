import React, { useState, useEffect } from 'react';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { useAuth } from '../context/AuthContext';
import EmailLinkSignIn from './EmailLinkSignIn';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialMode?: 'login' | 'signup';
}

const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, initialMode = 'login' }) => {
  const [mode, setMode] = useState<'login' | 'signup' | 'forgot' | 'emaillink'>(initialMode);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  // Individual loading states for each authentication method
  const [loadingStates, setLoadingStates] = useState({
    google: false,
    apple: false,
    anonymous: false,
    email: false
  });
  
  const {
    signInWithGoogle,
    signInWithApple,
    signInWithEmail,
    signUpWithEmail,
    signInAnonymously,
    resetPassword,
    error,
    user,
    logout
  } = useAuth();

  // Auto-close modal if user is already authenticated
  useEffect(() => {
    if (user && isOpen) {
      onClose();
    }
  }, [user, isOpen, onClose]);

  if (!isOpen) return null;

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoadingStates(prev => ({ ...prev, email: true }));

    try {
      if (mode === 'login') {
        await signInWithEmail(email, password);
      } else if (mode === 'signup') {
        await signUpWithEmail(email, password, displayName);
      } else if (mode === 'forgot') {
        await resetPassword(email);
        alert('Password reset email sent! Check your inbox.');
        setMode('login');
      }
      onClose();
    } catch (error) {
      console.error('Auth error:', error);
    } finally {
      setLoadingStates(prev => ({ ...prev, email: false }));
    }
  };

  const handleSocialAuth = async (provider: 'google' | 'apple' | 'anonymous') => {
    try {
      setLoadingStates(prev => ({ ...prev, [provider]: true }));

      switch (provider) {
        case 'google':
          await signInWithGoogle();
          break;
        case 'apple':
          await signInWithApple();
          break;
        case 'anonymous':
          await signInAnonymously();
          break;
      }
      
      // Close modal on successful authentication
      onClose();
    } catch (error: any) {
      // Error is already handled by the individual auth functions
    } finally {
      // Always reset loading state
      setLoadingStates(prev => ({ ...prev, [provider]: false }));
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-primary-50 to-secondary-50 dark:from-gray-800 dark:to-gray-750">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-primary-100 dark:bg-primary-800 rounded-full flex items-center justify-center">
              <svg className="w-4 h-4 text-primary-600 dark:text-primary-400" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              {mode === 'login' ? 'Welcome Back' : 
               mode === 'signup' ? 'Create Account' : 
               'Reset Password'}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors duration-200 p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            <XMarkIcon className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6">
          {error && (
            <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
              {error}
              {error.includes('unauthorized-domain') && (
                <div className="mt-2 text-sm">
                  <strong>Quick Fix:</strong> Try the Firebase Hosting version:{' '}
                  <a 
                    href="https://ancient-history-trivia.web.app" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-blue-600 underline hover:text-blue-800"
                  >
                    ancient-history-trivia.web.app
                  </a>
                </div>
              )}
            </div>
          )}

          {/* Social Authentication Buttons */}
          {mode !== 'forgot' && mode !== 'emaillink' && (
            <div className="space-y-3 mb-6">
              {/* Google Sign In */}
              <button
                onClick={async () => {
                  setLoadingStates(prev => ({ ...prev, google: true }));
                  try {
                    await signInWithGoogle();
                  } finally {
                    setLoadingStates(prev => ({ ...prev, google: false }));
                  }
                }}
                disabled={loadingStates.google}
                className="w-full flex items-center justify-center px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors disabled:opacity-50"
              >
                {loadingStates.google ? (
                  <div className="w-5 h-5 border-2 border-gray-300 border-t-blue-600 rounded-full animate-spin mr-3" />
                ) : (
                  <svg className="w-5 h-5 mr-3" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                  </svg>
                )}
                Continue with Google
              </button>

              {/* Facebook Login Removed - Focusing on Google, Apple, and Email */}

              {/* Apple Sign In */}
              <button
                onClick={async () => {
                  setLoadingStates(prev => ({ ...prev, apple: true }));
                  try {
                    await signInWithApple();
                  } finally {
                    setLoadingStates(prev => ({ ...prev, apple: false }));
                  }
                }}
                disabled={loadingStates.apple}
                className="w-full flex items-center justify-center px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm bg-black hover:bg-gray-900 text-white transition-colors disabled:opacity-50"
              >
                {loadingStates.apple ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-3" />
                ) : (
                  <svg className="w-5 h-5 mr-3" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12.017 0C8.396 0 8.025.044 8.025.044c0 0-.396.045-.396.045C3.571.134 0 3.728 0 8.25 0 12.963 3.855 16.818 8.568 16.818c1.788 0 3.417-.686 4.625-1.81a6.425 6.425 0 0 0 1.425-2.016c.252-.63.402-1.317.402-2.04 0-1.788-.686-3.417-1.81-4.625A6.425 6.425 0 0 0 11.194.925C10.564.673 9.877.523 9.154.523c0 0-.396-.045-.396-.045S8.381 0 8.025 0h3.992zm2.706 16.706c0 1.255-.978 2.295-2.295 2.295-1.255 0-2.295-.978-2.295-2.295 0-1.255.978-2.295 2.295-2.295 1.255 0 2.295.978 2.295 2.295z"/>
                  </svg>
                )}
                Continue with Apple
              </button>

              {/* Anonymous Sign In */}
              <button
                onClick={async () => {
                  setLoadingStates(prev => ({ ...prev, anonymous: true }));
                  try {
                    await signInAnonymously();
                  } finally {
                    setLoadingStates(prev => ({ ...prev, anonymous: false }));
                  }
                }}
                disabled={loadingStates.anonymous}
                className="w-full flex items-center justify-center px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm bg-gray-100 dark:bg-gray-600 text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-500 transition-colors disabled:opacity-50"
              >
                {loadingStates.anonymous ? (
                  <div className="w-5 h-5 border-2 border-gray-400 border-t-gray-600 rounded-full animate-spin mr-3" />
                ) : (
                  <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                )}
                Continue as Guest
              </button>
              
              <div className="relative mt-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300 dark:border-gray-600" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-400">
                    Or continue with email
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Email Form or Email Link Component */}
          {mode === 'emaillink' ? (
            <EmailLinkSignIn onBack={() => setMode('login')} />
          ) : (
            <form onSubmit={handleEmailAuth} className="space-y-4">
            {mode === 'signup' && (
              <div>
                <label htmlFor="displayName" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Full Name
                </label>
                <input
                  type="text"
                  id="displayName"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white"
                  required
                />
              </div>
            )}

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Email Address
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white"
                required
              />
            </div>

            {mode !== 'forgot' && (
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Password
                </label>
                <input
                  type="password"
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white"
                  required
                  minLength={6}
                />
              </div>
            )}

            <button
              type="submit"
              disabled={loadingStates.email}
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loadingStates.email ? 'Loading...' : 
               mode === 'login' ? 'Sign In' :
               mode === 'signup' ? 'Create Account' :
               'Send Reset Email'}              </button>
            </form>
          )}

          {/* Mode Switcher */}
          <div className="mt-6 text-center">
            {mode === 'login' && (
              <>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Don't have an account?{' '}
                  <button
                    onClick={() => setMode('signup')}
                    className="text-primary-600 hover:text-primary-500 font-medium"
                  >
                    Sign up
                  </button>
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                  <button
                    onClick={() => setMode('forgot')}
                    className="text-primary-600 hover:text-primary-500 font-medium"
                  >
                    Forgot your password?
                  </button>
                </p>
              </>
            )}
            
            {mode === 'signup' && (
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Already have an account?{' '}
                <button
                  onClick={() => setMode('login')}
                  className="text-primary-600 hover:text-primary-500 font-medium"
                >
                  Sign in
                </button>
              </p>
            )}

            {mode === 'forgot' && (
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Remember your password?{' '}
                <button
                  onClick={() => setMode('login')}
                  className="text-primary-600 hover:text-primary-500 font-medium"
                >
                  Sign in
                </button>
              </p>
            )}
          </div>

          {/* Anonymous Option */}
          {mode !== 'forgot' && (
            <div className="mt-4 text-center">
              <button
                onClick={() => handleSocialAuth('anonymous')}
                disabled={loadingStates.anonymous}
                className="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 disabled:opacity-50"
              >
                {loadingStates.anonymous ? 'Loading...' : 'Continue as Guest'}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AuthModal;
