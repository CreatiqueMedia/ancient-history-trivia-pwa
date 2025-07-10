// Purchase Content Delivery Service
// Handles delivery of 100 questions per bundle after Stripe purchase completion

import { 
  doc, 
  setDoc, 
  getDoc, 
  collection, 
  getDocs, 
  serverTimestamp,
  query,
  orderBy,
  writeBatch
} from 'firebase/firestore';
import { auth, db } from '../config/firebase';
import { Question } from '../types';
import { sampleQuestionsByBundle } from '../data/sampleQuestions';

interface PurchaseRecord {
  bundleId: string;
  stripeProductId: string;
  purchasedAt: Date;
  questionsDownloaded: boolean;
  downloadedAt?: Date;
  status: 'active' | 'refunded' | 'cancelled';
}

interface CachedBundle {
  questions: Question[];
  bundleId: string;
  cachedAt: number;
  version: number;
  purchaseComplete: boolean;
}

// Map Stripe Product IDs to Bundle IDs
const STRIPE_PRODUCT_TO_BUNDLE_MAP: Record<string, string> = {
  // Regional Bundles
  'prod_Sc1cAYaPVIFRnm': 'egypt_pack',
  'prod_Sc1cJRaC4oR6kR': 'rome_pack',
  'prod_Sc1cheDu2aPo24': 'greece_pack',
  'prod_Sc1c49nwMU5uCa': 'mesopotamia_pack',
  'prod_Sc1cjZLEoeLV59': 'china_pack',
  'prod_ScLQ5j27CiOLtK': 'india_pack',
  'prod_ScLS6NZofkzkv3': 'americas_pack',
  'prod_ScLSh6yyVtIN11': 'europe_pack',
  
  // Time Period Packs
  'prod_ScLSVWDcZ7gh5T': 'bronze_age_pack',
  'prod_ScLSgqSFOxxnKH': 'iron_age_pack',
  'prod_ScLSzGWRwaCj0F': 'prehistoric_pack',
  
  // Format Packs
  'prod_ScLSPhinbppXHL': 'multiple_choice_pack',
  'prod_ScLSsw9hXo49M7': 'true_false_pack',
  'prod_ScLSXDdQ9mNlVL': 'fill_blank_pack',
  
  // Difficulty Packs
  'prod_ScLSJ73GbHZT1r': 'easy_pack',
  'prod_ScLSgpeFtf9Pit': 'medium_pack',
  'prod_ScLSskLoTVMOaW': 'hard_pack'
};

export class PurchaseContentDeliveryService {
  private cache = new Map<string, Question[]>();
  private readonly CACHE_VERSION = 1;
  private readonly CACHE_DURATION = 30 * 24 * 60 * 60 * 1000; // 30 days

  /**
   * Main entry point - Handle successful Stripe purchase
   */
  async handleStripeSuccess(sessionId: string, stripeProductId: string, customerId?: string): Promise<void> {
    const user = auth.currentUser;
    if (!user) {
      throw new Error('User must be authenticated for purchase processing');
    }

    console.log(`🎉 Processing Stripe success: ${sessionId} for product: ${stripeProductId}`);

    try {
      // 1. Map Stripe product to bundle ID
      const bundleId = this.mapStripeProductToBundle(stripeProductId);
      if (!bundleId) {
        throw new Error(`Unknown Stripe product: ${stripeProductId}`);
      }

      // 2. Record the purchase
      await this.recordPurchase(user.uid, bundleId, stripeProductId, sessionId);

      // 3. Generate and deliver 100 questions
      await this.generateAndDeliverQuestions(bundleId);

      // 4. Update purchase record as complete
      await this.markQuestionsDelivered(user.uid, bundleId);

      // 5. Notify UI
      this.notifyContentReady(bundleId);

      console.log(`✅ Purchase complete: ${bundleId} delivered to user ${user.uid}`);

    } catch (error) {
      console.error('❌ Error in handleStripeSuccess:', error);
      throw error;
    }
  }

  /**
   * Map Stripe Product ID to Bundle ID
   */
  private mapStripeProductToBundle(stripeProductId: string): string | null {
    return STRIPE_PRODUCT_TO_BUNDLE_MAP[stripeProductId] || null;
  }

  /**
   * Record purchase in Firestore
   */
  private async recordPurchase(
    userId: string, 
    bundleId: string, 
    stripeProductId: string, 
    sessionId: string
  ): Promise<void> {
    const purchaseRef = doc(db, 'users', userId, 'purchases', bundleId);
    
    const purchaseData: Partial<PurchaseRecord> = {
      bundleId,
      stripeProductId,
      purchasedAt: new Date(),
      questionsDownloaded: false,
      status: 'active'
    };

    await setDoc(purchaseRef, {
      ...purchaseData,
      purchasedAt: serverTimestamp(),
      stripeSessionId: sessionId
    });

    console.log(`📝 Purchase recorded: ${bundleId} for user ${userId}`);
  }

  /**
   * Generate 100 questions and cache locally
   */
  private async generateAndDeliverQuestions(bundleId: string): Promise<void> {
    console.log(`📦 Generating 100 questions for ${bundleId}...`);

    // Generate 100 questions based on bundle type
    const questions = await this.generateFullQuestionSet(bundleId);

    if (questions.length !== 100) {
      console.warn(`⚠️ Expected 100 questions, generated ${questions.length} for ${bundleId}`);
    }

    // Store in Firestore for secure access
    await this.storeQuestionsInFirestore(bundleId, questions);

    // Cache locally for immediate access
    this.cacheQuestions(bundleId, questions);

    console.log(`✅ Generated and cached ${questions.length} questions for ${bundleId}`);
  }

  /**
   * Generate 100 questions based on bundle type with proper difficulty distribution
   */
  private async generateFullQuestionSet(bundleId: string): Promise<Question[]> {
    console.log(`🎯 Generating 100 questions for ${bundleId} with difficulty distribution...`);

    // Check if this is a difficulty pack (different rules)
    const isDifficultyPack = this.isDifficultyPack(bundleId);
    
    if (isDifficultyPack) {
      return this.generateDifficultyPackQuestions(bundleId);
    }

    // For all other bundles: Apply 33/33/34 formula
    return this.generateStandardBundleQuestions(bundleId);
  }

  /**
   * Check if bundle is a difficulty pack
   */
  private isDifficultyPack(bundleId: string): boolean {
    const difficultyPacks = [
      'easy_pack',           // Easy/Elementary Pack - 100% easy questions
      'medium_pack',         // Medium/Middle School Pack - 100% medium questions  
      'hard_pack',           // Hard/High School Pack - 100% hard questions
      'elementary_pack',     // Alternative naming
      'middle_school_pack',  // Alternative naming
      'high_school_pack',    // Alternative naming
      'beginner_pack',       // Alternative naming
      'intermediate_pack',   // Alternative naming
      'advanced_pack'        // Alternative naming
    ];
    return difficultyPacks.includes(bundleId);
  }

  /**
   * Generate questions for standard bundles (33% Easy, 33% Medium, 33% Hard)
   */
  private generateStandardBundleQuestions(bundleId: string): Question[] {
    const allQuestions: Question[] = [];
    const bundleName = this.getBundleName(bundleId);
    
    // 33/33/34 Distribution (34 hard questions to reach 100 total)
    const easyCount = 33;
    const mediumCount = 33; 
    const hardCount = 34; // 34 to reach 100 total

    console.log(`📊 Question distribution for ${bundleId}:`);
    console.log(`   Easy (Elementary): ${easyCount} questions`);
    console.log(`   Medium (Middle School): ${mediumCount} questions`);
    console.log(`   Hard (High School): ${hardCount} questions`);

    // Generate Easy Questions (Elementary School Level)
    for (let i = 0; i < easyCount; i++) {
      allQuestions.push(this.generateQuestionByDifficulty(bundleId, bundleName, 'easy', i + 1));
    }

    // Generate Medium Questions (Middle School Level)  
    for (let i = 0; i < mediumCount; i++) {
      allQuestions.push(this.generateQuestionByDifficulty(bundleId, bundleName, 'medium', i + 1));
    }

    // Generate Hard Questions (High School Level)
    for (let i = 0; i < hardCount; i++) {
      allQuestions.push(this.generateQuestionByDifficulty(bundleId, bundleName, 'hard', i + 1));
    }

    // Shuffle to mix difficulties
    return this.shuffleArray(allQuestions);
  }

  /**
   * Generate questions for difficulty packs (100% of specified difficulty)
   */
  private generateDifficultyPackQuestions(bundleId: string): Question[] {
    const allQuestions: Question[] = [];
    const bundleName = this.getBundleName(bundleId);
    
    // Determine difficulty level for pack
    let difficulty: 'easy' | 'medium' | 'hard' = 'medium';
    
    if (bundleId.includes('easy') || bundleId.includes('elementary') || bundleId.includes('beginner')) {
      difficulty = 'easy';
    } else if (bundleId.includes('hard') || bundleId.includes('high_school') || bundleId.includes('advanced')) {
      difficulty = 'hard';
    } else if (bundleId.includes('medium') || bundleId.includes('middle_school') || bundleId.includes('intermediate')) {
      difficulty = 'medium';
    }

    console.log(`🎓 Generating 100 ${difficulty} level questions for difficulty pack: ${bundleId}`);

    // Generate 100 questions of specified difficulty
    for (let i = 0; i < 100; i++) {
      allQuestions.push(this.generateQuestionByDifficulty(bundleId, bundleName, difficulty, i + 1));
    }

    return this.shuffleArray(allQuestions);
  }

  /**
   * Generate a question based on specific difficulty level
   */
  private generateQuestionByDifficulty(
    bundleId: string, 
    bundleName: string, 
    difficulty: 'easy' | 'medium' | 'hard',
    questionNumber: number
  ): Question {
    const difficultyConfig = this.getDifficultyConfig(difficulty);
    const themes = this.getThemesForBundle(bundleId);
    const theme = themes[questionNumber % themes.length];

    return {
      id: `${bundleId}_${difficulty}_${questionNumber}`,
      question: this.generateQuestionByLevel(bundleName, theme, difficulty),
      options: this.generateOptionsForDifficulty(bundleName, theme, difficulty),
      correctAnswer: Math.floor(Math.random() * 4),
      difficulty: difficulty,
      category: theme,
      region: bundleName,
      period: this.getPeriodForBundle(bundleId),
      explanation: this.generateExplanationForLevel(bundleName, theme, difficulty),
      tags: [...this.getTagsForBundle(bundleId), difficulty, difficultyConfig.level]
    };
  }

  /**
   * Get difficulty configuration
   */
  private getDifficultyConfig(difficulty: 'easy' | 'medium' | 'hard') {
    const configs = {
      easy: {
        level: 'Elementary School',
        description: 'Basic facts and simple concepts',
        complexity: 'Simple identification and basic knowledge'
      },
      medium: {
        level: 'Middle School', 
        description: 'Connections and analysis',
        complexity: 'Understanding relationships and context'
      },
      hard: {
        level: 'High School',
        description: 'Critical thinking and synthesis', 
        complexity: 'Advanced analysis and evaluation'
      }
    };
    return configs[difficulty];
  }

  /**
   * Generate additional questions to reach 100 total
   */
  private generateAdditionalQuestions(
    bundleId: string, 
    baseQuestions: Question[], 
    count: number
  ): Question[] {
    const additionalQuestions: Question[] = [];
    const bundleName = this.getBundleName(bundleId);

    for (let i = 0; i < count; i++) {
      // Generate variations of existing questions or create new ones
      const baseQuestion = baseQuestions[i % baseQuestions.length];
      
      additionalQuestions.push({
        id: `${bundleId}_generated_${i + 1}`,
        question: this.generateVariationQuestion(bundleName, baseQuestion, i),
        options: this.generateVariationOptions(bundleName, baseQuestion),
        correctAnswer: Math.floor(Math.random() * 4), // Random correct answer
        difficulty: this.getDifficultyForBundle(bundleId),
        category: 'Generated',
        region: bundleName,
        period: 'Ancient',
        explanation: this.generateExplanation(bundleName, i),
        tags: this.getTagsForBundle(bundleId)
      });
    }

    return additionalQuestions;
  }

  /**
   * Generate variation question based on bundle theme
   */
  private generateVariationQuestion(bundleName: string, baseQuestion: Question, index: number): string {
    const questionTemplates = [
      `Which of the following is most associated with ${bundleName}?`,
      `What significant event occurred in ${bundleName} history?`,
      `Who was an important figure in ${bundleName}?`,
      `What cultural achievement is ${bundleName} known for?`,
      `Which period is most characteristic of ${bundleName}?`,
      `What technology or innovation came from ${bundleName}?`,
      `Which city was important in ${bundleName}?`,
      `What religious or philosophical concept originated in ${bundleName}?`,
      `Which artifact is most associated with ${bundleName}?`,
      `What social structure was typical of ${bundleName}?`
    ];

    return questionTemplates[index % questionTemplates.length];
  }

  /**
   * Generate options for variation questions
   */
  private generateVariationOptions(bundleName: string, baseQuestion: Question): string[] {
    // Use some real options mixed with plausible distractors
    const baseOptions = baseQuestion.options || [];
    const genericOptions = [
      'Bronze working',
      'Iron technology',
      'Agricultural development',
      'Urban planning',
      'Written language',
      'Religious temples',
      'Trade networks',
      'Military innovations',
      'Artistic achievements',
      'Political systems'
    ];

    // Mix base options with generic ones
    const options = [
      ...baseOptions.slice(0, 2),
      ...genericOptions.slice(0, 2)
    ].slice(0, 4);

    // Ensure we have exactly 4 options
    while (options.length < 4) {
      options.push(`Option ${options.length + 1}`);
    }

    return this.shuffleArray(options);
  }

  /**
   * Generate explanation for questions
   */
  private generateExplanation(bundleName: string, index: number): string {
    const explanations = [
      `This is a characteristic feature of ${bundleName} civilization.`,
      `Historical evidence shows this was significant in ${bundleName}.`,
      `Archaeological findings confirm this aspect of ${bundleName}.`,
      `Scholars agree this represents ${bundleName} cultural achievements.`,
      `Primary sources document this in ${bundleName} history.`
    ];

    return explanations[index % explanations.length];
  }

  /**
   * Get difficulty level for bundle
   */
  private getDifficultyForBundle(bundleId: string): 'easy' | 'medium' | 'hard' {
    if (bundleId.includes('easy')) return 'easy';
    if (bundleId.includes('hard')) return 'hard';
    return 'medium';
  }

  /**
   * Get tags for bundle
   */
  private getTagsForBundle(bundleId: string): string[] {
    const tagMap: Record<string, string[]> = {
      egypt_pack: ['pyramids', 'pharaohs', 'nile', 'hieroglyphs'],
      rome_pack: ['empire', 'emperors', 'legions', 'republic'],
      greece_pack: ['democracy', 'philosophy', 'olympics', 'city-states'],
      mesopotamia_pack: ['cuneiform', 'ziggurats', 'babylon', 'sumerian'],
      china_pack: ['dynasties', 'great-wall', 'silk-road', 'confucius']
    };

    return tagMap[bundleId] || ['ancient', 'history', 'civilization'];
  }

  /**
   * Get readable bundle name
   */
  private getBundleName(bundleId: string): string {
    const nameMap: Record<string, string> = {
      egypt_pack: 'Ancient Egypt',
      rome_pack: 'Roman Empire',
      greece_pack: 'Ancient Greece',
      mesopotamia_pack: 'Mesopotamia',
      china_pack: 'Ancient China',
      india_pack: 'Ancient India',
      americas_pack: 'Ancient Americas',
      europe_pack: 'Ancient Europe',
      bronze_age_pack: 'Bronze Age',
      iron_age_pack: 'Iron Age',
      prehistoric_pack: 'Prehistoric Era',
      multiple_choice_pack: 'Multiple Choice Questions',
      true_false_pack: 'True/False Questions',
      fill_blank_pack: 'Fill-in-the-Blank Questions',
      easy_pack: 'Easy Level Questions',
      medium_pack: 'Medium Level Questions',
      hard_pack: 'Hard Level Questions'
    };

    return nameMap[bundleId] || bundleId.replace('_pack', '').replace('_', ' ');
  }

  /**
   * Store questions in Firestore for secure access
   */
  private async storeQuestionsInFirestore(bundleId: string, questions: Question[]): Promise<void> {
    const batch = writeBatch(db);
    
    // Store bundle metadata
    const bundleRef = doc(db, 'bundles', bundleId);
    batch.set(bundleRef, {
      id: bundleId,
      name: this.getBundleName(bundleId),
      questionCount: questions.length,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });

    // Store questions
    questions.forEach((question) => {
      const questionRef = doc(db, 'bundles', bundleId, 'questions', question.id);
      batch.set(questionRef, question);
    });

    await batch.commit();
    console.log(`🔒 Stored ${questions.length} questions in Firestore for ${bundleId}`);
  }

  /**
   * Cache questions locally
   */
  private cacheQuestions(bundleId: string, questions: Question[]): void {
    try {
      const cacheData: CachedBundle = {
        questions,
        bundleId,
        cachedAt: Date.now(),
        version: this.CACHE_VERSION,
        purchaseComplete: true
      };

      localStorage.setItem(`purchased_${bundleId}`, JSON.stringify(cacheData));
      this.cache.set(bundleId, questions);

      console.log(`💾 Cached ${questions.length} questions locally for ${bundleId}`);
    } catch (error) {
      console.error('Error caching questions:', error);
    }
  }

  /**
   * Mark questions as delivered
   */
  private async markQuestionsDelivered(userId: string, bundleId: string): Promise<void> {
    const purchaseRef = doc(db, 'users', userId, 'purchases', bundleId);
    
    await setDoc(purchaseRef, {
      questionsDownloaded: true,
      downloadedAt: serverTimestamp()
    }, { merge: true });

    console.log(`✅ Marked questions delivered for ${bundleId}`);
  }

  /**
   * Check if user has purchased a bundle
   */
  async isPurchased(bundleId: string): Promise<boolean> {
    const user = auth.currentUser;
    if (!user) return false;

    try {
      const purchaseRef = doc(db, 'users', user.uid, 'purchases', bundleId);
      const purchaseDoc = await getDoc(purchaseRef);
      
      return purchaseDoc.exists() && 
             purchaseDoc.data()?.status === 'active' && 
             purchaseDoc.data()?.questionsDownloaded === true;
    } catch (error) {
      console.error('Error checking purchase status:', error);
      return false;
    }
  }

  /**
   * Get questions for bundle (sample or full based on purchase)
   */
  async getQuestions(bundleId: string): Promise<Question[]> {
    const purchased = await this.isPurchased(bundleId);
    
    if (!purchased) {
      // Return sample questions
      return sampleQuestionsByBundle[bundleId] || [];
    }

    // Return full purchased content
    return this.getCachedQuestions(bundleId);
  }

  /**
   * Get cached questions
   */
  private getCachedQuestions(bundleId: string): Question[] {
    try {
      // Check memory cache first
      if (this.cache.has(bundleId)) {
        return this.cache.get(bundleId)!;
      }

      // Check localStorage
      const cached = localStorage.getItem(`purchased_${bundleId}`);
      if (!cached) return [];

      const cacheData: CachedBundle = JSON.parse(cached);

      // Check cache validity
      if (Date.now() - cacheData.cachedAt > this.CACHE_DURATION) {
        localStorage.removeItem(`purchased_${bundleId}`);
        return [];
      }

      // Update memory cache
      this.cache.set(bundleId, cacheData.questions);
      return cacheData.questions;
    } catch (error) {
      console.error('Error getting cached questions:', error);
      return [];
    }
  }

  /**
   * Generate fallback questions if no samples exist
   */
  private generateFallbackQuestions(bundleId: string): Question[] {
    const questions: Question[] = [];
    const bundleName = this.getBundleName(bundleId);

    for (let i = 0; i < 100; i++) {
      questions.push({
        id: `${bundleId}_fallback_${i + 1}`,
        question: `Question ${i + 1} about ${bundleName}`,
        options: ['Option A', 'Option B', 'Option C', 'Option D'],
        correctAnswer: 0,
        difficulty: 'medium',
        category: 'Fallback',
        region: bundleName,
        period: 'Ancient',
        explanation: `This is a question about ${bundleName}.`,
        tags: ['fallback']
      });
    }

    return questions;
  }

  /**
   * Utility: Shuffle array
   */
  private shuffleArray<T>(array: T[]): T[] {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  }

  /**
   * Notify UI that content is ready
   */
  private notifyContentReady(bundleId: string): void {
    window.dispatchEvent(new CustomEvent('purchaseContentReady', {
      detail: { bundleId, questionsCount: 100 }
    }));

    console.log(`🎉 Content ready notification sent for ${bundleId}`);
  }

  /**
   * Handle Stripe webhook (called from webhook endpoint)
   */
  async handleWebhook(eventType: string, eventData: any): Promise<void> {
    console.log(`🔔 Webhook received: ${eventType}`);

    switch (eventType) {
      case 'checkout.session.completed':
        await this.handleCheckoutCompleted(eventData);
        break;
      case 'payment_intent.succeeded':
        await this.handlePaymentSucceeded(eventData);
        break;
      case 'invoice.payment_succeeded':
        await this.handleSubscriptionPayment(eventData);
        break;
      default:
        console.log(`ℹ️ Unhandled webhook event: ${eventType}`);
    }
  }

  /**
   * Handle completed checkout session
   */
  private async handleCheckoutCompleted(sessionData: any): Promise<void> {
    const { id: sessionId, customer, client_reference_id, metadata } = sessionData;
    const userId = client_reference_id || metadata?.userId;
    
    if (!userId) {
      console.error('No user ID in checkout session');
      return;
    }

    // Extract product from line items
    if (sessionData.line_items?.data?.[0]?.price?.product) {
      const stripeProductId = sessionData.line_items.data[0].price.product;
      await this.handleStripeSuccess(sessionId, stripeProductId, customer);
    }
  }

  /**
   * Handle successful payment intent
   */
  private async handlePaymentSucceeded(paymentData: any): Promise<void> {
    console.log('💳 Payment succeeded:', paymentData.id);
    // Additional payment processing if needed
  }

  /**
   * Handle subscription payment
   */
  private async handleSubscriptionPayment(invoiceData: any): Promise<void> {
    console.log('🔄 Subscription payment succeeded:', invoiceData.id);
    // Handle subscription activation - unlock all bundles
  }

  /**
   * Get themes for bundle
   */
  private getThemesForBundle(bundleId: string): string[] {
    const themeMap: Record<string, string[]> = {
      egypt_pack: ['Pharaohs', 'Pyramids', 'Religion', 'Daily Life', 'Art', 'Politics'],
      rome_pack: ['Empire', 'Military', 'Politics', 'Culture', 'Engineering', 'Religion'],
      greece_pack: ['Philosophy', 'Democracy', 'Art', 'Olympics', 'War', 'Science'],
      mesopotamia_pack: ['Civilization', 'Writing', 'Law', 'Religion', 'Trade', 'Technology'],
      china_pack: ['Dynasties', 'Philosophy', 'Technology', 'Art', 'Politics', 'Culture'],
      india_pack: ['Religion', 'Philosophy', 'Mathematics', 'Literature', 'Politics', 'Trade'],
      americas_pack: ['Maya', 'Aztec', 'Inca', 'Trade', 'Architecture', 'Agriculture'],
      europe_pack: ['Celtic', 'Germanic', 'Nordic', 'Trade', 'Religion', 'Warfare'],
      bronze_age_pack: ['Technology', 'Trade', 'Warfare', 'Society', 'Religion', 'Culture'],
      iron_age_pack: ['Technology', 'Warfare', 'Society', 'Trade', 'Culture', 'Politics'],
      prehistoric_pack: ['Evolution', 'Tools', 'Art', 'Society', 'Agriculture', 'Technology']
    };

    return themeMap[bundleId] || ['History', 'Culture', 'Society', 'Politics', 'Technology', 'Religion'];
  }

  /**
   * Generate question by difficulty level
   */
  private generateQuestionByLevel(bundleName: string, theme: string, difficulty: 'easy' | 'medium' | 'hard'): string {
    const questionTemplates = {
      easy: [
        `What is ${bundleName} most famous for?`,
        `Which of these is from ${bundleName}?`,
        `What did people in ${bundleName} do?`,
        `Where was ${bundleName} located?`,
        `What was important in ${bundleName}?`
      ],
      medium: [
        `How did ${theme.toLowerCase()} influence ${bundleName} society?`,
        `What was the relationship between ${theme.toLowerCase()} and ${bundleName} politics?`,
        `How did ${bundleName} develop their ${theme.toLowerCase()}?`,
        `What role did ${theme.toLowerCase()} play in ${bundleName}?`,
        `How did ${theme.toLowerCase()} change over time in ${bundleName}?`
      ],
      hard: [
        `Analyze the complex relationship between ${theme.toLowerCase()} and social hierarchy in ${bundleName}.`,
        `How did ${theme.toLowerCase()} in ${bundleName} influence later civilizations?`,
        `What were the long-term consequences of ${theme.toLowerCase()} developments in ${bundleName}?`,
        `How did ${theme.toLowerCase()} reflect the underlying tensions in ${bundleName} society?`,
        `What evidence supports the theory that ${theme.toLowerCase()} was central to ${bundleName} identity?`
      ]
    };

    const templates = questionTemplates[difficulty];
    return templates[Math.floor(Math.random() * templates.length)];
  }

  /**
   * Generate options based on difficulty level
   */
  private generateOptionsForDifficulty(bundleName: string, theme: string, difficulty: 'easy' | 'medium' | 'hard'): string[] {
    const optionTemplates = {
      easy: [
        'Simple factual answer',
        'Basic concept',
        'Common knowledge item',
        'Elementary fact'
      ],
      medium: [
        'Detailed explanation with context',
        'Historical connection and relationship',
        'Cause and effect relationship',
        'Comparative analysis point'
      ],
      hard: [
        'Complex theoretical framework with multiple variables',
        'Sophisticated analysis requiring synthesis of multiple sources',
        'Advanced interpretation involving historiographical debate',
        'Nuanced understanding of contextual factors and implications'
      ]
    };

    return optionTemplates[difficulty];
  }

  /**
   * Get time period for bundle
   */
  private getPeriodForBundle(bundleId: string): string {
    const periodMap: Record<string, string> = {
      egypt_pack: '3100-30 BCE',
      rome_pack: '753 BCE-476 CE',
      greece_pack: '800-146 BCE',
      mesopotamia_pack: '3500-539 BCE',
      china_pack: '2070 BCE-220 CE',
      india_pack: '3300-550 CE',
      americas_pack: '1200 BCE-1500 CE',
      europe_pack: '1000 BCE-500 CE',
      bronze_age_pack: '3300-1200 BCE',
      iron_age_pack: '1200-550 BCE',
      prehistoric_pack: '2.5M-3000 BCE'
    };

    return periodMap[bundleId] || 'Ancient Period';
  }

  /**
   * Generate explanation based on difficulty level
   */
  private generateExplanationForLevel(bundleName: string, theme: string, difficulty: 'easy' | 'medium' | 'hard'): string {
    const explanationTemplates = {
      easy: [
        `This is a basic fact about ${bundleName}.`,
        `${theme} was important in ${bundleName}.`,
        `People in ${bundleName} are known for this.`,
        `This is what ${bundleName} is famous for.`
      ],
      medium: [
        `The relationship between ${theme.toLowerCase()} and ${bundleName} society reveals important historical patterns.`,
        `Evidence from archaeological and textual sources shows how ${theme.toLowerCase()} functioned in ${bundleName}.`,
        `Understanding ${theme.toLowerCase()} helps us see how ${bundleName} developed over time.`,
        `This aspect of ${theme.toLowerCase()} demonstrates the complexity of ${bundleName} civilization.`
      ],
      hard: [
        `Scholarly analysis of ${theme.toLowerCase()} in ${bundleName} reveals deep structural relationships that influenced broader historical developments.`,
        `The intersection of ${theme.toLowerCase()} with other cultural factors in ${bundleName} demonstrates sophisticated societal organization.`,
        `Contemporary sources and modern archaeological evidence combine to show how ${theme.toLowerCase()} reflected and shaped ${bundleName} identity.`,
        `This complex aspect of ${theme.toLowerCase()} illustrates the advanced nature of ${bundleName} thought and practice.`
      ]
    };

    const templates = explanationTemplates[difficulty];
    return templates[Math.floor(Math.random() * templates.length)];
  }
}

// Export singleton
export const purchaseContentDeliveryService = new PurchaseContentDeliveryService();
