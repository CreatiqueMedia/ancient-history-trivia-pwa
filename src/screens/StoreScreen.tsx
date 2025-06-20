import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  PlayIcon, 
  LockClosedIcon, 
  StarIcon,
  FunnelIcon,
  CheckCircleIcon,
  ShoppingCartIcon,
  FireIcon,
  CalendarDaysIcon,
  TrophyIcon,
  BeakerIcon as FlaskIcon
} from '@heroicons/react/24/solid';
import { 
  SunIcon, 
  BuildingLibraryIcon, 
  ShieldCheckIcon,
  BeakerIcon,
  BuildingOffice2Icon,
  GlobeAmericasIcon,
  WrenchScrewdriverIcon,
  HandRaisedIcon,
  ListBulletIcon,
  CheckCircleIcon as CheckIcon,
  AcademicCapIcon,
  BookOpenIcon,
  MapIcon,
  HomeIcon,
  CubeIcon,
  SparklesIcon,
  BoltIcon,
  FlagIcon,
  PencilSquareIcon
} from '@heroicons/react/24/outline';

import { QUESTION_BUNDLES, getBundleGroups, SUBSCRIPTION_TIERS } from '../data/bundles';
import { getSampleQuestionsForBundle } from '../data/sampleQuestions';
import { usePurchase } from '../context/PurchaseContext';
import { QuestionBundle, BundleGroup, SubscriptionTier } from '../types/bundles';

const StoreScreen: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'bundles' | 'subscription' | 'legacy'>('bundles');
  const [showSampleQuiz, setShowSampleQuiz] = useState<string | null>(null);
  
  const { 
    hasAccessToBundle, 
    isPremiumUser, 
    purchaseBundle, 
    purchaseGroup, 
    subscribe, 
    isProcessing 
  } = usePurchase();

  // Get version information
  const currentBundles = QUESTION_BUNDLES.filter(bundle => bundle.isCurrentVersion !== false);
  const legacyBundles = QUESTION_BUNDLES.filter(bundle => bundle.isCurrentVersion === false);

  // Handle sample quiz
  const handleSampleQuiz = (bundle: QuestionBundle) => {
    try {
      // Get the actual sample questions for this bundle
      const sampleQuestions = getSampleQuestionsForBundle(bundle.id);
      
      if (sampleQuestions.length === 0) {
        alert('Sample questions not available for this bundle yet.');
        return;
      }
      
      // Store the sample questions and navigate to quiz
      localStorage.setItem('sampleQuiz', JSON.stringify({
        bundleId: bundle.id,
        bundleName: bundle.name,
        version: bundle.version || 'v1',
        questions: sampleQuestions,
        isSample: true
      }));
      
      // Navigate to quiz screen with sample mode using React Router
      navigate(`/quiz/${bundle.id}?mode=sample`);
    } catch (error) {
      console.error('Sample quiz generation error:', error);
      alert('Unable to generate sample quiz. Please try again.');
    }
  };

  // Organize bundles into the sections you requested
  const organizeBundles = (bundleList: QuestionBundle[] = currentBundles) => {
    // Age Bundle Packs
    const ageBundles = bundleList.filter(bundle => 
      bundle.category === 'historical_age' && 
      ['Prehistoric', 'Bronze Age', 'Iron Age'].includes(bundle.subcategory)
    );

    // Format Bundle Packs  
    const formatBundles = bundleList.filter(bundle => 
      bundle.category === 'format' && 
      ['Multiple Choice', 'True/False', 'Fill-in-the-Blank'].includes(bundle.subcategory)
    );

    // Region Bundle Packs
    const regionBundles = bundleList.filter(bundle => 
      bundle.category === 'region' && 
      ['Roman', 'Egyptian', 'Greek', 'Mesopotamian', 'Chinese', 'Indian', 'American', 'European'].includes(bundle.subcategory)
    );

    // Other Bundle Packs (everything else)
    const otherBundles = bundleList.filter(bundle => {
      const isAge = bundle.category === 'historical_age' && ['Prehistoric', 'Bronze Age', 'Iron Age'].includes(bundle.subcategory);
      const isFormat = bundle.category === 'format' && ['Multiple Choice', 'True/False', 'Fill-in-the-Blank'].includes(bundle.subcategory);
      const isRegion = bundle.category === 'region' && ['Roman', 'Egyptian', 'Greek', 'Mesopotamian', 'Chinese', 'Indian', 'American', 'European'].includes(bundle.subcategory);
      
      return !isAge && !isFormat && !isRegion;
    });

    return {
      'Age Bundle Packs': ageBundles,
      'Format Bundle Packs': formatBundles, 
      'Region Bundle Packs': regionBundles,
      'Other Bundle Packs': otherBundles
    };
  };

  const bundleSections = organizeBundles();
  const legacyBundleSections = organizeBundles(legacyBundles);

  // Get icon component by name
  const getIconComponent = (iconName: string, className: string = "w-6 h-6") => {
    const iconMap: { [key: string]: React.ComponentType<any> } = {
      'sun': SunIcon,                          // Egypt - Sun god Ra
      'building-library': BuildingLibraryIcon, // Greece - Classical architecture  
      'shield-check': ShieldCheckIcon,         // Rome - Roman shields/military
      'cube': CubeIcon,                        // Mesopotamia - Ziggurats (cube-like)
      'building-office-2': BuildingOffice2Icon, // China - Pagodas/temples
      'sparkles': SparklesIcon,                // India - Spiritual/mystical
      'globe-americas': GlobeAmericasIcon,
      'wrench-screwdriver': WrenchScrewdriverIcon,
      'hand-raised': HandRaisedIcon,
      'list-bullet': ListBulletIcon,
      'check-circle': CheckIcon,
      'academic-cap': AcademicCapIcon,
      'trophy': TrophyIcon,
      'book-open': BookOpenIcon,
      'fire': FireIcon,
      'calendar-days': CalendarDaysIcon,
      'map': MapIcon,
      'home': HomeIcon,
      'bolt': BoltIcon,
      'flag': FlagIcon,
      'pencil-square': PencilSquareIcon,
    };
    
    const IconComponent = iconMap[iconName] || AcademicCapIcon;
    return <IconComponent className={className} />;
  };

  const filteredBundles = QUESTION_BUNDLES;

  const sortedBundles = [...filteredBundles];

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy':
        return 'bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300';
      case 'medium':
        return 'bg-yellow-100 dark:bg-yellow-900 text-yellow-700 dark:text-yellow-300';
      case 'hard':
        return 'bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-300';
      default:
        return 'bg-gray-100 dark:bg-gray-900 text-gray-700 dark:text-gray-300';
    }
  };

  const handlePurchaseBundle = async (bundle: QuestionBundle) => {
    if (hasAccessToBundle(bundle.id)) return;
    
    try {
      const success = await purchaseBundle(bundle.id);
      if (success) {
        alert(`Successfully purchased ${bundle.name}!`);
      }
    } catch (error) {
      alert('Purchase failed. Please try again.');
    }
  };

  const handlePurchaseGroup = async (group: BundleGroup) => {
    const bundleIds = group.bundles.map(b => b.id);
    try {
      const success = await purchaseGroup(bundleIds);
      if (success) {
        alert(`Successfully purchased ${group.groupName} bundle!`);
      }
    } catch (error) {
      alert('Purchase failed. Please try again.');
    }
  };

  const handleSubscribe = async (tier: SubscriptionTier) => {
    try {
      const success = await subscribe('pro', tier.period);
      if (success) {
        alert(`Successfully subscribed to ${tier.name}!`);
      }
    } catch (error) {
      alert('Subscription failed. Please try again.');
    }
  };

  const renderBundleCard = (bundle: QuestionBundle, showVersion: boolean = true) => {
    const isOwned = hasAccessToBundle(bundle.id);
    const canAccess = isOwned || isPremiumUser;

    return (
      <div 
        key={bundle.id}
        className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden hover:shadow-md transition-shadow"
      >
        {/* Header with theme colors */}
        <div 
          className="p-4 text-white relative"
          style={{ backgroundColor: bundle.themeColors.primary }}
        >
          <div className="flex items-start justify-between">
            <div className="flex items-center space-x-3">
              {getIconComponent(bundle.iconName, "w-8 h-8")}
              <div>
                <h3 className="font-bold text-lg">{bundle.name}</h3>
                <div className="flex items-center space-x-2">
                  <p className="text-sm opacity-90">{bundle.subcategory}</p>
                  {showVersion && (
                    <span className="bg-white/20 px-2 py-1 rounded text-xs font-medium">
                      {bundle.version}
                    </span>
                  )}
                </div>
              </div>
            </div>
            {canAccess && (
              <CheckCircleIcon className="w-6 h-6 text-white" />
            )}
          </div>
        </div>

        {/* Content */}
        <div className="p-4">
          <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">
            {bundle.description}
          </p>

          <div className="space-y-3 mb-4">
            {/* Question count and format */}
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-500 dark:text-gray-400">
                {bundle.questionCount} questions
              </span>
              <span className="text-sm text-gray-500 dark:text-gray-400">
                {bundle.format}
              </span>
              <span className="text-sm text-gray-500 dark:text-gray-400">
                Released: {new Date(bundle.releaseDate).toLocaleDateString()}
              </span>
            </div>
            
            {/* Difficulty breakdown */}
            <div className="space-y-2">
              <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">Question Difficulty:</h4>
              <div className="grid grid-cols-3 gap-2">
                <div className="text-center p-2 bg-green-50 dark:bg-green-900/20 rounded-md">
                  <div className="text-sm font-semibold text-green-700 dark:text-green-300">Easy</div>
                  <div className="text-xs text-green-600 dark:text-green-400">{bundle.difficultyBreakdown.easy} questions</div>
                </div>
                <div className="text-center p-2 bg-yellow-50 dark:bg-yellow-900/20 rounded-md">
                  <div className="text-sm font-semibold text-yellow-700 dark:text-yellow-300">Medium</div>
                  <div className="text-xs text-yellow-600 dark:text-yellow-400">{bundle.difficultyBreakdown.medium} questions</div>
                </div>
                <div className="text-center p-2 bg-red-50 dark:bg-red-900/20 rounded-md">
                  <div className="text-sm font-semibold text-red-700 dark:text-red-300">Hard</div>
                  <div className="text-xs text-red-600 dark:text-red-400">{bundle.difficultyBreakdown.hard} questions</div>
                </div>
              </div>
            </div>
          </div>

          {/* Sample Quiz Button - Always visible */}
          <div className="mb-4">
            <button
              onClick={() => handleSampleQuiz(bundle)}
              className="w-full bg-purple-100 hover:bg-purple-200 dark:bg-purple-900/30 dark:hover:bg-purple-900/50 text-purple-700 dark:text-purple-300 px-4 py-2 rounded-md text-sm font-medium flex items-center justify-center space-x-2 transition-colors border border-purple-200 dark:border-purple-700"
            >
              <FlaskIcon className="w-4 h-4" />
              <span>Take Sample Quiz (10 Questions)</span>
            </button>
          </div>

          {/* Action buttons */}
          <div className="flex items-center justify-between">
            <span className="text-lg font-bold text-gray-900 dark:text-white">
              ${bundle.price.toFixed(2)}
            </span>
            
            {canAccess ? (
              <Link 
                to="/quiz" 
                state={{ bundleId: bundle.id }}
                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md text-sm font-medium flex items-center space-x-2 transition-colors"
              >
                <PlayIcon className="w-4 h-4" />
                <span>Start Full Quiz</span>
              </Link>
            ) : (
              <button
                onClick={() => handlePurchaseBundle(bundle)}
                disabled={isProcessing}
                className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white px-4 py-2 rounded-md text-sm font-medium flex items-center space-x-2 transition-colors"
              >
                <ShoppingCartIcon className="w-4 h-4" />
                <span>{isProcessing ? 'Processing...' : 'Purchase'}</span>
              </button>
            )}
          </div>
        </div>
      </div>
    );
  };

  const renderGroupCard = (group: BundleGroup) => {
    const ownedCount = group.bundles.filter(b => hasAccessToBundle(b.id)).length;
    const allOwned = ownedCount === group.bundles.length;

    return (
      <div key={group.groupType} className="bg-gradient-to-r from-purple-500 to-blue-600 rounded-lg p-6 text-white mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-2xl font-bold mb-2">{group.groupName} Bundle</h3>
            <p className="text-purple-100 mb-4">
              Get all {group.bundles.length} {group.groupName.toLowerCase()} for {group.discountPercentage}% off!
            </p>
            <div className="flex items-center space-x-4">
              <span className="text-sm line-through opacity-75">${group.totalPrice.toFixed(2)}</span>
              <span className="text-2xl font-bold">${group.discountedPrice?.toFixed(2)}</span>
              <span className="bg-yellow-400 text-yellow-900 px-2 py-1 rounded text-sm font-medium">
                Save ${(group.totalPrice - (group.discountedPrice || 0)).toFixed(2)}
              </span>
            </div>
          </div>
          
          {allOwned ? (
            <div className="flex items-center space-x-2 text-green-300">
              <CheckCircleIcon className="w-6 h-6" />
              <span>Owned</span>
            </div>
          ) : (
            <button
              onClick={() => handlePurchaseGroup(group)}
              disabled={isProcessing}
              className="bg-white text-purple-600 px-6 py-3 rounded-lg font-medium hover:bg-gray-100 transition-colors disabled:bg-gray-300"
            >
              {isProcessing ? 'Processing...' : `Buy Bundle (${ownedCount}/${group.bundles.length} owned)`}
            </button>
          )}
        </div>
      </div>
    );
  };

  const renderSubscriptionCard = (tier: SubscriptionTier) => {
    return (
      <div key={tier.id} className={`rounded-lg p-6 border-2 ${
        tier.isPopular 
          ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' 
          : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800'
      }`}>
        {tier.isPopular && (
          <div className="text-center">
            <span className="bg-blue-500 text-white px-3 py-1 rounded-full text-sm font-medium">
              Most Popular
            </span>
          </div>
        )}
        
        <div className="text-center mt-4">
          <h3 className="text-xl font-bold text-gray-900 dark:text-white">{tier.name}</h3>
          <div className="mt-2">
            <span className="text-3xl font-bold text-gray-900 dark:text-white">${tier.price}</span>
            <span className="text-gray-500 dark:text-gray-400">/{tier.period}</span>
          </div>
          {tier.savings && (
            <span className="inline-block mt-2 bg-green-100 text-green-800 px-2 py-1 rounded text-sm">
              {tier.savings}
            </span>
          )}
        </div>

        <ul className="mt-6 space-y-3">
          {tier.features.map((feature: string, index: number) => (
            <li key={index} className="flex items-center text-sm text-gray-600 dark:text-gray-400">
              <CheckCircleIcon className="w-5 h-5 text-green-500 mr-3 flex-shrink-0" />
              {feature}
            </li>
          ))}
        </ul>

        <button
          onClick={() => handleSubscribe(tier)}
          disabled={isProcessing || isPremiumUser}
          className={`w-full mt-6 py-3 px-4 rounded-lg font-medium transition-colors ${
            tier.isPopular 
              ? 'bg-blue-600 hover:bg-blue-700 text-white' 
              : 'bg-gray-900 hover:bg-gray-800 text-white dark:bg-white dark:text-gray-900 dark:hover:bg-gray-100'
          } disabled:bg-gray-400 disabled:cursor-not-allowed`}
        >
          {isPremiumUser ? 'Current Plan' : isProcessing ? 'Processing...' : 'Subscribe'}
        </button>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 shadow-sm">
        <div className="max-w-6xl mx-auto px-4 py-6">
          <div className="text-center mb-6">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center justify-center gap-2">
              <StarIcon className="w-8 h-8 text-yellow-500" />
              Ancient History Store
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-2">
              Expand your knowledge with premium question bundles and features
            </p>
          </div>

          {/* Version Information Banner */}
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-lg p-4 mb-6 border border-blue-200 dark:border-blue-800">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="bg-blue-100 dark:bg-blue-900/30 rounded-full p-2">
                  <CalendarDaysIcon className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white">
                    Current Question Versions
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Latest release: {new Date().toLocaleDateString()}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                  v1
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400">
                  Next release: Coming Soon
                </div>
              </div>
            </div>
          </div>

          {/* Tab Navigation */}
          <div className="flex justify-center mb-6">
            <div className="flex bg-gray-100 dark:bg-gray-700 rounded-lg p-1">
              <button
                onClick={() => setActiveTab('bundles')}
                className={`px-6 py-2 rounded-md text-sm font-medium transition-colors flex items-center space-x-2 ${
                  activeTab === 'bundles'
                    ? 'bg-white dark:bg-gray-600 text-gray-900 dark:text-white shadow-sm'
                    : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white'
                }`}
              >
                <span>Current Packs</span>
                <span className="bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 px-2 py-1 rounded-full text-xs">
                  {currentBundles.length}
                </span>
              </button>
              <button
                onClick={() => setActiveTab('subscription')}
                className={`px-6 py-2 rounded-md text-sm font-medium transition-colors ${
                  activeTab === 'subscription'
                    ? 'bg-white dark:bg-gray-600 text-gray-900 dark:text-white shadow-sm'
                    : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white'
                }`}
              >
                Premium Subscription
              </button>
              {legacyBundles.length > 0 && (
                <button
                  onClick={() => setActiveTab('legacy')}
                  className={`px-6 py-2 rounded-md text-sm font-medium transition-colors flex items-center space-x-2 ${
                    activeTab === 'legacy'
                      ? 'bg-white dark:bg-gray-600 text-gray-900 dark:text-white shadow-sm'
                      : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white'
                  }`}
                >
                  <span>Previous Versions</span>
                  <span className="bg-gray-200 dark:bg-gray-600 text-gray-600 dark:text-gray-300 px-2 py-1 rounded-full text-xs">
                    {legacyBundles.length}
                  </span>
                </button>
              )}
            </div>
          </div>

          {/* Section Header for Bundle Packs */}
          {activeTab === 'bundles' && (
            <div className="text-center mb-6">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                Bundle Packs
              </h2>
              <p className="text-gray-600 dark:text-gray-400 mt-1">
                Organized by category for easy browsing
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Content Area */}
      <div className="max-w-6xl mx-auto px-4 py-8">
        {activeTab === 'bundles' ? (
          <>
            {/* Organized Bundle Sections */}
            <div className="space-y-12">
              {/* Loop through sections in custom order */}
              {Object.entries(bundleSections)
                .sort(([a], [b]) => {
                  // Define custom order with Other Bundle Packs last
                  const order = ['Age Bundle Packs', 'Format Bundle Packs', 'Region Bundle Packs', 'Other Bundle Packs'];
                  const aIndex = order.indexOf(a);
                  const bIndex = order.indexOf(b);
                  
                  // If both sections are in our defined order, sort by that order
                  if (aIndex !== -1 && bIndex !== -1) {
                    return aIndex - bIndex;
                  }
                  
                  // If only one is in our order, prioritize the ordered one
                  if (aIndex !== -1) return -1;
                  if (bIndex !== -1) return 1;
                  
                  // For any other sections, fall back to alphabetical
                  return a.localeCompare(b);
                })
                .map(([sectionName, bundles]) => (
                  bundles.length > 0 && (
                    <div key={sectionName} className="space-y-6">
                      <div className="text-center">
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                          {sectionName}
                        </h2>
                        <div className="w-24 h-1 bg-gradient-to-r from-blue-500 to-purple-500 mx-auto rounded-full"></div>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {bundles.map(bundle => renderBundleCard(bundle))}
                      </div>
                    </div>
                  )
                ))}
            </div>

            {/* Empty State */}
            {Object.values(bundleSections).every(bundles => bundles.length === 0) && (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">📚</div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                  No bundles found
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Check back later for new content.
                </p>
              </div>
            )}
          </>
        ) : activeTab === 'subscription' ? (
          <>
            {/* Subscription Plans */}
            <div className="mb-8">
              <div className="text-center mb-8">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                  Choose Your Plan
                </h2>
                <p className="text-gray-600 dark:text-gray-400">
                  Unlock all premium features and question bundles
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {SUBSCRIPTION_TIERS.map(tier => renderSubscriptionCard(tier))}
              </div>
            </div>

            {/* Premium Benefits */}
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4 text-center">
                Why Go Premium?
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <CheckCircleIcon className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                    <div>
                      <h4 className="font-medium text-gray-900 dark:text-white">Access All Bundles</h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Unlimited access to all question bundles</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircleIcon className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                    <div>
                      <h4 className="font-medium text-gray-900 dark:text-white">Advanced Analytics</h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Detailed progress tracking and insights</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircleIcon className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                    <div>
                      <h4 className="font-medium text-gray-900 dark:text-white">No Advertisements</h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Enjoy an ad-free learning experience</p>
                    </div>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <CheckCircleIcon className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                    <div>
                      <h4 className="font-medium text-gray-900 dark:text-white">Early Access</h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Get new content before everyone else</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircleIcon className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                    <div>
                      <h4 className="font-medium text-gray-900 dark:text-white">Priority Support</h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Get help when you need it most</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircleIcon className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                    <div>
                      <h4 className="font-medium text-gray-900 dark:text-white">Exclusive Content</h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Premium-only questions and features</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </>
        ) : activeTab === 'legacy' ? (
          <>
            {/* Legacy Versions */}
            <div className="mb-8">
              <div className="text-center mb-8">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                  Previous Question Versions
                </h2>
                <p className="text-gray-600 dark:text-gray-400">
                  Access older versions of question packs for additional practice
                </p>
              </div>

              {/* Legacy Bundle Sections */}
              <div className="space-y-12">
                {Object.entries(legacyBundleSections)
                  .sort(([a], [b]) => a.localeCompare(b))
                  .map(([sectionName, bundles]) => (
                    bundles.length > 0 && (
                      <div key={sectionName} className="space-y-6">
                        <div className="text-center">
                          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                            {sectionName} - Legacy Versions
                          </h2>
                          <div className="w-24 h-1 bg-gradient-to-r from-gray-400 to-gray-600 mx-auto rounded-full"></div>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                          {bundles.map(bundle => renderBundleCard(bundle, true))}
                        </div>
                      </div>
                    )
                  ))}
              </div>

              {/* Empty State for Legacy */}
              {Object.values(legacyBundleSections).every(bundles => bundles.length === 0) && (
                <div className="text-center py-12">
                  <div className="text-6xl mb-4">🏛️</div>
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                    No Legacy Versions Available
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    Previous versions will appear here when new releases are published.
                  </p>
                </div>
              )}
            </div>
          </>
        ) : null}

        {/* Info Section */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
              <BookOpenIcon className="w-5 h-5" />
              About Our Bundles
            </h3>
            <ul className="text-gray-600 dark:text-gray-400 space-y-2 text-sm">
              <li>• Carefully researched historical questions</li>
              <li>• Multiple difficulty levels available</li>
              <li>• Detailed explanations for learning</li>
              <li>• Regular updates with new content</li>
              <li>• Organized by regions, periods, and themes</li>
            </ul>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
              <StarIcon className="w-5 h-5 text-yellow-500" />
              Quality Promise
            </h3>
            <ul className="text-gray-600 dark:text-gray-400 space-y-2 text-sm">
              <li>• Expert-reviewed content</li>
              <li>• Historically accurate information</li>
              <li>• Engaging and educational format</li>
              <li>• Satisfaction guaranteed</li>
              <li>• Continuous improvements</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StoreScreen;
