// Enhanced Quiz Component with Purchase Content Integration
// Shows sample questions for free users, full 100 questions for purchased bundles

import React, { useState, useEffect } from 'react';
import { purchaseContentDeliveryService } from '../services/PurchaseContentDeliveryService';
import { mockWebhookEndpoint } from '../api/webhookEndpoint';
import { Question } from '../types';
import { auth } from '../config/firebase';

interface EnhancedQuizProps {
  bundleId: string;
  onClose: () => void;
}

interface QuizState {
  questions: Question[];
  currentIndex: number;
  selectedAnswer: number | null;
  showAnswer: boolean;
  score: number;
  isComplete: boolean;
  timeRemaining: number;
}

interface PurchaseStatus {
  purchased: boolean;
  questionCount: number;
  loading: boolean;
}

export const EnhancedQuiz: React.FC<EnhancedQuizProps> = ({ bundleId, onClose }) => {
  const [purchaseStatus, setPurchaseStatus] = useState<PurchaseStatus>({
    purchased: false,
    questionCount: 0,
    loading: true
  });
  
  const [quizState, setQuizState] = useState<QuizState>({
    questions: [],
    currentIndex: 0,
    selectedAnswer: null,
    showAnswer: false,
    score: 0,
    isComplete: false,
    timeRemaining: 30
  });

  const [showPurchasePrompt, setShowPurchasePrompt] = useState(false);

  // Load quiz data and check purchase status
  useEffect(() => {
    loadQuizData();
    
    // Listen for purchase completion
    const handlePurchaseComplete = () => {
      console.log('🎉 Purchase complete! Reloading quiz...');
      loadQuizData();
    };

    window.addEventListener('purchaseContentReady', handlePurchaseComplete);
    
    return () => {
      window.removeEventListener('purchaseContentReady', handlePurchaseComplete);
    };
  }, [bundleId]);

  // Timer effect
  useEffect(() => {
    if (quizState.timeRemaining > 0 && !quizState.showAnswer && !quizState.isComplete) {
      const timer = setTimeout(() => {
        setQuizState(prev => ({ ...prev, timeRemaining: prev.timeRemaining - 1 }));
      }, 1000);
      return () => clearTimeout(timer);
    } else if (quizState.timeRemaining === 0 && !quizState.showAnswer) {
      handleAnswerSubmit();
    }
  }, [quizState.timeRemaining, quizState.showAnswer, quizState.isComplete]);

  const loadQuizData = async () => {
    setPurchaseStatus(prev => ({ ...prev, loading: true }));
    
    try {
      // Check if user has purchased this bundle
      const isPurchased = await purchaseContentDeliveryService.isPurchased(bundleId);
      
      // Get questions (sample or full based on purchase)
      const questions = await purchaseContentDeliveryService.getQuestions(bundleId);
      
      setPurchaseStatus({
        purchased: isPurchased,
        questionCount: questions.length,
        loading: false
      });

      setQuizState(prev => ({
        ...prev,
        questions,
        currentIndex: 0,
        selectedAnswer: null,
        showAnswer: false,
        score: 0,
        isComplete: false,
        timeRemaining: 30
      }));

      console.log(`📊 Loaded ${questions.length} questions (purchased: ${isPurchased})`);
      
    } catch (error) {
      console.error('❌ Error loading quiz data:', error);
      setPurchaseStatus(prev => ({ ...prev, loading: false }));
    }
  };

  const handleAnswerSelect = (answerIndex: number) => {
    if (!quizState.showAnswer) {
      setQuizState(prev => ({ ...prev, selectedAnswer: answerIndex }));
    }
  };

  const handleAnswerSubmit = () => {
    if (quizState.selectedAnswer === null && quizState.timeRemaining > 0) return;

    const currentQuestion = quizState.questions[quizState.currentIndex];
    const isCorrect = quizState.selectedAnswer === currentQuestion.correctAnswer;

    setQuizState(prev => ({
      ...prev,
      showAnswer: true,
      score: isCorrect ? prev.score + 1 : prev.score
    }));
  };

  const handleNextQuestion = () => {
    const nextIndex = quizState.currentIndex + 1;
    
    if (nextIndex >= quizState.questions.length) {
      // Quiz complete
      setQuizState(prev => ({ ...prev, isComplete: true }));
      
      // Show purchase prompt if user completed sample questions
      if (!purchaseStatus.purchased) {
        setShowPurchasePrompt(true);
      }
    } else {
      setQuizState(prev => ({
        ...prev,
        currentIndex: nextIndex,
        selectedAnswer: null,
        showAnswer: false,
        timeRemaining: 30
      }));
    }
  };

  const handleTestPurchase = async () => {
    const user = auth.currentUser;
    if (!user) {
      alert('Please log in to test purchase');
      return;
    }

    try {
      console.log('🧪 Testing purchase flow...');
      await mockWebhookEndpoint(bundleId, user.uid);
      alert('✅ Test purchase completed! Quiz will reload with 100 questions.');
    } catch (error) {
      console.error('❌ Test purchase failed:', error);
      alert('❌ Test purchase failed. Check console for details.');
    }
  };

  const getBundleName = (bundleId: string): string => {
    const nameMap: Record<string, string> = {
      'region_pack_egypt': 'Ancient Egypt',
      'region_pack_rome': 'Roman Empire',
      'region_pack_greece': 'Ancient Greece',
      'region_pack_mesopotamia': 'Mesopotamia',
      'region_pack_china': 'Ancient China'
    };
    return nameMap[bundleId] || bundleId.replace('_pack', '').replace('_', ' ');
  };

  if (purchaseStatus.loading) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-8 max-w-md w-full mx-4">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Loading Quiz</h3>
            <p className="text-gray-600">Checking your access and loading questions...</p>
          </div>
        </div>
      </div>
    );
  }

  if (quizState.questions.length === 0) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-8 max-w-md w-full mx-4">
          <div className="text-center">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">No Questions Available</h3>
            <p className="text-gray-600 mb-6">
              No questions found for {getBundleName(bundleId)}. Please try another bundle.
            </p>
            <button
              onClick={onClose}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    );
  }

  const currentQuestion = quizState.questions[quizState.currentIndex];
  const progressPercent = ((quizState.currentIndex + 1) / quizState.questions.length) * 100;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        
        {/* Header */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">
                {getBundleName(bundleId)} Quiz
              </h2>
              <div className="mt-2">
                {!purchaseStatus.purchased ? (
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                    <div className="flex items-center">
                      <div className="bg-blue-100 rounded-full p-1 mr-2">
                        <span className="text-blue-600 text-xs font-semibold">SAMPLE</span>
                      </div>
                      <span className="text-blue-700 text-sm">
                        Playing with {purchaseStatus.questionCount} sample questions
                      </span>
                    </div>
                  </div>
                ) : (
                  <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                    <div className="flex items-center">
                      <div className="bg-green-100 rounded-full p-1 mr-2">
                        <span className="text-green-600 text-xs font-semibold">FULL</span>
                      </div>
                      <span className="text-green-700 text-sm">
                        Full access: {purchaseStatus.questionCount} questions available
                      </span>
                    </div>
                  </div>
                )}
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 text-2xl"
            >
              ×
            </button>
          </div>

          {/* Progress Bar */}
          <div className="mb-4">
            <div className="flex justify-between text-sm text-gray-600 mb-2">
              <span>Question {quizState.currentIndex + 1} of {quizState.questions.length}</span>
              <span>Score: {quizState.score}/{quizState.currentIndex + (quizState.showAnswer ? 1 : 0)}</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${progressPercent}%` }}
              ></div>
            </div>
          </div>

          {/* Timer */}
          {!quizState.showAnswer && !quizState.isComplete && (
            <div className="text-center">
              <div className={`inline-block px-4 py-2 rounded-lg font-semibold ${
                quizState.timeRemaining <= 10 ? 'bg-red-100 text-red-700' : 'bg-gray-100 text-gray-700'
              }`}>
                Time: {quizState.timeRemaining}s
              </div>
            </div>
          )}
        </div>

        {/* Question Content */}
        {!quizState.isComplete ? (
          <div className="p-6">
            <div className="mb-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">
                {currentQuestion.question}
              </h3>
              
              <div className="space-y-3">
                {currentQuestion.options.map((option, index) => (
                  <button
                    key={index}
                    onClick={() => handleAnswerSelect(index)}
                    disabled={quizState.showAnswer}
                    className={`w-full text-left p-4 rounded-lg border-2 transition-all ${
                      quizState.selectedAnswer === index
                        ? quizState.showAnswer
                          ? index === currentQuestion.correctAnswer
                            ? 'border-green-500 bg-green-50 text-green-700'
                            : 'border-red-500 bg-red-50 text-red-700'
                          : 'border-blue-500 bg-blue-50'
                        : quizState.showAnswer && index === currentQuestion.correctAnswer
                        ? 'border-green-500 bg-green-50 text-green-700'
                        : 'border-gray-200 hover:border-gray-300'
                    } ${quizState.showAnswer ? 'cursor-default' : 'cursor-pointer'}`}
                  >
                    <span className="font-medium mr-3">{String.fromCharCode(65 + index)}.</span>
                    {option}
                  </button>
                ))}
              </div>
            </div>

            {/* Answer Explanation */}
            {quizState.showAnswer && currentQuestion.explanation && (
              <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                <h4 className="font-semibold text-gray-900 mb-2">Explanation:</h4>
                <p className="text-gray-700">{currentQuestion.explanation}</p>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex justify-center space-x-4">
              {!quizState.showAnswer ? (
                <button
                  onClick={handleAnswerSubmit}
                  disabled={quizState.selectedAnswer === null}
                  className="bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed"
                >
                  Submit Answer
                </button>
              ) : (
                <button
                  onClick={handleNextQuestion}
                  className="bg-green-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-green-700"
                >
                  {quizState.currentIndex + 1 >= quizState.questions.length ? 'Finish Quiz' : 'Next Question'}
                </button>
              )}
            </div>
          </div>
        ) : (
          /* Quiz Complete */
          <div className="p-6 text-center">
            <div className="mb-6">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                🎉 Quiz Complete!
              </h3>
              <div className="text-6xl font-bold text-blue-600 mb-2">
                {Math.round((quizState.score / quizState.questions.length) * 100)}%
              </div>
              <p className="text-xl text-gray-700">
                You scored {quizState.score} out of {quizState.questions.length} questions
              </p>
            </div>

            {/* Purchase Prompt for Free Users */}
            {showPurchasePrompt && !purchaseStatus.purchased && (
              <div className="bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-lg p-6 mb-6">
                <h4 className="text-lg font-semibold text-gray-900 mb-2">
                  🔓 Unlock the Full Experience!
                </h4>
                <p className="text-gray-700 mb-4">
                  You just completed {purchaseStatus.questionCount} sample questions. 
                  Unlock all 100 questions for the complete {getBundleName(bundleId)} experience!
                </p>
                <div className="space-y-3">
                  <button
                    onClick={handleTestPurchase}
                    className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-3 rounded-lg font-semibold hover:from-blue-700 hover:to-purple-700"
                  >
                    🧪 Test Purchase (Dev Mode) - Unlock 100 Questions
                  </button>
                  <p className="text-xs text-gray-500">
                    * In production, this would redirect to Stripe checkout for $2.99
                  </p>
                </div>
              </div>
            )}

            <div className="space-x-4">
              <button
                onClick={() => window.location.reload()}
                className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
              >
                Try Again
              </button>
              <button
                onClick={onClose}
                className="bg-gray-600 text-white px-6 py-2 rounded-lg hover:bg-gray-700"
              >
                Close
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default EnhancedQuiz;
