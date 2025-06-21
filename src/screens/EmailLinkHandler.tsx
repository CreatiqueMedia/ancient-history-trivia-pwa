import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import LoadingSpinner from '../components/LoadingSpinner';

const EmailLinkHandler: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { signInWithLink } = useAuth();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    const handleEmailLink = async () => {
      const emailLink = window.location.href;
      let email = searchParams.get('email');
      
      // If email is not in URL params, check localStorage
      if (!email) {
        email = localStorage.getItem('emailForSignIn');
      }

      if (!email) {
        // Prompt user for email if not found
        email = window.prompt('Please provide your email for confirmation');
      }

      if (email) {
        try {
          await signInWithLink(email, emailLink);
          setStatus('success');
          setTimeout(() => {
            navigate('/', { replace: true });
          }, 2000);
        } catch (error: any) {
          console.error('Email link sign-in error:', error);
          setStatus('error');
          setErrorMessage(error.message || 'Failed to sign in with email link');
        }
      } else {
        setStatus('error');
        setErrorMessage('Email is required to complete sign-in');
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
