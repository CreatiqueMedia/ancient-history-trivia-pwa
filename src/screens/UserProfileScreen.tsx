import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  UserIcon, 
  CogIcon, 
  StarIcon, 
  ChartBarIcon,
  TrophyIcon,
  ArrowRightOnRectangleIcon,
  PencilIcon,
  CheckCircleIcon
} from '@heroicons/react/24/outline';
import { useAuth } from '../context/AuthContext';
import { useStats } from '../context/StatsContext';
import { usePurchase } from '../context/PurchaseContext';
import { SUBSCRIPTION_TIERS } from '../data/bundles';

const UserProfileScreen: React.FC = () => {
  const navigate = useNavigate();
  const { user, userProfile, logout, updateUserProfile } = useAuth();
  const { stats } = useStats();
  const { isPremiumUser, subscribe, isProcessing } = usePurchase();
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    displayName: userProfile?.displayName || '',
    email: userProfile?.email || ''
  });

  if (!user || !userProfile) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="text-center">
          <UserIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
            Not Signed In
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            Please sign in to view your profile
          </p>
        </div>
      </div>
    );
  }

  const handleSaveProfile = async () => {
    try {
      await updateUserProfile({
        displayName: editForm.displayName,
        email: editForm.email
      });
      setIsEditing(false);
    } catch (error) {
      console.error('Failed to update profile:', error);
    }
  };

  // Helper function to format subscription period display
  const formatPeriod = (period: string): string => {
    switch (period) {
      case 'monthly': return 'month';
      case 'yearly': return 'year';
      case 'biennial': return '2 years';
      case 'lifetime': return 'lifetime';
      default: return period;
    }
  };

  // Get persuasive marketing copy for each plan
  const getPlanTagline = (planId: string) => {
    switch (planId) {
      case 'scholar':
        return 'Unlock all question bundles and advanced features. Try free for 7 days!';
      case 'historian':
        return 'Go deeper with exclusive content, analytics, and offline access. 14-day free trial!';
      case 'academy':
        return 'Best value: 2 years of premium access, institution features, and the ultimate learning toolkit.';
      default:
        return '';
    }
  };

  // Handle subscription
  const handleSubscribe = async (tier: any) => {
    try {
      const success = await subscribe('pro', tier.period);
      if (success) {
        alert(`Successfully subscribed to ${tier.name}!`);
      }
    } catch (error) {
      alert('Subscription failed. Please try again.');
    }
  };

  // Navigate to store subscription tab
  const handleManageSubscription = () => {
    navigate('/store');
    // Use setTimeout to ensure navigation completes before setting tab
    setTimeout(() => {
      // Trigger the subscription tab to be active
      const event = new CustomEvent('setStoreTab', { detail: 'subscription' });
      window.dispatchEvent(event);
    }, 100);
  };

  // Map subscription to SUBSCRIPTION_TIERS for badge display
  const getSubscriptionBadge = () => {
    const subscription = userProfile.subscription;
    switch (subscription) {
      case 'pro_monthly':
        return { icon: '⭐', name: 'Pro Monthly', color: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200' };
      case 'pro_annual':
        return { icon: '🏆', name: 'Pro Annual', color: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200' };
      default:
        return { icon: '❓', name: 'No Subscription', color: 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200' };
    }
  };

  // Get current subscription tier details
  const getCurrentSubscriptionTier = () => {
    const subscription = userProfile.subscription;
    return SUBSCRIPTION_TIERS.find(tier => 
      (subscription === 'pro_monthly' && tier.id === 'pro_monthly') ||
      (subscription === 'pro_annual' && tier.id === 'pro_annual')
    );
  };

  // Render subscription card similar to store
  const renderSubscriptionCard = (tier: any, isCurrent: boolean = false) => {
    return (
      <div key={tier.id} className={`rounded-lg p-6 border-2 ${
        tier.isPopular 
          ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' 
          : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800'
      } ${isCurrent ? 'ring-2 ring-green-500' : ''}`}>
        {tier.isPopular && !isCurrent && (
          <div className="text-center">
            <span className="bg-blue-500 text-white px-3 py-1 rounded-full text-sm font-medium">
              Most Popular
            </span>
          </div>
        )}
        
        {isCurrent && (
          <div className="text-center">
            <span className="bg-green-500 text-white px-3 py-1 rounded-full text-sm font-medium">
              Current Plan
            </span>
          </div>
        )}
        
        <div className="text-center mt-4">
          <h3 className="text-xl font-bold text-gray-900 dark:text-white">{tier.name}</h3>
          <p className="mt-2 text-primary-700 dark:text-primary-300 text-base font-medium">{getPlanTagline(tier.id)}</p>
          <div className="mt-2">
            <span className="text-3xl font-bold text-gray-900 dark:text-white">${tier.price}</span>
            <span className="text-gray-500 dark:text-gray-400">/{formatPeriod(tier.period)}</span>
          </div>
          {tier.savings && (
            <span className="inline-block mt-2 bg-green-100 text-green-800 px-2 py-1 rounded text-sm">
              {tier.savings}
            </span>
          )}
        </div>

        <ul className="mt-6 space-y-3">
          {tier.features.map((feature: string, index: number) => (
            <li key={index} className="flex items-center text-sm text-gray-600 dark:text-gray-400">
              <CheckCircleIcon className="w-5 h-5 text-green-500 mr-3 flex-shrink-0" />
              {feature}
            </li>
          ))}
        </ul>

        <button
          onClick={() => isCurrent ? handleManageSubscription() : handleSubscribe(tier)}
          disabled={isProcessing}
          className={`w-full mt-6 py-3 px-4 rounded-lg font-medium transition-colors ${
            isCurrent
              ? 'bg-green-600 hover:bg-green-700 text-white'
              : tier.isPopular 
                ? 'bg-blue-600 hover:bg-blue-700 text-white' 
                : 'bg-gray-900 hover:bg-gray-800 text-white dark:bg-white dark:text-gray-900 dark:hover:bg-gray-100'
          } disabled:bg-gray-400 disabled:cursor-not-allowed`}
        >
          {isCurrent ? 'Manage Subscription' : isProcessing ? 'Processing...' : tier.id === 'pro_monthly' ? 'Start Pro Monthly' : tier.id === 'pro_annual' ? 'Start Pro Annual' : tier.id === 'pro_biennial' ? 'Unlock 2 Years – Best Value!' : `Get ${tier.name}`}
        </button>
      </div>
    );
  };

  const subscriptionBadge = getSubscriptionBadge();

  return (
    <div>
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 shadow-sm">
        <div className="max-w-4xl mx-auto px-4 py-6">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Profile
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Manage your account and preferences
          </p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Profile Card */}
        <div className="card p-6 mb-6">
          <div className="flex items-start justify-between mb-6">
            <div className="flex items-center space-x-4">
              {/* Avatar */}
              <div className="relative">
                {userProfile.photoURL ? (
                  <img
                    src={userProfile.photoURL}
                    alt={userProfile.displayName}
                    className="w-20 h-20 rounded-full"
                  />
                ) : (
                  <div className="w-20 h-20 bg-primary-600 rounded-full flex items-center justify-center">
                    <UserIcon className="w-10 h-10 text-white" />
                  </div>
                )}
                
                {/* Subscription Badge */}
                <div className={`absolute -bottom-2 -right-2 px-2 py-1 rounded-full text-xs font-medium ${subscriptionBadge.color}`}>
                  {subscriptionBadge.icon} {subscriptionBadge.name}
                </div>
              </div>

              {/* User Info */}
              <div className="flex-1">
                {isEditing ? (
                  <div className="space-y-3">
                    <input
                      type="text"
                      value={editForm.displayName}
                      onChange={(e) => setEditForm({ ...editForm, displayName: e.target.value })}
                      className="block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white"
                      placeholder="Display name"
                    />
                    <input
                      type="email"
                      value={editForm.email}
                      onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                      className="block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white"
                      placeholder="Email address"
                    />
                    <div className="flex space-x-2">
                      <button
                        onClick={handleSaveProfile}
                        className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 transition-colors"
                      >
                        Save
                      </button>
                      <button
                        onClick={() => {
                          setIsEditing(false);
                          setEditForm({
                            displayName: userProfile.displayName,
                            email: userProfile.email
                          });
                        }}
                        className="px-4 py-2 bg-gray-300 dark:bg-gray-600 text-gray-700 dark:text-gray-200 rounded-md hover:bg-gray-400 dark:hover:bg-gray-500 transition-colors"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                      {userProfile.displayName}
                    </h2>
                    <p className="text-gray-600 dark:text-gray-400">
                      {userProfile.email}
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-500 mt-1">
                      Member since {new Date(userProfile.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                )}
              </div>
            </div>

            {!isEditing && (
              <button
                onClick={() => setIsEditing(true)}
                className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
                title="Edit Profile"
              >
                <PencilIcon className="w-5 h-5" />
              </button>
            )}
          </div>

          {/* Provider Info */}
          <div className="flex items-center space-x-4 text-sm text-gray-600 dark:text-gray-400 mb-6">
            <div className="flex items-center">
              <span className="mr-2">Provider:</span>
              <span className="font-medium capitalize">{userProfile.provider}</span>
            </div>
            {userProfile.isAnonymous && (
              <span className="bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200 px-2 py-1 rounded-full text-xs">
                Guest Account
              </span>
            )}
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <ChartBarIcon className="w-8 h-8 text-primary-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-gray-900 dark:text-white">
                {stats.totalQuizzes}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                Quizzes Taken
              </div>
            </div>
            <div className="text-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <TrophyIcon className="w-8 h-8 text-yellow-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-gray-900 dark:text-white">
                {stats.achievements.length}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                Achievements
              </div>
            </div>
            <div className="text-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <div className="text-2xl font-bold text-gray-900 dark:text-white">
                {Math.round(stats.averageScore)}%
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                Average Score
              </div>
            </div>
            <div className="text-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <div className="text-2xl font-bold text-gray-900 dark:text-white">
                {stats.streakCurrent}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                Current Streak
              </div>
            </div>
          </div>
        </div>

        {/* Subscription Management Section */}
        <div className="mb-8">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              Your Subscription
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              {isPremiumUser ? 'Manage your premium subscription' : 'Choose a plan to unlock all premium features'}
            </p>
          </div>

          {/* Current Subscription or Available Plans */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {(() => {
              const currentTier = getCurrentSubscriptionTier();
              
              if (currentTier) {
                // Show current subscription + other options
                return SUBSCRIPTION_TIERS.map(tier => 
                  renderSubscriptionCard(tier, tier.id === currentTier.id)
                );
              } else {
                // Show all available subscription options
                return SUBSCRIPTION_TIERS.map(tier => renderSubscriptionCard(tier, false));
              }
            })()}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Settings */}
          <Link
            to="/settings"
            className="card p-6 hover:shadow-lg transition-shadow"
          >
            <div className="flex items-center mb-4">
              <CogIcon className="w-8 h-8 text-gray-600 mr-3" />
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Settings
              </h3>
            </div>
            <p className="text-gray-600 dark:text-gray-400 text-sm">
              Customize your quiz experience and preferences
            </p>
          </Link>

          {/* Statistics */}
          <Link
            to="/stats"
            className="card p-6 hover:shadow-lg transition-shadow"
          >
            <div className="flex items-center mb-4">
              <ChartBarIcon className="w-8 h-8 text-green-600 mr-3" />
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Statistics
              </h3>
            </div>
            <p className="text-gray-600 dark:text-gray-400 text-sm">
              View detailed analytics and progress tracking
            </p>
          </Link>
        </div>

        {/* Account Actions */}
        <div className="card p-6 mt-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Account Actions
          </h3>
          <div className="space-y-3">
            <button
              onClick={logout}
              className="flex items-center w-full px-4 py-3 text-left text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
            >
              <ArrowRightOnRectangleIcon className="w-5 h-5 mr-3" />
              Sign Out
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfileScreen;
