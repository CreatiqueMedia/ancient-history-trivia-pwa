import React, { useEffect, useState, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ChevronLeftIcon, ClockIcon } from '@heroicons/react/24/outline';
import { useQuiz } from '../context/QuizContext';
import { useSettings } from '../context/SettingsContext';
import { getBundleById, getRandomQuestions, getQuestionsForBundle } from '../data/questions';
import { QUESTION_BUNDLES } from '../data/bundles';
import { Question } from '../types';

const QuizScreen: React.FC = () => {
  const { bundleId } = useParams<{ bundleId?: string }>();
  const navigate = useNavigate();
  const { currentQuiz, startQuiz, selectAnswer, nextQuestion, finishQuiz } = useQuiz();
  const { settings } = useSettings();
  const [timer, setTimer] = useState<number>(settings.questionTimeLimit || 0);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentBundle, setCurrentBundle] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Memoize the quiz initialization to prevent re-renders
  const initializeQuiz = useCallback(() => {
    // Prevent reinitialization if quiz is already loaded for this bundle
    if (currentQuiz && questions.length > 0 && bundleId === currentBundle?.id) {
      setIsLoading(false);
      return;
    }
    
    setIsLoading(true);
    
    // Load questions based on bundle or use random questions
    let quizQuestions: Question[];
    let bundle = null;
    
    if (bundleId) {
      // Find the bundle for UI display
      bundle = QUESTION_BUNDLES.find(b => b.id === bundleId);
      setCurrentBundle(bundle);
      
      // Use the new bundle-specific question loading
      quizQuestions = getQuestionsForBundle(bundleId);
      if (quizQuestions.length === 0) {
        // Fallback to random questions if bundle has no questions
        quizQuestions = getRandomQuestions(10);
      }
    } else {
      quizQuestions = getRandomQuestions(10);
      setCurrentBundle(null);
    }
    
    setQuestions(quizQuestions);
    startQuiz(quizQuestions);
    setIsLoading(false);
  }, [bundleId, currentQuiz, questions.length, currentBundle?.id, startQuiz]);

  useEffect(() => {
    initializeQuiz();
  }, [bundleId]); // Only depend on bundleId, not startQuiz

  useEffect(() => {
    // Only run timer if there's a time limit set
    if (!currentQuiz || currentQuiz.showAnswer || currentQuiz.isCompleted || !settings.questionTimeLimit) return;

    const interval = setInterval(() => {
      setTimer(prev => {
        if (prev <= 1) {
          // Time's up - auto-advance to next question
          selectAnswer(-1); // No answer selected
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [currentQuiz?.currentQuestionIndex, currentQuiz?.showAnswer, currentQuiz?.isCompleted, settings.questionTimeLimit, selectAnswer]);

  useEffect(() => {
    if (currentQuiz && !currentQuiz.showAnswer && settings.questionTimeLimit) {
      setTimer(settings.questionTimeLimit); // Reset to configured time limit for each new question
    }
  }, [currentQuiz?.currentQuestionIndex, currentQuiz?.showAnswer, settings.questionTimeLimit]);

  const handleAnswerSelect = (answerIndex: number) => {
    selectAnswer(answerIndex);
  };

  const handleNext = () => {
    if (currentQuiz?.isCompleted) {
      const result = finishQuiz();
      if (result) {
        navigate('/results', { state: { result } });
      }
    } else {
      nextQuestion();
    }
  };

  const handleBack = () => {
    navigate(-1);
  };

  if (isLoading || !currentQuiz || !questions.length) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading quiz...</p>
        </div>
      </div>
    );
  }

  const currentQuestion = questions[currentQuiz.currentQuestionIndex];
  const progress = ((currentQuiz.currentQuestionIndex + 1) / questions.length) * 100;

  return (
    <div>
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 shadow-sm">
        <div className="max-w-4xl mx-auto px-4 py-4">
          {/* Bundle Info */}
          {currentBundle && (
            <div className="mb-4 p-3 rounded-lg" style={{ backgroundColor: currentBundle.themeColors.background }}>
              <div className="flex items-center space-x-3">
                <div 
                  className="w-10 h-10 rounded-full flex items-center justify-center text-white text-lg"
                  style={{ backgroundColor: currentBundle.themeColors.primary }}
                >
                  📚
                </div>
                <div>
                  <h2 className="font-bold text-gray-900 dark:text-white">{currentBundle.name}</h2>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{currentBundle.description}</p>
                </div>
              </div>
            </div>
          )}
          
          <div className="flex items-center justify-between">
            <button
              onClick={handleBack}
              className="flex items-center text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
            >
              <ChevronLeftIcon className="w-5 h-5 mr-1" />
              Back
            </button>
            
            <div className="text-center">
              <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Question {currentQuiz.currentQuestionIndex + 1} of {questions.length}
              </span>
            </div>

            {settings.questionTimeLimit ? (
              <div className="flex items-center text-gray-600 dark:text-gray-400">
                <ClockIcon className="w-5 h-5 mr-1" />
                <span className={`font-mono ${timer <= 10 ? 'text-red-500' : ''}`}>
                  {timer}s
                </span>
              </div>
            ) : (
              <div className="w-16"></div>
            )}
          </div>

          {/* Progress Bar */}
          <div className="mt-4">
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
              <div
                className="bg-primary-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
          </div>
        </div>
      </div>

      {/* Question Content */}
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="card p-8">
          {/* Question */}
          <div className="mb-8">
            <h1 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white mb-4">
              {currentQuestion.question}
            </h1>
            
            {/* Question Meta */}
            <div className="flex flex-wrap gap-2 text-sm">
              <span className="bg-primary-100 dark:bg-primary-900 text-primary-700 dark:text-primary-300 px-2 py-1 rounded">
                {currentQuestion.region}
              </span>
              <span className="bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 px-2 py-1 rounded">
                {currentQuestion.category}
              </span>
              <span className={`px-2 py-1 rounded ${
                currentQuestion.difficulty === 'easy' 
                  ? 'bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300'
                  : currentQuestion.difficulty === 'medium'
                  ? 'bg-yellow-100 dark:bg-yellow-900 text-yellow-700 dark:text-yellow-300'
                  : 'bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-300'
              }`}>
                {currentQuestion.difficulty}
              </span>
            </div>
          </div>

          {/* Answer Options */}
          <div className="space-y-4 mb-8">
            {currentQuestion.options.map((option, index) => {
              let optionClass = 'quiz-option';
              
              if (currentQuiz.showAnswer) {
                if (index === currentQuestion.correctAnswer) {
                  optionClass += ' correct';
                } else if (index === currentQuiz.selectedAnswer && index !== currentQuestion.correctAnswer) {
                  optionClass += ' incorrect';
                }
              } else if (index === currentQuiz.selectedAnswer) {
                optionClass += ' selected';
              }

              return (
                <button
                  key={index}
                  onClick={() => handleAnswerSelect(index)}
                  disabled={currentQuiz.showAnswer}
                  className={`${optionClass} w-full text-left disabled:cursor-not-allowed`}
                >
                  <div className="flex items-center">
                    <span className="flex-shrink-0 w-8 h-8 rounded-full bg-gray-100 dark:bg-gray-600 flex items-center justify-center text-sm font-medium mr-4">
                      {String.fromCharCode(65 + index)}
                    </span>
                    <span className="text-gray-900 dark:text-white">{option}</span>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Explanation */}
          {currentQuiz.showAnswer && currentQuestion.explanation && settings.showExplanations && (
            <div className="mb-8 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-700">
              <h3 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">
                Explanation
              </h3>
              <p className="text-blue-800 dark:text-blue-200 text-sm">
                {currentQuestion.explanation}
              </p>
            </div>
          )}

          {/* Next Button */}
          {currentQuiz.showAnswer && (
            <div className="text-center">
              <button
                onClick={handleNext}
                className="btn-primary"
              >
                {currentQuiz.isCompleted ? 'View Results' : 'Next Question'}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default QuizScreen;
