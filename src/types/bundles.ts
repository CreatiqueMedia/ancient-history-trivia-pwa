// Bundle types for the Ancient History PWA Store
export type BundleCategory = 'region' | 'historical_age' | 'format' | 'difficulty';

export type RegionCategory = 
  | 'Egyptian' 
  | 'Greek' 
  | 'Roman' 
  | 'Mesopotamian' 
  | 'Chinese' 
  | 'Indian' 
  | 'African' 
  | 'Americas' 
  | 'Other';

export type HistoricalAge = 
  | 'Prehistoric' 
  | 'Bronze Age' 
  | 'Iron Age' 
  | 'Classical Period' 
  | 'Stone Age';

export type BundleDifficulty = 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert';

export type QuestionFormat = 'Multiple Choice' | 'True/False' | 'Fill-in-the-Blank' | 'Mixed';

export interface QuestionBundle {
  id: string;
  name: string;
  description: string;
  category: BundleCategory;
  subcategory: string; // The specific region, age, etc.
  price: number; // In USD
  questionCount: number;
  questions: number[]; // Array of question IDs
  sampleQuestions: number[]; // Array of 10 sample question IDs (3 easy, 4 medium, 3 hard)
  isPremium: boolean;
  isOwned: boolean;
  difficulty: 'easy' | 'medium' | 'hard'; // Overall difficulty rating (for compatibility)
  difficultyBreakdown: {
    easy: number;
    medium: number;
    hard: number;
  }; // Questions per difficulty level
  format: QuestionFormat;
  historicalAge?: HistoricalAge;
  releaseDate: string;
  version: string; // Current version (e.g., "v1", "v2", etc.)
  versionHistory?: BundleVersion[]; // Previous versions
  isCurrentVersion: boolean; // True if this is the latest version
  bpType: 'RegionPackType' | 'AgePackType' | 'FormatPackType' | 'DifficultyPackType';
  imageUrl?: string;
  iconName: string; // For Heroicons
  themeColors: {
    primary: string;
    background: string;
    text: string;
  };
}

export interface BundleVersion {
  version: string;
  releaseDate: string;
  questionCount: number;
  sampleQuestions: number[];
  isAvailable: boolean; // Can users still purchase this version?
  price: number; // Price might change between versions
}

export interface BundleGroup {
  groupType: BundleCategory;
  groupName: string;
  bundles: QuestionBundle[];
  discountPercentage?: number;
  totalPrice: number;
  discountedPrice?: number;
}

export interface SubscriptionTier {
  id: string;
  name: string;
  price: number;
  period: 'monthly' | 'annual' | 'biennial';
  features: string[];
  savings?: string;
  isPopular?: boolean;
}

export interface PurchaseContext {
  ownedBundles: string[];
  subscriptionTier: 'free' | 'pro';
  subscriptionPeriod: 'none' | 'monthly' | 'annual' | 'biennial';
  subscriptionExpiry?: string;
  purchaseBundle: (bundleId: string) => Promise<boolean>;
  purchaseGroup: (bundleIds: string[]) => Promise<boolean>;
  subscribe: (tier: string, period: string) => Promise<boolean>;
  restorePurchases: () => Promise<void>;
}
