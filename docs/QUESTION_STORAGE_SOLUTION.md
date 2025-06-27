# Question Storage and Delivery Solution

This document outlines a solution for storing and delivering trivia questions for the Ancient History Trivia app, addressing the need to avoid storing all questions locally on mobile devices while providing a replacement for Firestore (which is being discontinued on August 25, 2025).

## Table of Contents

1. [Current Implementation](#current-implementation)
2. [Requirements](#requirements)
3. [Recommended Solution: Supabase](#recommended-solution-supabase)
4. [Implementation Plan](#implementation-plan)
5. [Alternative Solutions](#alternative-solutions)
6. [Performance Considerations](#performance-considerations)
7. [Offline Support](#offline-support)

## Current Implementation

The current implementation appears to:

1. Store sample questions locally in `src/data/questions.ts`
2. Export bundles to JSON files using `scripts/export-bundles.ts`
3. Upload bundles to Supabase Storage using `scripts/upload-bundles-to-supabase.ts`
4. Generate sample quizzes using `src/services/SampleQuizService.ts`

However, there's no clear mechanism for fetching questions from a remote source on demand, which would be necessary to avoid storing all questions locally.

## Requirements

Based on the app's needs, the question storage and delivery solution should:

1. **Minimize local storage usage** on mobile devices
2. **Support on-demand loading** of question bundles
3. **Enable offline access** to purchased bundles
4. **Provide fast access** to questions during quizzes
5. **Scale** to handle many question bundles and users
6. **Replace Firestore** functionality before August 25, 2025
7. **Integrate** with the existing payment system
8. **Support versioning** of question bundles

## Recommended Solution: Supabase

Since the app already uses Supabase for bundle storage, extending this to handle question delivery is the most straightforward approach.

### Why Supabase?

1. **Already integrated**: The app already has code for uploading bundles to Supabase Storage
2. **PostgreSQL backend**: Provides robust database capabilities
3. **Real-time subscriptions**: Can notify the app of updates to questions
4. **Row-level security**: Can control access to questions based on purchases
5. **Storage API**: Can store and retrieve large question sets efficiently
6. **Open source**: No vendor lock-in
7. **Free tier**: Generous free tier for development and small deployments

### Architecture Overview

![Supabase Architecture](https://i.imgur.com/XYZ123.png)

The solution will use:

1. **Supabase Database** for storing:
   - Question metadata
   - Bundle information
   - User purchase records

2. **Supabase Storage** for storing:
   - Complete question bundles as JSON files
   - Media assets (images, audio) associated with questions

3. **Local Storage** for:
   - Caching purchased bundles
   - Storing user progress and settings
   - Minimal sample questions for free users

## Implementation Plan

### 1. Database Schema

Create the following tables in Supabase:

```sql
-- Bundles table
CREATE TABLE bundles (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  category TEXT NOT NULL,
  subcategory TEXT NOT NULL,
  price NUMERIC NOT NULL,
  question_count INTEGER NOT NULL,
  difficulty TEXT NOT NULL,
  format TEXT NOT NULL,
  version TEXT NOT NULL,
  release_date TIMESTAMP WITH TIME ZONE NOT NULL,
  is_current_version BOOLEAN DEFAULT TRUE,
  storage_path TEXT NOT NULL
);

-- Questions table (for metadata only, actual questions in Storage)
CREATE TABLE questions (
  id TEXT PRIMARY KEY,
  bundle_id TEXT REFERENCES bundles(id),
  difficulty TEXT NOT NULL,
  category TEXT NOT NULL,
  region TEXT,
  period TEXT,
  format TEXT NOT NULL
);

-- User purchases table
CREATE TABLE user_purchases (
  user_id TEXT NOT NULL,
  bundle_id TEXT NOT NULL,
  purchased_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  PRIMARY KEY (user_id, bundle_id)
);

-- User subscriptions table
CREATE TABLE user_subscriptions (
  user_id TEXT PRIMARY KEY,
  tier TEXT NOT NULL,
  period TEXT NOT NULL,
  starts_at TIMESTAMP WITH TIME ZONE NOT NULL,
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
  is_active BOOLEAN DEFAULT TRUE
);
```

### 2. Storage Buckets

Create the following buckets in Supabase Storage:

1. `trivia-bundles`: For storing complete question bundles as JSON files
2. `question-assets`: For storing images, audio, or other media associated with questions

### 3. API Service Implementation

Create a new service in `src/services/QuestionService.ts`:

```typescript
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { Question, QuestionBundle } from '../types';
import { isPlatform } from '../utils/platform';

export class QuestionService {
  private static supabase: SupabaseClient;
  private static localBundleCache: Map<string, Question[]> = new Map();
  
  // Initialize Supabase client
  static initialize(supabaseUrl: string, supabaseKey: string) {
    this.supabase = createClient(supabaseUrl, supabaseKey);
  }
  
  // Get bundle metadata
  static async getBundleMetadata(bundleId: string): Promise<QuestionBundle | null> {
    const { data, error } = await this.supabase
      .from('bundles')
      .select('*')
      .eq('id', bundleId)
      .single();
      
    if (error) {
      console.error('Error fetching bundle metadata:', error);
      return null;
    }
    
    return data as unknown as QuestionBundle;
  }
  
  // Get all bundles metadata
  static async getAllBundleMetadata(): Promise<QuestionBundle[]> {
    const { data, error } = await this.supabase
      .from('bundles')
      .select('*')
      .eq('is_current_version', true);
      
    if (error) {
      console.error('Error fetching bundles:', error);
      return [];
    }
    
    return data as unknown as QuestionBundle[];
  }
  
  // Load questions for a bundle
  static async loadQuestionsForBundle(bundleId: string): Promise<Question[]> {
    // Check if already cached
    if (this.localBundleCache.has(bundleId)) {
      return this.localBundleCache.get(bundleId)!;
    }
    
    // Get bundle metadata to find storage path
    const bundle = await this.getBundleMetadata(bundleId);
    if (!bundle) return [];
    
    // Fetch questions from Storage
    const { data, error } = await this.supabase.storage
      .from('trivia-bundles')
      .download(bundle.storage_path);
      
    if (error) {
      console.error('Error downloading bundle:', error);
      return [];
    }
    
    // Parse JSON data
    const text = await data.text();
    const questions = JSON.parse(text) as Question[];
    
    // Cache locally if on mobile/PWA
    if (isPlatform('ios') || isPlatform('android') || isPlatform('pwa')) {
      this.localBundleCache.set(bundleId, questions);
      this.persistBundleToLocalStorage(bundleId, questions);
    }
    
    return questions;
  }
  
  // Get sample questions for a bundle (10 questions)
  static async getSampleQuestionsForBundle(bundleId: string): Promise<Question[]> {
    const { data, error } = await this.supabase
      .from('questions')
      .select('*')
      .eq('bundle_id', bundleId)
      .limit(10);
      
    if (error) {
      console.error('Error fetching sample questions:', error);
      return [];
    }
    
    return data as unknown as Question[];
  }
  
  // Check if user has purchased a bundle
  static async hasUserPurchasedBundle(userId: string, bundleId: string): Promise<boolean> {
    const { data, error } = await this.supabase
      .from('user_purchases')
      .select('*')
      .eq('user_id', userId)
      .eq('bundle_id', bundleId)
      .single();
      
    if (error) {
      return false;
    }
    
    return !!data;
  }
  
  // Check if user has active subscription
  static async hasUserActiveSubscription(userId: string): Promise<boolean> {
    const { data, error } = await this.supabase
      .from('user_subscriptions')
      .select('*')
      .eq('user_id', userId)
      .eq('is_active', true)
      .gt('expires_at', new Date().toISOString())
      .single();
      
    if (error) {
      return false;
    }
    
    return !!data;
  }
  
  // Store bundle in local storage for offline access
  private static persistBundleToLocalStorage(bundleId: string, questions: Question[]) {
    try {
      localStorage.setItem(`bundle_${bundleId}`, JSON.stringify(questions));
    } catch (e) {
      console.warn('Failed to persist bundle to localStorage:', e);
    }
  }
  
  // Load bundle from local storage
  static loadBundleFromLocalStorage(bundleId: string): Question[] | null {
    try {
      const data = localStorage.getItem(`bundle_${bundleId}`);
      if (!data) return null;
      return JSON.parse(data) as Question[];
    } catch (e) {
      console.warn('Failed to load bundle from localStorage:', e);
      return null;
    }
  }
  
  // Clear local cache to free up space
  static clearLocalCache(exceptBundleIds: string[] = []) {
    // Keep specified bundles
    const bundlesToKeep = new Set(exceptBundleIds);
    
    // Clear from Map cache
    for (const bundleId of this.localBundleCache.keys()) {
      if (!bundlesToKeep.has(bundleId)) {
        this.localBundleCache.delete(bundleId);
      }
    }
    
    // Clear from localStorage
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key?.startsWith('bundle_')) {
        const bundleId = key.replace('bundle_', '');
        if (!bundlesToKeep.has(bundleId)) {
          localStorage.removeItem(key);
        }
      }
    }
  }
}
```

### 4. Integration with Quiz Screen

Update the quiz screen to use the new QuestionService:

```typescript
// In src/screens/QuizScreen.tsx

import { QuestionService } from '../services/QuestionService';
import { usePurchase } from '../context/PurchaseContext';
import { useAuth } from '../context/AuthContext';

// Inside component
const { user } = useAuth();
const { hasAccessToBundle } = usePurchase();
const [questions, setQuestions] = useState<Question[]>([]);
const [loading, setLoading] = useState(true);

useEffect(() => {
  const loadQuestions = async () => {
    setLoading(true);
    
    // Check if this is a sample quiz
    const sampleQuizData = localStorage.getItem('sampleQuiz');
    if (sampleQuizData) {
      const sampleQuiz = JSON.parse(sampleQuizData);
      setQuestions(sampleQuiz.questions);
      setLoading(false);
      return;
    }
    
    // Check if user has access to this bundle
    if (!hasAccessToBundle(bundleId)) {
      // Redirect to store or show purchase prompt
      navigate('/store');
      return;
    }
    
    // Try to load from local storage first (for offline access)
    const cachedQuestions = QuestionService.loadBundleFromLocalStorage(bundleId);
    if (cachedQuestions) {
      setQuestions(cachedQuestions);
      setLoading(false);
      return;
    }
    
    // Load from Supabase
    const loadedQuestions = await QuestionService.loadQuestionsForBundle(bundleId);
    setQuestions(loadedQuestions);
    setLoading(false);
  };
  
  loadQuestions();
}, [bundleId, hasAccessToBundle, navigate]);
```

### 5. Admin Tools for Question Management

Create scripts for managing questions:

1. **Upload script**: Enhance the existing upload script to handle both bundle metadata and questions
2. **Update script**: For updating existing bundles with new questions
3. **Version management**: For creating new versions of bundles

### 6. Offline Support Implementation

Implement a service worker to:

1. Cache bundle data for offline access
2. Sync user progress when back online
3. Handle offline purchases (queue for processing when online)

## Alternative Solutions

While Supabase is recommended, here are alternative solutions:

### 1. Firebase Realtime Database

Firebase Realtime Database is different from Firestore and will continue to be available.

**Pros:**
- Similar API to Firestore
- Real-time updates
- Good offline support
- Familiar if already using Firebase Auth

**Cons:**
- Less powerful querying than Firestore
- JSON-based (not document-based)
- May require significant refactoring

### 2. MongoDB Atlas

**Pros:**
- Powerful document database
- Flexible schema
- Good scaling options
- Realm for mobile sync

**Cons:**
- Different programming model from Firestore
- More complex setup
- May be overkill for simple question storage

### 3. Custom API with Database Backend

**Pros:**
- Complete control over implementation
- Can optimize specifically for question delivery
- No vendor lock-in

**Cons:**
- Requires backend development
- More maintenance overhead
- Need to handle scaling, security, etc.

## Performance Considerations

To ensure optimal performance:

1. **Lazy loading**: Only load questions when needed
2. **Bundle size optimization**: Keep bundles to a reasonable size (100-200 questions per bundle)
3. **Caching strategy**:
   - Cache most recently used bundles
   - Preload next likely bundles
   - Clear cache when storage pressure is high
4. **Compression**: Compress question data to reduce transfer size
5. **Indexing**: Use appropriate indexes in Supabase for fast queries

## Offline Support

For robust offline support:

1. **Progressive caching**:
   - Always cache currently used bundle
   - Cache purchased bundles when on WiFi
   - Allow user to manually cache specific bundles
2. **Storage management**:
   - Monitor device storage usage
   - Provide clear UI for managing cached content
   - Auto-cleanup of least recently used content when storage is low
3. **Sync mechanism**:
   - Track quiz progress offline
   - Sync when connection is restored
   - Handle conflicts appropriately

By implementing this solution, the Ancient History Trivia app will have a robust, scalable, and efficient question storage and delivery system that minimizes local storage usage while providing excellent offline support.
