import React, { useEffect, useState, useCallback } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { ChevronLeftIcon, ClockIcon } from '@heroicons/react/24/outline';
import { useQuiz } from '../context/QuizContext';
import { useSettings } from '../context/SettingsContext';
import { useAuth } from '../hooks/useAuth';
import { usePurchase } from '../context/PurchaseContext';

import { TrialService } from '../services/TrialService';
import { DailyChallengeService } from '../services/DailyChallengeService';
import { EnhancedQuizService } from '../services/EnhancedQuizService';
import { FullQuestionService } from '../services/FullQuestionService';
import { FirestoreQuestionService } from '../services/FirestoreQuestionService';
import AuthModal from '../components/AuthModal';
import { getBundleById, getRandomQuestions, getQuestionsForBundle } from '../data/questions';
import { sampleQuestionsByBundle } from '../data/sampleQuestions';
import { QUESTION_BUNDLES } from '../data/bundles';
import { Question } from '../types';
import { QuestionBundle } from '../types/bundles';

const QuizScreen: React.FC = () => {
  const { bundleId } = useParams<{ bundleId?: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const { currentQuiz, startQuiz, selectAnswer, nextQuestion, finishQuiz } = useQuiz();
  const { settings } = useSettings();
  const { user } = useAuth();
  const { isPremiumUser, hasAccessToBundle } = usePurchase();
  const [timer, setTimer] = useState<number>(settings.questionTimeLimit || 0);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentBundle, setCurrentBundle] = useState<QuestionBundle | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [initialized, setInitialized] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);

  // Detect if this is a daily challenge from the pathname
  const isDailyChallenge = location.pathname === '/quiz/daily-challenge';
  const effectiveBundleId = isDailyChallenge ? 'daily-challenge' : bundleId;

  // Check authentication for daily challenges
  useEffect(() => {
    if (isDailyChallenge && !user) {
      setShowAuthModal(true);
      return;
    }
  }, [isDailyChallenge, user]);

  // Initialize quiz only once when component mounts or bundleId changes
  useEffect(() => {
    // Prevent re-initialization if already initialized for this bundleId
    if (initialized && currentQuiz && questions.length > 0) {
      return;
    }

    const initializeQuiz = async () => {
      setIsLoading(true);
      
      // Check if this is a sample quiz
      const urlParams = new URLSearchParams(window.location.search);
      const mode = urlParams.get('mode');
      const isSampleQuiz = mode === 'sample';
      
      // Check for sample quiz data in localStorage
      const sampleQuizData = localStorage.getItem('sampleQuiz');
      let sampleQuiz = null;
      
      if (isSampleQuiz && sampleQuizData) {
        try {
          sampleQuiz = JSON.parse(sampleQuizData);
        } catch (error) {
          console.error('Failed to parse sample quiz data:', error);
        }
      }
      
      // Load questions based on sample quiz, bundle, daily challenge, or use enhanced quiz generation
      let quizQuestions: Question[];
      let bundle: QuestionBundle | null = null;
      
      if (sampleQuiz && isSampleQuiz) {
        // Load sample quiz questions from localStorage
        quizQuestions = (sampleQuiz as any).questions;
        bundle = QUESTION_BUNDLES.find(b => b.id === (sampleQuiz as any).bundleId) || null;
        setCurrentBundle(bundle);
      } else if (isSampleQuiz && effectiveBundleId) {
        // Fallback: if it's a sample quiz but no localStorage data, get sample questions directly
        quizQuestions = sampleQuestionsByBundle[effectiveBundleId] || [];
        bundle = QUESTION_BUNDLES.find(b => b.id === effectiveBundleId) || null;
        setCurrentBundle(bundle);
        
        if (quizQuestions.length === 0) {
          console.warn('No sample questions found for bundle:', effectiveBundleId);
          quizQuestions = EnhancedQuizService.generateQuickQuiz(10);
        }
      } else if (effectiveBundleId === 'daily-challenge') {
        // Handle daily challenge
        try {
          const dailyChallenge = DailyChallengeService.getTodaysChallenge();
          
          // The DailyChallengeService already generates the actual questions, not just IDs
          // Let's get the questions directly from the service instead of trying to look them up
          const allQuestions: Question[] = [];
          Object.values(sampleQuestionsByBundle as { [key: string]: Question[] }).forEach((bundleQuestions: Question[]) => {
            allQuestions.push(...bundleQuestions);
          });
          
          // Map the question IDs to actual question objects
          quizQuestions = dailyChallenge.questions.map((questionId: string) => {
            const found = allQuestions.find((q: Question) => q.id === questionId);
            return found;
          }).filter((q): q is Question => q !== undefined);
          
          // Ensure we have exactly 10 questions - if not, regenerate
          if (quizQuestions.length !== 10) {
            DailyChallengeService.resetAllData();
            const newChallenge = DailyChallengeService.getTodaysChallenge();
            quizQuestions = newChallenge.questions.map((questionId: string) => 
              allQuestions.find((q: Question) => q.id === questionId)
            ).filter((q): q is Question => q !== undefined);
          }
          
          // Create a virtual bundle for daily challenge display
          bundle = {
            id: 'daily-challenge',
            name: dailyChallenge.theme,
            description: `Daily Challenge - ${dailyChallenge.category}`,
            themeColors: {
              primary: '#f59e0b',
              background: '#fef3c7',
              text: '#1f2937'
            }
          } as QuestionBundle;
          setCurrentBundle(bundle);
        } catch (error) {
          console.error('Failed to load daily challenge:', error);
          // Fallback to regular quiz with max 10 questions for daily challenge
          quizQuestions = EnhancedQuizService.generateQuickQuiz(10);
          setCurrentBundle(null);
        }
      } else if (effectiveBundleId) {
        // Find the bundle for UI display
        bundle = QUESTION_BUNDLES.find(b => b.id === effectiveBundleId) || null;
        setCurrentBundle(bundle);
        
        // Determine question count based on user access level
        const userHasFullAccess = user && (isPremiumUser || hasAccessToBundle(effectiveBundleId) || TrialService.isInTrial());
        
        if (userHasFullAccess) {
          // Premium users and trial users get FULL question sets from Firestore
          try {
            // Try to get questions from Firestore first
            quizQuestions = await FirestoreQuestionService.getQuestionsFromFirestore(effectiveBundleId);
            
            if (quizQuestions.length === 0) {
              quizQuestions = EnhancedQuizService.generateQuickQuiz(100);
            }
          } catch (error) {
            console.error(`❌ Error fetching questions from Firestore:`, error);
            quizQuestions = FullQuestionService.generateFullQuestions(effectiveBundleId);
            
            if (quizQuestions.length === 0) {
              quizQuestions = EnhancedQuizService.generateQuickQuiz(100);
            }
          }
        } else {
          // Free users and unauthenticated users get sample questions only
          quizQuestions = EnhancedQuizService.generateBundleSampleQuiz(effectiveBundleId, 10);
          
          if (quizQuestions.length === 0) {
            // Fallback to enhanced quick quiz with 33 AP-level questions
            // BUT NOT for daily challenge - that should always have exactly 10
            if (effectiveBundleId !== 'daily-challenge') {
              quizQuestions = EnhancedQuizService.generateQuickQuiz(33);
            } else {
              console.error('[QuizScreen] Daily challenge failed to load questions - this should not happen');
            }
          }
        }
      } else {
        // Determine question count based on user access level for general quiz
        const userHasFullAccess = user && (isPremiumUser || TrialService.isInTrial());
        
        if (userHasFullAccess) {
          // Premium users and trial users get full 100 questions
          quizQuestions = EnhancedQuizService.generateQuickQuiz(100);
        } else {
          // Free users and unauthenticated users get 33 questions
          quizQuestions = EnhancedQuizService.generateQuickQuiz(33);
        }
        setCurrentBundle(null);
      }
      
      setQuestions(quizQuestions);
      startQuiz(quizQuestions);
      setInitialized(true);
      setIsLoading(false);
    };

    initializeQuiz();

    // Cleanup function to clear sample quiz data when leaving the quiz
    return () => {
      const urlParams = new URLSearchParams(window.location.search);
      const mode = urlParams.get('mode');
      if (mode === 'sample') {
        localStorage.removeItem('sampleQuiz');
      }
    };
  }, [effectiveBundleId]); // Only depend on bundleId, not on startQuiz or other functions

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
  
  // Get enhanced question display information
  const questionDisplayInfo = EnhancedQuizService.getQuestionDisplayInfo(currentQuestion);

  return (
    <div>
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 shadow-sm">
        <div className="max-w-4xl mx-auto px-4 py-4">
          {/* Bundle Info */}
          {currentBundle && (
            <div className="mb-4 p-3 rounded-lg" style={{ backgroundColor: currentBundle.themeColors.background }}>
              <div className="flex items-center justify-between">
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
                {(() => {
                  const urlParams = new URLSearchParams(window.location.search);
                  const mode = urlParams.get('mode');
                  return mode === 'sample' && (
                    <div className="bg-emerald-100 dark:bg-emerald-900/30 text-emerald-800 dark:text-emerald-200 px-3 py-1 rounded-full text-sm font-bold border border-emerald-300 dark:border-emerald-700">
                      🧪 Sample Quiz
                    </div>
                  );
                })()}
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
            
            {/* Enhanced Question Meta */}
            <div className="flex flex-wrap gap-2 text-sm mb-3">
              <span className="bg-primary-100 dark:bg-primary-900 text-primary-700 dark:text-primary-300 px-3 py-1 rounded-full font-medium">
                📍 {questionDisplayInfo.region}
              </span>
              <span className="bg-purple-100 dark:bg-purple-900 text-purple-700 dark:text-purple-300 px-3 py-1 rounded-full font-medium">
                ⏳ {questionDisplayInfo.historicalAge}
              </span>
              <span className="bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 px-3 py-1 rounded-full font-medium">
                📚 {questionDisplayInfo.category}
              </span>
            </div>
            
            {/* Difficulty Level Display */}
            <div className="mb-4">
              <div className={`inline-flex items-center px-4 py-2 rounded-lg font-semibold text-sm ${
                currentQuestion.difficulty === 'easy' 
                  ? 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 border border-green-300 dark:border-green-700'
                  : currentQuestion.difficulty === 'medium'
                  ? 'bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200 border border-yellow-300 dark:border-yellow-700'
                  : 'bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200 border border-red-300 dark:border-red-700'
              }`}>
                <span className="mr-2">
                  {currentQuestion.difficulty === 'easy' ? '🟢' : 
                   currentQuestion.difficulty === 'medium' ? '🟡' : '🔴'}
                </span>
                <span className="capitalize">{currentQuestion.difficulty}</span>
                <span className="mx-2">•</span>
                <span>{questionDisplayInfo.difficultyLevel}</span>
              </div>
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

      {/* Auth Modal for Daily Challenge */}        {showAuthModal && (
          <AuthModal 
            isOpen={showAuthModal}
            onClose={() => setShowAuthModal(false)}
          />
        )}
    </div>
  );
};

export default QuizScreen;
