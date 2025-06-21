import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeftIcon, GlobeAltIcon, HeartIcon, AcademicCapIcon, BookOpenIcon } from '@heroicons/react/24/outline';
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
        {/* Introduction Card */}
        <div className="card p-8 mb-8">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              Hello, I am Ron Ratzlaff, born Ron Alan Curtis (aka The Awakened Hybrid)
            </h2>
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
