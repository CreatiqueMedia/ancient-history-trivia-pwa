import { Question } from '../types';
import { sampleQuestions } from '../data/questions';
import { QuestionBundle } from '../types/bundles';

export interface SampleQuizConfig {
  bundleId: string;
  version: string;
  totalQuestions: 10;
  difficultyDistribution: {
    easy: 3;
    medium: 4;
    hard: 3;
  };
}

export class SampleQuizService {
  /**
   * Generate a sample quiz for a specific bundle
   */
  static generateSampleQuiz(bundle: QuestionBundle): Question[] {
    // For now, we'll use questions from the general sample pool
    // In production, each bundle would have its own question pool
    const bundleQuestions = this.getQuestionsForBundle(bundle);
    
    const sampleQuiz: Question[] = [];
    
    // Get 3 easy questions
    const easyQuestions = bundleQuestions.filter(q => q.difficulty === 'easy');
    sampleQuiz.push(...this.getRandomQuestions(easyQuestions, 3));
    
    // Get 4 medium questions
    const mediumQuestions = bundleQuestions.filter(q => q.difficulty === 'medium');
    sampleQuiz.push(...this.getRandomQuestions(mediumQuestions, 4));
    
    // Get 3 hard questions
    const hardQuestions = bundleQuestions.filter(q => q.difficulty === 'hard');
    sampleQuiz.push(...this.getRandomQuestions(hardQuestions, 3));
    
    // Shuffle the final quiz
    return this.shuffleArray(sampleQuiz);
  }

  /**
   * Get questions that match the bundle's theme/region
   */
  private static getQuestionsForBundle(bundle: QuestionBundle): Question[] {
    const region = bundle.subcategory.toLowerCase();
    
    // Filter questions by region/theme
    return sampleQuestions.filter(question => {
      const questionRegion = question.region?.toLowerCase();
      return questionRegion?.includes(region) || 
             region.includes(questionRegion || '') ||
             this.isRelatedTheme(region, question);
    });
  }

  /**
   * Check if question is related to bundle theme
   */
  private static isRelatedTheme(bundleTheme: string, question: Question): boolean {
    const themes: Record<string, string[]> = {
      'egyptian': ['egypt', 'pharaoh', 'pyramid', 'nile'],
      'greek': ['greece', 'athens', 'sparta', 'philosophy', 'democracy'],
      'roman': ['rome', 'caesar', 'empire', 'legion', 'gladiator'],
      'mesopotamian': ['babylon', 'sumerian', 'assyrian', 'tigris', 'euphrates'],
      'chinese': ['china', 'emperor', 'dynasty', 'confucius', 'silk road'],
      'indian': ['india', 'buddha', 'hinduism', 'indus', 'maurya'],
    };

    const bundleKeywords = themes[bundleTheme] || [];
    const questionText = (question.question + ' ' + (question.tags?.join(' ') || '')).toLowerCase();
    
    return bundleKeywords.some(keyword => questionText.includes(keyword));
  }

  /**
   * Get random questions from an array
   */
  private static getRandomQuestions(questions: Question[], count: number): Question[] {
    const shuffled = this.shuffleArray([...questions]);
    return shuffled.slice(0, Math.min(count, shuffled.length));
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
   * Get sample quiz for legacy versions
   */
  static getSampleQuizForVersion(bundleId: string, version: string): Question[] {
    // This would fetch from a database or versioned question sets
    // For now, return current sample quiz with version metadata
    const currentBundle = { 
      id: bundleId, 
      subcategory: bundleId.split('_')[2] || 'general',
      version 
    } as QuestionBundle;
    
    return this.generateSampleQuiz(currentBundle);
  }
}

export default SampleQuizService;
