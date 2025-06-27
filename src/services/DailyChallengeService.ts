import { DailyChallenge, DailyChallengeStreak, DailyChallengeReward, StreakEntry } from '../types/enhancements';
import { Question } from '../types';
import { sampleQuestions } from '../data/questions';
import { analyticsService } from './AnalyticsService';
import { notificationService } from './NotificationService';

/**
 * Service for managing daily challenges and streaks
 * Creates habit-forming daily quizzes with rewards and streak tracking
 */
export class DailyChallengeService {
  private static readonly STORAGE_KEY = 'daily_challenge_data';
  private static readonly STREAK_KEY = 'daily_challenge_streak';
  private static readonly COMPLETED_KEY = 'daily_challenge_completed';

  /**
   * Get today's daily challenge
   */
  static getTodaysChallenge(): DailyChallenge {
    const today = this.getTodayString();
    const stored = this.getStoredChallenges();
    
    // Check if we already have today's challenge
    if (stored[today]) {
      return stored[today];
    }

    // Generate new challenge for today
    const challenge = this.generateDailyChallenge(today);
    
    // Store the challenge
    stored[today] = challenge;
    this.storeChallenges(stored);
    
    return challenge;
  }

  /**
   * Generate a new daily challenge for a specific date
   */
  private static generateDailyChallenge(date: string): DailyChallenge {
    const themes = [
      'Ancient Empires',
      'Legendary Rulers',
      'Cultural Achievements',
      'Military Conquests',
      'Religious Beliefs',
      'Technological Innovations',
      'Trade and Commerce',
      'Art and Architecture'
    ];

    const categories = ['Architecture', 'Politics', 'Philosophy', 'Culture', 'Religion', 'Geography', 'Law', 'Technology'];
    
    // Use date as seed for consistent daily challenges
    const seed = this.dateToSeed(date);
    const theme = themes[seed % themes.length];
    const category = categories[seed % categories.length];
    const difficulty = this.getDifficultyForDate(seed);

    // Select 5 questions for the daily challenge
    const selectedQuestions = this.selectQuestionsForChallenge(category, difficulty, 5, seed);

    const rewards: DailyChallengeReward[] = [
      {
        type: 'xp',
        value: 50,
        description: 'Daily Challenge XP'
      },
      {
        type: 'streak_bonus',
        value: 10,
        description: 'Streak Bonus XP'
      }
    ];

    // Add special rewards for certain days
    if (seed % 7 === 0) { // Weekly bonus
      rewards.push({
        type: 'badge',
        value: 'weekly_warrior',
        description: 'Weekly Warrior Badge'
      });
    }

    return {
      id: `daily_${date}`,
      date,
      questions: selectedQuestions.map(q => q.id),
      difficulty,
      category,
      theme,
      rewards,
      isCompleted: false
    };
  }

  /**
   * Select questions for the daily challenge
   */
  private static selectQuestionsForChallenge(
    category: string, 
    difficulty: 'easy' | 'medium' | 'hard', 
    count: number, 
    seed: number
  ): Question[] {
    // Filter questions by category and difficulty
    let filteredQuestions = sampleQuestions.filter(q => 
      q.category === category || q.difficulty === difficulty
    );

    // If not enough questions, expand criteria
    if (filteredQuestions.length < count) {
      filteredQuestions = sampleQuestions.filter(q => 
        q.category === category || q.difficulty === difficulty || q.region
      );
    }

    // If still not enough, use all questions
    if (filteredQuestions.length < count) {
      filteredQuestions = [...sampleQuestions];
    }

    // Shuffle using seed for consistency
    const shuffled = this.shuffleWithSeed(filteredQuestions, seed);
    return shuffled.slice(0, count);
  }

  /**
   * Complete today's daily challenge
   */
  static async completeDailyChallenge(score: number): Promise<DailyChallengeReward[]> {
    const today = this.getTodayString();
    const challenge = this.getTodaysChallenge();
    
    if (challenge.isCompleted) {
      return challenge.rewards || [];
    }

    // Mark challenge as completed
    challenge.isCompleted = true;
    challenge.completedAt = new Date();
    challenge.score = score;

    // Update stored challenges
    const stored = this.getStoredChallenges();
    stored[today] = challenge;
    this.storeChallenges(stored);

    // Update streak
    const streak = this.updateStreak(today, score);
    
    // Calculate final rewards including streak bonuses
    const finalRewards = this.calculateRewards(challenge, streak);

    // Track analytics
    analyticsService.trackFeatureUsage('daily_challenge_completed', `${today}_${score}_${streak.current}_${challenge.theme}`);

    // Schedule next day's notification
    this.scheduleNextDayNotification();

    return finalRewards;
  }

  /**
   * Get current streak information
   */
  static getStreak(): DailyChallengeStreak {
    const stored = localStorage.getItem(this.STREAK_KEY);
    if (!stored) {
      return {
        current: 0,
        best: 0,
        lastCompletedDate: '',
        streakHistory: []
      };
    }

    try {
      return JSON.parse(stored);
    } catch {
      return {
        current: 0,
        best: 0,
        lastCompletedDate: '',
        streakHistory: []
      };
    }
  }

  /**
   * Update streak after completing a challenge
   */
  private static updateStreak(date: string, score: number): DailyChallengeStreak {
    const streak = this.getStreak();
    const yesterday = this.getYesterdayString();

    // Add today's entry
    const todayEntry: StreakEntry = {
      date,
      completed: true,
      score
    };

    // Update streak history
    streak.streakHistory = streak.streakHistory.filter(entry => entry.date !== date);
    streak.streakHistory.push(todayEntry);
    streak.streakHistory.sort((a, b) => a.date.localeCompare(b.date));

    // Keep only last 30 days of history
    if (streak.streakHistory.length > 30) {
      streak.streakHistory = streak.streakHistory.slice(-30);
    }

    // Calculate current streak
    if (streak.lastCompletedDate === yesterday || streak.lastCompletedDate === '') {
      streak.current += 1;
    } else {
      streak.current = 1; // Reset streak
    }

    // Update best streak
    if (streak.current > streak.best) {
      streak.best = streak.current;
    }

    streak.lastCompletedDate = date;

    // Store updated streak
    localStorage.setItem(this.STREAK_KEY, JSON.stringify(streak));

    return streak;
  }

  /**
   * Calculate final rewards including streak bonuses
   */
  private static calculateRewards(challenge: DailyChallenge, streak: DailyChallengeStreak): DailyChallengeReward[] {
    const rewards = [...(challenge.rewards || [])];

    // Add streak milestone rewards
    if (streak.current === 7) {
      rewards.push({
        type: 'badge',
        value: 'week_warrior',
        description: '7-Day Streak Achievement'
      });
    } else if (streak.current === 30) {
      rewards.push({
        type: 'badge',
        value: 'month_master',
        description: '30-Day Streak Achievement'
      });
    } else if (streak.current === 100) {
      rewards.push({
        type: 'badge',
        value: 'century_scholar',
        description: '100-Day Streak Achievement'
      });
    }

    // Add streak bonus XP
    if (streak.current > 1) {
      const bonusXP = Math.min(streak.current * 5, 100); // Max 100 bonus XP
      rewards.push({
        type: 'streak_bonus',
        value: bonusXP,
        description: `${streak.current}-Day Streak Bonus`
      });
    }

    return rewards;
  }

  /**
   * Check if today's challenge is completed
   */
  static isTodayCompleted(): boolean {
    const today = this.getTodayString();
    const challenge = this.getTodaysChallenge();
    return challenge.isCompleted;
  }

  /**
   * Get challenge history for calendar view
   */
  static getChallengeHistory(days: number = 30): { [date: string]: DailyChallenge } {
    const stored = this.getStoredChallenges();
    const history: { [date: string]: DailyChallenge } = {};
    
    for (let i = 0; i < days; i++) {
      const date = this.getDateString(new Date(Date.now() - i * 24 * 60 * 60 * 1000));
      if (stored[date]) {
        history[date] = stored[date];
      }
    }

    return history;
  }

  /**
   * Schedule notification for next day's challenge
   */
  private static scheduleNextDayNotification(): void {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(9, 0, 0, 0); // 9 AM next day

    // Calculate time until tomorrow's notification
    const timeUntilNotification = tomorrow.getTime() - Date.now();
    
    // Schedule the notification
    setTimeout(() => {
      notificationService.sendNotification({
        title: 'Daily Challenge Available!',
        body: 'Your new daily history challenge is ready. Keep your streak alive!',
        tag: 'daily_challenge_reminder',
        requiresPermission: true
      });
    }, timeUntilNotification);
  }

  /**
   * Get stored challenges from localStorage
   */
  private static getStoredChallenges(): { [date: string]: DailyChallenge } {
    const stored = localStorage.getItem(this.STORAGE_KEY);
    if (!stored) return {};

    try {
      return JSON.parse(stored);
    } catch {
      return {};
    }
  }

  /**
   * Store challenges to localStorage
   */
  private static storeChallenges(challenges: { [date: string]: DailyChallenge }): void {
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(challenges));
  }

  /**
   * Get today's date as YYYY-MM-DD string
   */
  private static getTodayString(): string {
    return this.getDateString(new Date());
  }

  /**
   * Get yesterday's date as YYYY-MM-DD string
   */
  private static getYesterdayString(): string {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    return this.getDateString(yesterday);
  }

  /**
   * Convert date to YYYY-MM-DD string
   */
  private static getDateString(date: Date): string {
    return date.toISOString().split('T')[0];
  }

  /**
   * Convert date string to seed number for consistent randomization
   */
  private static dateToSeed(dateString: string): number {
    let hash = 0;
    for (let i = 0; i < dateString.length; i++) {
      const char = dateString.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32-bit integer
    }
    return Math.abs(hash);
  }

  /**
   * Get difficulty for date (cycles through difficulties)
   */
  private static getDifficultyForDate(seed: number): 'easy' | 'medium' | 'hard' {
    const difficulties: ('easy' | 'medium' | 'hard')[] = ['easy', 'medium', 'hard'];
    return difficulties[seed % 3];
  }

  /**
   * Shuffle array with seed for consistent results
   */
  private static shuffleWithSeed<T>(array: T[], seed: number): T[] {
    const shuffled = [...array];
    let currentIndex = shuffled.length;
    let randomIndex: number;

    // Use seed to create pseudo-random number generator
    let random = seed;
    const nextRandom = () => {
      random = (random * 9301 + 49297) % 233280;
      return random / 233280;
    };

    while (currentIndex !== 0) {
      randomIndex = Math.floor(nextRandom() * currentIndex);
      currentIndex--;

      [shuffled[currentIndex], shuffled[randomIndex]] = [
        shuffled[randomIndex], shuffled[currentIndex]
      ];
    }

    return shuffled;
  }

  /**
   * Reset all daily challenge data (for testing/debugging)
   */
  static resetAllData(): void {
    localStorage.removeItem(this.STORAGE_KEY);
    localStorage.removeItem(this.STREAK_KEY);
    localStorage.removeItem(this.COMPLETED_KEY);
  }

  /**
   * Get statistics for daily challenges
   */
  static getStatistics(): {
    totalCompleted: number;
    currentStreak: number;
    bestStreak: number;
    averageScore: number;
    completionRate: number;
  } {
    const streak = this.getStreak();
    const history = this.getChallengeHistory(30);
    const completed = Object.values(history).filter(c => c.isCompleted);
    
    const totalCompleted = completed.length;
    const averageScore = completed.length > 0 
      ? completed.reduce((sum, c) => sum + (c.score || 0), 0) / completed.length 
      : 0;
    const completionRate = Object.keys(history).length > 0 
      ? (completed.length / Object.keys(history).length) * 100 
      : 0;

    return {
      totalCompleted,
      currentStreak: streak.current,
      bestStreak: streak.best,
      averageScore: Math.round(averageScore),
      completionRate: Math.round(completionRate)
    };
  }
}

export default DailyChallengeService;
