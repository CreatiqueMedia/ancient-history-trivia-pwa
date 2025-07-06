import React from 'react';
import { Link } from 'react-router-dom';
import { 
  ArrowLeftIcon, 
  GlobeAltIcon, 
  HeartIcon, 
  AcademicCapIcon, 
  BookOpenIcon,
  LightBulbIcon,
  TrophyIcon,
  FireIcon,
  StarIcon,
  CheckCircleIcon
} from '@heroicons/react/24/outline';
import { Logo } from '../components/Logo';

const AboutScreen: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="bg-gradient-to-r from-primary-600 to-primary-800 text-white">
        <div className="max-w-4xl mx-auto px-4 py-6">
          <div className="flex items-center mb-4">
            <Link
              to="/"
              className="flex items-center text-white hover:text-primary-200 transition-colors mr-4"
            >
              <ArrowLeftIcon className="w-5 h-5 mr-2" />
              Back to Home
            </Link>
          </div>
          
          <div className="text-center">
            <div className="flex justify-center mb-4">
              <Logo size={60} className="drop-shadow-lg" />
            </div>
            <h1 className="text-3xl md:text-4xl font-bold mb-2">About</h1>
            <p className="text-primary-100 text-lg">Learn about The Awakened Hybrid</p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* App Overview Section */}
        <div className="card p-8 mb-8">
          <div className="text-center mb-8">
            <div className="flex justify-center mb-4">
              <Logo size={48} className="drop-shadow-lg" />
            </div>
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              Ancient History Trivia App
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-400">
              Your comprehensive educational platform for exploring ancient civilizations
            </p>
          </div>

          <div className="prose prose-lg max-w-none dark:prose-invert">
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-6">
              Welcome to the Ancient History Trivia app - more than just a quiz game, this is a complete educational 
              platform designed to make learning about ancient civilizations engaging, comprehensive, and rewarding. 
              Whether you're an elementary student just beginning to explore history or a high school scholar diving 
              deep into complex historical concepts, our app adapts to your learning level.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
              <div className="bg-blue-50 dark:bg-blue-900/20 p-6 rounded-lg">
                <div className="flex items-center mb-4">
                  <AcademicCapIcon className="w-6 h-6 text-blue-600 dark:text-blue-400 mr-3" />
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white">Educational Focus</h3>
                </div>
                <p className="text-gray-700 dark:text-gray-300 text-sm">
                  Every quiz is carefully designed with educational value in mind, featuring questions that span 
                  elementary to high school difficulty levels with rich explanations and historical context.
                </p>
              </div>

              <div className="bg-green-50 dark:bg-green-900/20 p-6 rounded-lg">
                <div className="flex items-center mb-4">
                  <BookOpenIcon className="w-6 h-6 text-green-600 dark:text-green-400 mr-3" />
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white">Comprehensive Content</h3>
                </div>
                <p className="text-gray-700 dark:text-gray-300 text-sm">
                  Explore ancient civilizations from around the world including Egypt, Rome, Greece, Mesopotamia, 
                  China, India, and the Americas across different historical periods.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Quiz System Explanation */}
        <div className="card p-8 mb-8">
          <div className="flex items-center mb-6">
            <LightBulbIcon className="w-8 h-8 text-yellow-500 mr-4" />
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white">Intelligent Quiz System</h3>
          </div>

          <div className="space-y-6">
            <div className="bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20 p-6 rounded-lg">
              <h4 className="text-lg font-bold text-gray-900 dark:text-white mb-3">Smart Question Distribution</h4>
              <p className="text-gray-700 dark:text-gray-300 mb-4">
                Our enhanced quiz system ensures every quiz provides balanced educational value:
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center">
                  <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center text-white font-bold text-lg mx-auto mb-2">
                    33%
                  </div>
                  <div className="font-semibold text-gray-900 dark:text-white">Easy Questions</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Elementary School Level</div>
                </div>
                <div className="text-center">
                  <div className="w-12 h-12 bg-yellow-500 rounded-full flex items-center justify-center text-white font-bold text-lg mx-auto mb-2">
                    33%
                  </div>
                  <div className="font-semibold text-gray-900 dark:text-white">Medium Questions</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Middle School Level</div>
                </div>
                <div className="text-center">
                  <div className="w-12 h-12 bg-red-500 rounded-full flex items-center justify-center text-white font-bold text-lg mx-auto mb-2">
                    33%
                  </div>
                  <div className="font-semibold text-gray-900 dark:text-white">Hard Questions</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">High School Level</div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-gray-50 dark:bg-gray-800 p-6 rounded-lg">
                <h4 className="text-lg font-bold text-gray-900 dark:text-white mb-3">Enhanced Question Display</h4>
                <ul className="space-y-2 text-gray-700 dark:text-gray-300">
                  <li className="flex items-center">
                    <span className="w-2 h-2 bg-blue-500 rounded-full mr-3"></span>
                    📍 Regional information (Egypt, Rome, Greece, etc.)
                  </li>
                  <li className="flex items-center">
                    <span className="w-2 h-2 bg-purple-500 rounded-full mr-3"></span>
                    ⏳ Historical age context (Bronze Age, Iron Age, etc.)
                  </li>
                  <li className="flex items-center">
                    <span className="w-2 h-2 bg-green-500 rounded-full mr-3"></span>
                    📚 Subject categories (Architecture, Politics, Religion)
                  </li>
                  <li className="flex items-center">
                    <span className="w-2 h-2 bg-yellow-500 rounded-full mr-3"></span>
                    🎓 Educational level indicators
                  </li>
                </ul>
              </div>

              <div className="bg-gray-50 dark:bg-gray-800 p-6 rounded-lg">
                <h4 className="text-lg font-bold text-gray-900 dark:text-white mb-3">Question Formats</h4>
                <ul className="space-y-2 text-gray-700 dark:text-gray-300">
                  <li className="flex items-center">
                    <span className="w-2 h-2 bg-blue-500 rounded-full mr-3"></span>
                    Multiple Choice questions for concept understanding
                  </li>
                  <li className="flex items-center">
                    <span className="w-2 h-2 bg-green-500 rounded-full mr-3"></span>
                    True/False questions for quick knowledge checks
                  </li>
                  <li className="flex items-center">
                    <span className="w-2 h-2 bg-purple-500 rounded-full mr-3"></span>
                    Fill-in-the-Blank for specific recall testing
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Bundle System Explanation */}
        <div className="card p-8 mb-8">
          <div className="flex items-center mb-6">
            <BookOpenIcon className="w-8 h-8 text-blue-500 mr-4" />
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white">Question Bundle System</h3>
          </div>

          <div className="space-y-6">
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
              Our comprehensive bundle system organizes content into focused learning modules, each containing 
              100 carefully curated questions with 10-question sample quizzes available for preview.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-lg border border-yellow-200 dark:border-yellow-700">
                <div className="text-center">
                  <div className="text-2xl mb-2">🌍</div>
                  <h4 className="font-bold text-gray-900 dark:text-white">Region Packs</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                    Ancient Rome, Egypt, Greece, Mesopotamia, China, India, Americas, Europe
                  </p>
                </div>
              </div>

              <div className="bg-orange-50 dark:bg-orange-900/20 p-4 rounded-lg border border-orange-200 dark:border-orange-700">
                <div className="text-center">
                  <div className="text-2xl mb-2">⏳</div>
                  <h4 className="font-bold text-gray-900 dark:text-white">Age Packs</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                    Prehistoric, Bronze Age, Iron Age periods
                  </p>
                </div>
              </div>

              <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg border border-green-200 dark:border-green-700">
                <div className="text-center">
                  <div className="text-2xl mb-2">🎯</div>
                  <h4 className="font-bold text-gray-900 dark:text-white">Difficulty Packs</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                    Easy, Medium, Hard - maintain specific difficulty levels
                  </p>
                </div>
              </div>

              <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-lg border border-purple-200 dark:border-purple-700">
                <div className="text-center">
                  <div className="text-2xl mb-2">📝</div>
                  <h4 className="font-bold text-gray-900 dark:text-white">Format Packs</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                    Multiple Choice, True/False, Fill-in-the-Blank
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-blue-50 dark:bg-blue-900/20 p-6 rounded-lg">
              <h4 className="text-lg font-bold text-gray-900 dark:text-white mb-3">Bundle Pricing</h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">$2.99</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Individual Bundle</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600 dark:text-green-400">20% Off</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Group Discounts</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">30% Off</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">All Bundles Package</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Daily Challenges & Achievements */}
        <div className="card p-8 mb-8">
          <div className="flex items-center mb-6">
            <TrophyIcon className="w-8 h-8 text-yellow-500 mr-4" />
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white">Daily Challenges & Achievements</h3>
          </div>

          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-gradient-to-br from-orange-50 to-red-50 dark:from-orange-900/20 dark:to-red-900/20 p-6 rounded-lg">
                <div className="flex items-center mb-4">
                  <FireIcon className="w-6 h-6 text-orange-500 mr-3" />
                  <h4 className="text-lg font-bold text-gray-900 dark:text-white">Daily Challenges</h4>
                </div>
                <ul className="space-y-2 text-gray-700 dark:text-gray-300 text-sm">
                  <li>• Fresh themed challenges every day</li>
                  <li>• Build and maintain learning streaks</li>
                  <li>• Earn XP, badges, and streak bonuses</li>
                  <li>• 8 rotating themes (Ancient Empires, Legendary Rulers, etc.)</li>
                  <li>• Automatic difficulty cycling for balanced learning</li>
                </ul>
              </div>

              <div className="bg-gradient-to-br from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20 p-6 rounded-lg">
                <div className="flex items-center mb-4">
                  <TrophyIcon className="w-6 h-6 text-yellow-500 mr-3" />
                  <h4 className="text-lg font-bold text-gray-900 dark:text-white">Achievement System</h4>
                </div>
                <ul className="space-y-2 text-gray-700 dark:text-gray-300 text-sm">
                  <li>• Unlock achievements for various accomplishments</li>
                  <li>• Track progress across different categories</li>
                  <li>• Daily challenge achievements and streaks</li>
                  <li>• Category mastery and difficulty achievements</li>
                  <li>• Visual progress tracking and completion rates</li>
                </ul>
              </div>
            </div>

            <div className="bg-gradient-to-r from-purple-100 to-blue-100 dark:from-purple-900/20 dark:to-blue-900/20 p-6 rounded-lg">
              <h4 className="text-lg font-bold text-gray-900 dark:text-white mb-3">Streak Rewards & Milestones</h4>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center">
                  <div className="text-xl font-bold text-yellow-600 dark:text-yellow-400">3 Days</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Beginner Streak</div>
                </div>
                <div className="text-center">
                  <div className="text-xl font-bold text-orange-600 dark:text-orange-400">7 Days</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Week Warrior</div>
                </div>
                <div className="text-center">
                  <div className="text-xl font-bold text-red-600 dark:text-red-400">30 Days</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Month Master</div>
                </div>
                <div className="text-center">
                  <div className="text-xl font-bold text-purple-600 dark:text-purple-400">100 Days</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Century Scholar</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Subscription & Trial Information */}
        <div className="card p-8 mb-8">
          <div className="flex items-center mb-6">
            <StarIcon className="w-8 h-8 text-purple-500 mr-4" />
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white">Subscription Plans & Free Trial</h3>
          </div>

          <div className="space-y-6">
            {/* Free Plan Section */}
            <div className="bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-700 p-6 rounded-lg border-2 border-gray-300 dark:border-gray-600">
              <h4 className="text-lg font-bold text-gray-900 dark:text-white mb-4">🆓 Free Plan - Always Available</h4>
              <p className="text-gray-700 dark:text-gray-300 mb-4">
                Start your ancient history learning journey with our comprehensive free plan:
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                <div className="flex items-center">
                  <CheckCircleIcon className="w-5 h-5 text-green-500 mr-2" />
                  <span className="text-sm text-gray-700 dark:text-gray-300">33 Questions per Quiz</span>
                </div>
                <div className="flex items-center">
                  <CheckCircleIcon className="w-5 h-5 text-green-500 mr-2" />
                  <span className="text-sm text-gray-700 dark:text-gray-300">Daily Challenge Access</span>
                </div>
                <div className="flex items-center">
                  <CheckCircleIcon className="w-5 h-5 text-green-500 mr-2" />
                  <span className="text-sm text-gray-700 dark:text-gray-300">Basic Statistics</span>
                </div>
                <div className="flex items-center">
                  <CheckCircleIcon className="w-5 h-5 text-green-500 mr-2" />
                  <span className="text-sm text-gray-700 dark:text-gray-300">Achievement System</span>
                </div>
                <div className="flex items-center">
                  <CheckCircleIcon className="w-5 h-5 text-green-500 mr-2" />
                  <span className="text-sm text-gray-700 dark:text-gray-300">Sample Bundle Previews</span>
                </div>
                <div className="flex items-center">
                  <CheckCircleIcon className="w-5 h-5 text-green-500 mr-2" />
                  <span className="text-sm text-gray-700 dark:text-gray-300">All Difficulty Levels</span>
                </div>
                <div className="flex items-center">
                  <CheckCircleIcon className="w-5 h-5 text-green-500 mr-2" />
                  <span className="text-sm text-gray-700 dark:text-gray-300">Educational Explanations</span>
                </div>
                <div className="flex items-center">
                  <CheckCircleIcon className="w-5 h-5 text-green-500 mr-2" />
                  <span className="text-sm text-gray-700 dark:text-gray-300">No Time Limits</span>
                </div>
              </div>
              <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
                <p className="text-sm text-gray-700 dark:text-gray-300 font-medium">
                  <strong>Perfect for:</strong> Students, casual learners, and anyone wanting to explore ancient history 
                  without commitment. Get a solid educational experience with carefully curated questions covering 
                  all major ancient civilizations.
                </p>
              </div>
            </div>

            <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 p-6 rounded-lg">
              <h4 className="text-lg font-bold text-gray-900 dark:text-white mb-4">🎁 3-Day Free Trial</h4>
              <p className="text-gray-700 dark:text-gray-300 mb-4">
                Experience the full power of our educational platform with unlimited access to all premium content:
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="flex items-center">
                  <CheckCircleIcon className="w-5 h-5 text-green-500 mr-2" />
                  <span className="text-sm text-gray-700 dark:text-gray-300">All Premium Bundles</span>
                </div>
                <div className="flex items-center">
                  <CheckCircleIcon className="w-5 h-5 text-green-500 mr-2" />
                  <span className="text-sm text-gray-700 dark:text-gray-300">100 Questions per Quiz</span>
                </div>
                <div className="flex items-center">
                  <CheckCircleIcon className="w-5 h-5 text-green-500 mr-2" />
                  <span className="text-sm text-gray-700 dark:text-gray-300">Advanced Features</span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              {/* Free Plan Card */}
              <div className="bg-gray-100 dark:bg-gray-800 border-2 border-gray-300 dark:border-gray-600 rounded-lg p-6">
                <h4 className="text-lg font-bold text-gray-900 dark:text-white mb-2">Free Plan</h4>
                <div className="text-3xl font-bold text-gray-600 dark:text-gray-400 mb-4">$0<span className="text-sm text-gray-500">/forever</span></div>
                <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                  <li>✓ 33 questions per quiz</li>
                  <li>✓ Daily challenges</li>
                  <li>✓ Basic achievements</li>
                  <li>✓ Sample bundle previews</li>
                  <li>✓ Educational explanations</li>
                </ul>
              </div>

              <div className="bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 rounded-lg p-6">
                <h4 className="text-lg font-bold text-gray-900 dark:text-white mb-2">Pro Monthly</h4>
                <div className="text-3xl font-bold text-blue-600 dark:text-blue-400 mb-4">$4.99<span className="text-sm text-gray-500">/month</span></div>
                <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                  <li>✓ Access to all question bundles</li>
                  <li>✓ Unlimited quiz modes</li>
                  <li>✓ Advanced statistics</li>
                  <li>✓ Daily challenges & streaks</li>
                  <li>✓ No advertisements</li>
                </ul>
              </div>

              <div className="bg-gradient-to-br from-blue-500 to-purple-600 text-white rounded-lg p-6 transform scale-105 shadow-lg">
                <div className="text-center mb-2">
                  <span className="bg-yellow-400 text-yellow-900 px-3 py-1 rounded-full text-xs font-bold">MOST POPULAR</span>
                </div>
                <h4 className="text-lg font-bold mb-2">Pro Annual</h4>
                <div className="text-3xl font-bold mb-2">$39.99<span className="text-sm opacity-75">/year</span></div>
                <div className="text-sm opacity-75 mb-4">Save 33% vs Monthly</div>
                <ul className="space-y-2 text-sm">
                  <li>✓ Everything in Monthly</li>
                  <li>✓ Best value for serious learners</li>
                  <li>✓ Priority customer support</li>
                  <li>✓ Early access to new features</li>
                </ul>
              </div>

              <div className="bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 rounded-lg p-6">
                <h4 className="text-lg font-bold text-gray-900 dark:text-white mb-2">Pro Biennial</h4>
                <div className="text-3xl font-bold text-green-600 dark:text-green-400 mb-2">$69.99<span className="text-sm text-gray-500">/2 years</span></div>
                <div className="text-sm text-green-600 dark:text-green-400 mb-4">Save 42% vs Monthly</div>
                <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                  <li>✓ Maximum savings</li>
                  <li>✓ Perfect for long-term learning</li>
                  <li>✓ All premium features</li>
                  <li>✓ Locked-in pricing</li>
                </ul>
              </div>
            </div>

            <div className="bg-yellow-50 dark:bg-yellow-900/20 p-6 rounded-lg border border-yellow-200 dark:border-yellow-700">
              <h4 className="text-lg font-bold text-gray-900 dark:text-white mb-3">Smart Trial Conversion</h4>
              <p className="text-gray-700 dark:text-gray-300 text-sm">
                Our intelligent system tracks your trial usage and provides personalized subscription recommendations 
                based on your learning patterns. The more you explore during your trial, the better we can suggest 
                the perfect plan for your educational journey.
              </p>
            </div>
          </div>
        </div>

        {/* Privacy Policy Section */}
        <div className="card p-8 mb-8">
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Privacy Policy</h3>
          <div className="prose prose-sm max-w-none dark:prose-invert">
            <p className="text-gray-700 dark:text-gray-300 mb-4">
              <strong>Last Updated:</strong> January 1, 2025
            </p>
            
            <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Information We Collect</h4>
            <ul className="text-gray-700 dark:text-gray-300 mb-4 space-y-2">
              <li>• <strong>Account Information:</strong> Email address, display name, and profile photo (if provided)</li>
              <li>• <strong>Usage Data:</strong> Quiz scores, progress, achievements, and app usage patterns</li>
              <li>• <strong>Device Information:</strong> Device type, operating system, and app version for analytics</li>
              <li>• <strong>Payment Information:</strong> Processed securely through Stripe (we don't store payment details)</li>
            </ul>

            <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">How We Use Your Information</h4>
            <ul className="text-gray-700 dark:text-gray-300 mb-4 space-y-2">
              <li>• Provide and improve our educational services</li>
              <li>• Track your learning progress and achievements</li>
              <li>• Send important updates about your account or subscription</li>
              <li>• Analyze app usage to improve user experience</li>
              <li>• Process payments and manage subscriptions</li>
            </ul>

            <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Data Sharing</h4>
            <p className="text-gray-700 dark:text-gray-300 mb-4">
              We do not sell, trade, or share your personal information with third parties except:
            </p>
            <ul className="text-gray-700 dark:text-gray-300 mb-4 space-y-2">
              <li>• With service providers (Firebase, Stripe) who help us operate the app</li>
              <li>• When required by law or to protect our rights</li>
              <li>• With your explicit consent</li>
            </ul>

            <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Data Security</h4>
            <p className="text-gray-700 dark:text-gray-300 mb-4">
              We implement industry-standard security measures to protect your data, including encryption 
              and secure authentication through Firebase.
            </p>

            <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Your Rights</h4>
            <ul className="text-gray-700 dark:text-gray-300 mb-4 space-y-2">
              <li>• Access and download your data</li>
              <li>• Correct inaccurate information</li>
              <li>• Delete your account and data</li>
              <li>• Opt out of non-essential communications</li>
            </ul>

            <p className="text-gray-700 dark:text-gray-300">
              For privacy-related questions, contact us at: 
              <a href="mailto:info@theawakenedhybrid.com" className="text-primary-600 dark:text-primary-400 ml-1">
                info@theawakenedhybrid.com
              </a>
            </p>
          </div>
        </div>

        {/* Terms of Service Section */}
        <div className="card p-8 mb-8">
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Terms of Service</h3>
          <div className="prose prose-sm max-w-none dark:prose-invert">
            <p className="text-gray-700 dark:text-gray-300 mb-4">
              <strong>Last Updated:</strong> January 1, 2025
            </p>
            
            <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Acceptance of Terms</h4>
            <p className="text-gray-700 dark:text-gray-300 mb-4">
              By using the Ancient History Trivia app, you agree to these Terms of Service. 
              If you don't agree, please don't use our app.
            </p>

            <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Description of Service</h4>
            <p className="text-gray-700 dark:text-gray-300 mb-4">
              Ancient History Trivia is an educational platform providing quiz content about ancient civilizations. 
              We offer both free and premium content through subscription plans.
            </p>

            <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">User Accounts</h4>
            <ul className="text-gray-700 dark:text-gray-300 mb-4 space-y-2">
              <li>• You must provide accurate information when creating an account</li>
              <li>• You're responsible for maintaining account security</li>
              <li>• One account per person</li>
              <li>• You must be 13+ years old to use our service</li>
            </ul>

            <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Subscription Terms</h4>
            <ul className="text-gray-700 dark:text-gray-300 mb-4 space-y-2">
              <li>• Free trial: 3 days with full access to premium content</li>
              <li>• Subscriptions auto-renew unless cancelled</li>
              <li>• Cancel anytime through your account settings</li>
              <li>• Refunds processed according to platform policies (App Store/Google Play)</li>
              <li>• Price changes will be communicated 30 days in advance</li>
            </ul>

            <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Acceptable Use</h4>
            <p className="text-gray-700 dark:text-gray-300 mb-2">You agree not to:</p>
            <ul className="text-gray-700 dark:text-gray-300 mb-4 space-y-2">
              <li>• Share account credentials with others</li>
              <li>• Attempt to reverse engineer or hack the app</li>
              <li>• Use the app for any illegal purposes</li>
              <li>• Submit false or misleading feedback</li>
            </ul>

            <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Intellectual Property</h4>
            <p className="text-gray-700 dark:text-gray-300 mb-4">
              All content, including questions, explanations, and app design, is owned by The Awakened Hybrid 
              and protected by copyright laws. You may not reproduce or distribute our content without permission.
            </p>

            <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Limitation of Liability</h4>
            <p className="text-gray-700 dark:text-gray-300 mb-4">
              The app is provided "as is" without warranties. We're not liable for any damages arising from 
              your use of the app, including but not limited to data loss or service interruptions.
            </p>

            <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Changes to Terms</h4>
            <p className="text-gray-700 dark:text-gray-300 mb-4">
              We may update these terms occasionally. Continued use of the app after changes constitutes 
              acceptance of the new terms.
            </p>

            <p className="text-gray-700 dark:text-gray-300">
              For questions about these terms, contact us at: 
              <a href="mailto:info@theawakenedhybrid.com" className="text-primary-600 dark:text-primary-400 ml-1">
                info@theawakenedhybrid.com
              </a>
            </p>
          </div>
        </div>

        {/* Contact & Support Section */}
        <div className="card p-8 mb-8">
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Contact & Support</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-blue-50 dark:bg-blue-900/20 p-6 rounded-lg">
              <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">📧 Email Support</h4>
              <p className="text-gray-700 dark:text-gray-300 mb-3">
                For technical issues, billing questions, or general support:
              </p>
              <a 
                href="mailto:info@theawakenedhybrid.com" 
                className="text-primary-600 dark:text-primary-400 font-medium hover:underline"
              >
                info@theawakenedhybrid.com
              </a>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                Response time: 24-48 hours
              </p>
            </div>

            <div className="bg-green-50 dark:bg-green-900/20 p-6 rounded-lg">
              <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">💬 In-App Feedback</h4>
              <p className="text-gray-700 dark:text-gray-300 mb-3">
                Use the feedback button in the app for:
              </p>
              <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                <li>• Bug reports</li>
                <li>• Feature requests</li>
                <li>• Content suggestions</li>
                <li>• General feedback</li>
              </ul>
            </div>

            <div className="bg-purple-50 dark:bg-purple-900/20 p-6 rounded-lg">
              <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">🌐 Business Inquiries</h4>
              <p className="text-gray-700 dark:text-gray-300 mb-3">
                For partnerships, licensing, or custom development:
              </p>
              <a 
                href="mailto:info@creatiquemedia.com" 
                className="text-primary-600 dark:text-primary-400 font-medium hover:underline"
              >
                info@creatiquemedia.com
              </a>
            </div>

            <div className="bg-yellow-50 dark:bg-yellow-900/20 p-6 rounded-lg">
              <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">🔒 Privacy & Legal</h4>
              <p className="text-gray-700 dark:text-gray-300 mb-3">
                For privacy or legal concerns:
              </p>
              <a 
                href="mailto:info@theawakenedhybrid.com" 
                className="text-primary-600 dark:text-primary-400 font-medium hover:underline"
              >
                info@theawakenedhybrid.com
              </a>
            </div>
          </div>
        </div>

        {/* Links Section */}
        <div className="card p-8 mb-8">
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6 text-center">Connect with The Awakened Hybrid</h3>
          <div className="flex flex-wrap justify-center gap-4">
            <a 
              href="https://theawakenedhybrid.com/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="bg-primary-600 hover:bg-primary-700 text-white px-6 py-3 rounded-lg transition-colors"
            >
              Main Website
            </a>
            <a 
              href="https://on.soundcloud.com/zE85i" 
              target="_blank" 
              rel="noopener noreferrer"
              className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-lg transition-colors"
            >
              SoundCloud
            </a>
            <a 
              href="https://www.instagram.com/theawakenedhybrid/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="bg-pink-500 hover:bg-pink-600 text-white px-6 py-3 rounded-lg transition-colors"
            >
              Instagram
            </a>
            <a 
              href="https://creatiquemedia.com/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg transition-colors"
            >
              Web Development Business
            </a>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center py-8">
          <p className="text-gray-600 dark:text-gray-400">
            © 2023-2025 The Awakened Hybrid - All Rights Reserved
          </p>
        </div>
      </div>
    </div>
  );
};

export default AboutScreen;
