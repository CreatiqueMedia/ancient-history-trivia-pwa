import React from 'react';
import { 
  MoonIcon, 
  SunIcon, 
  ComputerDesktopIcon,
  SpeakerWaveIcon,
  SpeakerXMarkIcon,
  ClockIcon,
  QuestionMarkCircleIcon,
  EyeIcon,
  TrashIcon
} from '@heroicons/react/24/outline';
import { useSettings } from '../context/SettingsContext';
import { useTheme } from '../context/ThemeContext';
import { useStats } from '../hooks/useStats';

const SettingsScreen: React.FC = () => {
  const { settings, updateSettings, resetSettings } = useSettings();
  const { theme, setTheme } = useTheme();
  const { resetStats } = useStats();

  const handleResetData = () => {
    if (window.confirm('Are you sure you want to reset all your data? This action cannot be undone.')) {
      resetStats();
      resetSettings();
      alert('All data has been reset.');
    }
  };

  const themeOptions = [
    { value: 'light', label: 'Light', icon: SunIcon },
    { value: 'dark', label: 'Dark', icon: MoonIcon },
    { value: 'system', label: 'System', icon: ComputerDesktopIcon }
  ];

  const fontSizeOptions = [
    { value: 'small', label: 'Small' },
    { value: 'medium', label: 'Medium' },
    { value: 'large', label: 'Large' }
  ];

  const timeOptions = [
    { value: null, label: 'No limit' },
    { value: 15, label: '15 seconds' },
    { value: 30, label: '30 seconds' },
    { value: 60, label: '1 minute' },
    { value: 120, label: '2 minutes' }
  ];

  return (
    <div>
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 shadow-sm">
        <div className="max-w-4xl mx-auto px-4 py-6">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Settings
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Customize your trivia experience
          </p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Appearance */}
        <div className="card p-6 mb-6">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
            Appearance
          </h2>

          <div className="space-y-6">
            {/* Theme Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                Theme
              </label>
              <div className="grid grid-cols-3 gap-3">
                {themeOptions.map(({ value, label, icon: Icon }) => (
                  <button
                    key={value}
                    onClick={() => setTheme(value as any)}
                    className={`flex flex-col items-center p-4 rounded-lg border-2 transition-colors ${
                      theme === value
                        ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20'
                        : 'border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500'
                    }`}
                  >
                    <Icon className="w-6 h-6 mb-2 text-gray-600 dark:text-gray-400" />
                    <span className="text-sm font-medium text-gray-900 dark:text-white">
                      {label}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Font Size */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                Font Size
              </label>
              <select
                value={settings.fontSize}
                onChange={(e) => updateSettings({ fontSize: e.target.value as any })}
                className="w-full bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 text-gray-900 dark:text-white"
              >
                {fontSizeOptions.map(({ value, label }) => (
                  <option key={value} value={value}>
                    {label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Audio & Feedback */}
        <div className="card p-6 mb-6">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6 flex items-center">
            <SpeakerWaveIcon className="w-6 h-6 mr-2" />
            Audio & Feedback
          </h2>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                {settings.soundEnabled ? (
                  <SpeakerWaveIcon className="w-5 h-5 text-gray-500 dark:text-gray-400 mr-3" />
                ) : (
                  <SpeakerXMarkIcon className="w-5 h-5 text-gray-500 dark:text-gray-400 mr-3" />
                )}
                <div>
                  <h3 className="font-medium text-gray-900 dark:text-white">
                    Sound Effects
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Play sounds for correct/incorrect answers
                  </p>
                </div>
              </div>
              <button
                onClick={() => updateSettings({ soundEnabled: !settings.soundEnabled })}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  settings.soundEnabled
                    ? 'bg-primary-600'
                    : 'bg-gray-200 dark:bg-gray-700'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    settings.soundEnabled ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium text-gray-900 dark:text-white">
                  Vibration
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Vibrate on mobile devices
                </p>
              </div>
              <button
                onClick={() => updateSettings({ vibrationEnabled: !settings.vibrationEnabled })}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  settings.vibrationEnabled
                    ? 'bg-primary-600'
                    : 'bg-gray-200 dark:bg-gray-700'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    settings.vibrationEnabled ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>
          </div>
        </div>

        {/* Quiz Settings */}
        <div className="card p-6 mb-6">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6 flex items-center">
            <QuestionMarkCircleIcon className="w-6 h-6 mr-2" />
            Quiz Settings
          </h2>

          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium text-gray-900 dark:text-white">
                  Auto-advance Questions
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Automatically move to next question after answering
                </p>
              </div>
              <button
                onClick={() => updateSettings({ autoAdvance: !settings.autoAdvance })}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  settings.autoAdvance
                    ? 'bg-primary-600'
                    : 'bg-gray-200 dark:bg-gray-700'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    settings.autoAdvance ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium text-gray-900 dark:text-white">
                  Show Explanations
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Display detailed explanations after answering
                </p>
              </div>
              <button
                onClick={() => updateSettings({ showExplanations: !settings.showExplanations })}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  settings.showExplanations
                    ? 'bg-primary-600'
                    : 'bg-gray-200 dark:bg-gray-700'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    settings.showExplanations ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                <ClockIcon className="w-4 h-4 inline mr-1" />
                Question Time Limit
              </label>
              <select
                value={settings.questionTimeLimit || ''}
                onChange={(e) => updateSettings({ 
                  questionTimeLimit: e.target.value ? parseInt(e.target.value) : null 
                })}
                className="w-full bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 text-gray-900 dark:text-white"
              >
                {timeOptions.map(({ value, label }) => (
                  <option key={value || 'none'} value={value || ''}>
                    {label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Accessibility */}
        <div className="card p-6 mb-6">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6 flex items-center">
            <EyeIcon className="w-6 h-6 mr-2" />
            Accessibility
          </h2>

          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-medium text-gray-900 dark:text-white">
                Enhanced Accessibility
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Enable screen reader support and high contrast
              </p>
            </div>
            <button
              onClick={() => updateSettings({ accessibilityEnabled: !settings.accessibilityEnabled })}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                settings.accessibilityEnabled
                  ? 'bg-primary-600'
                  : 'bg-gray-200 dark:bg-gray-700'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  settings.accessibilityEnabled ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>
        </div>

        {/* Data Management */}
        <div className="card p-6">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6 flex items-center">
            <TrashIcon className="w-6 h-6 mr-2" />
            Data Management
          </h2>

          <div className="space-y-4">
            <div>
              <h3 className="font-medium text-gray-900 dark:text-white mb-2">
                Reset All Data
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                This will permanently delete all your statistics, settings, and progress. This action cannot be undone.
              </p>
              <button
                onClick={handleResetData}
                className="bg-red-600 hover:bg-red-700 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200"
              >
                Reset All Data
              </button>
            </div>
          </div>
        </div>

        {/* About */}
        <div className="card p-6 mt-6 text-center bg-gradient-to-br from-primary-50 to-primary-100 dark:from-primary-900/20 dark:to-primary-800/20 border-primary-200 dark:border-primary-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
            Ancient History Trivia PWA
          </h3>
          <p className="text-gray-600 dark:text-gray-400 text-sm">
            Version 1.0.0 • Built with React & TypeScript
          </p>
        </div>
      </div>
    </div>
  );
};

export default SettingsScreen;
