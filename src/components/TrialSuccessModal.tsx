import React from 'react';
import { 
  CheckCircleIcon, 
  XMarkIcon,
  SparklesIcon,
  ClockIcon,
  GiftIcon
} from '@heroicons/react/24/solid';

interface TrialSuccessModalProps {
  isOpen: boolean;
  onClose: () => void;
  daysRemaining: number;
  onStartExploring: () => void;
}

const TrialSuccessModal: React.FC<TrialSuccessModalProps> = ({
  isOpen,
  onClose,
  daysRemaining,
  onStartExploring
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black bg-opacity-50 transition-opacity" onClick={onClose} />
      
      {/* Modal */}
      <div className="flex min-h-full items-center justify-center p-4">
        <div className="relative bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-md w-full mx-4 overflow-hidden">
          {/* Header with gradient background */}
          <div className="bg-gradient-to-r from-green-500 to-emerald-600 px-6 py-8 text-center relative">
            {/* Close button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 text-white hover:text-gray-200 transition-colors"
            >
              <XMarkIcon className="w-6 h-6" />
            </button>
            
            {/* Success icon with animation */}
            <div className="flex justify-center mb-4">
              <div className="relative">
                <div className="w-20 h-20 bg-white bg-opacity-20 rounded-full flex items-center justify-center animate-pulse">
                  <CheckCircleIcon className="w-12 h-12 text-white" />
                </div>
                {/* Sparkle effects */}
                <SparklesIcon className="w-6 h-6 text-yellow-300 absolute -top-2 -right-2 animate-bounce" />
                <SparklesIcon className="w-4 h-4 text-yellow-200 absolute -bottom-1 -left-1 animate-bounce delay-300" />
              </div>
            </div>
            
            <h2 className="text-2xl font-bold text-white mb-2">
              🎉 Free Trial Started!
            </h2>
            <p className="text-green-100 text-lg">
              Welcome to Premium Access
            </p>
          </div>

          {/* Content */}
          <div className="px-6 py-6">
            {/* Trial info */}
            <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-xl p-4 mb-6 border border-blue-200 dark:border-blue-800">
              <div className="flex items-center justify-center mb-3">
                <div className="bg-blue-100 dark:bg-blue-900/30 rounded-full p-2 mr-3">
                  <ClockIcon className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                    {daysRemaining}-Day
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    of unlimited access
                  </div>
                </div>
              </div>
            </div>

            {/* Benefits list */}
            <div className="space-y-3 mb-6">
              <h3 className="font-semibold text-gray-900 dark:text-white text-center mb-4">
                What's included in your trial:
              </h3>
              
              <div className="space-y-2">
                <div className="flex items-center text-sm text-gray-700 dark:text-gray-300">
                  <CheckCircleIcon className="w-5 h-5 text-green-500 mr-3 flex-shrink-0" />
                  <span>All Premium Question Bundles</span>
                </div>
                <div className="flex items-center text-sm text-gray-700 dark:text-gray-300">
                  <CheckCircleIcon className="w-5 h-5 text-green-500 mr-3 flex-shrink-0" />
                  <span>Unlimited Quiz Attempts</span>
                </div>
                <div className="flex items-center text-sm text-gray-700 dark:text-gray-300">
                  <CheckCircleIcon className="w-5 h-5 text-green-500 mr-3 flex-shrink-0" />
                  <span>Advanced Features & Analytics</span>
                </div>
                <div className="flex items-center text-sm text-gray-700 dark:text-gray-300">
                  <CheckCircleIcon className="w-5 h-5 text-green-500 mr-3 flex-shrink-0" />
                  <span>Ad-Free Experience</span>
                </div>
              </div>
            </div>

            {/* Action buttons */}
            <div className="space-y-3">
              <button
                onClick={onStartExploring}
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-200 transform hover:scale-105 shadow-lg flex items-center justify-center space-x-2"
              >
                <GiftIcon className="w-5 h-5" />
                <span>Start Exploring Premium Content</span>
              </button>
              
              <button
                onClick={onClose}
                className="w-full bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 font-medium py-2 px-6 rounded-xl transition-colors"
              >
                I'll explore later
              </button>
            </div>

            {/* Trial reminder */}
            <div className="mt-4 text-center">
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Your trial will automatically end in {daysRemaining} days. No payment required.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TrialSuccessModal;
