/**
 * Simplified Question Service - No Firestore
 * Uses bundled questions and localStorage for caching
 */
import { Question } from '../types/index';
import { QUESTION_BUNDLES } from '../data/bundles';
import { sampleQuestionsByBundle } from '../data/sampleQuestions';

export class LocalQuestionService {
  private static readonly CACHE_KEY = 'question_cache';
  private static readonly CACHE_DURATION = 24 * 60 * 60 * 1000; // 24 hours

  /**
   * Get questions for a bundle (uses local data only)
   */
  static getQuestionsForBundle(bundleId: string): Question[] {
    // Check cache first
    const cached = this.getCachedQuestions(bundleId);
    if (cached) {
      return cached;
    }

    // Get from sample questions
    const questions = sampleQuestionsByBundle[bundleId] || [];
    
    // Cache the questions
    this.cacheQuestions(bundleId, questions);
    
    return questions;
  }

  /**
   * Check if questions are available for a bundle
   */
  static hasQuestionsForBundle(bundleId: string): boolean {
    return bundleId in sampleQuestionsByBundle;
  }

  /**
   * Get all available bundle IDs
   */
  static getAvailableBundles(): string[] {
    return Object.keys(sampleQuestionsByBundle);
  }

  /**
   * Cache questions in localStorage
   */
  private static cacheQuestions(bundleId: string, questions: Question[]): void {
    try {
      const cache = this.getCache();
      cache[bundleId] = {
        questions,
        timestamp: Date.now()
      };
      localStorage.setItem(this.CACHE_KEY, JSON.stringify(cache));
    } catch (error) {
      console.warn('Failed to cache questions:', error);
    }
  }

  /**
   * Get cached questions from localStorage
   */
  private static getCachedQuestions(bundleId: string): Question[] | null {
    try {
      const cache = this.getCache();
      const cached = cache[bundleId];
      
      if (!cached) return null;
      
      // Check if cache is still valid
      if (Date.now() - cached.timestamp > this.CACHE_DURATION) {
        delete cache[bundleId];
        localStorage.setItem(this.CACHE_KEY, JSON.stringify(cache));
        return null;
      }
      
      return cached.questions;
    } catch (error) {
      console.warn('Failed to get cached questions:', error);
      return null;
    }
  }

  /**
   * Get the entire cache object
   */
  private static getCache(): Record<string, { questions: Question[]; timestamp: number }> {
    try {
      const cached = localStorage.getItem(this.CACHE_KEY);
      return cached ? JSON.parse(cached) : {};
    } catch (error) {
      console.warn('Failed to parse question cache:', error);
      return {};
    }
  }

  /**
   * Clear the question cache
   */
  static clearCache(): void {
    localStorage.removeItem(this.CACHE_KEY);
  }

  /**
   * Get cache stats for debugging
   */
  static getCacheStats(): { bundleCount: number; totalQuestions: number } {
    const cache = this.getCache();
    const bundleCount = Object.keys(cache).length;
    const totalQuestions = Object.values(cache).reduce(
      (sum, cached) => sum + cached.questions.length,
      0
    );
    
    return { bundleCount, totalQuestions };
  }
}
