import { Link } from 'react-router-dom';
import { PlayIcon, ChartBarIcon, TrophyIcon } from '@heroicons/react/24/solid';
import { questionBundles } from '../data/questions';
import { useStats } from '../context/StatsContext';
import { useAuth } from '../context/MockAuthContext';
import { Logo } from '../components/Logo';

const HomeScreen = () => {
  const { stats } = useStats();
  const { user, userProfile } = useAuth();

  const quickStats = [
    { label: 'Questions Answered', value: stats.totalQuestions, icon: '📝' },
    { label: 'Correct Answers', value: stats.correctAnswers, icon: '✅' },
    { label: 'Current Streak', value: stats.streakCurrent, icon: '🔥' },
    { label: 'Average Score', value: `${Math.round(stats.averageScore)}%`, icon: '📊' }
  ];

  // Decorative topic showcase data
  const topicShowcase = [
    {
      id: 'ancient-egypt',
      title: 'Ancient Egypt',
      description: 'Explore the mysteries of pharaohs, pyramids, and the Nile civilization',
      icon: '🏺',
      gradient: 'from-yellow-400 to-orange-500',
      textColor: 'text-yellow-900'
    },
    {
      id: 'roman-empire',
      title: 'Ancient Rome',
      description: 'From Republic to Empire - the rise and fall of Rome',
      icon: '🏛️',
      gradient: 'from-red-400 to-red-600',
      textColor: 'text-red-900'
    },
    {
      id: 'ancient-greece',
      title: 'Ancient Greece',
      description: 'Philosophy, democracy, and the birthplace of Western civilization',
      icon: '⚱️',
      gradient: 'from-blue-400 to-blue-600',
      textColor: 'text-blue-900'
    },
    {
      id: 'mesopotamia',
      title: 'Ancient Mesopotamia',
      description: 'The cradle of civilization, home to Sumer, Babylon, and Assyria',
      icon: '🏛️',
      gradient: 'from-green-400 to-green-600',
      textColor: 'text-green-900'
    },
    {
      id: 'ancient-china',
      title: 'Ancient China',
      description: 'Dynasties, inventions, philosophy, and the Great Wall',
      icon: '🏮',
      gradient: 'from-red-400 to-pink-500',
      textColor: 'text-red-900'
    },
    {
      id: 'ancient-india',
      title: 'Ancient India',
      description: 'Vedic period, empires, religion, and cultural achievements',
      icon: '🕌',
      gradient: 'from-orange-400 to-orange-600',
      textColor: 'text-orange-900'
    },
    {
      id: 'bronze-age',
      title: 'Bronze Age',
      description: 'Early civilizations, technology, and cultural developments',
      icon: '⚔️',
      gradient: 'from-amber-400 to-amber-600',
      textColor: 'text-amber-900'
    },
    {
      id: 'iron-age',
      title: 'Iron Age',
      description: 'Advanced civilizations, warfare, and technological progress',
      icon: '🛡️',
      gradient: 'from-gray-400 to-gray-600',
      textColor: 'text-gray-900'
    }
  ];

  const featuredBundles = questionBundles.filter(bundle => !bundle.isPremium).slice(0, 3);

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  return (
    <div>
      {/* Header */}
      <div className="bg-gradient-to-r from-primary-600 to-primary-800 text-white">
        <div className="max-w-4xl mx-auto px-4 py-8 md:py-12">
          <div className="text-center">
            {/* Brought to you by text */}
            <div className="mb-6">
              <p className="text-primary-200 text-sm md:text-base font-medium tracking-wide">
                Brought to you by, 
                <span className="text-white font-bold ml-1 bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent">
                  "The Awakened Hybrid and CreatiqueMedia LLC"
                </span>
              </p>
            </div>
            
            {/* Eye of Ra Brand Logo */}
            <div className="flex justify-center mb-4">
              <Logo 
                size={80} 
                className="drop-shadow-lg"
              />
            </div>
            
            {user && userProfile ? (
              <>
                <h1 className="text-2xl md:text-3xl font-bold mb-2">
                  {getGreeting()}, {userProfile.displayName}! 👋
                </h1>
                <p className="text-primary-100 text-lg">
                  Ready to explore ancient history?
                </p>
                {userProfile.subscription !== 'free' && (
                  <div className="mt-3 inline-flex items-center bg-white/20 rounded-full px-4 py-2">
                    <span className="text-sm font-medium">
                      {userProfile.subscription === 'scholar' ? '📚 Scholar Member' :
                       userProfile.subscription === 'historian' ? '🏛️ Historian Member' :
                       userProfile.subscription === 'academy' ? '👑 Academy Member' : 'Premium Member'}
                    </span>
                  </div>
                )}
              </>
            ) : (
              <>
                <h1 className="text-3xl md:text-4xl font-bold mb-2">
                  Ancient History Trivia
                </h1>
                <p className="text-primary-100 text-lg">
                  Test your knowledge of ancient civilizations
                </p>
              </>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-6 md:py-8">
        {/* Quick Stats - Only show if user has played at least one game */}
        {stats.totalQuestions > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            {quickStats.map((stat, index) => (
              <div key={index} className="card p-4 text-center">
                <div className="text-2xl mb-2">{stat.icon}</div>
                <div className="text-2xl font-bold text-gray-900 dark:text-white">
                  {stat.value}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          <Link
            to="/quiz"
            className="card p-6 hover:shadow-xl transition-shadow duration-200 group"
          >
            <div className="flex items-center">
              <div className="bg-primary-100 dark:bg-primary-900 p-3 rounded-full mr-4 group-hover:bg-primary-200 dark:group-hover:bg-primary-800 transition-colors">
                <PlayIcon className="w-6 h-6 text-primary-600 dark:text-primary-400" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Quick Quiz
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Start a random quiz with 10 questions
                </p>
              </div>
            </div>
          </Link>

          {/* Show different second action based on user state */}
          {user && userProfile ? (
            <Link
              to="/stats"
              className="card p-6 hover:shadow-xl transition-shadow duration-200 group"
            >
              <div className="flex items-center">
                <div className="bg-green-100 dark:bg-green-900 p-3 rounded-full mr-4 group-hover:bg-green-200 dark:group-hover:bg-green-800 transition-colors">
                  <ChartBarIcon className="w-6 h-6 text-green-600 dark:text-green-400" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    View Stats
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    Check your progress and achievements
                  </p>
                </div>
              </div>
            </Link>
          ) : (
            <Link
              to="/store"
              className="card p-6 hover:shadow-xl transition-shadow duration-200 group"
            >
              <div className="flex items-center">
                <div className="bg-blue-100 dark:bg-blue-900 p-3 rounded-full mr-4 group-hover:bg-blue-200 dark:group-hover:bg-blue-800 transition-colors">
                  <TrophyIcon className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    Browse Topics
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    Explore our question bundles and plans
                  </p>
                </div>
              </div>
            </Link>
          )}
        </div>

        {/* Decorative Topics Showcase Slider */}
        <section className="mb-8 overflow-hidden">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              Journey Through Ancient History
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              Discover the civilizations and eras that shaped our world
            </p>
          </div>

          <div className="relative">
            {/* Sliding container */}
            <div className="flex animate-scroll">
              {/* First set of topics */}
              {topicShowcase.map((topic) => (
                <div
                  key={topic.id}
                  className="flex-shrink-0 w-80 mx-4"
                >
                  <div className={`card p-6 bg-gradient-to-br ${topic.gradient} text-white transform hover:scale-105 transition-transform duration-300`}>
                    <div className="text-center">
                      <div className="text-5xl mb-4 filter drop-shadow-lg">{topic.icon}</div>
                      <h3 className="text-xl font-bold mb-3 text-white drop-shadow-md">
                        {topic.title}
                      </h3>
                      <p className="text-white/90 text-sm leading-relaxed">
                        {topic.description}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
              {/* Duplicate set for seamless loop */}
              {topicShowcase.map((topic) => (
                <div
                  key={`${topic.id}-duplicate`}
                  className="flex-shrink-0 w-80 mx-4"
                >
                  <div className={`card p-6 bg-gradient-to-br ${topic.gradient} text-white transform hover:scale-105 transition-transform duration-300`}>
                    <div className="text-center">
                      <div className="text-5xl mb-4 filter drop-shadow-lg">{topic.icon}</div>
                      <h3 className="text-xl font-bold mb-3 text-white drop-shadow-md">
                        {topic.title}
                      </h3>
                      <p className="text-white/90 text-sm leading-relaxed">
                        {topic.description}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            {/* Gradient fade edges */}
            <div className="absolute left-0 top-0 bottom-0 w-16 bg-gradient-to-r from-gray-50 dark:from-gray-900 to-transparent pointer-events-none z-10"></div>
            <div className="absolute right-0 top-0 bottom-0 w-16 bg-gradient-to-l from-gray-50 dark:from-gray-900 to-transparent pointer-events-none z-10"></div>
          </div>
        </section>

        {/* Recent Activity */}
        {stats.lastPlayed && (
          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              Welcome Back!
            </h2>
            <div className="card p-6">
              <div className="flex items-center">
                <div className="bg-primary-100 dark:bg-primary-900 p-3 rounded-full mr-4">
                  <TrophyIcon className="w-6 h-6 text-primary-600 dark:text-primary-400" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    Last played: {stats.lastPlayed.toLocaleDateString()}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    Keep up the great work! You're on a {stats.streakCurrent} question streak.
                  </p>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* Call to Action */}
        <div className="card p-8 text-center bg-gradient-to-br from-primary-50 to-primary-100 dark:from-primary-900/20 dark:to-primary-800/20 border-primary-200 dark:border-primary-700">
          <div className="flex justify-center mb-4">
            <Logo 
              size={48} 
              className="opacity-80"
            />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Ready to Test Your Knowledge?
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            Choose from our collection of carefully crafted questions about ancient civilizations.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/quiz"
              className="btn-primary inline-flex items-center justify-center"
            >
              <PlayIcon className="w-5 h-5 mr-2" />
              Start Quiz
            </Link>
            <Link
              to="/store"
              className="btn-secondary inline-flex items-center justify-center"
            >
              Browse Topics
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomeScreen;
