import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';

interface EmailLinkSignInProps {
  onSuccess?: () => void;
  onClose?: () => void;
  onBack?: () => void;
}

const EmailLinkSignIn: React.FC<EmailLinkSignInProps> = ({ onSuccess, onClose, onBack }) => {
  const [email, setEmail] = useState('');
  const [isLinkSent, setIsLinkSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const { sendSignInLink, error } = useAuth();

  const handleSendLink = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setLoading(true);
    try {
      await sendSignInLink(email);
      setIsLinkSent(true);
    } catch (error) {
      console.error('Error sending sign-in link:', error);
    } finally {
      setLoading(false);
    }
  };

  if (isLinkSent) {
    return (
      <div className="text-center p-6">
        <div className="mb-4">
          <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
            <svg className="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          </div>
        </div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Check Your Email</h3>
        <p className="text-gray-600 mb-4">
          We've sent a sign-in link to <strong>{email}</strong>
        </p>
        <p className="text-sm text-gray-500 mb-6">
          Click the link in your email to sign in. The link will expire in 1 hour.
        </p>
        <button
          onClick={onClose}
          className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
        >
          Got it
        </button>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex items-center mb-4">
        {onBack && (
          <button
            onClick={onBack}
            className="mr-3 p-1 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
        )}
        <h3 className="text-lg font-semibold text-gray-900">Sign in with Email Link</h3>
      </div>
      <p className="text-gray-600 mb-6">
        Enter your email and we'll send you a secure link to sign in without a password.
      </p>
      
      <form onSubmit={handleSendLink} className="space-y-4">
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
            Email address
          </label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            placeholder="your@email.com"
            required
          />
        </div>

        {error && (
          <div className="text-red-600 text-sm bg-red-50 p-3 rounded-lg">
            {error}
          </div>
        )}

        <div className="flex gap-3">
          <button
            type="submit"
            disabled={loading || !email}
            className="flex-1 bg-primary-600 text-white py-2 px-4 rounded-lg hover:bg-primary-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
          >
            {loading ? 'Sending...' : 'Send Sign-in Link'}
          </button>
          {onClose && (
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
            >
              Cancel
            </button>
          )}
        </div>
      </form>
    </div>
  );
};

export default EmailLinkSignIn;
