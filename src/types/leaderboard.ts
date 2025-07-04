export interface LeaderboardEntry {
  id: string;
  userId: string;
  username: string;
  displayName: string;
  avatar?: string;
  totalScore: number;
  totalQuizzes: number;
  averageScore: number;
  winStreak: number;
  challengesWon: number;
  challengesLost: number;
  rank: number;
  lastActive: string;
  achievements: string[];
}

export interface Challenge {
  id: string;
  challengerId: string;
  challengerName: string;
  challengedId: string;
  challengedName: string;
  status: 'pending' | 'accepted' | 'declined' | 'in_progress' | 'completed' | 'expired';
  createdAt: string;
  acceptedAt?: string;
  completedAt?: string;
  expiresAt: string;
  questions: ChallengeQuestion[];
  challengerScore?: number;
  challengedScore?: number;
  winnerId?: string;
  category?: string;
  difficulty?: 'easy' | 'medium' | 'hard' | 'mixed';
}

export interface ChallengeQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
  difficulty: 'easy' | 'medium' | 'hard';
  category: string;
  timeLimit: number; // seconds
}

export interface ChallengeResult {
  challengeId: string;
  userId: string;
  answers: ChallengeAnswer[];
  score: number;
  completedAt: string;
  timeSpent: number; // total seconds
}

export interface ChallengeAnswer {
  questionId: string;
  selectedAnswer: number;
  isCorrect: boolean;
  timeSpent: number; // seconds for this question
}

export interface ChallengeNotification {
  id: string;
  type: 'challenge_received' | 'challenge_accepted' | 'challenge_declined' | 'challenge_completed';
  fromUserId: string;
  fromUserName: string;
  challengeId: string;
  message: string;
  createdAt: string;
  read: boolean;
}

export interface LeaderboardFilters {
  timeframe: 'all_time' | 'this_month' | 'this_week' | 'today';
  category?: string;
  minQuizzes?: number;
}
