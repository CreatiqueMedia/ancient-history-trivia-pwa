import React from 'react';

/**
 * Enhanced Suspense fallback with better UX
 */
export const LazyLoadingFallback: React.FC<{ 
  height?: string;
  showSpinner?: boolean;
}> = ({ 
  height = '200px',
  showSpinner = true 
}) => (
  <div 
    className="flex items-center justify-center animate-pulse" 
    style={{ minHeight: height }}
    role="status"
    aria-label="Loading content"
  >
    {showSpinner && (
      <div className="flex flex-col items-center space-y-4">
        <div className="w-8 h-8 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
        <div className="text-sm text-gray-500 dark:text-gray-400">Loading...</div>
      </div>
    )}
  </div>
);

/**
 * Route-specific loading fallback
 */
export const RouteLoadingFallback: React.FC = () => (
  <div className="min-h-screen flex items-center justify-center">
    <LazyLoadingFallback height="400px" />
  </div>
);

/**
 * Component-specific loading fallback
 */
export const ComponentLoadingFallback: React.FC<{ message?: string }> = ({ 
  message = "Loading..." 
}) => (
  <div className="flex items-center justify-center p-8">
    <div className="flex flex-col items-center space-y-2">
      <div className="w-6 h-6 border-2 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
      <div className="text-xs text-gray-500 dark:text-gray-400">{message}</div>
    </div>
  </div>
);
