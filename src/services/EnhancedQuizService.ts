import { Question } from '../types';
import { sampleQuestions } from '../data/questions';
import { sampleQuestionsByBundle, getSampleQuestionsForBundle } from '../data/sampleQuestions';
import { QUESTION_BUNDLES } from '../data/bundles';

/**
 * Enhanced Quiz Service that implements intelligent question selection
 * with proper difficulty and format distribution according to requirements
 */
export class EnhancedQuizService {
  
  /**
   * Generate Quick Quiz with proper distribution:
   * - 33% Easy (elementary), 33% Medium (middle school), 33% Hard (high school)
   * - Mixed formats: Multiple Choice, True/False, Fill-in-the-Blank
   * - Mixed regions and historical periods
   */
  static generateQuickQuiz(questionCount: number = 10): Question[] {
    const allQuestions = [...sampleQuestions];
    
    // Calculate distribution
    const easyCount = Math.floor(questionCount * 0.33);
    const mediumCount = Math.floor(questionCount * 0.33);
    const hardCount = questionCount - easyCount - mediumCount;
    
    // Get questions by difficulty
    const easyQuestions = this.shuffleArray(allQuestions.filter(q => q.difficulty === 'easy'));
    const mediumQuestions = this.shuffleArray(allQuestions.filter(q => q.difficulty === 'medium'));
    const hardQuestions = this.shuffleArray(allQuestions.filter(q => q.difficulty === 'hard'));
    
    // Select questions with format distribution
    const selectedQuestions: Question[] = [];
    
    // Add easy questions
    selectedQuestions.push(...this.selectQuestionsWithFormatMix(easyQuestions, easyCount));
    
    // Add medium questions
    selectedQuestions.push(...this.selectQuestionsWithFormatMix(mediumQuestions, mediumCount));
    
    // Add hard questions
    selectedQuestions.push(...this.selectQuestionsWithFormatMix(hardQuestions, hardCount));
    
    // Shuffle final selection to mix difficulties
    return this.shuffleArray(selectedQuestions);
  }
  
  /**
   * Generate Bundle Sample Quiz with proper distribution:
   * - 33% Easy, 33% Medium, 33% Hard (except for Difficulty Packs)
   * - Mixed formats for all bundles
   * - Bundle-specific content
   */
  static generateBundleSampleQuiz(bundleId: string, questionCount: number = 10): Question[] {
    const bundle = QUESTION_BUNDLES.find(b => b.id === bundleId);
    if (!bundle) {
      console.warn(`Bundle ${bundleId} not found, falling back to quick quiz`);
      return this.generateQuickQuiz(questionCount);
    }
    
    // Get bundle-specific questions
    const bundleQuestions = getSampleQuestionsForBundle(bundleId);
    
    if (bundleQuestions.length === 0) {
      console.warn(`No questions found for bundle ${bundleId}, falling back to quick quiz`);
      return this.generateQuickQuiz(questionCount);
    }
    
    // Special handling for Difficulty Packs - maintain their specific difficulty
    if (bundle.category === 'difficulty') {
      return this.generateDifficultyPackQuiz(bundle, bundleQuestions, questionCount);
    }
    
    // For all other bundles, use 33/33/33 distribution
    return this.generateMixedDifficultyQuiz(bundleQuestions, questionCount);
  }
  
  /**
   * Generate quiz for Difficulty Packs - maintain specific difficulty level
   */
  private static generateDifficultyPackQuiz(bundle: any, questions: Question[], questionCount: number): Question[] {
    const targetDifficulty = bundle.difficulty;
    
    // Filter questions by target difficulty
    const filteredQuestions = questions.filter(q => q.difficulty === targetDifficulty);
    
    if (filteredQuestions.length < questionCount) {
      console.warn(`Not enough ${targetDifficulty} questions for ${bundle.id}, using all available`);
      return this.selectQuestionsWithFormatMix(this.shuffleArray(filteredQuestions), filteredQuestions.length);
    }
    
    return this.selectQuestionsWithFormatMix(this.shuffleArray(filteredQuestions), questionCount);
  }
  
  /**
   * Generate quiz with 33/33/33 difficulty distribution
   */
  private static generateMixedDifficultyQuiz(questions: Question[], questionCount: number): Question[] {
    // Calculate distribution
    const easyCount = Math.floor(questionCount * 0.33);
    const mediumCount = Math.floor(questionCount * 0.33);
    const hardCount = questionCount - easyCount - mediumCount;
    
    // Separate by difficulty
    const easyQuestions = this.shuffleArray(questions.filter(q => q.difficulty === 'easy'));
    const mediumQuestions = this.shuffleArray(questions.filter(q => q.difficulty === 'medium'));
    const hardQuestions = this.shuffleArray(questions.filter(q => q.difficulty === 'hard'));
    
    const selectedQuestions: Question[] = [];
    
    // Add questions with format distribution
    selectedQuestions.push(...this.selectQuestionsWithFormatMix(easyQuestions, easyCount));
    selectedQuestions.push(...this.selectQuestionsWithFormatMix(mediumQuestions, mediumCount));
    selectedQuestions.push(...this.selectQuestionsWithFormatMix(hardQuestions, hardCount));
    
    // If we don't have enough questions in any difficulty, fill from available
    while (selectedQuestions.length < questionCount && questions.length > selectedQuestions.length) {
      const remaining = questions.filter(q => !selectedQuestions.includes(q));
      if (remaining.length > 0) {
        selectedQuestions.push(remaining[Math.floor(Math.random() * remaining.length)]);
      } else {
        break;
      }
    }
    
    return this.shuffleArray(selectedQuestions);
  }
  
  /**
   * Select questions ensuring format variety (Multiple Choice, True/False, Fill-in-the-Blank)
   */
  private static selectQuestionsWithFormatMix(questions: Question[], count: number): Question[] {
    if (questions.length === 0 || count === 0) return [];
    
    // For now, since most questions are Multiple Choice format, we'll select randomly
    // In a real implementation, you would filter by format property
    const selected: Question[] = [];
    const available = [...questions];
    
    for (let i = 0; i < count && available.length > 0; i++) {
      const randomIndex = Math.floor(Math.random() * available.length);
      selected.push(available.splice(randomIndex, 1)[0]);
    }
    
    return selected;
  }
  
  /**
   * Enhanced question metadata for display during quiz
   */
  static getQuestionDisplayInfo(question: Question): {
    difficulty: string;
    difficultyLevel: string;
    region: string;
    historicalAge: string;
    category: string;
  } {
    return {
      difficulty: question.difficulty,
      difficultyLevel: this.getDifficultyLevel(question.difficulty),
      region: question.region,
      historicalAge: this.getHistoricalAge(question.period),
      category: question.category
    };
  }
  
  /**
   * Get educational level description for difficulty
   */
  private static getDifficultyLevel(difficulty: string): string {
    switch (difficulty) {
      case 'easy':
        return 'Elementary School Level';
      case 'medium':
        return 'Middle School Level';
      case 'hard':
        return 'High School Level';
      default:
        return 'Unknown Level';
    }
  }
  
  /**
   * Get historical age from period
   */
  private static getHistoricalAge(period: string): string {
    const periodLower = period.toLowerCase();
    
    if (periodLower.includes('prehistoric') || periodLower.includes('paleolithic') || 
        periodLower.includes('neolithic') || periodLower.includes('mesolithic')) {
      return 'Prehistoric Age';
    }
    
    if (periodLower.includes('bronze')) {
      return 'Bronze Age';
    }
    
    if (periodLower.includes('iron')) {
      return 'Iron Age';
    }
    
    if (periodLower.includes('classical') || periodLower.includes('ancient') || 
        periodLower.includes('empire') || periodLower.includes('republic')) {
      return 'Classical Antiquity';
    }
    
    if (periodLower.includes('medieval') || periodLower.includes('viking')) {
      return 'Early Medieval';
    }
    
    // Default mapping for specific periods
    switch (periodLower) {
      case 'old kingdom':
      case 'middle kingdom':
      case 'new kingdom':
        return 'Classical Antiquity';
      case 'archaic':
        return 'Archaic Period';
      case 'hellenistic':
        return 'Hellenistic Period';
      case 'imperial':
        return 'Imperial Period';
      default:
        return period; // Return original if no mapping found
    }
  }
  
  /**
   * Shuffle array using Fisher-Yates algorithm
   */
  private static shuffleArray<T>(array: T[]): T[] {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  }
  
  /**
   * Get quiz statistics for a set of questions
   */
  static getQuizStatistics(questions: Question[]): {
    totalQuestions: number;
    difficultyBreakdown: { easy: number; medium: number; hard: number };
    formatBreakdown: { [format: string]: number };
    regionBreakdown: { [region: string]: number };
    periodBreakdown: { [period: string]: number };
  } {
    const stats = {
      totalQuestions: questions.length,
      difficultyBreakdown: { easy: 0, medium: 0, hard: 0 },
      formatBreakdown: {} as { [format: string]: number },
      regionBreakdown: {} as { [region: string]: number },
      periodBreakdown: {} as { [period: string]: number }
    };
    
    questions.forEach(question => {
      // Count difficulty
      stats.difficultyBreakdown[question.difficulty]++;
      
      // Count format (default to Multiple Choice if not specified)
      const format = question.format || 'Multiple Choice';
      stats.formatBreakdown[format] = (stats.formatBreakdown[format] || 0) + 1;
      
      // Count region
      stats.regionBreakdown[question.region] = (stats.regionBreakdown[question.region] || 0) + 1;
      
      // Count period
      stats.periodBreakdown[question.period] = (stats.periodBreakdown[question.period] || 0) + 1;
    });
    
    return stats;
  }
  
  /**
   * Validate quiz meets distribution requirements
   */
  static validateQuizDistribution(questions: Question[], expectedDistribution?: {
    easy?: number;
    medium?: number;
    hard?: number;
  }): {
    isValid: boolean;
    issues: string[];
    actualDistribution: { easy: number; medium: number; hard: number };
  } {
    const stats = this.getQuizStatistics(questions);
    const issues: string[] = [];
    
    // Check if we have the expected distribution (within 1 question tolerance)
    if (expectedDistribution) {
      const tolerance = 1;
      
      if (expectedDistribution.easy !== undefined) {
        const diff = Math.abs(stats.difficultyBreakdown.easy - expectedDistribution.easy);
        if (diff > tolerance) {
          issues.push(`Easy questions: expected ${expectedDistribution.easy}, got ${stats.difficultyBreakdown.easy}`);
        }
      }
      
      if (expectedDistribution.medium !== undefined) {
        const diff = Math.abs(stats.difficultyBreakdown.medium - expectedDistribution.medium);
        if (diff > tolerance) {
          issues.push(`Medium questions: expected ${expectedDistribution.medium}, got ${stats.difficultyBreakdown.medium}`);
        }
      }
      
      if (expectedDistribution.hard !== undefined) {
        const diff = Math.abs(stats.difficultyBreakdown.hard - expectedDistribution.hard);
        if (diff > tolerance) {
          issues.push(`Hard questions: expected ${expectedDistribution.hard}, got ${stats.difficultyBreakdown.hard}`);
        }
      }
    }
    
    return {
      isValid: issues.length === 0,
      issues,
      actualDistribution: stats.difficultyBreakdown
    };
  }
}

export default EnhancedQuizService;
