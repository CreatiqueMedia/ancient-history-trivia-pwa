import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
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
// FIRESTORE IMPORTS REMOVED - App now operates in pure offline mode
import { auth, googleProvider, appleProvider } from '../config/firebase';
import type { UserProfile, AuthProvider, SubscriptionTier } from '../types';

interface AuthContextType {
  user: User | null;
  userProfile: UserProfile | null;
  loading: boolean;
  signInWithGoogle: () => Promise<any>;
  signInWithApple: () => Promise<void>;
  signInWithEmail: (email: string, password: string) => Promise<void>;
  signUpWithEmail: (email: string, password: string, displayName: string) => Promise<void>;
  sendSignInLink: (email: string) => Promise<void>;
  signInWithLink: (email: string, emailLink: string) => Promise<void>;
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
  const [user, setUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Create user profile (pure offline mode - no Firestore)
  const createUserProfile = async (user: User, provider: AuthProvider): Promise<UserProfile> => {
    // Always create profile from auth data since Firestore is disabled
    const profile: UserProfile = {
      id: user.uid,
      email: user.email || '',
      displayName: user.displayName || user.email?.split('@')[0] || 'User',
      photoURL: user.photoURL || undefined,
      provider,
      subscription: 'free',
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

    // Try to load any existing profile from localStorage
    try {
      const savedProfile = localStorage.getItem(`userProfile_${user.uid}`);
      if (savedProfile) {
        const parsed = JSON.parse(savedProfile);
        // Merge saved preferences with current auth data
        profile.preferences = { ...profile.preferences, ...parsed.preferences };
        profile.subscription = parsed.subscription || 'free';
        profile.createdAt = new Date(parsed.createdAt) || profile.createdAt;
      }
    } catch (error) {
      console.warn('Could not load saved profile from localStorage:', error);
    }

    // Save profile to localStorage for persistence
    try {
      localStorage.setItem(`userProfile_${user.uid}`, JSON.stringify(profile));
    } catch (error) {
      console.warn('Could not save profile to localStorage:', error);
    }

    return profile;
  };

  // Sign in with Google
  const signInWithGoogle = async () => {
    try {
      setError(null);
      setLoading(true);
      
      try {
        // Try popup first
        const result = await signInWithPopup(auth, googleProvider);
        const profile = await createUserProfile(result.user, 'google');
        setUserProfile(profile);
        return result;
      } catch (popupError: any) {
        // If popup fails due to COOP or similar issues, fall back to redirect
        if (popupError.code === 'auth/popup-blocked' || 
            popupError.message?.includes('Cross-Origin-Opener-Policy') ||
            popupError.message?.includes('window.close')) {
          console.log('🔄 Popup blocked or COOP issue, falling back to redirect...');
          await signInWithRedirect(auth, googleProvider);
          return; // Redirect will handle the rest
        }
        throw popupError; // Re-throw other popup errors
      }
    } catch (error: any) {
      console.error('❌ Google sign in error:', error);
      
      // Provide user-friendly error messages
      let userError = error.message;
      if (error.code === 'auth/popup-closed-by-user') {
        userError = 'Sign-in was cancelled. Please try again.';
      } else if (error.code === 'auth/popup-blocked') {
        userError = 'Pop-up blocked. Trying redirect method...';
      } else if (error.code === 'auth/operation-not-allowed') {
        userError = 'Google sign-in is not enabled. Please contact support.';
      } else if (error.code === 'auth/invalid-api-key') {
        userError = 'Authentication configuration error. Please contact support.';
      } else if (error.code === 'auth/unauthorized-domain') {
        userError = 'This domain is not authorized for authentication. Please contact support or try the Firebase Hosting version at ancient-history-trivia.web.app';
      } else if (error.code === 'auth/account-exists-with-different-credential') {
        userError = 'An account already exists with this email address using a different sign-in method.';
      } else if (error.message?.includes('Cross-Origin-Opener-Policy')) {
        userError = 'Browser security settings are preventing sign-in. Trying alternative method...';
      }
      
      setError(userError);
      throw error; // Re-throw so the modal can handle it
    } finally {
      setLoading(false);
    }
  };


  // Sign in with Apple
  const signInWithApple = async () => {
    try {
      setError(null);
      setLoading(true);
      const result = await signInWithPopup(auth, appleProvider);
      const profile = await createUserProfile(result.user, 'apple');
      setUserProfile(profile);
    } catch (error: any) {
      console.error('Apple sign in error:', error);
      
      let userError = error.message;
      if (error.code === 'auth/unauthorized-domain') {
        userError = 'This domain is not authorized for authentication. Please contact support or try the Firebase Hosting version at ancient-history-trivia.web.app';
      } else if (error.code === 'auth/popup-closed-by-user') {
        userError = 'Sign-in was cancelled. Please try again.';
      } else if (error.code === 'auth/popup-blocked') {
        userError = 'Pop-up blocked. Please allow pop-ups for this site and try again.';
      }
      
      setError(userError);
    } finally {
      setLoading(false);
    }
  };

  // Sign in with Email
  const signInWithEmail = async (email: string, password: string) => {
    try {
      setError(null);
      setLoading(true);
      const result = await signInWithEmailAndPassword(auth, email, password);
      const profile = await createUserProfile(result.user, 'email');
      setUserProfile(profile);
    } catch (error: any) {
      setError(error.message);
      console.error('Email sign in error:', error);
    } finally {
      setLoading(false);
    }
  };

  // Sign up with Email
  const signUpWithEmail = async (email: string, password: string, displayName: string) => {
    try {
      setError(null);
      setLoading(true);
      const result = await createUserWithEmailAndPassword(auth, email, password);
      
      // Update the user's display name
      await updateProfile(result.user, { displayName });
      
      const profile = await createUserProfile(result.user, 'email');
      setUserProfile(profile);
    } catch (error: any) {
      setError(error.message);
      console.error('Email sign up error:', error);
    } finally {
      setLoading(false);
    }
  };

  // Sign in anonymously
  const signInAnonymouslyHandler = async () => {
    try {
      setError(null);
      setLoading(true);
      const result = await signInAnonymously(auth);
      const profile = await createUserProfile(result.user, 'anonymous');
      setUserProfile(profile);
    } catch (error: any) {
      setError(error.message);
      console.error('Anonymous sign in error:', error);
    } finally {
      setLoading(false);
    }
  };

  // Send sign-in link to email
  const sendSignInLink = async (email: string) => {
    try {
      setError(null);
      const actionCodeSettings = {
        // URL where user will be redirected after clicking the link
        url: window.location.origin + '/auth/signin',
        handleCodeInApp: true,
        // For web-only deployment, we don't need iOS/Android configs yet
        // When you're ready for mobile apps, uncomment and configure these:
        // iOS: {
        //   bundleId: 'com.creativequemedia.ancienthistorytrivia'
        // },
        // android: {
        //   packageName: 'com.creativequemedia.ancienthistorytrivia',
        //   installApp: true,
        //   minimumVersion: '1'
        // },
        // dynamicLinkDomain: 'ancienthistorytrivia.page.link' // Set up in Firebase Console when needed
      };
      
      await sendSignInLinkToEmail(auth, email, actionCodeSettings);
      // Save email in localStorage for verification
      localStorage.setItem('emailForSignIn', email);
    } catch (error: any) {
      setError(error.message);
      console.error('Send sign-in link error:', error);
      throw error;
    }
  };

  // Sign in with email link
  const signInWithLink = async (email: string, emailLink: string) => {
    try {
      setError(null);
      setLoading(true);
      
      if (isSignInWithEmailLink(auth, emailLink)) {
        const result = await signInWithEmailLink(auth, email, emailLink);
        const profile = await createUserProfile(result.user, 'email');
        setUserProfile(profile);
        // Clear email from localStorage
        localStorage.removeItem('emailForSignIn');
      } else {
        throw new Error('Invalid sign-in link');
      }
    } catch (error: any) {
      setError(error.message);
      console.error('Sign in with link error:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Logout
  const logout = async () => {
    try {
      setError(null);
      await signOut(auth);
      setUser(null);
      setUserProfile(null);
    } catch (error: any) {
      setError(error.message);
      console.error('Logout error:', error);
    }
  };

  // Reset password
  const resetPassword = async (email: string) => {
    try {
      setError(null);
      await sendPasswordResetEmail(auth, email);
    } catch (error: any) {
      setError(error.message);
      console.error('Password reset error:', error);
    }
  };

  // Update user profile
  const updateUserProfile = async (updates: Partial<UserProfile>) => {
    if (!user || !userProfile) return;

    try {
      setError(null);
      
      // Update local state and localStorage (pure offline mode)
      const updatedProfile = { ...userProfile, ...updates, lastActive: new Date() };
      setUserProfile(updatedProfile);
      
      // Save to localStorage for persistence
      try {
        localStorage.setItem(`userProfile_${user.uid}`, JSON.stringify(updatedProfile));
      } catch (storageError) {
        console.warn('Could not save updated profile to localStorage:', storageError);
      }
      
    } catch (error: any) {
      console.warn('Profile update error:', error);
      setError('Failed to update profile');
    }
  };

  // Check subscription status
  const isSubscribed = (tier?: SubscriptionTier): boolean => {
    if (!userProfile) return false;
    
    const tierHierarchy = ['free', 'pro_monthly', 'pro_annual'];
    const userTierIndex = tierHierarchy.indexOf(userProfile.subscription);
    const requiredTierIndex = tierHierarchy.indexOf(tier || 'pro_monthly');
    
    return userTierIndex >= requiredTierIndex;
  };

  // Listen for auth state changes (pure offline mode)
  useEffect(() => {
    
    // Check for redirect result first
    const checkRedirectResult = async () => {
      try {
        const result = await getRedirectResult(auth);
        
        if (result && result.user) {
          try {
            const provider = result.providerId?.includes('google') ? 'google' :
                            result.providerId?.includes('apple') ? 'apple' : 'email';
            const profile = await createUserProfile(result.user, provider);
            setUserProfile(profile);
          } catch (profileError) {
            console.error('Error creating profile from redirect:', profileError);
          }
        }
      } catch (error: any) {
        // Don't set error for these specific cases as they're expected
        if (error.code !== 'auth/no-auth-event' && error.code !== 'auth/invalid-auth-event') {
          setError(error.message);
        }
      }
    };
    
    // Check for redirect result immediately
    checkRedirectResult();
    
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setUser(user);
      
      if (user) {
        setLoading(true);
        
        // Since Firestore is disabled, always create profile from auth data
        try {
          const provider = user.providerData[0]?.providerId.includes('google') ? 'google' :
                          user.providerData[0]?.providerId.includes('apple') ? 'apple' :
                          user.isAnonymous ? 'anonymous' : 'email';
          
          const profile = await createUserProfile(user, provider);
          setUserProfile(profile);
        } catch (error: any) {
          console.warn('[AuthContext] Error creating user profile:', error);
          
          // Create basic fallback profile
          const fallbackProfile: UserProfile = {
            id: user.uid,
            email: user.email || '',
            displayName: user.displayName || user.email?.split('@')[0] || 'User',
            photoURL: user.photoURL || undefined,
            provider: user.isAnonymous ? 'anonymous' : 'email',
            subscription: 'free',
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
          
          setUserProfile(fallbackProfile);
        }
      } else {
        setUserProfile(null);
      }
      
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const value: AuthContextType = {
    user,
    userProfile,
    loading,
    signInWithGoogle,
    signInWithApple,
    signInWithEmail,
    signUpWithEmail,
    sendSignInLink,
    signInWithLink,
    signInAnonymously: signInAnonymouslyHandler,
    logout,
    resetPassword,
    updateUserProfile,
    isSubscribed,
    error
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}
