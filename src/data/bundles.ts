import { QuestionBundle, BundleGroup, SubscriptionTier } from '../types/bundles';
import { getSampleQuestionsForBundle } from './sampleQuestions';

// Pricing configuration matching the original app
export const PRICING = {
  pack: 2.99,
  groupDiscount: 0.8, // 20% off
  allDiscount: 0.7,   // 30% off
  subscription: {
    pro: {
      monthly: 4.99,
      annual: 39.99,
      biennial: 69.99
    }
  }
};

export const SUBSCRIPTION_TIERS: SubscriptionTier[] = [
  {
    id: 'free',
    name: 'Free',
    price: 0,
    period: 'forever',
    features: [
      'Access to sample quizzes (10 questions each)',
      'Basic daily challenges',
      'Limited statistics',
      'Community features',
      'Ad-supported experience'
    ]
  },
  {
    id: 'pro_monthly',
    name: 'Pro Monthly',
    price: PRICING.subscription.pro.monthly,
    period: 'monthly',
    features: [
      'Access to all question bundles',
      'Unlimited quiz modes',
      'Advanced statistics & analytics',
      'Daily challenges & streaks',
      'Spaced repetition learning',
      'Offline access',
      'No advertisements'
    ]
  },
  {
    id: 'pro_annual',
    name: 'Pro Annual',
    price: PRICING.subscription.pro.annual,
    period: 'annual',
    features: [
      'Access to all question bundles',
      'Unlimited quiz modes',
      'Advanced statistics & analytics',
      'Daily challenges & streaks',
      'Spaced repetition learning',
      'Offline access',
      'No advertisements'
    ],
    savings: 'Save 33%',
    isPopular: true
  },
  {
    id: 'pro_biennial',
    name: 'Pro Biennial',
    price: PRICING.subscription.pro.biennial,
    period: 'biennial',
    features: [
      'Access to all question bundles',
      'Unlimited quiz modes',
      'Advanced statistics & analytics',
      'Daily challenges & streaks',
      'Spaced repetition learning',
      'Offline access',
      'No advertisements'
    ],
    savings: 'Save 42%'
  }
];

// Enhanced question bundles based on the original app structure
// Raw bundle data without the required fields
const RAW_BUNDLES = [
  // Region Packs
  {
    id: 'region_pack_rome',
    name: 'Ancient Rome Pack',
    description: 'Test your knowledge of Ancient Rome. 100 questions covering the Republic, Empire, culture, and key figures.',
    category: 'region',
    subcategory: 'Roman',
    price: PRICING.pack,
    questionCount: 100,
    questions: [], // Will be populated with actual question IDs
    sampleQuestions: [], // Will be populated with sample question IDs
    isPremium: true,
    isOwned: false,
    difficulty: 'medium',
    difficultyBreakdown: {
      easy: 25,
      medium: 50,
      hard: 25
    },
    format: 'Mixed',
    releaseDate: '2025-05-02',
    version: 'v1',
    isCurrentVersion: true,
    bpType: 'RegionPackType',
    iconName: 'shield-check', // Roman shields and military
    themeColors: {
      primary: '#DC2626',
      background: '#FEE2E2',
      text: '#FFFFFF'
    }
  },
  {
    id: 'region_pack_egypt',
    name: 'Ancient Egypt Pack',
    description: '100 questions about Ancient Egypt. Pharaohs, pyramids, culture, and the Nile civilization.',
    category: 'region',
    subcategory: 'Egyptian',
    price: PRICING.pack,
    questionCount: 100,
    questions: [],
    sampleQuestions: [], // Will be populated with sample question IDs
    isPremium: true,
    isOwned: false,
    difficulty: 'medium',
    difficultyBreakdown: {
      easy: 25,
      medium: 50,
      hard: 25
    },
    format: 'Mixed',
    releaseDate: '2025-05-02',
    version: 'v1',
    isCurrentVersion: true,
    bpType: 'RegionPackType',
    iconName: 'sun',
    themeColors: {
      primary: '#F59E0B',
      background: '#FEF3C7',
      text: '#78350F'
    }
  },
  {
    id: 'region_pack_greece',
    name: 'Ancient Greece Pack',
    description: '100 questions on Ancient Greece. Philosophy, democracy, mythology, and classical civilization.',
    category: 'region',
    subcategory: 'Greek',
    price: PRICING.pack,
    questionCount: 100,
    questions: [],
    sampleQuestions: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
    isPremium: true,
    isOwned: false,
    difficulty: 'medium',
    difficultyBreakdown: {
      easy: 25,
      medium: 50,
      hard: 25
    },
    format: 'Mixed',
    releaseDate: '2025-05-02',
    version: 'v1',
    isCurrentVersion: true,
    bpType: 'RegionPackType',
    iconName: 'building-library', // Classical Greek architecture
    themeColors: {
      primary: '#3B82F6',
      background: '#DBEAFE',
      text: '#FFFFFF'
    }
  },
  {
    id: 'region_pack_mesopotamia',
    name: 'Ancient Mesopotamia Pack',
    description: '100 questions on Mesopotamia. Sumer, Akkad, Babylon, and the cradle of civilization.',
    category: 'region',
    subcategory: 'Mesopotamian',
    price: PRICING.pack,
    questionCount: 100,
    questions: [],
    isPremium: true,
    isOwned: false,
    difficulty: 'hard',
    difficultyBreakdown: {
      easy: 25,
      medium: 50,
      hard: 25
    },
    format: 'Mixed',
    releaseDate: '2025-05-02',
    version: 'v1',
    bpType: 'RegionPackType',
    iconName: 'cube', // Representing ziggurats (cube-like structures)
    themeColors: {
      primary: '#10B981',
      background: '#D1FAE5',
      text: '#FFFFFF'
    }
  },
  {
    id: 'region_pack_china',
    name: 'Ancient China Pack',
    description: '100 questions on Ancient China. Dynasties, inventions, philosophy, and the Great Wall.',
    category: 'region',
    subcategory: 'Chinese',
    price: PRICING.pack,
    questionCount: 100,
    questions: [],
    isPremium: true,
    isOwned: false,
    difficulty: 'medium',
    difficultyBreakdown: {
      easy: 25,
      medium: 50,
      hard: 25
    },
    format: 'Mixed',
    releaseDate: '2025-05-02',
    version: 'v1',
    bpType: 'RegionPackType',
    iconName: 'building-office-2',
    themeColors: {
      primary: '#EF4444',
      background: '#FEE2E2',
      text: '#FFFFFF'
    }
  },
  {
    id: 'region_pack_india',
    name: 'Ancient India Pack',
    description: '100 questions about Ancient India. Vedic period, empires, religion, and cultural achievements.',
    category: 'region',
    subcategory: 'Indian',
    price: PRICING.pack,
    questionCount: 100,
    questions: [],
    isPremium: true,
    isOwned: false,
    difficulty: 'medium',
    difficultyBreakdown: {
      easy: 25,
      medium: 50,
      hard: 25
    },
    format: 'Mixed',
    releaseDate: '2025-05-02',
    version: 'v1',
    bpType: 'RegionPackType',
    iconName: 'sparkles', // Representing spiritual/mystical aspects of Indian culture
    themeColors: {
      primary: '#F97316',
      background: '#FFEDD5',
      text: '#FFFFFF'
    }
  },

  // Additional Region Packs
  {
    id: 'region_pack_americas',
    name: 'Ancient Americas Pack',
    description: '100 questions about Ancient Americas. Maya, Aztec, Inca, and other pre-Columbian civilizations.',
    category: 'region',
    subcategory: 'American',
    price: PRICING.pack,
    questionCount: 100,
    questions: [],
    isPremium: true,
    isOwned: false,
    difficulty: 'medium',
    difficultyBreakdown: {
      easy: 25,
      medium: 50,
      hard: 25
    },
    format: 'Mixed',
    releaseDate: '2025-05-02',
    version: 'v1',
    bpType: 'RegionPackType',
    iconName: 'globe-americas',
    themeColors: {
      primary: '#059669',
      background: '#D1FAE5',
      text: '#FFFFFF'
    }
  },
  {
    id: 'region_pack_europe',
    name: 'Ancient Europe Pack',
    description: '100 questions on Ancient Europe. Celtic, Germanic, Norse cultures and early European civilizations.',
    category: 'region',
    subcategory: 'European',
    price: PRICING.pack,
    questionCount: 100,
    questions: [],
    isPremium: true,
    isOwned: false,
    difficulty: 'medium',
    difficultyBreakdown: {
      easy: 25,
      medium: 50,
      hard: 25
    },
    format: 'Mixed',
    releaseDate: '2025-05-02',
    version: 'v1',
    bpType: 'RegionPackType',
    iconName: 'flag',
    themeColors: {
      primary: '#7C2D12',
      background: '#FED7AA',
      text: '#FFFFFF'
    }
  },

  // Age Packs
  {
    id: 'age_pack_bronze_age',
    name: 'Bronze Age Pack',
    description: '100 Bronze Age questions. Early civilizations, technology, and cultural developments.',
    category: 'historical_age',
    subcategory: 'Bronze Age',
    price: PRICING.pack,
    questionCount: 100,
    questions: [],
    isPremium: true,
    isOwned: false,
    difficulty: 'hard',
    difficultyBreakdown: {
      easy: 25,
      medium: 50,
      hard: 25
    },
    format: 'Mixed',
    historicalAge: 'Bronze Age',
    releaseDate: '2025-05-02',
    version: 'v1',
    bpType: 'AgePackType',
    iconName: 'bolt', // Representing metallurgy/forging
    themeColors: {
      primary: '#B45309',
      background: '#FED7AA',
      text: '#FFFFFF'
    }
  },
  {
    id: 'age_pack_iron_age',
    name: 'Iron Age Pack',
    description: '100 Iron Age questions. Advanced civilizations, warfare, and technological progress.',
    category: 'historical_age',
    subcategory: 'Iron Age',
    price: PRICING.pack,
    questionCount: 100,
    questions: [],
    isPremium: true,
    isOwned: false,
    difficulty: 'hard',
    difficultyBreakdown: {
      easy: 25,
      medium: 50,
      hard: 25
    },
    format: 'Mixed',
    historicalAge: 'Iron Age',
    releaseDate: '2025-05-02',
    version: 'v1',
    bpType: 'AgePackType',
    iconName: 'wrench-screwdriver', // Tools/metalworking
    themeColors: {
      primary: '#52525B',
      background: '#F4F4F5',
      text: '#FFFFFF'
    }
  },
  {
    id: 'age_pack_prehistoric',
    name: 'Prehistoric Age Pack',
    description: '100 Prehistoric Age questions. Early human history, evolution, and stone age cultures.',
    category: 'historical_age',
    subcategory: 'Prehistoric',
    price: PRICING.pack,
    questionCount: 100,
    questions: [],
    isPremium: true,
    isOwned: false,
    difficulty: 'hard',
    difficultyBreakdown: {
      easy: 25,
      medium: 50,
      hard: 25
    },
    format: 'Mixed',
    historicalAge: 'Prehistoric',
    releaseDate: '2025-05-02',
    version: 'v1',
    bpType: 'AgePackType',
    iconName: 'fire', // Representing discovery of fire
    themeColors: {
      primary: '#854D0E',
      background: '#FEF3C7',
      text: '#FFFFFF'
    }
  },

  // Format Packs
  {
    id: 'format_pack_multiple_choice',
    name: 'Multiple Choice Pack',
    description: '100 Multiple Choice questions. No mix - pure multiple choice format for focused practice.',
    category: 'format',
    subcategory: 'Multiple Choice',
    price: PRICING.pack,
    questionCount: 100,
    questions: [],
    isPremium: true,
    isOwned: false,
    difficulty: 'medium',
    difficultyBreakdown: {
      easy: 25,
      medium: 50,
      hard: 25
    },
    format: 'Multiple Choice',
    releaseDate: '2025-05-02',
    version: 'v1',
    bpType: 'FormatPackType',
    iconName: 'list-bullet',
    themeColors: {
      primary: '#0EA5E9',
      background: '#E0F2FE',
      text: '#FFFFFF'
    }
  },
  {
    id: 'format_pack_true_false',
    name: 'True/False Pack',
    description: '100 True/False questions. Quick decision-making and fundamental knowledge testing.',
    category: 'format',
    subcategory: 'True/False',
    price: PRICING.pack,
    questionCount: 100,
    questions: [],
    isPremium: true,
    isOwned: false,
    difficulty: 'easy',
    difficultyBreakdown: {
      easy: 25,
      medium: 50,
      hard: 25
    },
    format: 'True/False',
    releaseDate: '2025-05-02',
    version: 'v1',
    bpType: 'FormatPackType',
    iconName: 'check-circle',
    themeColors: {
      primary: '#14B8A6',
      background: '#CCFBF1',
      text: '#FFFFFF'
    }
  },
  {
    id: 'format_pack_fill_blank',
    name: 'Fill-in-the-Blank Pack',
    description: '100 Fill-in-the-Blank questions. Test your recall and specific knowledge with completion challenges.',
    category: 'format',
    subcategory: 'Fill-in-the-Blank',
    price: PRICING.pack,
    questionCount: 100,
    questions: [],
    isPremium: true,
    isOwned: false,
    difficulty: 'medium',
    difficultyBreakdown: {
      easy: 25,
      medium: 50,
      hard: 25
    },
    format: 'Fill-in-the-Blank',
    releaseDate: '2025-05-02',
    version: 'v1',
    bpType: 'FormatPackType',
    iconName: 'pencil-square',
    themeColors: {
      primary: '#7C3AED',
      background: '#EDE9FE',
      text: '#FFFFFF'
    }
  },

  // Difficulty Packs
  {
    id: 'difficulty_pack_easy',
    name: 'Easy Pack',
    description: '100 easy questions covering prehistoric, bronze age, iron age, and classical antiquity. Perfect for elementary school level.',
    category: 'difficulty',
    subcategory: 'Easy',
    price: PRICING.pack,
    questionCount: 100,
    questions: [],
    isPremium: true,
    isOwned: false,
    difficulty: 'easy',
    difficultyBreakdown: {
      easy: 100,
      medium: 0,
      hard: 0
    },
    format: 'Mixed',
    releaseDate: '2025-05-02',
    version: 'v1',
    bpType: 'DifficultyPackType',
    iconName: 'academic-cap',
    themeColors: {
      primary: '#22C55E',
      background: '#DCFCE7',
      text: '#FFFFFF'
    }
  },
  {
    id: 'difficulty_pack_medium',
    name: 'Medium Pack',
    description: '100 medium questions covering prehistoric, bronze age, iron age, and classical antiquity. Perfect for middle school level.',
    category: 'difficulty',
    subcategory: 'Medium',
    price: PRICING.pack,
    questionCount: 100,
    questions: [],
    isPremium: true,
    isOwned: false,
    difficulty: 'medium',
    difficultyBreakdown: {
      easy: 0,
      medium: 100,
      hard: 0
    },
    format: 'Mixed',
    releaseDate: '2025-05-02',
    version: 'v1',
    bpType: 'DifficultyPackType',
    iconName: 'book-open',
    themeColors: {
      primary: '#F59E0B',
      background: '#FEF3C7',
      text: '#FFFFFF'
    }
  },
  {
    id: 'difficulty_pack_hard',
    name: 'Hard Pack',
    description: '100 hard questions covering prehistoric, bronze age, iron age, and classical antiquity. Perfect for high school level.',
    category: 'difficulty',
    subcategory: 'Hard',
    price: PRICING.pack,
    questionCount: 100,
    questions: [],
    isPremium: true,
    isOwned: false,
    difficulty: 'hard',
    difficultyBreakdown: {
      easy: 0,
      medium: 0,
      hard: 100
    },
    format: 'Mixed',
    releaseDate: '2025-05-02',
    version: 'v1',
    bpType: 'DifficultyPackType',
    iconName: 'trophy',
    themeColors: {
      primary: '#EF4444',
      background: '#FEE2E2',
      text: '#FFFFFF'
    }
  }
];

// Export bundles with required properties added
export const QUESTION_BUNDLES: QuestionBundle[] = RAW_BUNDLES.map((bundle, index) => {
  const sampleQuestions = getSampleQuestionsForBundle(bundle.id);
  // Create numeric IDs for sample questions (starting from bundle index * 100)
  const baseId = (index + 1) * 100;
  const sampleQuestionIds = sampleQuestions.length > 0 
    ? sampleQuestions.map((_, i) => baseId + i + 1)
    : [baseId + 1, baseId + 2, baseId + 3, baseId + 4, baseId + 5, baseId + 6, baseId + 7, baseId + 8, baseId + 9, baseId + 10];
  
  return {
    ...bundle,
    sampleQuestions: sampleQuestionIds,
    isCurrentVersion: true
  } as QuestionBundle;
});

// Helper function to group bundles by category
export const getBundleGroups = (): BundleGroup[] => {
  const groups: { [key: string]: QuestionBundle[] } = {};
  
  QUESTION_BUNDLES.forEach(bundle => {
    if (!groups[bundle.category]) {
      groups[bundle.category] = [];
    }
    groups[bundle.category].push(bundle);
  });

  return Object.entries(groups).map(([category, bundles]) => {
    const totalPrice = bundles.length * PRICING.pack;
    const discountedPrice = totalPrice * PRICING.groupDiscount;
    
    return {
      groupType: category as any,
      groupName: getCategoryDisplayName(category),
      bundles,
      discountPercentage: 20,
      totalPrice,
      discountedPrice
    };
  });
};

function getCategoryDisplayName(category: string): string {
  switch (category) {
    case 'region': return 'Region Packs';
    case 'historical_age': return 'Historical Age Packs';
    case 'format': return 'Format Packs';
    case 'difficulty': return 'Difficulty Packs';
    default: return category;
  }
}
