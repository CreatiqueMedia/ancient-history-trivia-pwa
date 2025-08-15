import React from 'react';
import {
  User,
  signInWithPopup,
  signInWithRedirect,
  getRedirectResult,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updateProfile,
  signInAnonymously,
  sendPasswordResetEmail,
  sendSignInLinkToEmail,
  isSignInWithEmailLink,
  signInWithEmailLink,
  GoogleAuthProvider,
  OAuthProvider
} from 'firebase/auth';
import { auth, googleProvider, appleProvider } from '../config/firebase';
import type { UserProfile, SubscriptionTier } from '../types';
import { StripeTrialService } from '../services/StripeTrialService';

interface AuthContextType {
  user: User | null;
  userProfile: UserProfile | null;
  loading: boolean;
  signInWithGoogle: () => Promise<any>;
  signInWithApple: () => Promise<void>;
  signInWithEmail: (email: string, password: string) => Promise<void>;
  signUpWithEmail: (email: string, password: string, displayName?: string) => Promise<void>;
  sendSignInLink: (email: string) => Promise<void>;
  signInWithLink: (email: string, emailLink: string) => Promise<void>;
  signInAnonymously: () => Promise<void>;
  logout: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  updateUserProfile: (updates: Partial<UserProfile>) => Promise<void>;
  isSubscribed: (tier?: SubscriptionTier) => boolean;
  error: string | null;
}

const defaultContext: AuthContextType = {
  user: null,
  userProfile: null,
  loading: false,
  signInWithGoogle: async () => {},
  signInWithApple: async () => {},
  signInWithEmail: async () => {},
  signUpWithEmail: async () => {},
  sendSignInLink: async () => {},
  signInWithLink: async () => {},
  signInAnonymously: async () => {},
  logout: async () => {},
  resetPassword: async () => {},
  updateUserProfile: async () => {},
  isSubscribed: () => false,
  error: null,
};

const AuthContext = React.createContext<AuthContextType>(defaultContext);

export { AuthContext };



interface AuthProviderProps {
  children: React.ReactNode;
}

interface AuthProviderState {
  user: User | null;
  userProfile: UserProfile | null;
  loading: boolean;
  error: string | null;
}

export class AuthProvider extends React.Component<AuthProviderProps, AuthProviderState> {
  private unsubscribe: (() => void) | null = null;

  constructor(props: AuthProviderProps) {
    super(props);
    
    this.state = {
      user: null,
      userProfile: null,
      loading: true,
      error: null,
    };
  }

  componentDidMount() {
    // Set up auth state listener
    this.unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const profile = await this.createUserProfile(user, 'google');
        this.setState({ user, userProfile: profile, loading: false, error: null });
      } else {
        this.setState({ user: null, userProfile: null, loading: false, error: null });
      }
    });

    // Check for redirect result on app start
    this.checkRedirectResult();
  }

  componentWillUnmount() {
    if (this.unsubscribe) {
      this.unsubscribe();
    }
  }

  checkRedirectResult = async () => {
    try {
      const result = await getRedirectResult(auth);
      if (result?.user) {
        const profile = await this.createUserProfile(result.user, 'google');
        this.setState({ userProfile: profile, error: null });
      }
    } catch (error: any) {
      console.error('Redirect result error:', error);
      this.setState({ error: error.message });
    }
  };

  createUserProfile = async (user: User, provider: 'google' | 'apple' | 'email' | 'anonymous'): Promise<UserProfile> => {
    const profile: UserProfile = {
      id: user.uid,
      email: user.email || '',
      displayName: user.displayName || user.email?.split('@')[0] || 'User',
      photoURL: user.photoURL || undefined,
      provider,
      subscription: 'free', // 🆓 Auto-enroll new users in FREE PLAN
      preferences: {
        theme: 'system',
        soundEnabled: true,
        vibrationEnabled: true,
        autoAdvance: false,
        showExplanations: true,
        questionTimeLimit: null,
        language: 'en',
        accessibilityEnabled: false,
        fontSize: 'medium',
        notifications: {
          dailyReminders: true,
          achievementUpdates: true,
          newContentAlerts: true,
          friendActivity: false,
          reminderTime: '19:00'
        }
      },
      createdAt: new Date(),
      lastActive: new Date(),
      isAnonymous: user.isAnonymous
    };

    // Try to load existing profile from localStorage
    try {
      const savedProfile = localStorage.getItem(`userProfile_${user.uid}`);
      if (savedProfile) {
        const parsed = JSON.parse(savedProfile);
        return { ...profile, ...parsed, lastActive: new Date() };
      }
    } catch (error) {
      console.warn('Could not load saved profile:', error);
    }

    // Save new profile to localStorage
    try {
      localStorage.setItem(`userProfile_${user.uid}`, JSON.stringify(profile));
      
      // Log successful FREE PLAN enrollment for new users
      console.log(`✅ New user ${user.uid} automatically enrolled in FREE PLAN`);
      
      // Track FREE PLAN enrollment for analytics
      if (typeof window !== 'undefined' && (window as any).gtag) {
        (window as any).gtag('event', 'signup', {
          method: provider,
          user_id: user.uid,
          subscription_tier: 'free',
          value: 0
        });
      }
    } catch (error) {
      console.warn('Could not save profile to localStorage:', error);
    }

    return profile;
  };

  signInWithGoogle = async () => {
    try {
      this.setState({ error: null, loading: true });
      
      try {
        // Try popup first
        const result = await signInWithPopup(auth, googleProvider);
        if (result.user) {
          const profile = await this.createUserProfile(result.user, 'google');
          this.setState({ userProfile: profile });
        }
      } catch (popupError: any) {
        console.log('🔄 Popup authentication failed, trying redirect...', popupError.code);
        
        if (
          popupError.code === 'auth/popup-blocked' ||
          popupError.code === 'auth/popup-closed-by-user' ||
          popupError.code === 'auth/cancelled-popup-request' ||
          popupError.message?.includes('COOP')
        ) {
          // Fallback to redirect
          this.setState({ error: 'Redirecting for sign-in...' });
          await signInWithRedirect(auth, googleProvider);
          return;
        } else {
          throw popupError;
        }
      }
    } catch (error: any) {
      console.error('❌ Google sign in error:', error);
      let userError = 'Failed to sign in with Google. Please try again.';
      
      if (error.code === 'auth/popup-blocked') {
        userError = 'Pop-up blocked. Please allow pop-ups and try again.';
      } else if (error.code === 'auth/cancelled-popup-request') {
        userError = 'Sign-in cancelled. Please try again.';
      } else if (error.message?.includes('requests-from-referer') && error.message?.includes('localhost')) {
        // Development environment - localhost not authorized
        userError = 'Development mode: Please add localhost:5173 to Firebase authorized domains or use anonymous sign-in for testing.';
        console.warn('⚠️ Development issue: Add localhost to Firebase Console > Authentication > Settings > Authorized domains');
      } else if (error.message?.includes('are-blocked')) {
        userError = 'Domain not authorized. Please contact support.';
      }
      
      this.setState({ error: userError });
    } finally {
      this.setState({ loading: false });
    }
  };

  signInWithApple = async () => {
    try {
      this.setState({ error: null, loading: true });
      const result = await signInWithPopup(auth, appleProvider);
      const profile = await this.createUserProfile(result.user, 'apple');
      this.setState({ userProfile: profile });
    } catch (error: any) {
      console.error('❌ Apple sign in error:', error);
      let userError = 'Failed to sign in with Apple. Please try again.';
      
      if (error.code === 'auth/popup-blocked') {
        userError = 'Pop-up blocked. Please allow pop-ups and try again.';
      } else if (error.code === 'auth/cancelled-popup-request') {
        userError = 'Sign-in cancelled. Please try again.';
      }
      
      this.setState({ error: userError });
    } finally {
      this.setState({ loading: false });
    }
  };

  signInWithEmail = async (email: string, password: string) => {
    try {
      this.setState({ error: null, loading: true });
      const result = await signInWithEmailAndPassword(auth, email, password);
      const profile = await this.createUserProfile(result.user, 'email');
      this.setState({ userProfile: profile });
    } catch (error: any) {
      console.error('❌ Email sign in error:', error);
      this.setState({ error: error.message });
    } finally {
      this.setState({ loading: false });
    }
  };

  signUpWithEmail = async (email: string, password: string, displayName?: string) => {
    try {
      this.setState({ error: null, loading: true });
      const result = await createUserWithEmailAndPassword(auth, email, password);
      
      if (displayName && result.user) {
        await updateProfile(result.user, { displayName });
      }
      
      const profile = await this.createUserProfile(result.user, 'email');
      this.setState({ userProfile: profile });
    } catch (error: any) {
      console.error('❌ Email sign up error:', error);
      this.setState({ error: error.message });
    } finally {
      this.setState({ loading: false });
    }
  };

  signInAnonymously = async () => {
    try {
      this.setState({ error: null, loading: true });
      const result = await signInAnonymously(auth);
      const profile = await this.createUserProfile(result.user, 'anonymous');
      this.setState({ userProfile: profile });
    } catch (error: any) {
      console.error('❌ Anonymous sign in error:', error);
      this.setState({ error: error.message });
    } finally {
      this.setState({ loading: false });
    }
  };

  logout = async () => {
    try {
      this.setState({ error: null });
      await signOut(auth);
      // Clear localStorage data
      if (this.state.user?.uid) {
        localStorage.removeItem(`userProfile_${this.state.user.uid}`);
      }
      this.setState({ user: null, userProfile: null });
    } catch (error: any) {
      console.error('❌ Logout error:', error);
      this.setState({ error: error.message });
    }
  };

  resetPassword = async (email: string) => {
    try {
      this.setState({ error: null });
      await sendPasswordResetEmail(auth, email);
    } catch (error: any) {
      console.error('❌ Password reset error:', error);
      this.setState({ error: error.message });
    }
  };

  sendSignInLink = async (email: string) => {
    try {
      this.setState({ error: null });
      const actionCodeSettings = {
        url: window.location.href,
        handleCodeInApp: true,
      };
      await sendSignInLinkToEmail(auth, email, actionCodeSettings);
      localStorage.setItem('emailForSignIn', email);
    } catch (error: any) {
      console.error('❌ Send sign in link error:', error);
      this.setState({ error: error.message });
    }
  };

  signInWithLink = async (email: string, emailLink: string) => {
    try {
      this.setState({ error: null, loading: true });
      if (isSignInWithEmailLink(auth, emailLink)) {
        const result = await signInWithEmailLink(auth, email, emailLink);
        localStorage.removeItem('emailForSignIn');
        const profile = await this.createUserProfile(result.user, 'email');
        this.setState({ userProfile: profile });
      }
    } catch (error: any) {
      console.error('❌ Sign in with link error:', error);
      this.setState({ error: error.message });
    } finally {
      this.setState({ loading: false });
    }
  };

  updateUserProfile = async (updates: Partial<UserProfile>) => {
    try {
      this.setState({ error: null });
      if (this.state.userProfile) {
        const updatedProfile = { ...this.state.userProfile, ...updates };
        this.setState({ userProfile: updatedProfile });
        
        // Save to localStorage
        if (this.state.user?.uid) {
          localStorage.setItem(`userProfile_${this.state.user.uid}`, JSON.stringify(updatedProfile));
        }
      }
    } catch (error: any) {
      console.error('❌ Update profile error:', error);
      this.setState({ error: error.message });
    }
  };

  isSubscribed = (tier?: SubscriptionTier): boolean => {
    if (!this.state.userProfile) return false;
    
    if (!tier) {
      return this.state.userProfile.subscription !== 'free';
    }
    
    // Check if user has the required subscription tier or higher
    const tierHierarchy = {
      'free': 0,
      'pro_monthly': 1,
      'pro_annual': 2,
      'pro_biennial': 3
    };
    
    const currentLevel = tierHierarchy[this.state.userProfile.subscription] || 0;
    const requiredLevel = tierHierarchy[tier] || 0;
    
    return currentLevel >= requiredLevel;
  };

  render() {
    const value: AuthContextType = {
      user: this.state.user,
      userProfile: this.state.userProfile,
      loading: this.state.loading,
      error: this.state.error,
      signInWithGoogle: this.signInWithGoogle,
      signInWithApple: this.signInWithApple,
      signInWithEmail: this.signInWithEmail,
      signUpWithEmail: this.signUpWithEmail,
      sendSignInLink: this.sendSignInLink,
      signInWithLink: this.signInWithLink,
      signInAnonymously: this.signInAnonymously,
      logout: this.logout,
      resetPassword: this.resetPassword,
      updateUserProfile: this.updateUserProfile,
      isSubscribed: this.isSubscribed,
    };

    return (
      <AuthContext.Provider value={value}>
        {this.props.children}
      </AuthContext.Provider>
    );
  }
}
