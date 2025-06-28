import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  ClockIcon, 
  SparklesIcon, 
  XMarkIcon,
  ExclamationTriangleIcon,
  GiftIcon
} from '@heroicons/react/24/solid';
import { TrialStatus } from '../types/enhancements';
import { TrialService } from '../services/TrialService';

interface TrialBannerProps {
  className?: string;
  onDismiss?: () => void;
  showDismiss?: boolean;
}

const TrialBanner: React.FC<TrialBannerProps> = ({ 
  className = '', 
  onDismiss,
  showDismiss = true 
}) => {
  const [trialStatus, setTrialStatus] = useState<TrialStatus | null>(null);
  const [isVisible, setIsVisible] = useState(true);
  const [conversionMessage, setConversionMessage] = useState<{
    title: string;
    message: string;
    urgency: 'low' | 'medium' | 'high';
    cta: string;
  } | null>(null);

  useEffect(() => {
    loadTrialStatus();
    
    // Update trial status every minute
    const interval = setInterval(loadTrialStatus, 60000);
    return () => clearInterval(interval);
  }, []);

  const loadTrialStatus = () => {
    const status = TrialService.getTrialStatus();
    const message = TrialService.getConversionMessage();
    
    setTrialStatus(status);
    setConversionMessage(message);
  };

  const handleDismiss = () => {
    setIsVisible(false);
    if (onDismiss) {
      onDismiss();
    }
  };

  const handleConversionClick = () => {
    TrialService.markConversionOffered();
    // Analytics tracking would happen here
  };

  const getUrgencyStyles = (urgency: 'low' | 'medium' | 'high') => {
    switch (urgency) {
      case 'high':
        return {
          container: 'bg-gradient-to-r from-red-500 to-red-600 border-red-600',
          text: 'text-white',
          button: 'bg-white text-red-600 hover:bg-red-50',
          icon: 'text-red-200'
        };
      case 'medium':
        return {
          container: 'bg-gradient-to-r from-orange-500 to-orange-600 border-orange-600',
          text: 'text-white',
          button: 'bg-white text-orange-600 hover:bg-orange-50',
          icon: 'text-orange-200'
        };
      default:
        return {
          container: 'bg-gradient-to-r from-blue-500 to-blue-600 border-blue-600',
          text: 'text-white',
          button: 'bg-white text-blue-600 hover:bg-blue-50',
          icon: 'text-blue-200'
        };
    }
  };

  const formatTimeRemaining = (endDate: Date): string => {
    const now = new Date();
    const timeDiff = endDate.getTime() - now.getTime();
    
    if (timeDiff <= 0) return 'Expired';

    const days = Math.floor(timeDiff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((timeDiff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60));

    if (days > 0) {
      return `${days}d ${hours}h`;
    } else if (hours > 0) {
      return `${hours}h ${minutes}m`;
    } else {
      return `${minutes}m`;
    }
  };

  const getProgressPercentage = (): number => {
    if (!trialStatus) return 0;
    const totalDays = 7; // Trial duration
    const daysUsed = totalDays - trialStatus.daysRemaining;
    return Math.min(100, (daysUsed / totalDays) * 100);
  };

  // Don't show banner if not visible or no trial/conversion message
  if (!isVisible || !conversionMessage) return null;

  // Don't show if user is not in trial and trial hasn't started
  if (!trialStatus && conversionMessage.urgency === 'low' && !conversionMessage.title.includes('Start')) {
    return null;
  }

  const styles = getUrgencyStyles(conversionMessage.urgency);

  return (
    <div className={`relative overflow-hidden rounded-lg border shadow-lg ${styles.container} ${className}`}>
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent transform -skew-x-12"></div>
      </div>

      <div className="relative p-4 md:p-6">
        {/* Mobile Layout - Centered */}
        <div className="block lg:hidden text-center">
          {/* Icon */}
          <div className="flex justify-center mb-3">
            {conversionMessage.urgency === 'high' ? (
              <ExclamationTriangleIcon className={`w-8 h-8 ${styles.icon}`} />
            ) : trialStatus ? (
              <ClockIcon className={`w-8 h-8 ${styles.icon}`} />
            ) : (
              <GiftIcon className={`w-8 h-8 ${styles.icon}`} />
            )}
          </div>

          {/* Content */}
          <div className="mb-4">
            <h3 className={`text-lg font-bold ${styles.text} mb-2`}>
              {conversionMessage.title}
            </h3>
            
            <p className={`text-sm ${styles.text} opacity-90 mb-3`}>
              {conversionMessage.message}
            </p>

            {/* Trial Timer */}
            {trialStatus && trialStatus.isActive && (
              <div className="flex justify-center mb-3">
                <div className="flex items-center bg-black bg-opacity-20 rounded-full px-3 py-1">
                  <ClockIcon className="w-4 h-4 text-white mr-1" />
                  <span className="text-white text-sm font-mono">
                    {formatTimeRemaining(trialStatus.endDate)}
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Desktop Layout - Horizontal */}
        <div className="hidden lg:flex items-center justify-between">
          <div className="flex items-center flex-1">
            {/* Icon */}
            <div className="flex-shrink-0 mr-4">
              {conversionMessage.urgency === 'high' ? (
                <ExclamationTriangleIcon className={`w-8 h-8 ${styles.icon}`} />
              ) : trialStatus ? (
                <ClockIcon className={`w-8 h-8 ${styles.icon}`} />
              ) : (
                <GiftIcon className={`w-8 h-8 ${styles.icon}`} />
              )}
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between mb-2">
                <h3 className={`text-lg font-bold ${styles.text}`}>
                  {conversionMessage.title}
                </h3>
                
                {/* Trial Timer */}
                {trialStatus && trialStatus.isActive && (
                  <div className="flex items-center bg-black bg-opacity-20 rounded-full px-3 py-1">
                    <ClockIcon className="w-4 h-4 text-white mr-1" />
                    <span className="text-white text-sm font-mono">
                      {formatTimeRemaining(trialStatus.endDate)}
                    </span>
                  </div>
                )}
              </div>

              <p className={`text-sm md:text-base ${styles.text} opacity-90 mb-3`}>
                {conversionMessage.message}
              </p>

              {/* Trial Progress Bar */}
              {trialStatus && trialStatus.isActive && (
                <div className="mb-3">
                  <div className="flex justify-between text-xs text-white opacity-75 mb-1">
                    <span>Trial Progress</span>
                    <span>{trialStatus.accessedBundles.length} bundles explored</span>
                  </div>
                  <div className="w-full bg-black bg-opacity-20 rounded-full h-2">
                    <div 
                      className="bg-white h-2 rounded-full transition-all duration-300"
                      style={{ width: `${getProgressPercentage()}%` }}
                    ></div>
                  </div>
                </div>
              )}

              {/* Benefits List for New Users */}
              {!trialStatus && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-2 mb-3">
                  <div className="flex items-center text-white text-sm">
                    <SparklesIcon className="w-4 h-4 mr-1" />
                    <span>All Premium Bundles</span>
                  </div>
                  <div className="flex items-center text-white text-sm">
                    <SparklesIcon className="w-4 h-4 mr-1" />
                    <span>Unlimited Questions</span>
                  </div>
                  <div className="flex items-center text-white text-sm">
                    <SparklesIcon className="w-4 h-4 mr-1" />
                    <span>Advanced Features</span>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center space-x-3 ml-4">
            <Link
              to="/subscription"
              onClick={handleConversionClick}
              className={`px-4 py-2 rounded-lg font-semibold text-sm transition-colors ${styles.button}`}
            >
              {conversionMessage.cta}
            </Link>

            {/* Dismiss Button */}
            {showDismiss && conversionMessage.urgency !== 'high' && (
              <button
                onClick={handleDismiss}
                className="p-2 rounded-full text-white hover:bg-black hover:bg-opacity-20 transition-colors"
                title="Dismiss"
              >
                <XMarkIcon className="w-5 h-5" />
              </button>
            )}
          </div>
        </div>

        {/* Mobile Benefits List and Action Buttons */}
        <div className="block lg:hidden">
          {/* Trial Progress Bar for Mobile */}
          {trialStatus && trialStatus.isActive && (
            <div className="mb-4">
              <div className="flex justify-between text-xs text-white opacity-75 mb-1">
                <span>Trial Progress</span>
                <span>{trialStatus.accessedBundles.length} bundles explored</span>
              </div>
              <div className="w-full bg-black bg-opacity-20 rounded-full h-2">
                <div 
                  className="bg-white h-2 rounded-full transition-all duration-300"
                  style={{ width: `${getProgressPercentage()}%` }}
                ></div>
              </div>
            </div>
          )}

          {/* Benefits List for New Users - Mobile Centered */}
          {!trialStatus && (
            <div className="flex flex-col items-center space-y-2 mb-4">
              <div className="flex items-center text-white text-sm">
                <SparklesIcon className="w-4 h-4 mr-1" />
                <span>All Premium Bundles</span>
              </div>
              <div className="flex items-center text-white text-sm">
                <SparklesIcon className="w-4 h-4 mr-1" />
                <span>Unlimited Questions</span>
              </div>
              <div className="flex items-center text-white text-sm">
                <SparklesIcon className="w-4 h-4 mr-1" />
                <span>Advanced Features</span>
              </div>
            </div>
          )}

          {/* Action Buttons - Mobile Centered */}
          <div className="flex flex-col items-center space-y-3">
            <Link
              to="/subscription"
              onClick={handleConversionClick}
              className={`px-6 py-3 rounded-lg font-semibold text-sm transition-colors ${styles.button} w-full max-w-xs text-center`}
            >
              {conversionMessage.cta}
            </Link>

            {/* Dismiss Button */}
            {showDismiss && conversionMessage.urgency !== 'high' && (
              <button
                onClick={handleDismiss}
                className="p-2 rounded-full text-white hover:bg-black hover:bg-opacity-20 transition-colors"
                title="Dismiss"
              >
                <XMarkIcon className="w-5 h-5" />
              </button>
            )}
          </div>
        </div>

        {/* Additional Info for Active Trials */}
        {trialStatus && trialStatus.isActive && trialStatus.accessedBundles.length > 0 && (
          <div className="mt-4 pt-4 border-t border-white border-opacity-20">
            <div className="flex items-center justify-between text-white text-sm">
              <div className="flex items-center">
                <span className="opacity-75">Bundles explored:</span>
                <div className="ml-2 flex flex-wrap gap-1">
                  {trialStatus.accessedBundles.slice(0, 3).map((bundleId, index) => (
                    <span 
                      key={index}
                      className="bg-white bg-opacity-20 px-2 py-1 rounded text-xs"
                    >
                      Bundle {bundleId.slice(-2)}
                    </span>
                  ))}
                  {trialStatus.accessedBundles.length > 3 && (
                    <span className="bg-white bg-opacity-20 px-2 py-1 rounded text-xs">
                      +{trialStatus.accessedBundles.length - 3} more
                    </span>
                  )}
                </div>
              </div>
              
              {conversionMessage.urgency === 'high' && (
                <div className="flex items-center">
                  <ExclamationTriangleIcon className="w-4 h-4 mr-1" />
                  <span className="font-semibold">Don't lose access!</span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Pulsing Animation for High Urgency */}
        {conversionMessage.urgency === 'high' && (
          <div className="absolute inset-0 rounded-lg animate-pulse bg-white opacity-5"></div>
        )}
      </div>
    </div>
  );
};

export default TrialBanner;
