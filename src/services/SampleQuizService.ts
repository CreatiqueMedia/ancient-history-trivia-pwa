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
    const bundleQuestions = this.getQuestionsForBundle(bundle);
    const sampleQuiz: Question[] = [];
    const isFormatPack = bundle.category === 'format' || bundle.bpType === 'FormatPackType';
    const format = bundle.format;
    const totalQuestions = 10;

    // Helper to filter by format
    const getFormatType = (q: Question): string => {
      if (q.options.length === 2 && (q.options[0].toLowerCase() === 'true' || q.options[1].toLowerCase() === 'false')) return 'True/False';
      if (q.question.includes('_____') || q.question.toLowerCase().includes('blank')) return 'Fill-in-the-Blank';
      return 'Multiple Choice';
    };

    if (isFormatPack && (format === 'Multiple Choice' || format === 'True/False' || format === 'Fill-in-the-Blank')) {
      // Only use questions of the matching format
      const formatQuestions = bundleQuestions.filter(q => getFormatType(q) === format);
      return this.getRandomQuestions(formatQuestions, totalQuestions);
    } else {
      // Mixed: try to get as close to equal as possible
      const tf = bundleQuestions.filter(q => getFormatType(q) === 'True/False');
      const mc = bundleQuestions.filter(q => getFormatType(q) === 'Multiple Choice');
      const fib = bundleQuestions.filter(q => getFormatType(q) === 'Fill-in-the-Blank');
      // Try to get at least 3 of each, then fill remainder
      const tfCount = Math.min(3, tf.length);
      const mcCount = Math.min(3, mc.length);
      const fibCount = Math.min(3, fib.length);
      sampleQuiz.push(...this.getRandomQuestions(tf, tfCount));
      sampleQuiz.push(...this.getRandomQuestions(mc, mcCount));
      sampleQuiz.push(...this.getRandomQuestions(fib, fibCount));
      // Fill up to 10 with remaining, prioritizing balance
      let remaining = totalQuestions - sampleQuiz.length;
      const leftovers = [...this.getRandomQuestions(tf, tf.length), ...this.getRandomQuestions(mc, mc.length), ...this.getRandomQuestions(fib, fib.length)]
        .filter(q => !sampleQuiz.includes(q));
      sampleQuiz.push(...leftovers.slice(0, remaining));
      return this.shuffleArray(sampleQuiz).slice(0, totalQuestions);
    }
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
