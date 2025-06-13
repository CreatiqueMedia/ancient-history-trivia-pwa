import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  UserIcon, 
  CogIcon, 
  StarIcon, 
  ChartBarIcon,
  TrophyIcon,
  ArrowRightOnRectangleIcon,
  PencilIcon
} from '@heroicons/react/24/outline';
import { useAuth } from '../context/MockAuthContext';
import { useStats } from '../context/StatsContext';

const UserProfileScreen: React.FC = () => {
  const { user, userProfile, logout, updateUserProfile } = useAuth();
  const { stats } = useStats();
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

  const getSubscriptionBadge = () => {
    const subscription = userProfile.subscription;
    switch (subscription) {
      case 'scholar':
        return { icon: '📚', name: 'Scholar', color: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200' };
      case 'historian':
        return { icon: '🏛️', name: 'Historian', color: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200' };
      case 'academy':
        return { icon: '👑', name: 'Academy', color: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200' };
      default:
        return { icon: '🌟', name: 'Explorer', color: 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200' };
    }
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

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Subscription Management */}
          <Link
            to="/subscription"
            className="card p-6 hover:shadow-lg transition-shadow"
          >
            <div className="flex items-center mb-4">
              <StarIcon className="w-8 h-8 text-primary-600 mr-3" />
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Subscription
              </h3>
            </div>
            <p className="text-gray-600 dark:text-gray-400 text-sm mb-3">
              Manage your subscription and unlock premium features
            </p>
            <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${subscriptionBadge.color}`}>
              {subscriptionBadge.icon} {subscriptionBadge.name}
            </div>
          </Link>

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
