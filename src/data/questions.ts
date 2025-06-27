import { Question, QuestionBundle } from '../types';
import { QUESTION_BUNDLES } from './bundles';

// Sample Ancient History Questions
export const sampleQuestions: Question[] = [
  {
    id: 'egypt-001',
    question: 'Which ancient Egyptian pharaoh is known for building the Great Pyramid of Giza?',
    options: ['Tutankhamun', 'Khufu', 'Ramesses II', 'Cleopatra'],
    correctAnswer: 1,
    difficulty: 'medium',
    category: 'Architecture',
    region: 'Egypt',
    period: 'Old Kingdom',
    explanation: 'Khufu (also known as Cheops) was the pharaoh who commissioned the Great Pyramid of Giza around 2580-2560 BCE.',
    tags: ['pyramid', 'pharaoh', 'giza']
  },
  {
    id: 'rome-001',
    question: 'In what year was Julius Caesar assassinated?',
    options: ['44 BCE', '45 BCE', '43 BCE', '46 BCE'],
    correctAnswer: 0,
    difficulty: 'medium',
    category: 'Politics',
    region: 'Rome',
    period: 'Late Republic',
    explanation: 'Julius Caesar was assassinated on the Ides of March (March 15) in 44 BCE by a group of senators.',
    tags: ['caesar', 'assassination', 'republic']
  },
  {
    id: 'greece-001',
    question: 'Who was the teacher of Alexander the Great?',
    options: ['Socrates', 'Plato', 'Aristotle', 'Pythagoras'],
    correctAnswer: 2,
    difficulty: 'easy',
    category: 'Philosophy',
    region: 'Greece',
    period: 'Classical',
    explanation: 'Aristotle was hired by Philip II of Macedon to tutor his son Alexander when Alexander was 13.',
    tags: ['alexander', 'aristotle', 'philosophy']
  },
  {
    id: 'mesopotamia-001',
    question: 'Which ancient civilization is credited with creating the first known system of writing?',
    options: ['Egyptians', 'Sumerians', 'Babylonians', 'Assyrians'],
    correctAnswer: 1,
    difficulty: 'medium',
    category: 'Culture',
    region: 'Mesopotamia',
    period: 'Bronze Age',
    explanation: 'The Sumerians developed cuneiform writing around 3200 BCE, making it one of the earliest known writing systems.',
    tags: ['writing', 'cuneiform', 'civilization']
  },
  {
    id: 'china-001',
    question: 'Which Chinese dynasty was the first to unify China under a single emperor?',
    options: ['Han Dynasty', 'Tang Dynasty', 'Qin Dynasty', 'Ming Dynasty'],
    correctAnswer: 2,
    difficulty: 'medium',
    category: 'Politics',
    region: 'China',
    period: 'Imperial',
    explanation: 'The Qin Dynasty (221-206 BCE) was the first to unify China under Emperor Qin Shi Huang.',
    tags: ['dynasty', 'unification', 'emperor']
  },
  {
    id: 'persia-001',
    question: 'What was the name of the ancient Persian religion founded by Zoroaster?',
    options: ['Mithraism', 'Zoroastrianism', 'Manichaeism', 'Mazdakism'],
    correctAnswer: 1,
    difficulty: 'hard',
    category: 'Religion',
    region: 'Persia',
    period: 'Classical',
    explanation: 'Zoroastrianism, founded by the prophet Zoroaster, was the dominant religion of the Persian Empire.',
    tags: ['religion', 'zoroaster', 'persia']
  },
  {
    id: 'maya-001',
    question: 'The Maya civilization was primarily located in which modern-day regions?',
    options: ['Peru and Bolivia', 'Mexico and Central America', 'Colombia and Venezuela', 'Chile and Argentina'],
    correctAnswer: 1,
    difficulty: 'easy',
    category: 'Geography',
    region: 'Mesoamerica',
    period: 'Classical',
    explanation: 'The Maya civilization flourished in southern Mexico, Guatemala, Belize, Honduras, and El Salvador.',
    tags: ['maya', 'mesoamerica', 'geography']
  },
  {
    id: 'india-001',
    question: 'Which ancient Indian empire was founded by Chandragupta Maurya?',
    options: ['Gupta Empire', 'Maurya Empire', 'Mughal Empire', 'Chola Empire'],
    correctAnswer: 1,
    difficulty: 'medium',
    category: 'Politics',
    region: 'India',
    period: 'Classical',
    explanation: 'Chandragupta Maurya founded the Maurya Empire around 321 BCE, which became one of the largest empires in ancient India.',
    tags: ['maurya', 'empire', 'chandragupta']
  },
  {
    id: 'viking-001',
    question: 'What were Viking longships primarily designed for?',
    options: ['Deep sea fishing', 'Coastal raids and river navigation', 'Cargo transport only', 'Naval battles'],
    correctAnswer: 1,
    difficulty: 'easy',
    category: 'Technology',
    region: 'Scandinavia',
    period: 'Medieval',
    explanation: 'Viking longships were designed for speed and shallow draft, allowing them to navigate rivers and conduct coastal raids.',
    tags: ['viking', 'ships', 'navigation']
  },
  {
    id: 'babylon-001',
    question: 'Who was the Babylonian king famous for his code of laws?',
    options: ['Nebuchadnezzar II', 'Hammurabi', 'Sargon', 'Cyrus the Great'],
    correctAnswer: 1,
    difficulty: 'medium',
    category: 'Law',
    region: 'Mesopotamia',
    period: 'Bronze Age',
    explanation: 'Hammurabi (r. 1792-1750 BCE) created one of the world\'s first written legal codes, known as the Code of Hammurabi.',
    tags: ['hammurabi', 'law', 'babylon']
  }
];

// Sample Question Bundles
export const questionBundles: QuestionBundle[] = [
  {
    id: 'ancient-egypt',
    name: 'Ancient Egypt',
    description: 'Explore the mysteries of pharaohs, pyramids, and the Nile civilization',
    questions: sampleQuestions.filter(q => q.region === 'Egypt'),
    difficulty: 'medium',
    category: 'Civilization',
    region: 'Egypt',
    period: 'All Periods',
    isPremium: false,
    icon: '🏺'
  },
  {
    id: 'roman-empire',
    name: 'Roman Empire',
    description: 'From Republic to Empire - the rise and fall of Rome',
    questions: sampleQuestions.filter(q => q.region === 'Rome'),
    difficulty: 'medium',
    category: 'Civilization',
    region: 'Rome',
    period: 'Classical',
    isPremium: false,
    icon: '🏛️'
  },
  {
    id: 'ancient-greece',
    name: 'Ancient Greece',
    description: 'Philosophy, democracy, and the birthplace of Western civilization',
    questions: sampleQuestions.filter(q => q.region === 'Greece'),
    difficulty: 'easy',
    category: 'Civilization',
    region: 'Greece',
    period: 'Classical',
    isPremium: false,
    icon: '⚱️'
  },
  {
    id: 'world-civilizations',
    name: 'World Civilizations Mix',
    description: 'A comprehensive mix of questions from civilizations around the world',
    questions: sampleQuestions,
    difficulty: 'medium',
    category: 'Mixed',
    region: 'Global',
    period: 'All Periods',
    isPremium: false,
    icon: '🌍'
  },
  {
    id: 'premium-masters',
    name: 'Masters Collection',
    description: 'Advanced questions for true history scholars',
    questions: sampleQuestions.filter(q => q.difficulty === 'hard'),
    difficulty: 'hard',
    category: 'Advanced',
    region: 'Global',
    period: 'All Periods',
    isPremium: true,
    price: 4.99,
    icon: '👑'
  }
];

// Utility functions
export const getQuestionsByDifficulty = (difficulty: 'easy' | 'medium' | 'hard'): Question[] => {
  return sampleQuestions.filter(q => q.difficulty === difficulty);
};

export const getQuestionsByRegion = (region: string): Question[] => {
  return sampleQuestions.filter(q => q.region.toLowerCase() === region.toLowerCase());
};

export const getQuestionsByCategory = (category: string): Question[] => {
  return sampleQuestions.filter(q => q.category.toLowerCase() === category.toLowerCase());
};

export const getRandomQuestions = (count: number): Question[] => {
  // Import EnhancedQuizService for better question distribution
  // For now, maintain backward compatibility with simple random selection
  const shuffled = [...sampleQuestions].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
};

// Enhanced random questions with proper distribution
export const getEnhancedRandomQuestions = (count: number = 10): Question[] => {
  // This will be used by the Enhanced Quiz Service
  // 33% Easy, 33% Medium, 33% Hard distribution
  const easyCount = Math.floor(count * 0.33);
  const mediumCount = Math.floor(count * 0.33);
  const hardCount = count - easyCount - mediumCount;
  
  const easyQuestions = sampleQuestions.filter(q => q.difficulty === 'easy');
  const mediumQuestions = sampleQuestions.filter(q => q.difficulty === 'medium');
  const hardQuestions = sampleQuestions.filter(q => q.difficulty === 'hard');
  
  const selectedQuestions: Question[] = [];
  
  // Shuffle and select from each difficulty
  const shuffledEasy = [...easyQuestions].sort(() => 0.5 - Math.random());
  const shuffledMedium = [...mediumQuestions].sort(() => 0.5 - Math.random());
  const shuffledHard = [...hardQuestions].sort(() => 0.5 - Math.random());
  
  selectedQuestions.push(...shuffledEasy.slice(0, easyCount));
  selectedQuestions.push(...shuffledMedium.slice(0, mediumCount));
  selectedQuestions.push(...shuffledHard.slice(0, hardCount));
  
  // Final shuffle to mix difficulties
  return selectedQuestions.sort(() => 0.5 - Math.random());
};

export const getBundleById = (id: string): QuestionBundle | undefined => {
  const enhancedBundle = QUESTION_BUNDLES.find(bundle => bundle.id === id);
  if (!enhancedBundle) return undefined;
  
  // Convert enhanced bundle to legacy format for compatibility
  return {
    id: enhancedBundle.id,
    name: enhancedBundle.name,
    description: enhancedBundle.description,
    questions: getQuestionsForBundle(id),
    difficulty: enhancedBundle.difficulty,
    category: enhancedBundle.subcategory,
    region: enhancedBundle.subcategory,
    period: enhancedBundle.historicalAge || 'Ancient',
    isPremium: enhancedBundle.isPremium,
    price: enhancedBundle.price,
    icon: '🏛️'
  };
};

export const getQuestionsForBundle = (bundleId: string): Question[] => {
  const bundle = QUESTION_BUNDLES.find(b => b.id === bundleId);
  if (!bundle) return [];
  
  // For now, return random questions filtered by bundle properties
  // In a real app, you would use bundle.questions array to get specific question IDs
  const filteredQuestions = sampleQuestions.filter(q => {
    // Match questions based on bundle category and subcategory
    switch (bundle.category) {
      case 'region':
        return q.region.toLowerCase() === bundle.subcategory.toLowerCase();
      case 'historical_age':
        return q.period.toLowerCase().includes(bundle.subcategory.toLowerCase());
      case 'difficulty':
        return q.difficulty === bundle.difficulty;
      default:
        return true;
    }
  });
  
  // Return up to the bundle's question count
  return filteredQuestions.slice(0, bundle.questionCount);
};
