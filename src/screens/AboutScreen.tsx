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
            <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 p-6 rounded-lg">
              <h4 className="text-lg font-bold text-gray-900 dark:text-white mb-4">🎁 7-Day Free Trial</h4>
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
                  <span className="text-sm text-gray-700 dark:text-gray-300">Unlimited Questions</span>
                </div>
                <div className="flex items-center">
                  <CheckCircleIcon className="w-5 h-5 text-green-500 mr-2" />
                  <span className="text-sm text-gray-700 dark:text-gray-300">Advanced Features</span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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

        {/* Introduction Card */}
        <div className="card p-8 mb-8">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2 text-center">
              Hello, I am Ron Ratzlaff, born Ron Alan Curtis
            </h2>
            <p className="text-lg font-semibold text-primary-600 dark:text-primary-400 mb-4 text-center">
              Also Known As: The Awakened Hybrid
            </p>
          </div>

          <div className="prose prose-lg max-w-none dark:prose-invert">
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-6">
              I am a middle aged man married since 2009. My beautiful Russian wife and I have two gorgeous baby boys. 
              I was born February 19, 1975. Had open heart surgery in 1979 when I was 4 years old to mend a broken heart, 
              literally. I was born with Ventricular Septal Defect and the hole in my left ventricle was widening, not 
              closing like the medical establishment presumed. Therefore, I had to undergo a serious life threatening 
              procedure back then to help save my life so I could live to see the age of 5.
            </p>

            <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-6">
              I was raised in a very emotionally turbulent family, most definitely what most would consider a completely 
              dysfunctional family! My step-father struggled with alcoholism and serious anger issues. He would take that 
              out on my brother and me by way of verbal, physical, and emotional abuse. My mother simply ignored it and 
              embraced the notion that this was all "NORMAL" behavior.
            </p>

            <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-6">
              However, as I grew older, I also struggled severely with mental health issues and chemical dependency.
            </p>

            <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-6">
              I finally departed my family and Fresno, California in 2005 for active duty military service at the ripe 
              old age of 27, for military age, that is.
            </p>

            <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-6">
              I met my Soviet bride in 2007 and we married in 2009. My wife was well aware of my struggles with mental 
              health and alcoholism. But, she couldn't save me. I had to do that on my own.
            </p>
          </div>
        </div>

        {/* Recovery Journey Card */}
        <div className="card p-8 mb-8">
          <div className="flex items-center mb-6">
            <HeartIcon className="w-6 h-6 text-red-500 mr-3" />
            <h3 className="text-xl font-bold text-gray-900 dark:text-white">Recovery & Awakening Journey</h3>
          </div>

          <div className="prose prose-lg max-w-none dark:prose-invert">
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-6">
              Time went on and as I got closer to 50, my wife started with ultimatums about my drinking and threatened 
              to leave me if I didn't do something. With the prospect of losing my family due to my inadequacies, I finally 
              sought help. I admitted myself into a clinic in Bend, Oregon where I lived from 2014-2021. The Psychiatrist 
              prescribed me 10mg of Lexapro. It was almost an immediate response I had, unlike other SSRIs I have taken 
              in the past such as, Paxil, Prozac, and Zoloft.
            </p>

            <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-6">
              I literally stopped drinking for months. When we moved to Oklahoma in May 2021 I began drinking again. 
              I was struggling with depression and anxiety and I dealt with it the only way I knew how, and that was the bottle.
            </p>

            <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-6">
              That went on for a few months and I increased my Lexapro to 20mg/day. I then began researching Cannabis Therapy 
              and decided to get an Oklahoma Medical Marijuana Authority (OMMA). After I received my card, I went to a 
              dispensary and purchased Indica flower. My alcohol cravings almost immediately dissipated as well as my 
              depression, anxiety, and it helped immensely with my herniated disc pain in my low back.
            </p>

            <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-6">
              I literally stopped getting drunk, then I gradually moved to 3 White Claw's a week and this is where I am at. 
              I never believed that because you suffer from struggles and used a certain chemical as a coping mechanism, 
              that you should quit completely. Once you realize that you are the one with the power and NOT the dependency, 
              then you have WON! I enjoy alcohol beverages, I just don't enjoy hangovers or jail!
            </p>
          </div>
        </div>

        {/* Spiritual Awakening Card */}
        <div className="card p-8 mb-8">
          <div className="flex items-center mb-6">
            <BookOpenIcon className="w-6 h-6 text-purple-500 mr-3" />
            <h3 className="text-xl font-bold text-gray-900 dark:text-white">Spiritual Awakening</h3>
          </div>

          <div className="prose prose-lg max-w-none dark:prose-invert">
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-6">
              After this, I began having incredible urges to research esoteric ancient knowledge which began in December 2021. 
              This is where I am at now and my journey just started. So, I decided to record my Spiritual Awakening journey 
              with others by posting to Facebook, GETTR, Instagram, and YouTube to help others that are also struggling 
              with similar life experiences.
            </p>

            <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-6">
              I hope that what I have struggled with and my recovery and AWAKENING can help inspire others to seek NOT 
              anything outside of themselves that religion constantly falsely claims is the path towards salvation, because 
              it is MOST definitely NOT! I am definitely not a spiritual guru and I still fight my inner demons, but I 
              have improved more than at any other time in my life and now I feel like I have meaning.
            </p>

            <div className="bg-gradient-to-r from-purple-100 to-blue-100 dark:from-purple-900/20 dark:to-blue-900/20 p-6 rounded-lg mb-6">
              <p className="text-gray-800 dark:text-gray-200 font-medium text-center italic">
                "We are ETERNAL beings manifested in physical matter and we can NEVER die! Our physical passes away, 
                but our TRUE form NEVER fades! We are LIGHT, ENERGY, VIBRATION, and once we understand this concept 
                of ancient wisdom, ONLY then can we finally have peace, understanding, unity, compassion, empathy, 
                but MOST importantly, LOVE!"
              </p>
              <p className="text-center mt-4 font-bold text-gray-900 dark:text-white">– The Awakened Hybrid</p>
            </div>
          </div>
        </div>

        {/* Professional Background Card */}
        <div className="card p-8 mb-8">
          <div className="flex items-center mb-6">
            <GlobeAltIcon className="w-6 h-6 text-blue-500 mr-3" />
            <h3 className="text-xl font-bold text-gray-900 dark:text-white">Professional Background</h3>
          </div>

          <div className="prose prose-lg max-w-none dark:prose-invert">
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-6">
              By profession, I am a Web and App Developer and I own my own web development business in Edmond, Oklahoma. 
              Hey, I built this app myself, so if anyone is interested in having something cool, like this for your business, 
              or even personal needs, let me know. If you are, please check out my business site at: 
              <a href="https://creatiquemedia.com/" target="_blank" rel="noopener noreferrer" 
                 className="text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 ml-1">
                https://CreatiqueMedia.com
              </a>.
            </p>

            <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-6">
              I worked 18 years as a Systems Engineer till 2020. I started web development in 2012 and I finally got 
              burned out being a wage slave to Capitalism and spending 8-12 hours per day cordoned off in a cubicle 
              farm like some farm animal. So, I started doing web development full time, but it is extremely slow at 
              the moment given the uncertainty with the economy and the banking industry and talk of the USD collapsing. 
              I needed to do something else that gave me purpose and this is what I have discovered!
            </p>

            <p className="text-gray-700 dark:text-gray-300 leading-relaxed font-medium text-center">
              Spiritual Awareness and Spiritual Healing is now my primary objective!
            </p>
          </div>
        </div>

        {/* Education Card */}
        <div className="card p-8 mb-8">
          <div className="flex items-center mb-6">
            <AcademicCapIcon className="w-6 h-6 text-green-500 mr-3" />
            <h3 className="text-xl font-bold text-gray-900 dark:text-white">Education & Credentials</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Degrees Earned */}
            <div>
              <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Degrees Earned</h4>
              <div className="space-y-4">
                <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
                  <h5 className="font-medium text-gray-900 dark:text-white">Bachelor of Science in Management Information Systems</h5>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Wayland Baptist University</p>
                </div>
                <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
                  <h5 className="font-medium text-gray-900 dark:text-white">Bachelor of Science in Computer Information Systems</h5>
                  <p className="text-sm text-gray-600 dark:text-gray-400">with a Minor in Human Resources Management</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Florida Institute of Technology</p>
                </div>
                <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
                  <h5 className="font-medium text-gray-900 dark:text-white">Associate of Applied Science in Information Systems Technology</h5>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Community College of the Air Force</p>
                </div>
              </div>
            </div>

            {/* Degrees NOT Earned */}
            <div>
              <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Degrees NOT Earned</h4>
              <div className="space-y-4">
                <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                  <h5 className="font-medium text-gray-900 dark:text-white">Master of Science in Software Engineering</h5>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Brandeis University</p>
                </div>
                <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                  <h5 className="font-medium text-gray-900 dark:text-white">Master of Science in Information Technology</h5>
                  <p className="text-sm text-gray-600 dark:text-gray-400">University of Massachusetts – Lowell</p>
                </div>
              </div>
              
              <div className="mt-4 p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
                <p className="text-sm text-gray-700 dark:text-gray-300 font-medium">
                  "I GOT BURNED OUT EARNING DEGREES JUST TO BE A WAGE SLAVE, SO I STOPPED CHASING A FALSE BULLSHIT LIE 
                  CALLED 'THE AMERICAN DREAM'. ONCE YOU REALIZE THAT ALL OF THIS IS A BULLSHIT ILLUSION THAT POLITICIANS 
                  AND ACADEMIA KEEP POURING DOWN YOUR THROAT, THEN YOU ARE AHEAD OF MOST LIVING THE GOOD OL' LIE!"
                </p>
              </div>
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
                href="mailto:business@creatiquemedia.com" 
                className="text-primary-600 dark:text-primary-400 font-medium hover:underline"
              >
                business@creatiquemedia.com
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
