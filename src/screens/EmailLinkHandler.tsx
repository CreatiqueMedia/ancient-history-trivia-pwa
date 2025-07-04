import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import LoadingSpinner from '../components/LoadingSpinner';

const EmailLinkHandler: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { signInWithLink } = useAuth();
  const [status, setStatus] = useState<'loading' | 'success' | 'error' | 'needEmail'>('loading');
  const [errorMessage, setErrorMessage] = useState('');
  const [emailInput, setEmailInput] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const handleEmailLink = async () => {
      const emailLink = window.location.href;
      let email = searchParams.get('email');
      
      // If email is not in URL params, check localStorage
      if (!email) {
        email = localStorage.getItem('emailForSignIn');
      }

      if (!email) {
        // Show email input form instead of ugly prompt
        setStatus('needEmail');
        return;
      }

      await processEmailLink(email);
    };

    const processEmailLink = async (email: string) => {
      const emailLink = window.location.href;
      
      try {
        await signInWithLink(email, emailLink);
        setStatus('success');
        
        // Check for pending purchase and redirect appropriately
        setTimeout(() => {
          const redirectParam = searchParams.get('redirect');
          const pendingPurchase = localStorage.getItem('pendingPurchase');
          
          if (redirectParam) {
            navigate(redirectParam, { replace: true });
          } else if (pendingPurchase) {
            // If there's a pending purchase, redirect to store
            navigate('/store', { replace: true });
          } else {
            navigate('/', { replace: true });
          }
        }, 2000);
      } catch (error: any) {
        console.error('Email link sign-in error:', error);
        setStatus('error');
        setErrorMessage(error.message || 'Failed to sign in with email link');
      }
    };

    handleEmailLink();
  }, [searchParams, signInWithLink, navigate]);

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <LoadingSpinner />
          <p className="mt-4 text-gray-600">Signing you in...</p>
        </div>
      </div>
    );
  }

  if (status === 'success') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center p-8 bg-white rounded-lg shadow-lg max-w-md">
          <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
            <svg className="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Welcome back!</h2>
          <p className="text-gray-600">You've been successfully signed in. Redirecting you to the app...</p>
        </div>
      </div>
    );
  }

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!emailInput.trim()) return;
    
    setIsSubmitting(true);
    setStatus('loading');
    
    const emailLink = window.location.href;
    try {
      await signInWithLink(emailInput.trim(), emailLink);
      setStatus('success');
      
      // Check for pending purchase and redirect appropriately
      setTimeout(() => {
        const redirectParam = searchParams.get('redirect');
        const pendingPurchase = localStorage.getItem('pendingPurchase');
        
        if (redirectParam) {
          navigate(redirectParam, { replace: true });
        } else if (pendingPurchase) {
          // If there's a pending purchase, redirect to store
          navigate('/store', { replace: true });
        } else {
          navigate('/', { replace: true });
        }
      }, 2000);
    } catch (error: any) {
      console.error('Email link sign-in error:', error);
      setStatus('error');
      setErrorMessage(error.message || 'Failed to sign in with email link');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (status === 'needEmail') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center p-8 bg-white rounded-lg shadow-lg max-w-md w-full mx-4">
          <div className="mx-auto w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
            <svg className="w-8 h-8 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
            </svg>
          </div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Confirm Your Email</h2>
          <p className="text-gray-600 mb-6">Please enter your email address to complete the sign-in process.</p>
          
          <form onSubmit={handleEmailSubmit} className="space-y-4">
            <div>
              <input
                type="email"
                value={emailInput}
                onChange={(e) => setEmailInput(e.target.value)}
                placeholder="Enter your email address"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
                disabled={isSubmitting}
                autoFocus
              />
            </div>
            
            <div className="flex space-x-3">
              <button
                type="button"
                onClick={() => navigate('/')}
                className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                disabled={isSubmitting}
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting || !emailInput.trim()}
                className="flex-1 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
              >
                {isSubmitting ? 'Signing In...' : 'Continue'}
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center p-8 bg-white rounded-lg shadow-lg max-w-md">
        <div className="mx-auto w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
          <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </div>
        <h2 className="text-xl font-semibold text-gray-900 mb-2">Sign-in Failed</h2>
        <p className="text-gray-600 mb-4">{errorMessage}</p>
        <button
          onClick={() => navigate('/')}
          className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
        >
          Back to Home
        </button>
      </div>
    </div>
  );
};

export default EmailLinkHandler;
