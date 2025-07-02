import React from 'react';
import LoadingSpinner from './LoadingSpinner';

// Page Loading Component
export const PageLoading: React.FC<{ message?: string }> = ({ message = "Loading..." }) => (
  <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
    <div className="text-center">
      <LoadingSpinner size="lg" />
      <p className="mt-4 text-gray-600 dark:text-gray-400">{message}</p>
    </div>
  </div>
);

// Card Loading Component
export const CardLoading: React.FC<{ className?: string }> = ({ className = "" }) => (
  <div className={`bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-6 ${className}`}>
    <div className="animate-pulse">
      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-4"></div>
      <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/2 mb-2"></div>
      <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-2/3 mb-2"></div>
      <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/3"></div>
    </div>
  </div>
);

// Button Loading Component
export const ButtonLoading: React.FC<{ 
  children: React.ReactNode;
  isLoading: boolean;
  className?: string;
  disabled?: boolean;
}> = ({ children, isLoading, className = "", disabled = false }) => (
  <button 
    className={`flex items-center justify-center ${className}`}
    disabled={isLoading || disabled}
  >
    {isLoading ? (
      <>
        <LoadingSpinner size="sm" color="text-current" />
        <span className="ml-2">Loading...</span>
      </>
    ) : (
      children
    )}
  </button>
);

// Quiz Loading Component
export const QuizLoading: React.FC = () => (
  <div className="max-w-4xl mx-auto px-4 py-8">
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8">
      <div className="animate-pulse">
        {/* Question header */}
        <div className="flex justify-between items-center mb-6">
          <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-24"></div>
          <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-16"></div>
        </div>
        
        {/* Question text */}
        <div className="mb-8">
          <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-full mb-2"></div>
          <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
        </div>
        
        {/* Answer options */}
        <div className="space-y-4 mb-8">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-12 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
          ))}
        </div>
        
        {/* Action buttons */}
        <div className="flex justify-between">
          <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded w-20"></div>
          <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded w-24"></div>
        </div>
      </div>
    </div>
  </div>
);

// List Loading Component
export const ListLoading: React.FC<{ items?: number }> = ({ items = 5 }) => (
  <div className="space-y-4">
    {Array.from({ length: items }).map((_, i) => (
      <div key={i} className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow">
        <div className="animate-pulse">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-gray-200 dark:bg-gray-700 rounded-full"></div>
            <div className="flex-1">
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-2"></div>
              <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
            </div>
          </div>
        </div>
      </div>
    ))}
  </div>
);

// Stats Loading Component
export const StatsLoading: React.FC = () => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
    {Array.from({ length: 4 }).map((_, i) => (
      <div key={i} className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
        <div className="animate-pulse">
          <div className="flex items-center justify-between mb-4">
            <div className="w-8 h-8 bg-gray-200 dark:bg-gray-700 rounded"></div>
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-16"></div>
          </div>
          <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-20 mb-2"></div>
          <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-24"></div>
        </div>
      </div>
    ))}
  </div>
);

// Content Loading Component with Skeleton
export const ContentLoading: React.FC<{ 
  lines?: number;
  showAvatar?: boolean;
  showImage?: boolean;
}> = ({ lines = 3, showAvatar = false, showImage = false }) => (
  <div className="animate-pulse">
    {showAvatar && (
      <div className="flex items-center space-x-4 mb-6">
        <div className="w-12 h-12 bg-gray-200 dark:bg-gray-700 rounded-full"></div>
        <div className="flex-1">
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/4 mb-2"></div>
          <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/6"></div>
        </div>
      </div>
    )}
    
    {showImage && (
      <div className="w-full h-48 bg-gray-200 dark:bg-gray-700 rounded-lg mb-6"></div>
    )}
    
    <div className="space-y-3">
      {Array.from({ length: lines }).map((_, i) => (
        <div 
          key={i} 
          className={`h-4 bg-gray-200 dark:bg-gray-700 rounded ${
            i === lines - 1 ? 'w-2/3' : 'w-full'
          }`}
        ></div>
      ))}
    </div>
  </div>
);

// Inline Loading Component
export const InlineLoading: React.FC<{ message?: string }> = ({ message = "Loading..." }) => (
  <div className="flex items-center justify-center py-4">
    <LoadingSpinner size="sm" />
    <span className="ml-2 text-gray-600 dark:text-gray-400">{message}</span>
  </div>
);

// Modal Loading Component
export const ModalLoading: React.FC<{ message?: string }> = ({ message = "Loading..." }) => (
  <div className="flex flex-col items-center justify-center py-12">
    <LoadingSpinner size="lg" />
    <p className="mt-4 text-gray-600 dark:text-gray-400 text-center">{message}</p>
  </div>
);

// Network Loading Component (for slow connections)
export const NetworkLoading: React.FC<{ 
  message?: string;
  showTips?: boolean;
}> = ({ 
  message = "Loading content...", 
  showTips = false 
}) => (
  <div className="text-center py-12">
    <LoadingSpinner size="lg" />
    <p className="mt-4 text-gray-600 dark:text-gray-400">{message}</p>
    {showTips && (
      <div className="mt-6 max-w-md mx-auto">
        <p className="text-sm text-gray-500 dark:text-gray-500 mb-2">
          Taking longer than usual?
        </p>
        <ul className="text-xs text-gray-400 dark:text-gray-600 space-y-1">
          <li>• Check your internet connection</li>
          <li>• Try refreshing the page</li>
          <li>• Clear your browser cache</li>
        </ul>
      </div>
    )}
  </div>
);

// Progress Loading Component
export const ProgressLoading: React.FC<{ 
  progress: number;
  message?: string;
}> = ({ progress, message = "Loading..." }) => (
  <div className="text-center py-8">
    <div className="max-w-xs mx-auto mb-4">
      <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400 mb-2">
        <span>{message}</span>
        <span>{Math.round(progress)}%</span>
      </div>
      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
        <div 
          className="bg-primary-600 h-2 rounded-full transition-all duration-300"
          style={{ width: `${progress}%` }}
        ></div>
      </div>
    </div>
  </div>
);

export default {
  PageLoading,
  CardLoading,
  ButtonLoading,
  QuizLoading,
  ListLoading,
  StatsLoading,
  ContentLoading,
  InlineLoading,
  ModalLoading,
  NetworkLoading,
  ProgressLoading
};
