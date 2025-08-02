import React, { useEffect } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { 
  TrophyIcon, 
  HomeIcon, 
  ArrowPathIcon,
  ShareIcon,
  ChartBarIcon 
} from '@heroicons/react/24/solid';
import { useStats } from '../hooks/useStats';
import { QuizResult } from '../types';

const ResultsScreen: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { updateStats } = useStats();
  
  const result = location.state?.result as QuizResult;

  useEffect(() => {
    if (!result) {
      navigate('/');
      return;
    }
    
    // Update stats with quiz result
    updateStats(result);
  }, [result, navigate, updateStats]);

  if (!result) {
    return null;
  }

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600 dark:text-green-400';
    if (score >= 60) return 'text-yellow-600 dark:text-yellow-400';
    return 'text-red-600 dark:text-red-400';
  };

  const getScoreMessage = (score: number) => {
    if (score === 100) return "Perfect! You're a history master! 🏆";
    if (score >= 90) return "Excellent! You know your history! 🌟";
    if (score >= 80) return "Great job! Well done! 👏";
    if (score >= 70) return "Good work! Keep it up! 👍";
    if (score >= 60) return "Not bad! Room for improvement! 📚";
    return "Keep studying! You'll get better! 💪";
  };

  const handleShare = async () => {
    const shareData = {
      title: 'Ancient History Trivia',
      text: `I just scored ${result.score}% on Ancient History Trivia! Can you beat my score?`,
      url: window.location.origin
    };

    if (navigator.share && navigator.canShare && navigator.canShare(shareData)) {
      try {
        await navigator.share(shareData);
      } catch (err) {
        // Error sharing - ignore silently
      }
    } else {
      // Fallback to clipboard
      const text = `I just scored ${result.score}% on Ancient History Trivia! Can you beat my score? ${window.location.origin}`;
      if (navigator.clipboard) {
        await navigator.clipboard.writeText(text);
        alert('Score copied to clipboard!');
      }
    }
  };

  return (
    <div>
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Main Result Card */}
        <div className="card p-8 text-center mb-8">
          {/* Trophy/Score Display */}
          <div className="mb-6">
            <div className={`inline-flex items-center justify-center w-20 h-20 rounded-full mb-4 ${
              result.score >= 80 
                ? 'bg-yellow-100 dark:bg-yellow-900' 
                : result.score >= 60 
                ? 'bg-blue-100 dark:bg-blue-900'
                : 'bg-gray-100 dark:bg-gray-700'
            }`}>
              <TrophyIcon className={`w-10 h-10 ${
                result.score >= 80 
                  ? 'text-yellow-600 dark:text-yellow-400' 
                  : result.score >= 60 
                  ? 'text-blue-600 dark:text-blue-400'
                  : 'text-gray-600 dark:text-gray-400'
              }`} />
            </div>
            
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-2">
              Quiz Complete!
            </h1>
            
            <p className="text-lg text-gray-600 dark:text-gray-400">
              {getScoreMessage(result.score)}
            </p>
          </div>

          {/* Score */}
          <div className="mb-8">
            <div className={`text-6xl md:text-7xl font-bold mb-2 ${getScoreColor(result.score)}`}>
              {result.score}%
            </div>
            <p className="text-gray-600 dark:text-gray-400">
              {result.correctAnswers} out of {result.totalQuestions} correct
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-6">
            <Link to="/" className="btn-primary">
              <HomeIcon className="w-5 h-5 mr-2" />
              Home
            </Link>
            <button 
              onClick={() => navigate('/quiz')}
              className="btn-secondary"
            >
              <ArrowPathIcon className="w-5 h-5 mr-2" />
              Play Again
            </button>
            <button 
              onClick={handleShare}
              className="btn-secondary"
            >
              <ShareIcon className="w-5 h-5 mr-2" />
              Share
            </button>
          </div>
        </div>

        {/* Detailed Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="card p-6 text-center">
            <div className="text-3xl font-bold text-green-600 dark:text-green-400 mb-2">
              {result.correctAnswers}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              Correct Answers
            </div>
          </div>
          
          <div className="card p-6 text-center">
            <div className="text-3xl font-bold text-red-600 dark:text-red-400 mb-2">
              {result.incorrectAnswers}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              Incorrect Answers
            </div>
          </div>
          
          <div className="card p-6 text-center">
            <div className="text-3xl font-bold text-blue-600 dark:text-blue-400 mb-2">
              {Math.floor(result.timeSpent / 60)}:{(result.timeSpent % 60).toString().padStart(2, '0')}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              Time Spent
            </div>
          </div>
        </div>

        {/* Question Review */}
        <div className="card p-6">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6 flex items-center">
            <ChartBarIcon className="w-6 h-6 mr-2" />
            Question Review
          </h2>
          
          <div className="space-y-4">
            {result.questionResults.map((questionResult, index) => (
              <div 
                key={questionResult.questionId}
                className={`p-4 rounded-lg border-2 ${
                  questionResult.isCorrect
                    ? 'border-green-200 dark:border-green-700 bg-green-50 dark:bg-green-900/20'
                    : 'border-red-200 dark:border-red-700 bg-red-50 dark:bg-red-900/20'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <span className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium mr-3 ${
                      questionResult.isCorrect
                        ? 'bg-green-100 dark:bg-green-800 text-green-700 dark:text-green-300'
                        : 'bg-red-100 dark:bg-red-800 text-red-700 dark:text-red-300'
                    }`}>
                      {index + 1}
                    </span>
                    <span className="text-gray-900 dark:text-white font-medium">
                      Question {index + 1}
                    </span>
                  </div>
                  
                  <div className="flex items-center space-x-4 text-sm">
                    <span className={questionResult.isCorrect ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}>
                      {questionResult.isCorrect ? '✓ Correct' : '✗ Incorrect'}
                    </span>
                    <span className="text-gray-500 dark:text-gray-400">
                      {questionResult.timeSpent}s
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Motivational Message */}
        <div className="card p-6 text-center mt-8 bg-gradient-to-br from-primary-50 to-primary-100 dark:from-primary-900/20 dark:to-primary-800/20 border-primary-200 dark:border-primary-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
            Keep Learning!
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            Ancient history is fascinating. The more you play, the more you'll discover about our incredible past.
          </p>
          <Link 
            to="/store" 
            className="text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 font-medium"
          >
            Explore More Topics →
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ResultsScreen;
