import React, { useState, useEffect } from 'react';
import { XMarkIcon, GiftIcon, StarIcon, PlayIcon } from '@heroicons/react/24/solid';
import { useAuth } from '../hooks/useAuth';

interface WelcomeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const WelcomeModal: React.FC<WelcomeModalProps> = ({ isOpen, onClose }) => {
  const { userProfile } = useAuth();

  if (!isOpen || !userProfile) return null;

  const freePlanFeatures = [
    'Access to sample quizzes (10 questions each)',
    'Basic daily challenges', 
    'Limited statistics',
    'Community features'
  ];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl max-w-md w-full mx-4 animate-scale-in">
        {/* Header */}
        <div className="relative bg-gradient-to-r from-primary-600 to-primary-700 rounded-t-xl p-6 text-center">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-white/80 hover:text-white transition-colors"
          >
            <XMarkIcon className="h-6 w-6" />
          </button>
          
          <div className="flex justify-center mb-4">
            <div className="bg-white/20 rounded-full p-3">
              <GiftIcon className="h-12 w-12 text-white" />
            </div>
          </div>
          
          <h2 className="text-2xl font-bold text-white mb-2">
            Welcome to Ancient History Trivia!
          </h2>
          <p className="text-primary-100">
            You've been automatically enrolled in our <strong>FREE PLAN</strong>
          </p>
        </div>

        {/* Content */}
        <div className="p-6">
          <div className="mb-6">
            <div className="flex items-center mb-3">
              <StarIcon className="h-5 w-5 text-yellow-500 mr-2" />
              <h3 className="font-semibold text-gray-800 dark:text-gray-200">
                Your FREE Plan Includes:
              </h3>
            </div>
            
            <ul className="space-y-2">
              {freePlanFeatures.map((feature, index) => (
                <li key={index} className="flex items-start">
                  <div className="h-1.5 w-1.5 bg-primary-600 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                  <span className="text-gray-600 dark:text-gray-300 text-sm">
                    {feature}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          <div className="bg-primary-50 dark:bg-primary-900/20 rounded-lg p-4 mb-6">
            <div className="flex items-center mb-2">
              <PlayIcon className="h-4 w-4 text-primary-600 mr-2" />
              <span className="font-medium text-primary-800 dark:text-primary-200 text-sm">
                Ready to Start Learning?
              </span>
            </div>
            <p className="text-primary-700 dark:text-primary-300 text-sm">
              Try our sample quizzes and daily challenges. Upgrade anytime to unlock all content!
            </p>
          </div>

          <div className="flex space-x-3">
            <button
              onClick={onClose}
              className="flex-1 bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg font-medium transition-colors duration-200"
            >
              Start Exploring
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WelcomeModal;
