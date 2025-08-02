import React, { useState } from 'react';
import { 
  TrophyIcon, 
  LockClosedIcon, 
  CheckCircleIcon,
  FunnelIcon,
  StarIcon,
  FireIcon,
  CalendarDaysIcon,
  AcademicCapIcon,
  BookOpenIcon,
  ClockIcon,
  LightBulbIcon,
  BoltIcon,
  FlagIcon,
  BookmarkIcon,
  SunIcon,
  ShieldCheckIcon,
  BuildingOffice2Icon,
  GlobeAmericasIcon,
  FaceSmileIcon
} from '@heroicons/react/24/solid';
import { useStats } from '../hooks/useStats';
import { AchievementType } from '../types';
import TrialBanner from '../components/TrialBanner';
import ManageSubscription from '../components/ManageSubscription';

// Icon mapping function to convert string icon names to React components
const getAchievementIcon = (iconName: string) => {
  const iconProps = { className: "w-6 h-6 text-white" };
  
  switch (iconName) {
    case 'calendar-days':
      return <CalendarDaysIcon {...iconProps} />;
    case 'fire':
      return <FireIcon {...iconProps} />;
    case 'trophy':
      return <TrophyIcon {...iconProps} />;
    case 'star':
      return <StarIcon {...iconProps} />;
    case 'academic-cap':
      return <AcademicCapIcon {...iconProps} />;
    case 'book-open':
      return <BookOpenIcon {...iconProps} />;
    case 'clock':
      return <ClockIcon {...iconProps} />;
    case 'light-bulb':
      return <LightBulbIcon {...iconProps} />;
    case 'bolt':
      return <BoltIcon {...iconProps} />;
    case 'flag':
      return <FlagIcon {...iconProps} />;
    case 'bookmark':
      return <BookmarkIcon {...iconProps} />;
    case 'sun':
      return <SunIcon {...iconProps} />;
    case 'shield-check':
      return <ShieldCheckIcon {...iconProps} />;
    case 'building-office-2':
      return <BuildingOffice2Icon {...iconProps} />;
    case 'globe-americas':
      return <GlobeAmericasIcon {...iconProps} />;
    case 'face-smile':
      return <FaceSmileIcon {...iconProps} />;
    case 'building-columns':
      return <TrophyIcon {...iconProps} />; // Fallback to trophy
    case 'water':
      return <StarIcon {...iconProps} />; // Fallback to star
    default:
      return <TrophyIcon {...iconProps} />;
  }
};

// Function to get appropriate background color for achievement icons
const getIconBackground = (iconName: string, isCompleted: boolean) => {
  // Define color mappings for each icon type
  const colorMap = {
    'flag': isCompleted ? 'bg-gradient-to-br from-green-500 to-green-600' : 'bg-gradient-to-br from-green-300 to-green-400',
    'star': isCompleted ? 'bg-gradient-to-br from-yellow-500 to-yellow-600' : 'bg-gradient-to-br from-yellow-300 to-yellow-400',
    'bolt': isCompleted ? 'bg-gradient-to-br from-blue-500 to-blue-600' : 'bg-gradient-to-br from-blue-300 to-blue-400',
    'academic-cap': isCompleted ? 'bg-gradient-to-br from-purple-500 to-purple-600' : 'bg-gradient-to-br from-purple-300 to-purple-400',
    'clock': isCompleted ? 'bg-gradient-to-br from-orange-500 to-orange-600' : 'bg-gradient-to-br from-orange-300 to-orange-400',
    'bookmark': isCompleted ? 'bg-gradient-to-br from-indigo-500 to-indigo-600' : 'bg-gradient-to-br from-indigo-300 to-indigo-400',
    'trophy': isCompleted ? 'bg-gradient-to-br from-yellow-500 to-yellow-600' : 'bg-gradient-to-br from-yellow-300 to-yellow-400',
    'fire': isCompleted ? 'bg-gradient-to-br from-red-500 to-red-600' : 'bg-gradient-to-br from-red-300 to-red-400',
    'calendar-days': isCompleted ? 'bg-gradient-to-br from-cyan-500 to-cyan-600' : 'bg-gradient-to-br from-cyan-300 to-cyan-400',
    'light-bulb': isCompleted ? 'bg-gradient-to-br from-amber-500 to-amber-600' : 'bg-gradient-to-br from-amber-300 to-amber-400',
    'book-open': isCompleted ? 'bg-gradient-to-br from-emerald-500 to-emerald-600' : 'bg-gradient-to-br from-emerald-300 to-emerald-400',
    'sun': isCompleted ? 'bg-gradient-to-br from-yellow-400 to-orange-500' : 'bg-gradient-to-br from-yellow-200 to-orange-300',
    'shield-check': isCompleted ? 'bg-gradient-to-br from-teal-500 to-teal-600' : 'bg-gradient-to-br from-teal-300 to-teal-400',
    'building-office-2': isCompleted ? 'bg-gradient-to-br from-slate-500 to-slate-600' : 'bg-gradient-to-br from-slate-300 to-slate-400',
    'globe-americas': isCompleted ? 'bg-gradient-to-br from-sky-500 to-sky-600' : 'bg-gradient-to-br from-sky-300 to-sky-400',
    'face-smile': isCompleted ? 'bg-gradient-to-br from-pink-500 to-pink-600' : 'bg-gradient-to-br from-pink-300 to-pink-400',
    'building-columns': isCompleted ? 'bg-gradient-to-br from-violet-500 to-violet-600' : 'bg-gradient-to-br from-violet-300 to-violet-400',
    'water': isCompleted ? 'bg-gradient-to-br from-blue-400 to-cyan-500' : 'bg-gradient-to-br from-blue-200 to-cyan-300',
  };

  return colorMap[iconName as keyof typeof colorMap] || 
    (isCompleted ? 'bg-gradient-to-br from-gray-500 to-gray-600' : 'bg-gradient-to-br from-gray-300 to-gray-400');
};

const AchievementsScreen: React.FC = () => {
  const { achievements, stats } = useStats();
  const [filter, setFilter] = useState<'all' | 'unlocked' | 'locked' | 'daily' | 'category' | 'difficulty' | 'general'>('all');

  const filteredAchievements = achievements.filter(achievement => {
    if (filter === 'all') return true;
    if (filter === 'unlocked') return achievement.unlocked;
    if (filter === 'locked') return !achievement.unlocked;
    // For now, return all achievements for category filters since we don't have category property
    return true;
  });

  const unlockedCount = achievements.filter(a => a.unlocked).length;
  const totalCount = achievements.length;
  const completionPercentage = Math.round((unlockedCount / totalCount) * 100);

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'daily':
        return <CalendarDaysIcon className="w-5 h-5" />;
      case 'category':
        return <AcademicCapIcon className="w-5 h-5" />;
      case 'difficulty':
        return <StarIcon className="w-5 h-5" />;
      case 'general':
        return <TrophyIcon className="w-5 h-5" />;
      default:
        return <TrophyIcon className="w-5 h-5" />;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'daily':
        return 'from-blue-500 to-blue-600';
      case 'category':
        return 'from-green-500 to-green-600';
      case 'difficulty':
        return 'from-purple-500 to-purple-600';
      case 'general':
        return 'from-yellow-500 to-yellow-600';
      default:
        return 'from-gray-500 to-gray-600';
    }
  };

  const formatProgress = (achievement: AchievementType) => {
    if (!achievement.maxProgress || achievement.maxProgress <= 1) {
      return achievement.unlocked ? 'Complete' : 'Incomplete';
    }
    return `${achievement.progress || 0}/${achievement.maxProgress}`;
  };

  const getProgressPercentage = (achievement: AchievementType) => {
    if (!achievement.maxProgress || achievement.maxProgress <= 1) {
      return achievement.unlocked ? 100 : 0;
    }
    return Math.min(((achievement.progress || 0) / achievement.maxProgress) * 100, 100);
  };

  const renderAchievementCard = (achievement: AchievementType) => {
    const progressPercentage = getProgressPercentage(achievement);
    const isCompleted = achievement.unlocked;

    return (
      <div 
        key={achievement.id}
        className={`relative bg-white dark:bg-gray-800 rounded-xl p-6 border transition-all duration-200 hover:shadow-lg ${
          isCompleted 
            ? 'border-yellow-300 dark:border-yellow-600 shadow-md' 
            : 'border-gray-200 dark:border-gray-700'
        }`}
      >
        {/* Achievement Status Indicator */}
        <div className="absolute top-4 right-4">
          {isCompleted ? (
            <CheckCircleIcon className="w-6 h-6 text-yellow-500" />
          ) : (
            <LockClosedIcon className="w-6 h-6 text-gray-400" />
          )}
        </div>

        {/* Achievement Header */}
        <div className="flex items-start space-x-4 mb-4">
          <div className={`w-12 h-12 rounded-full flex items-center justify-center ${getIconBackground(achievement.icon, isCompleted)}`}>
            {getAchievementIcon(achievement.icon)}
          </div>
          <div className="flex-1">
            <h3 className={`text-base font-semibold ${isCompleted ? 'text-gray-900 dark:text-white' : 'text-gray-600 dark:text-gray-400'}`}>
              {achievement.title}
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              {achievement.description}
            </p>
          </div>
        </div>

        {/* Progress Section */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-gray-600 dark:text-gray-400">Progress</span>
            <span className={`font-medium ${isCompleted ? 'text-yellow-600 dark:text-yellow-400' : 'text-gray-600 dark:text-gray-400'}`}>
              {formatProgress(achievement)}
            </span>
          </div>
          
          {/* Progress Bar */}
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
            <div 
              className={`h-2.5 rounded-full transition-all duration-500 ${
                isCompleted 
                  ? 'bg-gradient-to-r from-yellow-400 to-yellow-500' 
                  : 'bg-gradient-to-r from-blue-400 to-blue-500'
              }`}
              style={{ width: `${progressPercentage}%` }}
            />
          </div>
        </div>

        {/* Unlocked Date - Remove for now since we don't have unlockedAt property */}
        {/* {isCompleted && achievement.unlockedAt && (
          <div className="mt-4 text-xs text-gray-500 dark:text-gray-400">
            Unlocked on {new Date(achievement.unlockedAt).toLocaleDateString()}
          </div>
        )} */}

        {/* Achievement Type Badge - Removed to fix overlapping text issue */}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 shadow-sm">
        <div className="max-w-6xl mx-auto px-4 py-6">
          <div className="text-center mb-6">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center justify-center gap-2">
              <TrophyIcon className="w-8 h-8 text-yellow-500" />
              Achievements
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-2">
              Track your progress and unlock rewards
            </p>
          </div>

          {/* Progress Overview */}
          <div className="bg-gradient-to-r from-yellow-400 to-yellow-600 rounded-lg p-6 text-white mb-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold mb-2">Overall Progress</h2>
                <p className="opacity-90">
                  {unlockedCount} of {totalCount} achievements unlocked
                </p>
              </div>
              <div className="text-right">
                <div className="text-4xl font-bold">{completionPercentage}%</div>
                <div className="text-yellow-100 text-sm">Complete</div>
              </div>
            </div>
            <div className="mt-4 w-full bg-yellow-300 rounded-full h-3">
              <div 
                className="bg-white h-3 rounded-full transition-all duration-500"
                style={{ width: `${completionPercentage}%` }}
              />
            </div>
          </div>

          {/* Filters */}
          <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
            <div className="flex flex-wrap gap-2">
              {[
                { key: 'all', label: 'All Achievements' },
                { key: 'unlocked', label: 'Unlocked' },
                { key: 'locked', label: 'Locked' },
                { key: 'daily', label: 'Daily Challenges' },
                { key: 'category', label: 'Category Masters' },
                { key: 'difficulty', label: 'Difficulty' },
                { key: 'general', label: 'General' }
              ].map(({ key, label }) => (
                <button
                  key={key}
                  onClick={() => setFilter(key as typeof filter)}
                  className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                    filter === key
                      ? 'bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300'
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Achievements Grid */}
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Trial Banner and Manage Subscription */}
        <div className="mb-8">
          <TrialBanner variant="compact" className="mb-4" />
          <ManageSubscription variant="compact" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredAchievements.map(achievement => renderAchievementCard(achievement))}
        </div>

        {/* Empty State */}
        {filteredAchievements.length === 0 && (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🏆</div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              No achievements found
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              Try adjusting your filters or start completing quizzes to unlock achievements.
            </p>
          </div>
        )}

        {        /* Achievement Statistics Overview */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center text-white mb-4">
              <CheckCircleIcon className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">Completed</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">Achievements you've unlocked</p>
            <div className="text-2xl font-bold text-gray-900 dark:text-white">
              {unlockedCount}
            </div>
            <div className="text-sm text-gray-500 dark:text-gray-400">Unlocked</div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-yellow-500 to-yellow-600 flex items-center justify-center text-white mb-4">
              <TrophyIcon className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">Total</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">All available achievements</p>
            <div className="text-2xl font-bold text-gray-900 dark:text-white">
              {totalCount}
            </div>
            <div className="text-sm text-gray-500 dark:text-gray-400">Available</div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white mb-4">
              <StarIcon className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">Progress</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">Your completion rate</p>
            <div className="text-2xl font-bold text-gray-900 dark:text-white">
              {completionPercentage}%
            </div>
            <div className="text-sm text-gray-500 dark:text-gray-400">Complete</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AchievementsScreen;
