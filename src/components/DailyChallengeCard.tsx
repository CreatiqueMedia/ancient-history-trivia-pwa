import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  FireIcon, 
  CalendarDaysIcon, 
  TrophyIcon, 
  PlayIcon,
  CheckCircleIcon,
  ClockIcon
} from '@heroicons/react/24/solid';
import { DailyChallenge, DailyChallengeStreak } from '../types/enhancements';
import { DailyChallengeService } from '../services/DailyChallengeService';

interface DailyChallengeCardProps {
  className?: string;
}

const DailyChallengeCard: React.FC<DailyChallengeCardProps> = ({ className = '' }) => {
  const [challenge, setChallenge] = useState<DailyChallenge | null>(null);
  const [streak, setStreak] = useState<DailyChallengeStreak | null>(null);
  const [isCompleted, setIsCompleted] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDailyChallenge();
    
    // Set up interval to check for date changes every minute
    const checkForNewDay = () => {
      const now = new Date();
      const currentDate = now.toISOString().split('T')[0];
      
      // Check if we have a challenge and if the date has changed
      if (challenge && challenge.date !== currentDate) {
        loadDailyChallenge();
      }
    };
    
    // Check every minute for date changes
    const interval = setInterval(checkForNewDay, 60000);
    
    // Also check when the component becomes visible again (tab focus)
    const handleVisibilityChange = () => {
      if (!document.hidden) {
        checkForNewDay();
      }
    };
    
    document.addEventListener('visibilitychange', handleVisibilityChange);
    
    return () => {
      clearInterval(interval);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [challenge?.date]); // Re-run when challenge date changes

  const loadDailyChallenge = () => {
    try {
      const todaysChallenge = DailyChallengeService.getTodaysChallenge();
      const currentStreak = DailyChallengeService.getStreak();
      const completed = DailyChallengeService.isTodayCompleted();

      setChallenge(todaysChallenge);
      setStreak(currentStreak);
      setIsCompleted(completed);
    } catch (error) {
      console.error('Error loading daily challenge:', error);
    } finally {
      setLoading(false);
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy':
        return 'text-green-600 bg-green-100 dark:bg-green-900 dark:text-green-300';
      case 'medium':
        return 'text-yellow-800 bg-yellow-50 dark:bg-yellow-900 dark:text-yellow-300';
      case 'hard':
        return 'text-red-600 bg-red-100 dark:bg-red-900 dark:text-red-300';
      default:
        return 'text-gray-600 bg-gray-100 dark:bg-gray-900 dark:text-gray-300';
    }
  };

  const getStreakColor = (streakCount: number) => {
    if (streakCount >= 30) return 'text-purple-600';
    if (streakCount >= 7) return 'text-orange-600';
    if (streakCount >= 3) return 'text-yellow-600';
    return 'text-gray-600';
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      weekday: 'long', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  if (loading) {
    return (
      <div className={`card p-6 animate-pulse ${className}`}>
        <div className="flex items-center justify-between mb-4">
          <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-32"></div>
          <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-16"></div>
        </div>
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full mb-2"></div>
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-4"></div>
        <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded w-full"></div>
      </div>
    );
  }

  if (!challenge) {
    return (
      <div className={`card p-6 border-red-200 dark:border-red-800 ${className}`}>
        <div className="text-center">
          <ClockIcon className="w-12 h-12 text-red-500 mx-auto mb-3" />
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
            Challenge Unavailable
          </h3>
          <p className="text-gray-600 dark:text-gray-400">
            Unable to load today's challenge. Please try again later.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className={`card p-6 bg-gradient-to-br from-primary-50 to-primary-100 dark:from-primary-900/20 dark:to-primary-800/20 border-primary-200 dark:border-primary-700 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center">
          <CalendarDaysIcon className="w-6 h-6 text-primary-600 dark:text-primary-400 mr-2" />
          <h3 className="text-lg font-bold text-gray-900 dark:text-white">
            Daily Challenge
          </h3>
        </div>
        
        {/* Streak Display */}
        <div className="flex items-center bg-white dark:bg-gray-800 rounded-full px-3 py-1 shadow-sm">
          <FireIcon className={`w-5 h-5 mr-1 ${getStreakColor(streak?.current || 0)}`} />
          <span className="text-sm font-bold text-gray-900 dark:text-white">
            {streak?.current || 0}
          </span>
        </div>
      </div>

      {/* Challenge Info */}
      <div className="mb-4">
        <div className="flex items-center justify-between mb-2">
          <h4 className="text-xl font-bold text-gray-900 dark:text-white">
            {challenge.theme}
          </h4>
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(challenge.difficulty)}`}>
            {challenge.difficulty.charAt(0).toUpperCase() + challenge.difficulty.slice(1)}
          </span>
        </div>
        
        <p className="text-gray-600 dark:text-gray-400 text-sm mb-2">
          {formatDate(challenge.date)} • {challenge.category}
        </p>
        
        <p className="text-gray-700 dark:text-gray-300 text-sm">
          Test your knowledge with {challenge.questions.length} carefully selected questions about {challenge.theme.toLowerCase()}.
        </p>
      </div>

      {/* Rewards Preview */}
      <div className="mb-4">
        <div className="flex items-center mb-2">
          <TrophyIcon className="w-4 h-4 text-yellow-600 mr-1" />
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Rewards:
          </span>
        </div>
        <div className="flex flex-wrap gap-2">
          {challenge.rewards.map((reward, index) => (
            <span 
              key={index}
              className="inline-flex items-center px-2 py-1 bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300 text-xs rounded-full"
            >
              {reward.type === 'xp' && '⭐'} 
              {reward.type === 'badge' && '🏆'} 
              {reward.type === 'streak_bonus' && '🔥'} 
              {reward.type === 'unlock_content' && '🔓'}
              <span className="ml-1">
                {typeof reward.value === 'number' ? `${reward.value} XP` : reward.description}
              </span>
            </span>
          ))}
        </div>
      </div>

      {/* Action Button */}
      <div className="flex items-center justify-between">
        {isCompleted ? (
          <div className="flex items-center text-green-600 dark:text-green-400">
            <CheckCircleIcon className="w-5 h-5 mr-2" />
            <span className="font-medium">
              Completed! Score: {challenge.score}%
            </span>
          </div>
        ) : (
          <Link
            to={`/quiz/daily-challenge`}
            className="btn-primary flex items-center justify-center flex-1"
          >
            <PlayIcon className="w-5 h-5 mr-2" />
            Start Challenge
          </Link>
        )}
      </div>

      {/* Streak Information */}
      {streak && streak.current > 0 && (
        <div className="mt-4 pt-4 border-t border-primary-200 dark:border-primary-700">
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600 dark:text-gray-400">
              Current Streak: <span className="font-bold text-gray-900 dark:text-white">{streak.current} days</span>
            </span>
            <span className="text-gray-600 dark:text-gray-400">
              Best: <span className="font-bold text-gray-900 dark:text-white">{streak.best} days</span>
            </span>
          </div>
          
          {/* Streak Progress Bar */}
          <div className="mt-2">
            <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mb-1">
              <span>Next milestone</span>
              <span>
                {streak.current < 7 ? `${7 - streak.current} days to Week Warrior` :
                 streak.current < 30 ? `${30 - streak.current} days to Month Master` :
                 streak.current < 100 ? `${100 - streak.current} days to Century Scholar` :
                 'Legend Status!'}
              </span>
            </div>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
              <div 
                className="bg-gradient-to-r from-orange-400 to-red-500 h-2 rounded-full transition-all duration-300"
                style={{ 
                  width: `${Math.min(100, (streak.current % 7) * (100 / 7))}%` 
                }}
              ></div>
            </div>
          </div>
        </div>
      )}

      {/* First Time User Help */}
      {!streak || streak.current === 0 ? (
        <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
          <div className="flex items-start">
            <FireIcon className="w-5 h-5 text-blue-600 dark:text-blue-400 mr-2 mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-sm font-medium text-blue-900 dark:text-blue-100 mb-1">
                Start Your Streak!
              </p>
              <p className="text-xs text-blue-700 dark:text-blue-300">
                Complete daily challenges to build your streak and earn bonus rewards. The longer your streak, the bigger the bonuses!
              </p>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
};

export default DailyChallengeCard;
