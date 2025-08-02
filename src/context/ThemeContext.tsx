import React from 'react';

type Theme = 'light' | 'dark' | 'system';

interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  isDark: boolean;
}

const defaultContext: ThemeContextType = {
  theme: 'light',
  setTheme: () => {},
  isDark: false,
};

const ThemeContext = React.createContext<ThemeContextType>(defaultContext);

interface ThemeProviderState {
  theme: Theme;
  isDark: boolean;
}

export class ThemeProvider extends React.Component<
  { children: React.ReactNode },
  ThemeProviderState
> {
  private mediaQuery: MediaQueryList | null = null;

  constructor(props: { children: React.ReactNode }) {
    super(props);
    
    // Initialize state directly - don't call setState in constructor
    let initialTheme: Theme = 'light';
    try {
      const saved = localStorage.getItem('theme');
      if (saved === 'light' || saved === 'dark' || saved === 'system') {
        initialTheme = saved;
      }
    } catch (error) {
      console.warn('Could not read theme from localStorage:', error);
    }

    this.state = {
      theme: initialTheme,
      isDark: false,
    };
  }

  componentDidMount() {
    this.applyTheme();
  }

  componentDidUpdate(prevProps: any, prevState: ThemeProviderState) {
    if (prevState.theme !== this.state.theme) {
      this.applyTheme();
      this.saveThemeToStorage();
    }
  }

  componentWillUnmount() {
    if (this.mediaQuery) {
      this.mediaQuery.removeEventListener('change', this.handleMediaQueryChange);
    }
  }

  private saveThemeToStorage = () => {
    try {
      localStorage.setItem('theme', this.state.theme);
    } catch (error) {
      console.warn('Could not save theme to localStorage:', error);
    }
  };

  private handleMediaQueryChange = (e: MediaQueryListEvent) => {
    const isDark = e.matches;
    this.setState({ isDark });
    
    try {
      const root = document.documentElement;
      if (isDark) {
        root.classList.add('dark');
      } else {
        root.classList.remove('dark');
      }
    } catch (error) {
      console.warn('Could not apply theme:', error);
    }
  };

  private applyTheme = () => {
    try {
      const root = document.documentElement;
      
      if (this.state.theme === 'system') {
        if (typeof window !== 'undefined' && window.matchMedia) {
          this.mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
          const isDarkMode = this.mediaQuery.matches;
          this.setState({ isDark: isDarkMode });
          
          if (isDarkMode) {
            root.classList.add('dark');
          } else {
            root.classList.remove('dark');
          }
          
          this.mediaQuery.addEventListener('change', this.handleMediaQueryChange);
        }
      } else {
        // Clean up media query listener if switching away from system
        if (this.mediaQuery) {
          this.mediaQuery.removeEventListener('change', this.handleMediaQueryChange);
          this.mediaQuery = null;
        }
        
        const isDarkMode = this.state.theme === 'dark';
        this.setState({ isDark: isDarkMode });
        
        if (isDarkMode) {
          root.classList.add('dark');
        } else {
          root.classList.remove('dark');
        }
      }
    } catch (error) {
      console.warn('Could not apply theme:', error);
    }
  };

  private setTheme = (theme: Theme) => {
    this.setState({ theme });
  };

  render() {
    const contextValue: ThemeContextType = {
      theme: this.state.theme,
      setTheme: this.setTheme,
      isDark: this.state.isDark,
    };

    return (
      <ThemeContext.Provider value={contextValue}>
        {this.props.children}
      </ThemeContext.Provider>
    );
  }
}

export function useTheme(): ThemeContextType {
  const context = React.useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}
