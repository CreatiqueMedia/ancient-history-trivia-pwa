import React, { createContext } from 'react';
import { Question, QuizState, QuestionResult, QuizResult } from '../types';
import { DailyChallengeService } from '../services/DailyChallengeService';

interface QuizContextType {
  currentQuiz: QuizState | null;
  startQuiz: (questions: Question[]) => void;
  selectAnswer: (answerIndex: number) => void;
  nextQuestion: () => void;
  finishQuiz: () => QuizResult | null;
  resetQuiz: () => void;
}

const QuizContext = createContext<QuizContextType | undefined>(undefined);

interface QuizProviderState {
  currentQuiz: QuizState | null;
  questions: Question[];
}

export class QuizProvider extends React.Component<
  { children: React.ReactNode },
  QuizProviderState
> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = {
      currentQuiz: null,
      questions: []
    };
  }

  startQuiz = (quizQuestions: Question[]) => {
    this.setState({
      questions: quizQuestions,
      currentQuiz: {
        currentQuestionIndex: 0,
        selectedAnswer: null,
        showAnswer: false,
        timeRemaining: 90, // Increased to 90 seconds per question
        isCompleted: false,
        results: [],
        startTime: new Date()
      }
    });
  };

  selectAnswer = (answerIndex: number) => {
    this.setState(prevState => {
      const { currentQuiz } = prevState;
      if (!currentQuiz || currentQuiz.showAnswer) return prevState;
      
      return {
        ...prevState,
        currentQuiz: {
          ...currentQuiz,
          selectedAnswer: answerIndex,
          showAnswer: true
        }
      };
    });
  };

  nextQuestion = () => {
    this.setState(prevState => {
      const { currentQuiz, questions } = prevState;
      if (!currentQuiz || !questions.length) return prevState;

      const currentQuestion = questions[currentQuiz.currentQuestionIndex];
      const isCorrect = currentQuiz.selectedAnswer === currentQuestion.correctAnswer;
      
      const questionResult: QuestionResult = {
        questionId: currentQuestion.id,
        isCorrect,
        selectedAnswer: currentQuiz.selectedAnswer || -1,
        timeSpent: 90 - currentQuiz.timeRemaining
      };

      const newResults = [...currentQuiz.results, questionResult];
      const nextIndex = currentQuiz.currentQuestionIndex + 1;

      if (nextIndex >= questions.length) {
        // Quiz completed
        return {
          ...prevState,
          currentQuiz: {
            ...currentQuiz,
            isCompleted: true,
            results: newResults
          }
        };
      } else {
        // Next question
        return {
          ...prevState,
          currentQuiz: {
            ...currentQuiz,
            currentQuestionIndex: nextIndex,
            selectedAnswer: null,
            showAnswer: false,
            timeRemaining: 90, // Reset to 90 seconds for next question
            results: newResults
          }
        };
      }
    });
  };

  finishQuiz = (): QuizResult | null => {
    const { currentQuiz, questions } = this.state;
    if (!currentQuiz || !questions.length) return null;

    const correctAnswers = currentQuiz.results.filter(r => r.isCorrect).length;
    const totalQuestions = questions.length;
    const score = Math.round((correctAnswers / totalQuestions) * 100);
    const timeSpent = Math.round((Date.now() - currentQuiz.startTime.getTime()) / 1000);

    // Determine bundle ID from current URL or context
    let bundleId = 'default';
    try {
      const currentPath = window.location.pathname;
      if (currentPath.includes('/quiz/daily-challenge')) {
        bundleId = 'daily-challenge';
        
        // Complete the daily challenge if this is a daily challenge quiz
        DailyChallengeService.completeDailyChallenge(score);
      } else if (currentPath.includes('/quiz/')) {
        const pathParts = currentPath.split('/');
        bundleId = pathParts[pathParts.length - 1] || 'default';
      }
    } catch (error) {
      console.error('Error determining bundle ID:', error);
    }

    const result: QuizResult = {
      score,
      totalQuestions,
      correctAnswers,
      incorrectAnswers: totalQuestions - correctAnswers,
      timeSpent,
      questionResults: currentQuiz.results,
      completedAt: new Date(),
      bundleId
    };

    return result;
  };

  resetQuiz = () => {
    this.setState({
      currentQuiz: null,
      questions: []
    });
  };

  render() {
    const contextValue: QuizContextType = {
      currentQuiz: this.state.currentQuiz,
      startQuiz: this.startQuiz,
      selectAnswer: this.selectAnswer,
      nextQuestion: this.nextQuestion,
      finishQuiz: this.finishQuiz,
      resetQuiz: this.resetQuiz
    };

    return (
      <QuizContext.Provider value={contextValue}>
        {this.props.children}
      </QuizContext.Provider>
    );
  }
}

export function useQuiz() {
  const context = React.useContext(QuizContext);
  if (context === undefined) {
    throw new Error('useQuiz must be used within a QuizProvider');
  }
  return context;
}
