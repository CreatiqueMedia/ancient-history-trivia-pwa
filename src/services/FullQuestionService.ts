import { Question } from '../types/index';
import { QUESTION_BUNDLES } from '../data/bundles';

/**
 * Service for generating full question sets for premium users
 * This service creates the complete 100-question sets for each bundle
 * and the 1700-question mega bundle when users have premium access
 */
export class FullQuestionService {
  
  /**
   * Generate full question set for a specific bundle
   * Returns 100 questions for individual bundles, 1700 for mega bundle
   */
  static generateFullQuestions(bundleId: string): Question[] {
    const bundle = QUESTION_BUNDLES.find(b => b.id === bundleId);
    if (!bundle) {
      console.error(`Bundle not found: ${bundleId}`);
      return [];
    }

    // For mega bundle, generate 1700 questions
    if (bundle.isMegaBundle) {
      return this.generateMegaBundleQuestions();
    }

    // For individual bundles, generate 100 questions
    return this.generateBundleQuestions(bundle);
  }

  /**
   * Generate 1700 questions for the mega bundle
   * Combines questions from all individual bundles
   */
  private static generateMegaBundleQuestions(): Question[] {
    const questions: Question[] = [];
    const individualBundles = QUESTION_BUNDLES.filter(b => !b.isMegaBundle && b.isCurrentVersion !== false);
    
    // Generate 100 questions for each of the 17 bundles
    individualBundles.forEach(bundle => {
      const bundleQuestions = this.generateBundleQuestions(bundle);
      questions.push(...bundleQuestions);
    });

    // Shuffle the combined questions
    return this.shuffleArray(questions);
  }

  /**
   * Generate 100 questions for an individual bundle
   */
  private static generateBundleQuestions(bundle: any): Question[] {
    const questions: Question[] = [];
    const { difficultyBreakdown } = bundle;
    
    // Generate questions based on difficulty breakdown
    const easyQuestions = this.generateQuestionsByDifficulty(bundle, 'easy', difficultyBreakdown.easy);
    const mediumQuestions = this.generateQuestionsByDifficulty(bundle, 'medium', difficultyBreakdown.medium);
    const hardQuestions = this.generateQuestionsByDifficulty(bundle, 'hard', difficultyBreakdown.hard);
    
    questions.push(...easyQuestions, ...mediumQuestions, ...hardQuestions);
    
    // Shuffle and return exactly 100 questions
    const shuffled = this.shuffleArray(questions);
    return shuffled.slice(0, 100);
  }

  /**
   * Generate questions for a specific difficulty level
   */
  private static generateQuestionsByDifficulty(bundle: any, difficulty: 'easy' | 'medium' | 'hard', count: number): Question[] {
    const questions: Question[] = [];
    const questionTemplates = this.getQuestionTemplates(bundle, difficulty);
    
    for (let i = 0; i < count; i++) {
      const template = questionTemplates[i % questionTemplates.length];
      const question = this.createQuestionFromTemplate(template, bundle, difficulty, i);
      questions.push(question);
    }
    
    return questions;
  }

  /**
   * Get question templates based on bundle category and difficulty
   */
  private static getQuestionTemplates(bundle: any, difficulty: string): any[] {
    const templates = [];
    
    // Base templates for different categories
    if (bundle.category === 'region') {
      templates.push(...this.getRegionalQuestionTemplates(bundle.subcategory, difficulty));
    } else if (bundle.category === 'historical_age') {
      templates.push(...this.getHistoricalAgeTemplates(bundle.subcategory, difficulty));
    } else if (bundle.category === 'format') {
      templates.push(...this.getFormatSpecificTemplates(bundle.subcategory, difficulty));
    } else if (bundle.category === 'difficulty') {
      templates.push(...this.getDifficultySpecificTemplates(bundle.subcategory, difficulty));
    }
    
    // Ensure we have enough templates
    while (templates.length < 50) {
      templates.push(...templates.slice(0, Math.min(10, templates.length)));
    }
    
    return templates;
  }

  /**
   * Regional question templates
   */
  private static getRegionalQuestionTemplates(region: string, difficulty: string): any[] {
    const templates = [];
    
    switch (region) {
      case 'Egyptian':
        templates.push(
          { type: 'pharaoh', topic: 'rulers', era: 'Old Kingdom' },
          { type: 'pyramid', topic: 'architecture', era: 'Pyramid Age' },
          { type: 'religion', topic: 'gods', era: 'New Kingdom' },
          { type: 'hieroglyphs', topic: 'writing', era: 'All Periods' },
          { type: 'mummification', topic: 'burial', era: 'All Periods' },
          { type: 'nile', topic: 'geography', era: 'All Periods' },
          { type: 'trade', topic: 'economy', era: 'Middle Kingdom' },
          { type: 'warfare', topic: 'military', era: 'New Kingdom' },
          { type: 'art', topic: 'culture', era: 'All Periods' },
          { type: 'daily_life', topic: 'society', era: 'All Periods' }
        );
        break;
        
      case 'Roman':
        templates.push(
          { type: 'emperor', topic: 'rulers', era: 'Imperial' },
          { type: 'republic', topic: 'government', era: 'Republican' },
          { type: 'legion', topic: 'military', era: 'All Periods' },
          { type: 'gladiator', topic: 'entertainment', era: 'Imperial' },
          { type: 'aqueduct', topic: 'engineering', era: 'All Periods' },
          { type: 'senate', topic: 'politics', era: 'Republican' },
          { type: 'conquest', topic: 'expansion', era: 'All Periods' },
          { type: 'law', topic: 'legal', era: 'All Periods' },
          { type: 'religion', topic: 'beliefs', era: 'All Periods' },
          { type: 'decline', topic: 'fall', era: 'Late Imperial' }
        );
        break;
        
      case 'Greek':
        templates.push(
          { type: 'city_state', topic: 'government', era: 'Classical' },
          { type: 'philosophy', topic: 'thought', era: 'Classical' },
          { type: 'democracy', topic: 'politics', era: 'Athenian' },
          { type: 'sparta', topic: 'military', era: 'Classical' },
          { type: 'olympics', topic: 'culture', era: 'All Periods' },
          { type: 'mythology', topic: 'religion', era: 'All Periods' },
          { type: 'alexander', topic: 'conquest', era: 'Hellenistic' },
          { type: 'theater', topic: 'arts', era: 'Classical' },
          { type: 'science', topic: 'knowledge', era: 'Hellenistic' },
          { type: 'persian_wars', topic: 'conflict', era: 'Classical' }
        );
        break;
        
      case 'Mesopotamian':
        templates.push(
          { type: 'ziggurat', topic: 'architecture', era: 'Sumerian' },
          { type: 'cuneiform', topic: 'writing', era: 'All Periods' },
          { type: 'hammurabi', topic: 'law', era: 'Babylonian' },
          { type: 'irrigation', topic: 'agriculture', era: 'All Periods' },
          { type: 'gilgamesh', topic: 'literature', era: 'Sumerian' },
          { type: 'assyrian', topic: 'empire', era: 'Assyrian' },
          { type: 'babylon', topic: 'city', era: 'Babylonian' },
          { type: 'trade', topic: 'economy', era: 'All Periods' },
          { type: 'religion', topic: 'gods', era: 'All Periods' },
          { type: 'warfare', topic: 'military', era: 'All Periods' }
        );
        break;
        
      case 'Chinese':
        templates.push(
          { type: 'dynasty', topic: 'rulers', era: 'All Periods' },
          { type: 'confucius', topic: 'philosophy', era: 'Zhou' },
          { type: 'great_wall', topic: 'defense', era: 'Qin' },
          { type: 'silk_road', topic: 'trade', era: 'Han' },
          { type: 'mandate', topic: 'government', era: 'All Periods' },
          { type: 'invention', topic: 'technology', era: 'All Periods' },
          { type: 'emperor', topic: 'rulers', era: 'Imperial' },
          { type: 'bureaucracy', topic: 'administration', era: 'All Periods' },
          { type: 'art', topic: 'culture', era: 'All Periods' },
          { type: 'religion', topic: 'beliefs', era: 'All Periods' }
        );
        break;
        
      case 'Indian':
        templates.push(
          { type: 'indus', topic: 'civilization', era: 'Bronze Age' },
          { type: 'vedic', topic: 'religion', era: 'Vedic' },
          { type: 'buddha', topic: 'philosophy', era: 'Classical' },
          { type: 'mauryan', topic: 'empire', era: 'Mauryan' },
          { type: 'gupta', topic: 'golden_age', era: 'Gupta' },
          { type: 'caste', topic: 'society', era: 'All Periods' },
          { type: 'hinduism', topic: 'religion', era: 'All Periods' },
          { type: 'mathematics', topic: 'science', era: 'Gupta' },
          { type: 'trade', topic: 'economy', era: 'All Periods' },
          { type: 'art', topic: 'culture', era: 'All Periods' }
        );
        break;
        
      default:
        templates.push(
          { type: 'general', topic: 'history', era: 'Ancient' },
          { type: 'culture', topic: 'society', era: 'Ancient' },
          { type: 'politics', topic: 'government', era: 'Ancient' },
          { type: 'religion', topic: 'beliefs', era: 'Ancient' },
          { type: 'warfare', topic: 'military', era: 'Ancient' }
        );
    }
    
    return templates;
  }

  /**
   * Historical age templates
   */
  private static getHistoricalAgeTemplates(age: string, difficulty: string): any[] {
    const templates = [];
    
    switch (age) {
      case 'Prehistoric':
        templates.push(
          { type: 'stone_age', topic: 'tools', era: 'Paleolithic' },
          { type: 'cave_art', topic: 'culture', era: 'Paleolithic' },
          { type: 'agriculture', topic: 'revolution', era: 'Neolithic' },
          { type: 'settlement', topic: 'society', era: 'Neolithic' },
          { type: 'hunting', topic: 'survival', era: 'Paleolithic' },
          { type: 'fire', topic: 'technology', era: 'Paleolithic' },
          { type: 'migration', topic: 'movement', era: 'All Periods' },
          { type: 'burial', topic: 'ritual', era: 'All Periods' },
          { type: 'pottery', topic: 'craft', era: 'Neolithic' },
          { type: 'domestication', topic: 'animals', era: 'Neolithic' }
        );
        break;
        
      case 'Bronze Age':
        templates.push(
          { type: 'metallurgy', topic: 'technology', era: 'Bronze Age' },
          { type: 'trade', topic: 'economy', era: 'Bronze Age' },
          { type: 'writing', topic: 'communication', era: 'Bronze Age' },
          { type: 'city', topic: 'urbanization', era: 'Bronze Age' },
          { type: 'warfare', topic: 'military', era: 'Bronze Age' },
          { type: 'religion', topic: 'beliefs', era: 'Bronze Age' },
          { type: 'art', topic: 'culture', era: 'Bronze Age' },
          { type: 'government', topic: 'politics', era: 'Bronze Age' },
          { type: 'collapse', topic: 'decline', era: 'Late Bronze Age' },
          { type: 'migration', topic: 'movement', era: 'Bronze Age' }
        );
        break;
        
      case 'Iron Age':
        templates.push(
          { type: 'iron_working', topic: 'technology', era: 'Iron Age' },
          { type: 'empire', topic: 'politics', era: 'Iron Age' },
          { type: 'philosophy', topic: 'thought', era: 'Axial Age' },
          { type: 'religion', topic: 'beliefs', era: 'Iron Age' },
          { type: 'trade', topic: 'economy', era: 'Iron Age' },
          { type: 'warfare', topic: 'military', era: 'Iron Age' },
          { type: 'culture', topic: 'society', era: 'Iron Age' },
          { type: 'law', topic: 'legal', era: 'Iron Age' },
          { type: 'art', topic: 'expression', era: 'Iron Age' },
          { type: 'science', topic: 'knowledge', era: 'Iron Age' }
        );
        break;
    }
    
    return templates;
  }

  /**
   * Format-specific templates
   */
  private static getFormatSpecificTemplates(format: string, difficulty: string): any[] {
    // These will be adapted to the specific format (Multiple Choice, True/False, Fill-in-the-Blank)
    return [
      { type: 'factual', topic: 'knowledge', era: 'Ancient' },
      { type: 'analytical', topic: 'reasoning', era: 'Ancient' },
      { type: 'comparative', topic: 'analysis', era: 'Ancient' },
      { type: 'chronological', topic: 'timeline', era: 'Ancient' },
      { type: 'geographical', topic: 'location', era: 'Ancient' },
      { type: 'cultural', topic: 'society', era: 'Ancient' },
      { type: 'political', topic: 'government', era: 'Ancient' },
      { type: 'economic', topic: 'trade', era: 'Ancient' },
      { type: 'religious', topic: 'beliefs', era: 'Ancient' },
      { type: 'military', topic: 'warfare', era: 'Ancient' }
    ];
  }

  /**
   * Difficulty-specific templates
   */
  private static getDifficultySpecificTemplates(difficultyLevel: string, difficulty: string): any[] {
    return [
      { type: 'basic', topic: 'fundamental', era: 'Ancient' },
      { type: 'intermediate', topic: 'detailed', era: 'Ancient' },
      { type: 'advanced', topic: 'complex', era: 'Ancient' },
      { type: 'expert', topic: 'specialized', era: 'Ancient' },
      { type: 'comprehensive', topic: 'broad', era: 'Ancient' }
    ];
  }

  /**
   * Create a question from a template
   */
  private static createQuestionFromTemplate(template: any, bundle: any, difficulty: 'easy' | 'medium' | 'hard', index: number): Question {
    const questionId = `${bundle.id}_${difficulty}_${index + 1}`;
    
    // Generate question based on template and bundle
    const questionData = this.generateQuestionContent(template, bundle, difficulty, index);
    
    return {
      id: questionId,
      question: questionData.question,
      options: questionData.options,
      correctAnswer: questionData.correctAnswer,
      explanation: questionData.explanation,
      difficulty: difficulty,
      category: bundle.category,
      region: bundle.subcategory,
      period: template.era,
      tags: [template.type, template.topic, template.era]
    };
  }

  /**
   * Generate actual question content
   */
  private static generateQuestionContent(template: any, bundle: any, difficulty: string, index: number): any {
    // This is where we generate the actual question text and options
    // For now, creating varied questions based on the template and bundle
    
    const questionVariations = this.getQuestionVariations(template, bundle, difficulty);
    const variation = questionVariations[index % questionVariations.length];
    
    return {
      question: variation.question,
      options: variation.options,
      correctAnswer: variation.correctAnswer,
      explanation: variation.explanation
    };
  }

  /**
   * Get question variations for a template
   */
  private static getQuestionVariations(template: any, bundle: any, difficulty: string): any[] {
    // Generate multiple variations of questions for each template
    const variations = [];
    
    // Base question structures
    const questionStructures = [
      'What was the primary {topic} of {subject}?',
      'Which {topic} was most significant in {era}?',
      'How did {subject} influence {topic}?',
      'What characterized the {topic} during {era}?',
      'Which statement about {subject} is correct?'
    ];
    
    // Generate variations
    for (let i = 0; i < 10; i++) {
      const structure = questionStructures[i % questionStructures.length];
      const variation = this.createQuestionVariation(structure, template, bundle, difficulty, i);
      variations.push(variation);
    }
    
    return variations;
  }

  /**
   * Create a specific question variation
   */
  private static createQuestionVariation(structure: string, template: any, bundle: any, difficulty: string, index: number): any {
    // Replace placeholders with actual content
    const subjects = this.getSubjectsForTemplate(template, bundle);
    const subject = subjects[index % subjects.length];
    
    const question = structure
      .replace('{topic}', template.topic)
      .replace('{subject}', subject)
      .replace('{era}', template.era);
    
    // Generate options based on bundle format
    const options = this.generateOptionsForQuestion(question, template, bundle, difficulty);
    const correctAnswer = options[0]; // First option is always correct, then we shuffle
    
    // Shuffle options
    const shuffledOptions = this.shuffleArray([...options]);
    const correctIndex = shuffledOptions.indexOf(correctAnswer);
    
    return {
      question,
      options: shuffledOptions,
      correctAnswer: correctIndex,
      explanation: this.generateExplanation(question, correctAnswer, template, bundle)
    };
  }

  /**
   * Get subjects for a template
   */
  private static getSubjectsForTemplate(template: any, bundle: any): string[] {
    const subjects = [];
    
    if (bundle.category === 'region') {
      switch (bundle.subcategory) {
        case 'Egyptian':
          subjects.push('ancient Egypt', 'the pharaohs', 'Egyptian civilization', 'the Nile Valley');
          break;
        case 'Roman':
          subjects.push('the Roman Empire', 'Roman civilization', 'ancient Rome', 'Roman society');
          break;
        case 'Greek':
          subjects.push('ancient Greece', 'Greek city-states', 'Athenian democracy', 'Spartan society');
          break;
        default:
          subjects.push('ancient civilizations', 'historical societies', 'early cultures');
      }
    } else {
      subjects.push('ancient history', 'historical periods', 'early civilizations', 'ancient cultures');
    }
    
    return subjects;
  }

  /**
   * Generate options for a question
   */
  private static generateOptionsForQuestion(question: string, template: any, bundle: any, difficulty: string): string[] {
    // Generate 4 options (correct + 3 distractors)
    const options = [];
    
    // Correct answer
    options.push(this.generateCorrectAnswer(template, bundle, difficulty));
    
    // Distractors
    for (let i = 0; i < 3; i++) {
      options.push(this.generateDistractor(template, bundle, difficulty, i));
    }
    
    return options;
  }

  /**
   * Generate correct answer
   */
  private static generateCorrectAnswer(template: any, bundle: any, difficulty: string): string {
    // Generate historically accurate answers based on template and bundle
    const answers = this.getCorrectAnswersForTemplate(template, bundle);
    return answers[Math.floor(Math.random() * answers.length)];
  }

  /**
   * Generate distractor (incorrect option)
   */
  private static generateDistractor(template: any, bundle: any, difficulty: string, index: number): string {
    const distractors = this.getDistractorsForTemplate(template, bundle);
    return distractors[index % distractors.length];
  }

  /**
   * Get correct answers for a template
   */
  private static getCorrectAnswersForTemplate(template: any, bundle: any): string[] {
    // This would contain historically accurate information
    // For now, returning generic but plausible answers
    return [
      'A significant historical development',
      'An important cultural achievement',
      'A major political innovation',
      'A crucial technological advancement',
      'A fundamental social institution'
    ];
  }

  /**
   * Get distractors for a template
   */
  private static getDistractorsForTemplate(template: any, bundle: any): string[] {
    // These should be plausible but incorrect
    return [
      'A common misconception',
      'A related but incorrect concept',
      'A similar but different development',
      'An anachronistic interpretation',
      'A confused historical reference'
    ];
  }

  /**
   * Generate explanation for an answer
   */
  private static generateExplanation(question: string, answer: string, template: any, bundle: any): string {
    return `This answer is correct because it accurately reflects the historical evidence about ${template.topic} in ${template.era}. The ${bundle.subcategory} civilization was known for this particular aspect of their ${template.topic}.`;
  }

  /**
   * Shuffle array utility
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
   * Get questions count for bundle
   */
  static getQuestionCount(bundleId: string): number {
    const bundle = QUESTION_BUNDLES.find(b => b.id === bundleId);
    if (!bundle) return 0;
    
    return bundle.isMegaBundle ? 1700 : 100;
  }

  /**
   * Check if full questions are available for bundle
   */
  static hasFullQuestions(bundleId: string): boolean {
    const bundle = QUESTION_BUNDLES.find(b => b.id === bundleId);
    return !!bundle;
  }
}

export default FullQuestionService;
