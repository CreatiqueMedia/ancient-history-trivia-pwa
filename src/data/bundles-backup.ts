import { QuestionBundle, BundleGroup, SubscriptionTier } from '../types/bundles';

// Pricing configuration matching the original app
export const PRICING = {
  pack: 1.99,
  groupDiscount: 0.8, // 20% off
  allDiscount: 0.7,   // 30% off
  subscription: {
    pro: {
      monthly: 2.99,
      annual: 29.99,
      biennial: 49.99
    }
  }
};

export const SUBSCRIPTION_TIERS: SubscriptionTier[] = [
  {
    id: 'free',
    name: 'Free',
    price: 0,
    period: 'monthly',
    features: [
      'Access to basic question set',
      'Standard quiz modes',
      'Basic statistics',
      'Limited daily challenges'
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
    savings: 'Save 15%',
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
    savings: 'Save 20%'
  }
];

// Enhanced question bundles based on the original app structure
export const QUESTION_BUNDLES: QuestionBundle[] = [
  // Region Packs
  {
    id: 'region_pack_rome',
    name: 'Ancient Rome',
    description: 'Test your knowledge of Ancient Rome. 100 questions covering the Republic, Empire, culture, and key figures.',
    category: 'region',
    subcategory: 'Roman',
    price: PRICING.pack,
    questionCount: 100,
    questions: [], // Will be populated with actual question IDs
    isPremium: true,
    isOwned: false,
    difficulty: 'medium',
    difficultyBreakdown: {
      easy: 30,
      medium: 45,
      hard: 25
    },
    format: 'Mixed',
    releaseDate: '2025-05-02',
    version: 'v1',
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
    name: 'Ancient Egypt',
    description: '100 questions about Ancient Egypt. Pharaohs, pyramids, culture, and the Nile civilization.',
    category: 'region',
    subcategory: 'Egyptian',
    price: PRICING.pack,
    questionCount: 100,
    questions: [],
    isPremium: true,
    isOwned: false,
    difficulty: 'medium',
    difficultyBreakdown: {
      easy: 35,
      medium: 40,
      hard: 25
    },
    format: 'Mixed',
    releaseDate: '2025-05-02',
    version: 'v1',
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
    name: 'Ancient Greece',
    description: '100 questions on Ancient Greece. Philosophy, democracy, mythology, and classical civilization.',
    category: 'region',
    subcategory: 'Greek',
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
    iconName: 'building-library', // Classical Greek architecture
    themeColors: {
      primary: '#3B82F6',
      background: '#DBEAFE',
      text: '#FFFFFF'
    }
  },
  {
    id: 'region_pack_mesopotamia',
    name: 'Ancient Mesopotamia',
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
      easy: 20,
      medium: 40,
      hard: 40
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
    name: 'Ancient China',
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
      easy: 30,
      medium: 45,
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
    name: 'Ancient India',
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
      easy: 35,
      medium: 40,
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

  // Age Packs
  {
    id: 'age_pack_bronze_age',
    name: 'Bronze Age',
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
      easy: 20,
      medium: 40,
      hard: 40
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
    name: 'Iron Age',
    description: '100 Iron Age questions. Advanced civilizations, warfare, and technological progress.',
    category: 'historical_age',
    subcategory: 'Iron Age',
    price: PRICING.pack,
    questionCount: 100,
    questions: [],
    isPremium: true,
    isOwned: false,
    difficulty: 'hard',
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
    name: 'Prehistoric Age',
    description: '100 Prehistoric Age questions. Early human history, evolution, and stone age cultures.',
    category: 'historical_age',
    subcategory: 'Prehistoric',
    price: PRICING.pack,
    questionCount: 100,
    questions: [],
    isPremium: true,
    isOwned: false,
    difficulty: 'hard',
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

  // Difficulty Packs
  {
    id: 'difficulty_pack_beginner',
    name: 'Beginner Pack',
    description: '100 Beginner questions. Perfect for newcomers to ancient history.',
    category: 'difficulty',
    subcategory: 'Beginner',
    price: PRICING.pack,
    questionCount: 100,
    questions: [],
    isPremium: true,
    isOwned: false,
    difficulty: 'easy',
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
    id: 'difficulty_pack_advanced',
    name: 'Advanced Pack',
    description: '100 Advanced questions. For experts and serious historians only.',
    category: 'difficulty',
    subcategory: 'Advanced',
    price: PRICING.pack,
    questionCount: 100,
    questions: [],
    isPremium: true,
    isOwned: false,
    difficulty: 'hard',
    format: 'Mixed',
    releaseDate: '2025-05-02',
    version: 'v1',
    bpType: 'DifficultyPackType',
    iconName: 'trophy',
    themeColors: {
      primary: '#7C3AED',
      background: '#EDE9FE',
      text: '#FFFFFF'
    }
  }
];

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
