// Enhanced types for UX improvements
import { LeaderboardEntry } from './index';

export interface DailyChallenge {
  id: string;
  date: string; // YYYY-MM-DD format
  questions: string[]; // Question IDs
  difficulty: 'easy' | 'medium' | 'hard';
  category: string;
  theme: string;
  rewards: DailyChallengeReward[];
  isCompleted: boolean;
  completedAt?: Date;
  score?: number;
}

export interface DailyChallengeReward {
  type: 'xp' | 'badge' | 'streak_bonus' | 'unlock_content';
  value: number | string;
  description: string;
}

export interface DailyChallengeStreak {
  current: number;
  best: number;
  lastCompletedDate: string; // YYYY-MM-DD format
  streakHistory: StreakEntry[];
}

export interface StreakEntry {
  date: string; // YYYY-MM-DD format
  completed: boolean;
  score?: number;
}

// Enhanced Question with rich explanations
export interface EnhancedQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  difficulty: 'easy' | 'medium' | 'hard';
  category: string;
  region: string;
  period: string;
  format?: 'Multiple Choice' | 'True/False' | 'Fill-in-the-Blank' | 'Mixed';
  tags?: string[];
  explanation: RichExplanation;
}

export interface RichExplanation {
  basic: string; // Simple explanation
  historical_context: string; // Detailed historical context
  images?: ExplanationImage[];
  learn_more_links?: LearnMoreLink[];
  related_topics?: string[];
  fun_facts?: string[];
}

export interface ExplanationImage {
  url: string;
  caption: string;
  alt_text: string;
  source?: string;
}

export interface LearnMoreLink {
  title: string;
  url: string;
  description: string;
  source: string; // e.g., "Wikipedia", "Britannica", etc.
}

// Free Trial System
export interface TrialStatus {
  isActive: boolean;
  startDate: Date;
  endDate: Date;
  daysRemaining: number;
  accessedBundles: string[];
  conversionOffered: boolean;
}

// Bundle Packages and Discounts
export interface BundlePackage {
  id: string;
  name: string;
  description: string;
  type: 'regional' | 'era' | 'special_interest' | 'difficulty';
  bundleIds: string[];
  originalPrice: number;
  discountedPrice: number;
  discountPercentage: number;
  isLimitedTime: boolean;
  expiresAt?: Date;
  icon: string;
  gradient: string;
  features: string[];
}

// Personalized Learning
export interface LearningPath {
  userId: string;
  currentLevel: number;
  masteryScores: { [category: string]: number }; // 0-100
  recommendedBundles: string[];
  adaptiveDifficulty: { [category: string]: 'easy' | 'medium' | 'hard' };
  learningGoals: LearningGoal[];
  progressHistory: LearningProgress[];
}

export interface LearningGoal {
  id: string;
  type: 'category_mastery' | 'difficulty_progression' | 'streak_maintenance';
  target: number;
  current: number;
  category?: string;
  deadline?: Date;
  isCompleted: boolean;
}

export interface LearningProgress {
  date: string; // YYYY-MM-DD
  category: string;
  questionsAnswered: number;
  correctAnswers: number;
  averageTime: number;
  difficultyLevel: 'easy' | 'medium' | 'hard';
}

// Community Features
export interface CommunityChallenge {
  id: string;
  name: string;
  description: string;
  type: 'weekly' | 'monthly' | 'special_event';
  category?: string;
  startDate: Date;
  endDate: Date;
  participants: CommunityParticipant[];
  leaderboard: LeaderboardEntry[];
  rewards: CommunityReward[];
  isActive: boolean;
  userParticipating: boolean;
}

export interface CommunityParticipant {
  userId: string;
  username: string;
  score: number;
  questionsAnswered: number;
  accuracy: number;
  joinedAt: Date;
}

export interface CommunityReward {
  rank: number;
  type: 'xp' | 'badge' | 'premium_content' | 'discount';
  value: number | string;
  description: string;
}

// Learning Modes
export type LearningMode = 'quiz' | 'study' | 'flashcard' | 'timeline' | 'map';

export interface StudySession {
  id: string;
  mode: LearningMode;
  bundleId: string;
  questions: string[];
  startTime: Date;
  endTime?: Date;
  progress: StudyProgress;
  settings: StudySettings;
}

export interface StudyProgress {
  currentIndex: number;
  completed: string[]; // Question IDs
  bookmarked: string[]; // Question IDs
  timeSpent: number; // seconds
}

export interface StudySettings {
  showExplanations: boolean;
  autoAdvance: boolean;
  timeLimit?: number;
  shuffleQuestions: boolean;
  repeatIncorrect: boolean;
}

// Timeline Mode specific
export interface TimelineEvent {
  id: string;
  title: string;
  date: string; // Can be year, date, or range
  description: string;
  category: string;
  region: string;
  importance: 'low' | 'medium' | 'high';
  relatedQuestions: string[];
}

// Map Mode specific
export interface MapLocation {
  id: string;
  name: string;
  coordinates: [number, number]; // [lat, lng]
  type: 'city' | 'region' | 'landmark' | 'battle_site';
  period: string;
  description: string;
  relatedQuestions: string[];
}

// Enhanced Achievements
export interface EnhancedAchievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  category: AchievementCategory;
  tier: 'bronze' | 'silver' | 'gold' | 'platinum' | 'legendary';
  requirements: AchievementRequirement[];
  rewards: AchievementReward[];
  isUnlocked: boolean;
  unlockedAt?: Date;
  progress: number;
  maxProgress: number;
  isSecret: boolean;
  rarity: 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary';
  shareableImage?: string;
}

export interface AchievementRequirement {
  type: 'quiz_count' | 'correct_answers' | 'streak' | 'category_mastery' | 'time_challenge' | 'social_interaction' | 'learning_mode';
  value: number;
  category?: string;
  difficulty?: 'easy' | 'medium' | 'hard';
  mode?: LearningMode;
}

export interface AchievementReward {
  type: 'xp' | 'badge' | 'title' | 'unlock_content' | 'discount' | 'premium_access';
  value: number | string;
  description: string;
}

export type AchievementCategory = 'daily' | 'mastery' | 'social' | 'exploration' | 'challenge' | 'learning' | 'community';

// Referral System
export interface ReferralProgram {
  userId: string;
  referralCode: string;
  referralsCount: number;
  successfulReferrals: ReferralEntry[];
  totalRewardsEarned: number;
  currentTier: ReferralTier;
  nextTierProgress: number;
}

export interface ReferralEntry {
  referredUserId: string;
  referredUsername: string;
  dateReferred: Date;
  rewardEarned: number;
  status: 'pending' | 'completed' | 'expired';
}

export interface ReferralTier {
  name: string;
  minReferrals: number;
  rewardMultiplier: number;
  bonusRewards: string[];
  icon: string;
}

// Offline Enhancement
export interface OfflineContent {
  bundleId: string;
  downloadedAt: Date;
  lastAccessedAt: Date;
  size: number; // bytes
  isComplete: boolean;
  priority: 'high' | 'medium' | 'low';
}

export interface OfflineSettings {
  autoDownload: boolean;
  wifiOnly: boolean;
  maxStorageSize: number; // MB
  preloadRecommended: boolean;
  keepRecentlyUsed: number; // days
}

// Bookmarks and Favorites
export interface BookmarkedExplanation {
  questionId: string;
  bundleId: string;
  bookmarkedAt: Date;
  notes?: string;
  tags?: string[];
}

// User Preferences Enhancement
export interface EnhancedUserPreferences {
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
  learningMode: LearningMode;
  dailyChallengeReminder: boolean;
  communityFeatures: boolean;
  dataUsage: 'minimal' | 'standard' | 'unlimited';
  offlineSettings: OfflineSettings;
}

export interface NotificationPreferences {
  dailyReminders: boolean;
  achievementUpdates: boolean;
  newContentAlerts: boolean;
  friendActivity: boolean;
  communityUpdates: boolean;
  trialReminders: boolean;
  reminderTime: string; // HH:MM format
}
