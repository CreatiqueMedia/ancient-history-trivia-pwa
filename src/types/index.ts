export interface Question {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  difficulty: 'easy' | 'medium' | 'hard';
  category: string;
  region: string;
  period: string;
  explanation?: string;
  tags?: string[];
}

export interface QuizState {
  currentQuestionIndex: number;
  selectedAnswer: number | null;
  showAnswer: boolean;
  timeRemaining: number;
  isCompleted: boolean;
  results: QuestionResult[];
  startTime: Date;
}

export interface QuestionBundle {
  id: string;
  name: string;
  description: string;
  questions: Question[];
  difficulty: 'easy' | 'medium' | 'hard';
  category: string;
  region: string;
  period: string;
  isPremium: boolean;
  price?: number;
  icon?: string;
}

export interface QuizResult {
  score: number;
  totalQuestions: number;
  correctAnswers: number;
  incorrectAnswers: number;
  timeSpent: number;
  questionResults: QuestionResult[];
  completedAt: Date;
  bundleId: string;
}

export interface QuestionResult {
  questionId: string;
  isCorrect: boolean;
  selectedAnswer: number;
  timeSpent: number;
}

// Enhanced User System
export interface UserProfile {
  id: string;
  email: string;
  displayName: string;
  photoURL?: string;
  provider: AuthProvider;
  subscription: SubscriptionTier;
  preferences: UserPreferences;
  createdAt: Date;
  lastActive: Date;
  isAnonymous: boolean;
}

export interface UserPreferences {
  theme: 'light' | 'dark' | 'system';
  soundEnabled: boolean;
  vibrationEnabled: boolean;
  autoAdvance: boolean;
  showExplanations: boolean;
  questionTimeLimit: number | null;
  language: string;
  accessibilityEnabled: boolean;
  fontSize: 'small' | 'medium' | 'large';
  notifications: NotificationPreferences;
}

export interface NotificationPreferences {
  dailyReminders: boolean;
  achievementUpdates: boolean;
  newContentAlerts: boolean;
  friendActivity: boolean;
  reminderTime: string; // HH:MM format
}

export type AuthProvider = 'google' | 'facebook' | 'apple' | 'email' | 'anonymous';

export type SubscriptionTier = 'free' | 'scholar' | 'historian' | 'academy';

export interface SubscriptionPlan {
  id: SubscriptionTier;
  name: string;
  price: number;
  period: 'monthly' | 'yearly' | 'lifetime';
  features: string[];
  trialDays?: number;
  popular?: boolean;
  savings?: string;
}

// Enhanced Achievement System
export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  category: AchievementCategory;
  tier: 'bronze' | 'silver' | 'gold' | 'platinum';
  requirements: AchievementRequirement[];
  rewards: AchievementReward[];
  isUnlocked: boolean;
  unlockedAt?: Date;
  progress: number;
  maxProgress: number;
  isSecret?: boolean;
}

export interface AchievementRequirement {
  type: 'quiz_count' | 'correct_answers' | 'streak' | 'category_mastery' | 'time_challenge';
  value: number;
  category?: string;
  difficulty?: 'easy' | 'medium' | 'hard';
}

export interface AchievementReward {
  type: 'xp' | 'badge' | 'title' | 'unlock_content';
  value: number | string;
}

export type AchievementCategory = 'daily' | 'mastery' | 'social' | 'exploration' | 'challenge';

// Social Features
export interface SocialProfile {
  userId: string;
  username: string;
  displayName: string;
  photoURL?: string;
  level: number;
  xp: number;
  achievements: string[];
  friends: string[];
  isOnline: boolean;
  lastSeen: Date;
}

export interface FriendRequest {
  id: string;
  fromUserId: string;
  toUserId: string;
  status: 'pending' | 'accepted' | 'declined';
  createdAt: Date;
}

export interface Challenge {
  id: string;
  name: string;
  description: string;
  type: 'friend' | 'daily' | 'weekly' | 'seasonal';
  category?: string;
  difficulty?: 'easy' | 'medium' | 'hard';
  participants: string[];
  startDate: Date;
  endDate: Date;
  rewards: ChallengeReward[];
  requirements: ChallengeRequirement[];
  leaderboard: LeaderboardEntry[];
  isActive: boolean;
}

export interface ChallengeRequirement {
  type: 'score' | 'time' | 'accuracy' | 'questions_answered';
  value: number;
}

export interface ChallengeReward {
  type: 'xp' | 'badge' | 'title' | 'premium_content';
  value: number | string;
  tier: 'participant' | 'bronze' | 'silver' | 'gold';
}

export interface LeaderboardEntry {
  userId: string;
  username: string;
  score: number;
  rank: number;
  photoURL?: string;
}

// Enhanced Stats
export interface UserStats {
  totalQuizzes: number;
  totalQuestions: number;
  correctAnswers: number;
  averageScore: number;
  streakCurrent: number;
  streakBest: number;
  timeSpent: number; // Changed from totalTimeSpent
  lastPlayed: Date | null;
  achievements: AchievementType[];
  categoryStats: { [key: string]: CategoryStats };
  difficultyStats: { [key: string]: DifficultyStats };
}

export interface CategoryStats {
  totalQuestions: number;
  correctAnswers: number;
  averageScore: number;
  lastPlayed: Date | null;
}

export interface DifficultyStats {
  totalQuestions: number;
  correctAnswers: number;
  averageScore: number;
  lastPlayed: Date | null;
}

export interface WeeklyStats {
  week: string; // ISO week string
  quizzes: number;
  questions: number;
  correctAnswers: number;
  timeSpent: number;
}

export interface MonthlyStats {
  month: string; // YYYY-MM format
  quizzes: number;
  questions: number;
  correctAnswers: number;
  timeSpent: number;
}

export interface Settings {
  theme: 'light' | 'dark' | 'system';
  soundEnabled: boolean;
  vibrationEnabled: boolean;
  autoAdvance: boolean;
  showExplanations: boolean;
  questionTimeLimit: number | null;
  language: string;
  accessibilityEnabled: boolean;
  fontSize: 'small' | 'medium' | 'large';
}

export interface AchievementType {
  id: string;
  title: string;
  description: string;
  icon: string; // Heroicons name
  iconColor: string;
  backgroundColor: string;
  requirement: string;
  unlocked: boolean;
  progress?: number;
  maxProgress?: number;
}
