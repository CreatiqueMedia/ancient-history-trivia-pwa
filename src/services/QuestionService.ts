import { SupabaseClient } from '@supabase/supabase-js';
import { Question, QuestionBundle } from '../types';
import { isPlatform } from '../utils/platform';
import { analyticsService } from './AnalyticsService';
import { errorHandler } from './ErrorHandlingService';
import { SUPABASE_URL, SUPABASE_ANON_KEY, initializeSupabase } from '../config/environment';

/**
 * Service for managing trivia questions and bundles
 * Uses Supabase for remote storage and local caching for offline access
 */
export class QuestionService {
  private static supabase: SupabaseClient;
  private static localBundleCache: Map<string, Question[]> = new Map();
  private static isInitialized = false;
  private static STORAGE_PREFIX = 'ancient_history_bundle_';
  
  /**
   * Initialize the QuestionService
   */
  static async initialize(): Promise<boolean> {
    try {
      if (this.isInitialized) return true;
      
      // Initialize Supabase client
      const supabase = await initializeSupabase();
      if (!supabase) {
        throw new Error('Failed to initialize Supabase client');
      }
      
      this.supabase = supabase;
      this.isInitialized = true;
      
      // Load any cached bundles into memory
      this.loadCachedBundlesIntoMemory();
      
      console.log('QuestionService initialized successfully');
      return true;
    } catch (error) {
      console.error('Failed to initialize QuestionService:', error);
      errorHandler.handleGenericError(error, 'question-service-init');
      return false;
    }
  }
  
  /**
   * Load all cached bundles from localStorage into memory
   */
  private static loadCachedBundlesIntoMemory(): void {
    try {
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key?.startsWith(this.STORAGE_PREFIX)) {
          const bundleId = key.replace(this.STORAGE_PREFIX, '');
          const data = localStorage.getItem(key);
          if (data) {
            const questions = JSON.parse(data) as Question[];
            this.localBundleCache.set(bundleId, questions);
          }
        }
      }
      console.log(`Loaded ${this.localBundleCache.size} cached bundles into memory`);
    } catch (error) {
      console.warn('Error loading cached bundles:', error);
    }
  }
  
  /**
   * Get metadata for a specific bundle
   */
  static async getBundleMetadata(bundleId: string): Promise<QuestionBundle | null> {
    try {
      this.checkInitialization();
      
      const { data, error } = await this.supabase
        .from('bundles')
        .select('*')
        .eq('id', bundleId)
        .single();
        
      if (error) {
        throw error;
      }
      
      return data as unknown as QuestionBundle;
    } catch (error) {
      console.error('Error fetching bundle metadata:', error);
      errorHandler.handleGenericError(error, 'get-bundle-metadata');
      return null;
    }
  }
  
  /**
   * Get metadata for all current version bundles
   */
  static async getAllBundleMetadata(): Promise<QuestionBundle[]> {
    try {
      this.checkInitialization();
      
      const { data, error } = await this.supabase
        .from('bundles')
        .select('*')
        .eq('is_current_version', true);
        
      if (error) {
        throw error;
      }
      
      return data as unknown as QuestionBundle[];
    } catch (error) {
      console.error('Error fetching all bundle metadata:', error);
      errorHandler.handleGenericError(error, 'get-all-bundle-metadata');
      return [];
    }
  }
  
  /**
   * Load questions for a specific bundle
   * Tries local cache first, then fetches from Supabase if needed
   */
  static async loadQuestionsForBundle(bundleId: string): Promise<Question[]> {
    try {
      this.checkInitialization();
      
      // Track bundle access
      analyticsService.trackFeatureUsage('bundle_access', bundleId);
      
      // Check if already cached in memory
      if (this.localBundleCache.has(bundleId)) {
        console.log(`Using in-memory cached questions for bundle ${bundleId}`);
        return this.localBundleCache.get(bundleId)!;
      }
      
      // Check if cached in localStorage
      const cachedQuestions = this.loadBundleFromLocalStorage(bundleId);
      if (cachedQuestions) {
        console.log(`Using localStorage cached questions for bundle ${bundleId}`);
        this.localBundleCache.set(bundleId, cachedQuestions);
        return cachedQuestions;
      }
      
      // Get bundle metadata to find storage path
      const bundle = await this.getBundleMetadata(bundleId);
      if (!bundle) {
        throw new Error(`Bundle ${bundleId} not found`);
      }
      
      console.log(`Fetching questions for bundle ${bundleId} from Supabase`);
      
      // Check if storage path is available
      if (!bundle.storage_path) {
        throw new Error(`No storage path found for bundle ${bundleId}`);
      }
      
      // Fetch questions from Storage
      const { data, error } = await this.supabase.storage
        .from('trivia-bundles')
        .download(bundle.storage_path);
        
      if (error) {
        throw error;
      }
      
      // Parse JSON data
      const text = await data.text();
      const questions = JSON.parse(text) as Question[];
      
      // Cache locally if on mobile/PWA
      if (isPlatform('ios') || isPlatform('android') || isPlatform('pwa')) {
        console.log(`Caching ${questions.length} questions for bundle ${bundleId}`);
        this.localBundleCache.set(bundleId, questions);
        this.persistBundleToLocalStorage(bundleId, questions);
      }
      
      return questions;
    } catch (error) {
      console.error('Error loading questions for bundle:', error);
      errorHandler.handleGenericError(error, 'load-bundle-questions');
      return [];
    }
  }
  
  /**
   * Get sample questions for a bundle (10 questions)
   * Used for previewing bundles before purchase
   */
  static async getSampleQuestionsForBundle(bundleId: string): Promise<Question[]> {
    try {
      this.checkInitialization();
      
      // Track sample access
      analyticsService.trackFeatureUsage('sample_access', bundleId);
      
      const { data, error } = await this.supabase
        .from('questions')
        .select('*')
        .eq('bundle_id', bundleId)
        .limit(10);
        
      if (error) {
        throw error;
      }
      
      return data as unknown as Question[];
    } catch (error) {
      console.error('Error fetching sample questions:', error);
      errorHandler.handleGenericError(error, 'get-sample-questions');
      return [];
    }
  }
  
  /**
   * Check if user has purchased a specific bundle
   */
  static async hasUserPurchasedBundle(userId: string, bundleId: string): Promise<boolean> {
    try {
      this.checkInitialization();
      
      const { data, error } = await this.supabase
        .from('user_purchases')
        .select('*')
        .eq('user_id', userId)
        .eq('bundle_id', bundleId)
        .single();
        
      if (error) {
        if (error.code === 'PGRST116') {
          // No match found - not an error, just not purchased
          return false;
        }
        throw error;
      }
      
      return !!data;
    } catch (error) {
      console.error('Error checking bundle purchase status:', error);
      errorHandler.handleGenericError(error, 'check-bundle-purchase');
      return false;
    }
  }
  
  /**
   * Check if user has an active subscription
   */
  static async hasUserActiveSubscription(userId: string): Promise<boolean> {
    try {
      this.checkInitialization();
      
      const { data, error } = await this.supabase
        .from('user_subscriptions')
        .select('*')
        .eq('user_id', userId)
        .eq('is_active', true)
        .gt('expires_at', new Date().toISOString())
        .single();
        
      if (error) {
        if (error.code === 'PGRST116') {
          // No match found - not an error, just no active subscription
          return false;
        }
        throw error;
      }
      
      return !!data;
    } catch (error) {
      console.error('Error checking subscription status:', error);
      errorHandler.handleGenericError(error, 'check-subscription');
      return false;
    }
  }
  
  /**
   * Record a bundle purchase in Supabase
   */
  static async recordBundlePurchase(userId: string, bundleId: string): Promise<boolean> {
    try {
      this.checkInitialization();
      
      const { error } = await this.supabase
        .from('user_purchases')
        .insert({
          user_id: userId,
          bundle_id: bundleId,
          purchased_at: new Date().toISOString()
        });
        
      if (error) {
        throw error;
      }
      
      // Track purchase
      analyticsService.trackFeatureUsage('bundle_purchase', bundleId);
      
      return true;
    } catch (error) {
      console.error('Error recording bundle purchase:', error);
      errorHandler.handleGenericError(error, 'record-bundle-purchase');
      return false;
    }
  }
  
  /**
   * Record a subscription in Supabase
   */
  static async recordSubscription(
    userId: string, 
    tier: string, 
    period: string, 
    expiryDate: Date
  ): Promise<boolean> {
    try {
      this.checkInitialization();
      
      const { error } = await this.supabase
        .from('user_subscriptions')
        .upsert({
          user_id: userId,
          tier,
          period,
          starts_at: new Date().toISOString(),
          expires_at: expiryDate.toISOString(),
          is_active: true
        });
        
      if (error) {
        throw error;
      }
      
      // Track subscription
      analyticsService.trackFeatureUsage('subscription', `${tier}_${period}`);
      
      return true;
    } catch (error) {
      console.error('Error recording subscription:', error);
      errorHandler.handleGenericError(error, 'record-subscription');
      return false;
    }
  }
  
  /**
   * Store bundle in local storage for offline access
   */
  private static persistBundleToLocalStorage(bundleId: string, questions: Question[]): void {
    try {
      const key = `${this.STORAGE_PREFIX}${bundleId}`;
      localStorage.setItem(key, JSON.stringify(questions));
    } catch (e) {
      console.warn('Failed to persist bundle to localStorage:', e);
      
      // If storage is full, try to clear some space
      if (e instanceof DOMException && e.name === 'QuotaExceededError') {
        this.clearOldestCachedBundle();
        
        // Try again
        try {
          const key = `${this.STORAGE_PREFIX}${bundleId}`;
          localStorage.setItem(key, JSON.stringify(questions));
        } catch (retryError) {
          console.error('Failed to persist bundle after clearing space:', retryError);
        }
      }
    }
  }
  
  /**
   * Load bundle from local storage
   */
  static loadBundleFromLocalStorage(bundleId: string): Question[] | null {
    try {
      const key = `${this.STORAGE_PREFIX}${bundleId}`;
      const data = localStorage.getItem(key);
      if (!data) return null;
      
      // Update access timestamp
      this.updateBundleAccessTimestamp(bundleId);
      
      return JSON.parse(data) as Question[];
    } catch (e) {
      console.warn('Failed to load bundle from localStorage:', e);
      return null;
    }
  }
  
  /**
   * Update the last access timestamp for a bundle
   */
  private static updateBundleAccessTimestamp(bundleId: string): void {
    try {
      localStorage.setItem(`${this.STORAGE_PREFIX}${bundleId}_last_access`, Date.now().toString());
    } catch (e) {
      console.warn('Failed to update bundle access timestamp:', e);
    }
  }
  
  /**
   * Clear the oldest cached bundle to free up space
   */
  private static clearOldestCachedBundle(): void {
    try {
      let oldestTime = Date.now();
      let oldestBundleId: string | null = null;
      
      // Find the oldest accessed bundle
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key?.startsWith(this.STORAGE_PREFIX) && key.endsWith('_last_access')) {
          const bundleId = key.replace(`${this.STORAGE_PREFIX}`, '').replace('_last_access', '');
          const timestamp = parseInt(localStorage.getItem(key) || '0', 10);
          
          if (timestamp < oldestTime) {
            oldestTime = timestamp;
            oldestBundleId = bundleId;
          }
        }
      }
      
      // Clear the oldest bundle
      if (oldestBundleId) {
        console.log(`Clearing oldest cached bundle: ${oldestBundleId}`);
        localStorage.removeItem(`${this.STORAGE_PREFIX}${oldestBundleId}`);
        localStorage.removeItem(`${this.STORAGE_PREFIX}${oldestBundleId}_last_access`);
        this.localBundleCache.delete(oldestBundleId);
      }
    } catch (e) {
      console.warn('Failed to clear oldest cached bundle:', e);
    }
  }
  
  /**
   * Clear local cache to free up space
   * Optionally specify bundles to keep
   */
  static clearLocalCache(exceptBundleIds: string[] = []): void {
    try {
      // Keep specified bundles
      const bundlesToKeep = new Set(exceptBundleIds);
      
      // Clear from Map cache
      for (const bundleId of this.localBundleCache.keys()) {
        if (!bundlesToKeep.has(bundleId)) {
          this.localBundleCache.delete(bundleId);
        }
      }
      
      // Clear from localStorage
      const keysToRemove: string[] = [];
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key?.startsWith(this.STORAGE_PREFIX)) {
          const bundleId = key
            .replace(this.STORAGE_PREFIX, '')
            .replace('_last_access', '');
            
          if (!bundlesToKeep.has(bundleId)) {
            keysToRemove.push(key);
          }
        }
      }
      
      // Remove keys in a separate loop to avoid index issues
      keysToRemove.forEach(key => localStorage.removeItem(key));
      
      console.log(`Cleared ${keysToRemove.length} items from local cache`);
    } catch (e) {
      console.warn('Failed to clear local cache:', e);
    }
  }
  
  /**
   * Get the estimated storage usage in MB
   */
  static getStorageUsageEstimate(): number {
    try {
      let totalSize = 0;
      
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key?.startsWith(this.STORAGE_PREFIX)) {
          const value = localStorage.getItem(key) || '';
          totalSize += key.length + value.length;
        }
      }
      
      // Convert to MB (approximation)
      return Math.round((totalSize * 2) / (1024 * 1024) * 100) / 100;
    } catch (e) {
      console.warn('Failed to estimate storage usage:', e);
      return 0;
    }
  }
  
  /**
   * Ensure the service is initialized before use
   */
  private static checkInitialization(): void {
    if (!this.isInitialized) {
      throw new Error('QuestionService not initialized. Call initialize() first.');
    }
  }
}

export default QuestionService;
