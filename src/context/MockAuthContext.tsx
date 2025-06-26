import React, { createContext, useContext, useState, ReactNode } from 'react';
import type { UserProfile, AuthProvider as AuthProviderType, SubscriptionTier } from '../types';

// Mock User type to match Firebase User interface
interface MockUser {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
  isAnonymous: boolean;
  providerData: Array<{
    providerId: string;
  }>;
}

interface AuthContextType {
  user: MockUser | null;
  userProfile: UserProfile | null;
  loading: boolean;
  signInWithGoogle: () => Promise<void>;
  signInWithFacebook: () => Promise<void>;
  signInWithApple: () => Promise<void>;
  signInWithEmail: (email: string, password: string) => Promise<void>;
  signUpWithEmail: (email: string, password: string, displayName: string) => Promise<void>;
  signInAnonymously: () => Promise<void>;
  logout: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  updateUserProfile: (updates: Partial<UserProfile>) => Promise<void>;
  isSubscribed: (tier?: SubscriptionTier) => boolean;
  error: string | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  console.log('🔧 Working Mock Auth Provider starting...');
  
  const [user, setUser] = useState<MockUser | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Helper function to create user profile
  const createUserProfile = (user: MockUser, provider: AuthProviderType): UserProfile => {
    const profile: UserProfile = {
      id: user.uid,
      email: user.email || '',
      displayName: user.displayName || 'Anonymous User',
      photoURL: user.photoURL || undefined,
      provider: provider,
      subscription: 'free',
      createdAt: new Date(),
      lastActive: new Date(),
      isAnonymous: user.isAnonymous,
      preferences: {
        theme: 'light',
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
      }
    };

    // Save to localStorage with the expected key format
    localStorage.setItem(`userProfile_${user.uid}`, JSON.stringify(profile));
    return profile;
  };

  // Authentication functions
  const signInWithGoogle = async () => {
    setLoading(true);
    setError(null);
    
    const mockUser: MockUser = {
      uid: 'google_mock_user',
      email: 'user@gmail.com',
      displayName: 'Google User',
      photoURL: 'https://via.placeholder.com/150',
      isAnonymous: false,
      providerData: [{ providerId: 'google.com' }]
    };

    const profile = createUserProfile(mockUser, 'google');
    setUser(mockUser);
    setUserProfile(profile);
    setLoading(false);
  };

  const signInWithFacebook = async () => {
    setLoading(true);
    setError(null);
    
    const mockUser: MockUser = {
      uid: `facebook_${Date.now()}`,
      email: 'user@facebook.com',
      displayName: 'Facebook User',
      photoURL: 'https://via.placeholder.com/150',
      isAnonymous: false,
      providerData: [{ providerId: 'facebook.com' }]
    };

    const profile = createUserProfile(mockUser, 'facebook');
    setUser(mockUser);
    setUserProfile(profile);
    setLoading(false);
  };

  const signInWithApple = async () => {
    setLoading(true);
    setError(null);
    
    const mockUser: MockUser = {
      uid: `apple_${Date.now()}`,
      email: 'user@privaterelay.appleid.com',
      displayName: 'Apple User',
      photoURL: null,
      isAnonymous: false,
      providerData: [{ providerId: 'apple.com' }]
    };

    const profile = createUserProfile(mockUser, 'apple');
    setUser(mockUser);
    setUserProfile(profile);
    setLoading(false);
  };

  const signInWithEmail = async (email: string, password: string) => {
    setLoading(true);
    setError(null);

    if (!email || !password) {
      setError('Email and password are required');
      setLoading(false);
      return;
    }

    const mockUser: MockUser = {
      uid: `email_${Date.now()}`,
      email: email,
      displayName: email.split('@')[0],
      photoURL: null,
      isAnonymous: false,
      providerData: [{ providerId: 'password' }]
    };

    const profile = createUserProfile(mockUser, 'email');
    setUser(mockUser);
    setUserProfile(profile);
    setLoading(false);
  };

  const signUpWithEmail = async (email: string, password: string, displayName: string) => {
    setLoading(true);
    setError(null);
    
    if (!email || !password || !displayName) {
      setError('Email, password, and display name are required');
      setLoading(false);
      return;
    }

    const mockUser: MockUser = {
      uid: `email_${Date.now()}`,
      email: email,
      displayName: displayName,
      photoURL: null,
      isAnonymous: false,
      providerData: [{ providerId: 'password' }]
    };

    const profile = createUserProfile(mockUser, 'email');
    setUser(mockUser);
    setUserProfile(profile);
    setLoading(false);
  };

  const signInAnonymously = async () => {
    setLoading(true);
    setError(null);
    
    const mockUser: MockUser = {
      uid: `anon_${Date.now()}`,
      email: null,
      displayName: null,
      photoURL: null,
      isAnonymous: true,
      providerData: []
    };

    const profile = createUserProfile(mockUser, 'anonymous');
    setUser(mockUser);
    setUserProfile(profile);
    setLoading(false);
  };

  const logout = async () => {
    setLoading(true);
    
    if (user) {
      localStorage.removeItem(`userProfile_${user.uid}`);
    }
    localStorage.removeItem('currentUser');
    
    setUser(null);
    setUserProfile(null);
    setError(null);
    setLoading(false);
  };

  const resetPassword = async (email: string) => {
    setError(null);
    console.log('Password reset email sent to:', email);
  };

  const updateUserProfile = async (updates: Partial<UserProfile>) => {
    if (!user || !userProfile) {
      setError('User not authenticated');
      return;
    }

    const updatedProfile = { ...userProfile, ...updates };
    setUserProfile(updatedProfile);
    localStorage.setItem(`userProfile_${user.uid}`, JSON.stringify(updatedProfile));
  };

  const isSubscribed = (tier?: SubscriptionTier): boolean => {
    if (!userProfile) return false;
    
    if (!tier) {
      return userProfile.subscription !== 'free';
    }
    
    const tierLevels: Record<string, number> = {
      'free': 0,
      'pro_monthly': 1,
      'pro_annual': 1
    };
    
    const userLevel = tierLevels[userProfile.subscription] || 0;
    const requiredLevel = tierLevels[tier] || 0;
    
    return userLevel >= requiredLevel;
  };

  console.log('🔧 About to create context value...');
  console.log('🔧 updateUserProfile type:', typeof updateUserProfile);
  console.log('🔧 isSubscribed type:', typeof isSubscribed);
  console.log('🔧 userProfile:', userProfile);

  const contextValue: AuthContextType = {
    user,
    userProfile,
    loading,
    signInWithGoogle,
    signInWithFacebook,
    signInWithApple,
    signInWithEmail,
    signUpWithEmail,
    signInAnonymously,
    logout,
    resetPassword,
    updateUserProfile,
    isSubscribed,
    error
  };

  console.log('🔧 Context value keys:', Object.keys(contextValue));
  console.log('🔧 Context value property count:', Object.keys(contextValue).length);
  console.log('🔧 Working Mock Auth Provider providing context...');

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
}
