import React, { createContext, useContext, useState, useCallback } from 'react';
import { Question, QuizState, QuestionResult, QuizResult } from '../types';

interface QuizContextType {
  currentQuiz: QuizState | null;
  startQuiz: (questions: Question[]) => void;
  selectAnswer: (answerIndex: number) => void;
  nextQuestion: () => void;
  finishQuiz: () => QuizResult | null;
  resetQuiz: () => void;
}

const QuizContext = createContext<QuizContextType | undefined>(undefined);

export function QuizProvider({ children }: { children: React.ReactNode }) {
  const [currentQuiz, setCurrentQuiz] = useState<QuizState | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);

  const startQuiz = useCallback((quizQuestions: Question[]) => {
    setQuestions(quizQuestions);
    setCurrentQuiz({
      currentQuestionIndex: 0,
      selectedAnswer: null,
      showAnswer: false,
      timeRemaining: 90, // Increased to 90 seconds per question
      isCompleted: false,
      results: [],
      startTime: new Date()
    });
  }, []);

  const selectAnswer = useCallback((answerIndex: number) => {
    setCurrentQuiz(prev => {
      if (!prev || prev.showAnswer) return prev;
      
      return {
        ...prev,
        selectedAnswer: answerIndex,
        showAnswer: true
      };
    });
  }, []);

  const nextQuestion = useCallback(() => {
    setCurrentQuiz(prev => {
      if (!prev || !questions.length) return prev;

      const currentQuestion = questions[prev.currentQuestionIndex];
      const isCorrect = prev.selectedAnswer === currentQuestion.correctAnswer;
      
      const questionResult: QuestionResult = {
        questionId: currentQuestion.id,
        isCorrect,
        selectedAnswer: prev.selectedAnswer || -1,
        timeSpent: 90 - prev.timeRemaining
      };

      const newResults = [...prev.results, questionResult];
      const nextIndex = prev.currentQuestionIndex + 1;

      if (nextIndex >= questions.length) {
        // Quiz completed
        return {
          ...prev,
          isCompleted: true,
          results: newResults
        };
      } else {
        // Next question
        return {
          ...prev,
          currentQuestionIndex: nextIndex,
          selectedAnswer: null,
          showAnswer: false,
          timeRemaining: 90, // Reset to 90 seconds for next question
          results: newResults
        };
      }
    });
  }, [questions]);

  const finishQuiz = useCallback((): QuizResult | null => {
    if (!currentQuiz || !questions.length) return null;

    const correctAnswers = currentQuiz.results.filter(r => r.isCorrect).length;
    const totalQuestions = questions.length;
    const score = Math.round((correctAnswers / totalQuestions) * 100);
    const timeSpent = Math.round((Date.now() - currentQuiz.startTime.getTime()) / 1000);

    const result: QuizResult = {
      score,
      totalQuestions,
      correctAnswers,
      incorrectAnswers: totalQuestions - correctAnswers,
      timeSpent,
      questionResults: currentQuiz.results,
      completedAt: new Date(),
      bundleId: 'default' // This would come from the selected bundle
    };

    return result;
  }, [currentQuiz, questions]);

  const resetQuiz = useCallback(() => {
    setCurrentQuiz(null);
    setQuestions([]);
  }, []);

  return (
    <QuizContext.Provider value={{
      currentQuiz,
      startQuiz,
      selectAnswer,
      nextQuestion,
      finishQuiz,
      resetQuiz
    }}>
      {children}
    </QuizContext.Provider>
  );
}

export function useQuiz() {
  const context = useContext(QuizContext);
  if (context === undefined) {
    throw new Error('useQuiz must be used within a QuizProvider');
  }
  return context;
}
