import React, { Component, ErrorInfo, ReactNode } from 'react';
import { ExclamationTriangleIcon, ArrowPathIcon } from '@heroicons/react/24/outline';
import { analyticsService } from '../services/AnalyticsService';
import { security } from '../config/environment';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
    errorInfo: null
  };

  public static getDerivedStateFromError(error: Error): State {
    // Update state so the next render will show the fallback UI
    return {
      hasError: true,
      error,
      errorInfo: null
    };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
    
    // Track error in analytics
    analyticsService.trackError(error.message, 'error_boundary');
    
    // Call custom error handler if provided
    this.props.onError?.(error, errorInfo);
    
    // Enhanced error logging for production
    this.logProductionError(error, errorInfo);
    
    this.setState({
      error,
      errorInfo
    });
  }

  private logProductionError(error: Error, errorInfo: ErrorInfo) {
    if (import.meta.env.MODE === 'production') {
      const sanitizedError = {
        message: security.sanitizeInput(error.message),
        stack: error.stack?.split('\n').slice(0, 10).join('\n'), // Limit stack trace
        componentStack: errorInfo.componentStack?.split('\n').slice(0, 5).join('\n'),
        timestamp: new Date().toISOString(),
        url: window.location.href,
        userAgent: navigator.userAgent.substring(0, 200), // Limit user agent length
        userId: this.getCurrentUserId(),
        errorId: security.generateSecureId(),
      };
      
      // Future: Send to error monitoring service
      console.error('[ErrorBoundary] Production error logged:', sanitizedError);
      
      // TODO: Implement Sentry or similar service
      // Sentry.captureException(error, { 
      //   extra: sanitizedError,
      //   tags: { component: 'ErrorBoundary' }
      // });
    }
  }

  private getCurrentUserId(): string | null {
    try {
      const user = JSON.parse(localStorage.getItem('user') || 'null');
      return user?.uid || null;
    } catch {
      return null;
    }
  }

  private handleReload = () => {
    window.location.reload();
  };

  private handleReset = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null
    });
  };

  public render() {
    if (this.state.hasError) {
      // Custom fallback UI
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center p-4">
          <div className="max-w-md w-full bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 text-center">
            <div className="w-16 h-16 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center mx-auto mb-6">
              <ExclamationTriangleIcon className="w-8 h-8 text-red-600 dark:text-red-400" />
            </div>
            
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              Oops! Something went wrong
            </h1>
            
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              We're sorry, but something unexpected happened. This error has been logged and we'll look into it.
            </p>

            {import.meta.env.DEV && this.state.error && (
              <div className="bg-gray-100 dark:bg-gray-700 rounded-lg p-4 mb-6 text-left">
                <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-2">
                  Error Details (Development Mode):
                </h3>
                <pre className="text-xs text-red-600 dark:text-red-400 overflow-auto">
                  {this.state.error.message}
                </pre>
                {this.state.errorInfo && (
                  <pre className="text-xs text-gray-600 dark:text-gray-400 mt-2 overflow-auto">
                    {this.state.errorInfo.componentStack}
                  </pre>
                )}
              </div>
            )}

            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={this.handleReset}
                className="flex-1 bg-primary-600 hover:bg-primary-700 text-white px-4 py-3 rounded-lg transition-colors flex items-center justify-center"
              >
                <ArrowPathIcon className="w-4 h-4 mr-2" />
                Try Again
              </button>
              
              <button
                onClick={this.handleReload}
                className="flex-1 bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-900 dark:text-white px-4 py-3 rounded-lg transition-colors"
              >
                Reload Page
              </button>
            </div>

            <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
              <p className="text-sm text-gray-500 dark:text-gray-400">
                If this problem persists, please contact support at{' '}
                <a 
                  href="mailto:info@theawakenedhybrid.com" 
                  className="text-primary-600 dark:text-primary-400 hover:underline"
                >
                  info@theawakenedhybrid.com
                </a>
              </p>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
