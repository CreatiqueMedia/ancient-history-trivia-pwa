import { collection, doc, getDoc, setDoc, getDocs, query, where, deleteDoc } from 'firebase/firestore';
import { db } from '../config/firebase';
import { Question } from '../types/index';
import { QUESTION_BUNDLES } from '../data/bundles';
import { FullQuestionService } from './FullQuestionService';

/**
 * Service for managing questions in Firestore
 * Handles storing and retrieving full question sets for premium users
 */
export class FirestoreQuestionService {
  
  /**
   * Initialize Firestore with full question sets for all bundles
   * This should be called once to populate the database
   */
  static async initializeFirestoreQuestions(): Promise<void> {
    console.log('🔥 Initializing Firestore with full question sets...');
    
    try {
      // Get all current bundles (excluding legacy)
      const currentBundles = QUESTION_BUNDLES.filter(bundle => bundle.isCurrentVersion !== false);
      
      for (const bundle of currentBundles) {
        console.log(`📝 Generating questions for bundle: ${bundle.name}`);
        
        // Generate full question set using FullQuestionService
        const questions = FullQuestionService.generateFullQuestions(bundle.id);
        
        if (questions.length > 0) {
          // Store questions in Firestore
          await this.storeQuestionsInFirestore(bundle.id, questions);
          console.log(`✅ Stored ${questions.length} questions for ${bundle.name}`);
        } else {
          console.warn(`⚠️ No questions generated for ${bundle.name}`);
        }
        
        // Add small delay to avoid overwhelming Firestore
        await new Promise(resolve => setTimeout(resolve, 100));
      }
      
      console.log('🎉 Firestore initialization complete!');
    } catch (error) {
      console.error('❌ Error initializing Firestore questions:', error);
      throw error;
    }
  }
  
  /**
   * Store questions for a specific bundle in Firestore
   */
  private static async storeQuestionsInFirestore(bundleId: string, questions: Question[]): Promise<void> {
    try {
      // Store bundle metadata
      const bundleDoc = doc(db, 'questionBundles', bundleId);
      await setDoc(bundleDoc, {
        bundleId,
        questionCount: questions.length,
        lastUpdated: new Date().toISOString(),
        version: 'v1'
      });
      
      // Store questions in batches (Firestore has limits)
      const batchSize = 50;
      for (let i = 0; i < questions.length; i += batchSize) {
        const batch = questions.slice(i, i + batchSize);
        const batchDoc = doc(db, 'questionBundles', bundleId, 'batches', `batch_${Math.floor(i / batchSize)}`);
        
        await setDoc(batchDoc, {
          questions: batch,
          batchIndex: Math.floor(i / batchSize),
          questionCount: batch.length
        });
      }
      
    } catch (error) {
      console.error(`Error storing questions for ${bundleId}:`, error);
      throw error;
    }
  }
  
  /**
   * Retrieve full question set for a bundle from Firestore
   */
  static async getQuestionsFromFirestore(bundleId: string): Promise<Question[]> {
    try {
      console.log(`🔍 Fetching questions for bundle: ${bundleId} from Firestore`);
      
      // Check if bundle exists
      const bundleDoc = doc(db, 'questionBundles', bundleId);
      const bundleSnap = await getDoc(bundleDoc);
      
      if (!bundleSnap.exists()) {
        console.warn(`⚠️ Bundle ${bundleId} not found in Firestore, generating locally`);
        return FullQuestionService.generateFullQuestions(bundleId);
      }
      
      // Get all question batches
      const batchesRef = collection(db, 'questionBundles', bundleId, 'batches');
      const batchesSnap = await getDocs(batchesRef);
      
      const allQuestions: Question[] = [];
      
      // Combine all batches
      batchesSnap.docs.forEach(doc => {
        const batchData = doc.data();
        if (batchData.questions && Array.isArray(batchData.questions)) {
          allQuestions.push(...batchData.questions);
        }
      });
      
      console.log(`✅ Retrieved ${allQuestions.length} questions for ${bundleId} from Firestore`);
      return allQuestions;
      
    } catch (error) {
      console.error(`❌ Error fetching questions for ${bundleId}:`, error);
      // Fallback to local generation
      console.log(`🔄 Falling back to local question generation for ${bundleId}`);
      return FullQuestionService.generateFullQuestions(bundleId);
    }
  }
  
  /**
   * Check if questions exist in Firestore for a bundle
   */
  static async questionsExistInFirestore(bundleId: string): Promise<boolean> {
    try {
      const bundleDoc = doc(db, 'questionBundles', bundleId);
      const bundleSnap = await getDoc(bundleDoc);
      return bundleSnap.exists();
    } catch (error) {
      console.error(`Error checking if questions exist for ${bundleId}:`, error);
      return false;
    }
  }
  
  /**
   * Get question count for a bundle from Firestore
   */
  static async getQuestionCountFromFirestore(bundleId: string): Promise<number> {
    try {
      const bundleDoc = doc(db, 'questionBundles', bundleId);
      const bundleSnap = await getDoc(bundleDoc);
      
      if (bundleSnap.exists()) {
        const data = bundleSnap.data();
        return data.questionCount || 0;
      }
      
      return 0;
    } catch (error) {
      console.error(`Error getting question count for ${bundleId}:`, error);
      return 0;
    }
  }
  
  /**
   * Initialize questions for development/testing
   * This is a convenience method for local development
   */
  static async initializeForDevelopment(): Promise<void> {
    console.log('🚀 Initializing Firestore questions for development...');
    
    try {
      // Check if we're in development mode
      if (window.location.hostname === 'localhost') {
        console.log('🏠 Development mode detected, initializing questions...');
        await this.initializeFirestoreQuestions();
      } else {
        console.log('🌐 Production mode, skipping auto-initialization');
      }
    } catch (error) {
      console.error('❌ Development initialization failed:', error);
    }
  }
  
  /**
   * Clear all questions from Firestore (for testing)
   */
  static async clearAllQuestions(): Promise<void> {
    console.log('🗑️ Clearing all questions from Firestore...');
    
    try {
      const bundlesRef = collection(db, 'questionBundles');
      const bundlesSnap = await getDocs(bundlesRef);
      
      for (const bundleDoc of bundlesSnap.docs) {
        // Delete all batches
        const batchesRef = collection(db, 'questionBundles', bundleDoc.id, 'batches');
        const batchesSnap = await getDocs(batchesRef);
        
        for (const batchDoc of batchesSnap.docs) {
          await deleteDoc(batchDoc.ref);
        }
        
        // Delete bundle document
        await deleteDoc(bundleDoc.ref);
      }
      
      console.log('✅ All questions cleared from Firestore');
    } catch (error) {
      console.error('❌ Error clearing questions:', error);
      throw error;
    }
  }
  
  /**
   * Get bundle statistics from Firestore
   */
  static async getBundleStatistics(): Promise<{ [bundleId: string]: { questionCount: number; lastUpdated: string } }> {
    try {
      const bundlesRef = collection(db, 'questionBundles');
      const bundlesSnap = await getDocs(bundlesRef);
      
      const stats: { [bundleId: string]: { questionCount: number; lastUpdated: string } } = {};
      
      bundlesSnap.docs.forEach(doc => {
        const data = doc.data();
        stats[doc.id] = {
          questionCount: data.questionCount || 0,
          lastUpdated: data.lastUpdated || 'Unknown'
        };
      });
      
      return stats;
    } catch (error) {
      console.error('Error getting bundle statistics:', error);
      return {};
    }
  }
}

export default FirestoreQuestionService;
