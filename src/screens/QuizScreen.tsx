import React, { useEffect, useState, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ChevronLeftIcon, ClockIcon } from '@heroicons/react/24/outline';
import { useQuiz } from '../context/QuizContext';
import { useSettings } from '../context/SettingsContext';
import { useAuth } from '../context/AuthContext';
import { usePurchase } from '../context/PurchaseContext';
import { getBundleById, getRandomQuestions, getQuestionsForBundle } from '../data/questions';
import { QUESTION_BUNDLES } from '../data/bundles';
import { Question } from '../types';
import { EnhancedQuizService } from '../services/EnhancedQuizService';
import { FullQuestionService } from '../services/FullQuestionService';
import { FirestoreQuestionService } from '../services/FirestoreQuestionService';
import { TrialService } from '../services/TrialService';

const QuizScreen: React.FC = () => {
  const { bundleId } = useParams<{ bundleId?: string }>();
  const navigate = useNavigate();
  const { currentQuiz, startQuiz, selectAnswer, nextQuestion, finishQuiz } = useQuiz();
  const { settings } = useSettings();
  const { user } = useAuth();
  const { isPremiumUser, hasAccessToBundle } = usePurchase();
  const [timer, setTimer] = useState<number>(settings.questionTimeLimit || 0);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentBundle, setCurrentBundle] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [initialized, setInitialized] = useState(false);

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
      let bundle = null;
      
      if (sampleQuiz && isSampleQuiz) {
        // Load sample quiz questions
        quizQuestions = sampleQuiz.questions;
        bundle = QUESTION_BUNDLES.find(b => b.id === sampleQuiz.bundleId);
        setCurrentBundle(bundle);
      } else if (bundleId === 'daily-challenge') {
        // Handle daily challenge
        try {
          const { DailyChallengeService } = require('../services/DailyChallengeService');
          const dailyChallenge = DailyChallengeService.getTodaysChallenge();
          
          // Get the actual question objects from the daily challenge question IDs
          const { sampleQuestions } = require('../data/questions');
          quizQuestions = dailyChallenge.questions.map((questionId: string) => 
            sampleQuestions.find((q: Question) => q.id === questionId)
          ).filter(Boolean);
          
          // Create a virtual bundle for daily challenge display
          bundle = {
            id: 'daily-challenge',
            name: dailyChallenge.theme,
            description: `Daily Challenge - ${dailyChallenge.category}`,
            themeColors: {
              primary: '#f59e0b',
              background: '#fef3c7'
            }
          };
          setCurrentBundle(bundle);
        } catch (error) {
          console.error('Failed to load daily challenge:', error);
          // Fallback to regular quiz with max 10 questions for daily challenge
          quizQuestions = EnhancedQuizService.generateQuickQuiz(10);
          setCurrentBundle(null);
        }
      } else if (bundleId) {
        // Find the bundle for UI display
        bundle = QUESTION_BUNDLES.find(b => b.id === bundleId);
        setCurrentBundle(bundle);
        
        // Determine question count based on user access level
        const userHasFullAccess = user && (isPremiumUser || hasAccessToBundle(bundleId) || TrialService.isInTrial());
        
        if (userHasFullAccess) {
          // Premium users and trial users get FULL question sets from Firestore
          console.log(`🎯 Premium/Trial access detected for bundle: ${bundleId}`);
          console.log(`🔥 Fetching full question set from Firestore...`);
          
          try {
            // Try to get questions from Firestore first
            quizQuestions = await FirestoreQuestionService.getQuestionsFromFirestore(bundleId);
            console.log(`✅ Retrieved ${quizQuestions.length} questions for ${bundleId} from Firestore`);
            
            if (quizQuestions.length === 0) {
              console.warn(`⚠️ No questions found in Firestore, falling back to enhanced quiz`);
              quizQuestions = EnhancedQuizService.generateQuickQuiz(100);
            }
          } catch (error) {
            console.error(`❌ Error fetching questions from Firestore:`, error);
            console.log(`🔄 Falling back to local question generation`);
            quizQuestions = FullQuestionService.generateFullQuestions(bundleId);
            
            if (quizQuestions.length === 0) {
              quizQuestions = EnhancedQuizService.generateQuickQuiz(100);
            }
          }
        } else {
          // Free users and unauthenticated users get sample questions only
          console.log(`🔒 Free access for bundle: ${bundleId}, generating sample questions`);
          quizQuestions = EnhancedQuizService.generateBundleSampleQuiz(bundleId, 10);
          
          if (quizQuestions.length === 0) {
            // Fallback to enhanced quick quiz with 33 AP-level questions
            quizQuestions = EnhancedQuizService.generateQuickQuiz(33);
          }
        }
      } else {
        // Determine question count based on user access level for general quiz
        const userHasFullAccess = user && (isPremiumUser || TrialService.isInTrial());
        
        if (userHasFullAccess) {
          // Premium users and trial users get full 100 questions
          console.log(`🎯 Premium/Trial access detected for general quiz`);
          quizQuestions = EnhancedQuizService.generateQuickQuiz(100);
        } else {
          // Free users and unauthenticated users get 33 questions
          console.log(`🔒 Free access for general quiz`);
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
  }, [bundleId]); // Only depend on bundleId, not on startQuiz or other functions

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
    </div>
  );
};

export default QuizScreen;
