import React from 'react';
import { Settings } from '../types';

interface SettingsContextType {
  settings: Settings;
  updateSettings: (updates: Partial<Settings>) => void;
  resetSettings: () => void;
}

const defaultSettings: Settings = {
  theme: 'system',
  soundEnabled: true,
  vibrationEnabled: true,
  autoAdvance: false,
  showExplanations: true,
  questionTimeLimit: null,
  language: 'en',
  accessibilityEnabled: false,
  fontSize: 'medium'
};

const defaultContext: SettingsContextType = {
  settings: defaultSettings,
  updateSettings: () => {},
  resetSettings: () => {},
};

const SettingsContext = React.createContext<SettingsContextType>(defaultContext);

interface SettingsProviderState {
  settings: Settings;
}

export class SettingsProvider extends React.Component<
  { children: React.ReactNode },
  SettingsProviderState
> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    
    // Initialize state directly - don't call setState in constructor
    let initialSettings: Settings = defaultSettings;
    try {
      const saved = localStorage.getItem('settings');
      if (saved) {
        initialSettings = { ...defaultSettings, ...JSON.parse(saved) };
      }
    } catch (error) {
      console.warn('Could not read settings from localStorage:', error);
    }

    this.state = {
      settings: initialSettings,
    };
  }

  componentDidUpdate(_: any, prevState: SettingsProviderState) {
    if (prevState.settings !== this.state.settings) {
      try {
        localStorage.setItem('settings', JSON.stringify(this.state.settings));
      } catch (error) {
        console.warn('Could not save settings to localStorage:', error);
      }
    }
  }

  updateSettings = (updates: Partial<Settings>) => {
    this.setState(prevState => ({
      settings: { ...prevState.settings, ...updates }
    }));
  };

  resetSettings = () => {
    this.setState({ settings: defaultSettings });
  };

  render() {
    const value: SettingsContextType = {
      settings: this.state.settings,
      updateSettings: this.updateSettings,
      resetSettings: this.resetSettings,
    };

    return (
      <SettingsContext.Provider value={value}>
        {this.props.children}
      </SettingsContext.Provider>
    );
  }
}

export function useSettings() {
  const context = React.useContext(SettingsContext);
  if (!context) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
}
