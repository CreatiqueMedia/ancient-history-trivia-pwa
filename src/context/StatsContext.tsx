import React, { createContext, useContext, useEffect, useState } from 'react';
import { UserStats, QuizResult, AchievementType } from '../types';

interface StatsContextType {
  stats: UserStats;
  achievements: AchievementType[];
  updateStats: (result: QuizResult) => void;
  resetStats: () => void;
  unlockAchievement: (achievementId: string) => void;
  updateAchievementProgress: (achievementId: string, progress: number) => void;
}

// Daily Challenge Achievements
const dailyChallengeAchievements: AchievementType[] = [
  {
    id: 'daily_starter',
    title: 'Daily Scholar',
    description: 'Complete your first daily challenge',
    icon: 'calendar-days',
    iconColor: '#0891B2',
    backgroundColor: '#CFFAFE',
    requirement: 'Complete 1 daily challenge',
    unlocked: false
  },
  {
    id: 'daily_streak_3',
    title: 'History Streak',
    description: 'Complete daily challenges 3 days in a row',
    icon: 'fire',
    iconColor: '#F97316',
    backgroundColor: '#FFEDD5',
    requirement: '3-day streak of daily challenges',
    unlocked: false
  },
  {
    id: 'streak_7',
    title: 'Weekly Scholar',
    description: 'Complete daily challenges 7 days in a row',
    icon: 'calendar-days',
    iconColor: '#D946EF',
    backgroundColor: '#FAE8FF',
    requirement: '7-day streak of daily challenges',
    unlocked: false,
    progress: 0,
    maxProgress: 7
  }
];

// Category-based Achievements
const categoryAchievements: AchievementType[] = [
  {
    id: 'egyptian_master',
    title: 'Egyptian Master',
    description: 'Answer 20 Egyptian questions correctly',
    icon: 'sun',
    iconColor: '#F59E0B',
    backgroundColor: '#FEF3C7',
    requirement: '20 correct Egyptian answers',
    unlocked: false,
    progress: 0,
    maxProgress: 20
  },
  {
    id: 'greek_master',
    title: 'Greek Master',
    description: 'Answer 20 Greek questions correctly',
    icon: 'building-columns',
    iconColor: '#10B981',
    backgroundColor: '#D1FAE5',
    requirement: '20 correct Greek answers',
    unlocked: false,
    progress: 0,
    maxProgress: 20
  },
  {
    id: 'roman_master',
    title: 'Roman Master',
    description: 'Answer 20 Roman questions correctly',
    icon: 'shield-check',
    iconColor: '#EF4444',
    backgroundColor: '#FEE2E2',
    requirement: '20 correct Roman answers',
    unlocked: false,
    progress: 0,
    maxProgress: 20
  },
  {
    id: 'mesopotamian_master',
    title: 'Mesopotamian Master',
    description: 'Answer 20 Mesopotamian questions correctly',
    icon: 'water',
    iconColor: '#8B5CF6',
    backgroundColor: '#EDE9FE',
    requirement: '20 correct Mesopotamian answers',
    unlocked: false,
    progress: 0,
    maxProgress: 20
  },
  {
    id: 'chinese_master',
    title: 'Chinese Master',
    description: 'Answer 20 Chinese questions correctly',
    icon: 'building-office-2',
    iconColor: '#3B82F6',
    backgroundColor: '#DBEAFE',
    requirement: '20 correct Chinese answers',
    unlocked: false,
    progress: 0,
    maxProgress: 20
  },
  {
    id: 'other_master',
    title: 'Other Master',
    description: 'Answer 20 Other questions correctly',
    icon: 'globe-americas',
    iconColor: '#6B7280',
    backgroundColor: '#F3F4F6',
    requirement: '20 correct Other answers',
    unlocked: false,
    progress: 0,
    maxProgress: 20
  }
];

// Difficulty-based Achievements
const difficultyAchievements: AchievementType[] = [
  {
    id: 'easy_hero',
    title: 'Easy Mode Hero',
    description: 'Answer 20 Easy questions correctly',
    icon: 'face-smile',
    iconColor: '#FBBF24',
    backgroundColor: '#FEF3C7',
    requirement: '20 correct Easy answers',
    unlocked: false,
    progress: 0,
    maxProgress: 20
  },
  {
    id: 'medium_hero',
    title: 'Medium Mode Hero',
    description: 'Answer 20 Medium questions correctly',
    icon: 'trophy',
    iconColor: '#6366F1',
    backgroundColor: '#E0E7FF',
    requirement: '20 correct Medium answers',
    unlocked: false,
    progress: 0,
    maxProgress: 20
  },
  {
    id: 'hard_hero',
    title: 'Hard Mode Hero',
    description: 'Answer 20 Hard questions correctly',
    icon: 'fire',
    iconColor: '#EF4444',
    backgroundColor: '#FEE2E2',
    requirement: '20 correct Hard answers',
    unlocked: false,
    progress: 0,
    maxProgress: 20
  }
];

const defaultAchievements: AchievementType[] = [
  {
    id: 'first_quiz',
    title: 'First Steps',
    description: 'Complete your first quiz',
    icon: 'flag',
    iconColor: '#10B981',
    backgroundColor: '#D1FAE5',
    requirement: 'Complete 1 quiz',
    unlocked: false
  },
  {
    id: 'perfect_score',
    title: 'Perfect Scholar',
    description: 'Get a perfect score on a quiz',
    icon: 'star',
    iconColor: '#FBBF24',
    backgroundColor: '#FEF3C7',
    requirement: 'Get 100% on any quiz',
    unlocked: false
  },
  {
    id: 'streak_3',
    title: 'Knowledge Streak',
    description: 'Answer 3 questions correctly in a row',
    icon: 'bolt',
    iconColor: '#F59E0B',
    backgroundColor: '#FEF3C7',
    requirement: '3 correct answers in sequence',
    unlocked: false
  },
  {
    id: 'quiz_master',
    title: 'Quiz Master',
    description: 'Complete 10 quizzes',
    icon: 'academic-cap',
    iconColor: '#8B5CF6',
    backgroundColor: '#EDE9FE',
    requirement: 'Complete 10 quizzes',
    unlocked: false,
    progress: 0,
    maxProgress: 10
  },
  {
    id: 'speed_demon',
    title: 'Speed Demon',
    description: 'Complete a quiz in under 60 seconds',
    icon: 'clock',
    iconColor: '#EF4444',
    backgroundColor: '#FEE2E2',
    requirement: 'Complete quiz in under 60 seconds',
    unlocked: false
  },
  {
    id: 'bookworm',
    title: 'Ancient Bookworm',
    description: 'Bookmark 5 questions for later study',
    icon: 'bookmark',
    iconColor: '#EC4899',
    backgroundColor: '#FCE7F3',
    requirement: 'Bookmark 5 questions',
    unlocked: false,
    progress: 0,
    maxProgress: 5
  },
  {
    id: 'history_buff',
    title: 'History Buff',
    description: 'Answer 50 questions correctly',
    icon: 'book-open',
    iconColor: '#6366F1',
    backgroundColor: '#E0E7FF',
    requirement: 'Get 50 correct answers total',
    unlocked: false,
    progress: 0,
    maxProgress: 50
  },
  {
    id: 'challenge_accepted',
    title: 'Challenge Accepted',
    description: 'Complete a challenge mode quiz',
    icon: 'fire',
    iconColor: '#7C3AED',
    backgroundColor: '#EDE9FE',
    requirement: 'Finish 1 challenge mode quiz',
    unlocked: false
  },
  ...dailyChallengeAchievements,
  ...categoryAchievements,
  ...difficultyAchievements
];

const defaultStats: UserStats = {
  totalQuizzes: 0,
  totalQuestions: 0,
  correctAnswers: 0,
  averageScore: 0,
  streakCurrent: 0,
  streakBest: 0,
  timeSpent: 0,
  lastPlayed: null,
  achievements: [],
  categoryStats: {},
  difficultyStats: {}
};

const StatsContext = createContext<StatsContextType | undefined>(undefined);

export function StatsProvider({ children }: { children: React.ReactNode }) {
  const [stats, setStats] = useState<UserStats>(() => {
    try {
      const saved = localStorage.getItem('userStats');
      if (saved) {
        const parsed = JSON.parse(saved);
        return {
          ...defaultStats,
          ...parsed,
          lastPlayed: parsed.lastPlayed ? new Date(parsed.lastPlayed) : null
        };
      }
      return defaultStats;
    } catch {
      return defaultStats;
    }
  });

  const [achievements, setAchievements] = useState<AchievementType[]>(() => {
    try {
      const saved = localStorage.getItem('achievements');
      if (saved) {
        return JSON.parse(saved);
      }
      return defaultAchievements;
    } catch {
      return defaultAchievements;
    }
  });

  useEffect(() => {
    localStorage.setItem('userStats', JSON.stringify(stats));
  }, [stats]);

  useEffect(() => {
    localStorage.setItem('achievements', JSON.stringify(achievements));
  }, [achievements]);

  const unlockAchievement = (achievementId: string) => {
    setAchievements(prev => 
      prev.map(achievement => 
        achievement.id === achievementId 
          ? { ...achievement, unlocked: true }
          : achievement
      )
    );
  };

  const updateAchievementProgress = (achievementId: string, progress: number) => {
    setAchievements(prev => 
      prev.map(achievement => 
        achievement.id === achievementId 
          ? { 
              ...achievement, 
              progress,
              unlocked: achievement.maxProgress ? progress >= achievement.maxProgress : achievement.unlocked 
            }
          : achievement
      )
    );
  };

  const checkAchievements = (result: QuizResult, newStats: UserStats) => {
    // Check first quiz
    if (newStats.totalQuizzes === 1) {
      unlockAchievement('first_quiz');
    }

    // Check perfect score
    if (result.score === 100) {
      unlockAchievement('perfect_score');
    }

    // Check quiz master (10 quizzes)
    updateAchievementProgress('quiz_master', newStats.totalQuizzes);

    // Check speed demon (under 60 seconds)
    if (result.timeSpent < 60) {
      unlockAchievement('speed_demon');
    }

    // Check history buff (50 correct answers)
    updateAchievementProgress('history_buff', newStats.correctAnswers);

    // Category achievements - simplified for now
    // In a real implementation, you'd track category-specific correct answers
    Object.entries(newStats.categoryStats).forEach(([category, categoryData]) => {
      const categoryAchievementMap: { [key: string]: string } = {
        'ancient-egypt': 'egyptian_master',
        'ancient-greece': 'greek_master',
        'ancient-rome': 'roman_master',
        'mesopotamia': 'mesopotamian_master',
        'ancient-china': 'chinese_master'
      };
      
      const achievementId = categoryAchievementMap[category];
      if (achievementId) {
        updateAchievementProgress(achievementId, categoryData.correctAnswers);
      }
    });
  };

  const updateStats = (result: QuizResult) => {
    setStats(prev => {
      const newTotalQuestions = prev.totalQuestions + result.totalQuestions;
      const newCorrectAnswers = prev.correctAnswers + result.correctAnswers;
      const newTotalQuizzes = prev.totalQuizzes + 1;
      const newAverageScore = (newCorrectAnswers / newTotalQuestions) * 100;
      
      // Update streak
      const isPerfectScore = result.score === 100;
      const newStreakCurrent = isPerfectScore ? prev.streakCurrent + 1 : 0;
      const newStreakBest = Math.max(prev.streakBest, newStreakCurrent);

      // Update category stats
      const categoryStats = { ...prev.categoryStats };
      const category = result.questionResults[0]?.questionId.split('-')[0] || 'general';
      
      if (!categoryStats[category]) {
        categoryStats[category] = {
          totalQuestions: 0,
          correctAnswers: 0,
          averageScore: 0,
          lastPlayed: null
        };
      }
      
      categoryStats[category] = {
        totalQuestions: categoryStats[category].totalQuestions + result.totalQuestions,
        correctAnswers: categoryStats[category].correctAnswers + result.correctAnswers,
        averageScore: ((categoryStats[category].correctAnswers + result.correctAnswers) / 
                      (categoryStats[category].totalQuestions + result.totalQuestions)) * 100,
        lastPlayed: result.completedAt
      };

      // Update difficulty stats (simplified - using average difficulty)
      const difficultyStats = { ...prev.difficultyStats };
      const difficulty = 'medium'; // Default difficulty
      
      if (!difficultyStats[difficulty]) {
        difficultyStats[difficulty] = {
          totalQuestions: 0,
          correctAnswers: 0,
          averageScore: 0,
          lastPlayed: null
        };
      }
      
      difficultyStats[difficulty] = {
        totalQuestions: difficultyStats[difficulty].totalQuestions + result.totalQuestions,
        correctAnswers: difficultyStats[difficulty].correctAnswers + result.correctAnswers,
        averageScore: ((difficultyStats[difficulty].correctAnswers + result.correctAnswers) / 
                      (difficultyStats[difficulty].totalQuestions + result.totalQuestions)) * 100,
        lastPlayed: result.completedAt
      };

      const newStats = {
        totalQuizzes: newTotalQuizzes,
        totalQuestions: newTotalQuestions,
        correctAnswers: newCorrectAnswers,
        averageScore: newAverageScore,
        streakCurrent: newStreakCurrent,
        streakBest: newStreakBest,
        timeSpent: prev.timeSpent + result.timeSpent,
        lastPlayed: result.completedAt,
        achievements: prev.achievements,
        categoryStats,
        difficultyStats
      };

      // Check achievements after updating stats
      checkAchievements(result, newStats);

      return newStats;
    });
  };

  const resetStats = () => {
    setStats(defaultStats);
    setAchievements(defaultAchievements);
  };

  return (
    <StatsContext.Provider value={{ 
      stats, 
      achievements, 
      updateStats, 
      resetStats, 
      unlockAchievement, 
      updateAchievementProgress 
    }}>
      {children}
    </StatsContext.Provider>
  );
}

export function useStats() {
  const context = useContext(StatsContext);
  if (context === undefined) {
    throw new Error('useStats must be used within a StatsProvider');
  }
  return context;
}
