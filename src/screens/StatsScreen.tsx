import React from 'react';
import { 
  ChartBarIcon, 
  TrophyIcon, 
  ClockIcon, 
  FireIcon,
  QuestionMarkCircleIcon 
} from '@heroicons/react/24/solid';
import { useStats } from '../context/StatsContext';
import TrialBanner from '../components/TrialBanner';
import ManageSubscription from '../components/ManageSubscription';

const StatsScreen: React.FC = () => {
  const { stats } = useStats();

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    
    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    }
    return `${minutes}m`;
  };

  const getAccuracyColor = (accuracy: number) => {
    if (accuracy >= 80) return 'text-green-600 dark:text-green-400';
    if (accuracy >= 60) return 'text-yellow-600 dark:text-yellow-400';
    return 'text-red-600 dark:text-red-400';
  };

  const topCategories = Object.entries(stats.categoryStats)
    .sort(([,a], [,b]) => b.totalQuestions - a.totalQuestions)
    .slice(0, 5);

  return (
    <div>
      {/* Header */}
      <div className="bg-gradient-to-r from-primary-600 to-primary-800 text-white">
        <div className="max-w-6xl mx-auto px-4 py-8">
          <div className="text-center">
            <h1 className="text-3xl font-bold mb-2">Your Statistics</h1>
            <p className="text-primary-100">
              Track your progress and achievements
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Trial Banner and Manage Subscription */}
        <div className="mb-8">
          <TrialBanner variant="compact" className="mb-4" />
          <ManageSubscription variant="compact" />
        </div>

        {/* Overview Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="card p-6 text-center">
            <div className="bg-blue-100 dark:bg-blue-900 p-3 rounded-full w-12 h-12 mx-auto mb-3 flex items-center justify-center">
              <QuestionMarkCircleIcon className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            </div>
            <div className="text-2xl font-bold text-gray-900 dark:text-white">
              {stats.totalQuestions}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              Questions Answered
            </div>
          </div>

          <div className="card p-6 text-center">
            <div className="bg-green-100 dark:bg-green-900 p-3 rounded-full w-12 h-12 mx-auto mb-3 flex items-center justify-center">
              <TrophyIcon className="w-6 h-6 text-green-600 dark:text-green-400" />
            </div>
            <div className="text-2xl font-bold text-gray-900 dark:text-white">
              {stats.totalQuizzes}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              Quizzes Completed
            </div>
          </div>

          <div className="card p-6 text-center">
            <div className="bg-yellow-100 dark:bg-yellow-900 p-3 rounded-full w-12 h-12 mx-auto mb-3 flex items-center justify-center">
              <FireIcon className="w-6 h-6 text-yellow-600 dark:text-yellow-400" />
            </div>
            <div className="text-2xl font-bold text-gray-900 dark:text-white">
              {stats.streakBest}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              Best Streak
            </div>
          </div>

          <div className="card p-6 text-center">
            <div className="bg-purple-100 dark:bg-purple-900 p-3 rounded-full w-12 h-12 mx-auto mb-3 flex items-center justify-center">
              <ClockIcon className="w-6 h-6 text-purple-600 dark:text-purple-400" />
            </div>
            <div className="text-2xl font-bold text-gray-900 dark:text-white">
              {formatTime(stats.timeSpent)}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              Time Played
            </div>
          </div>
        </div>

        {/* Performance Overview */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Accuracy */}
          <div className="card p-6">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6 flex items-center">
              <ChartBarIcon className="w-6 h-6 mr-2" />
              Overall Performance
            </h2>

            <div className="space-y-6">
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-gray-700 dark:text-gray-300">Accuracy</span>
                  <span className={`font-semibold ${getAccuracyColor(stats.averageScore)}`}>
                    {Math.round(stats.averageScore)}%
                  </span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
                  <div
                    className={`h-3 rounded-full transition-all duration-500 ${
                      stats.averageScore >= 80
                        ? 'bg-green-500'
                        : stats.averageScore >= 60
                        ? 'bg-yellow-500'
                        : 'bg-red-500'
                    }`}
                    style={{ width: `${Math.min(stats.averageScore, 100)}%` }}
                  ></div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 text-center">
                <div>
                  <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                    {stats.correctAnswers}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    Correct
                  </div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-red-600 dark:text-red-400">
                    {stats.totalQuestions - stats.correctAnswers}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    Incorrect
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Current Streak */}
          <div className="card p-6">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6 flex items-center">
              <FireIcon className="w-6 h-6 mr-2" />
              Streak Progress
            </h2>

            <div className="text-center">
              <div className="text-4xl mb-4">🔥</div>
              <div className="text-3xl font-bold text-orange-600 dark:text-orange-400 mb-2">
                {stats.streakCurrent}
              </div>
              <div className="text-gray-600 dark:text-gray-400 mb-4">
                Current Streak
              </div>
              
              {stats.streakCurrent > 0 ? (
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Keep it up! Get {5 - (stats.streakCurrent % 5)} more correct to reach the next milestone.
                </p>
              ) : (
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Answer questions correctly to start your streak!
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Category Performance */}
        <div className="card p-6 mb-8">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
            Performance by Category
          </h2>

          {topCategories.length > 0 ? (
            <div className="space-y-4">
              {topCategories.map(([category, categoryStats]) => (
                <div key={category} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-medium text-gray-900 dark:text-white capitalize">
                        {category}
                      </h3>
                      <span className={`text-sm font-semibold ${getAccuracyColor(categoryStats.averageScore)}`}>
                        {Math.round(categoryStats.averageScore)}%
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400 mb-2">
                      <span>{categoryStats.totalQuestions} questions</span>
                      <span>{categoryStats.correctAnswers} correct</span>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full ${
                          categoryStats.averageScore >= 80
                            ? 'bg-green-500'
                            : categoryStats.averageScore >= 60
                            ? 'bg-yellow-500'
                            : 'bg-red-500'
                        }`}
                        style={{ width: `${Math.min(categoryStats.averageScore, 100)}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <div className="text-4xl mb-4">📊</div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                No Data Yet
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Complete some quizzes to see your category performance!
              </p>
            </div>
          )}
        </div>

        {/* Achievements Preview */}
        <div className="card p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">
              Recent Milestones
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className={`p-4 rounded-lg border-2 ${
              stats.totalQuestions >= 100 
                ? 'border-green-200 dark:border-green-700 bg-green-50 dark:bg-green-900/20' 
                : 'border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700'
            }`}>
              <div className="text-2xl mb-2">🎯</div>
              <h3 className="font-medium text-gray-900 dark:text-white">
                Century Mark
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Answer 100 questions ({stats.totalQuestions}/100)
              </p>
            </div>

            <div className={`p-4 rounded-lg border-2 ${
              stats.streakBest >= 10 
                ? 'border-green-200 dark:border-green-700 bg-green-50 dark:bg-green-900/20' 
                : 'border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700'
            }`}>
              <div className="text-2xl mb-2">🔥</div>
              <h3 className="font-medium text-gray-900 dark:text-white">
                Hot Streak
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                10 question streak ({stats.streakBest}/10)
              </p>
            </div>

            <div className={`p-4 rounded-lg border-2 ${
              stats.averageScore >= 80 
                ? 'border-green-200 dark:border-green-700 bg-green-50 dark:bg-green-900/20' 
                : 'border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700'
            }`}>
              <div className="text-2xl mb-2">🎓</div>
              <h3 className="font-medium text-gray-900 dark:text-white">
                Scholar
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                80% average score ({Math.round(stats.averageScore)}%/80%)
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StatsScreen;
