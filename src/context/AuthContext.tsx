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
  FacebookAuthProvider,
  OAuthProvider
} from 'firebase/auth';
import { doc, setDoc, getDoc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db, googleProvider, facebookProvider, appleProvider, ensureFirestoreConnected, shouldRetryFirestore, recordFirestoreError, resetFirestoreErrors } from '../config/firebase';
import type { UserProfile, AuthProvider, SubscriptionTier } from '../types';

interface AuthContextType {
  user: User | null;
  userProfile: UserProfile | null;
  loading: boolean;
  signInWithGoogle: () => Promise<any>;
  signInWithFacebook: () => Promise<void>;
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

  // Utility function for retrying Firestore operations with exponential backoff
  function retryFirestoreOperation<T>(
    operation: () => Promise<T>,
    maxRetries: number = 3,
    baseDelay: number = 1000
  ): Promise<T> {
    return new Promise(async (resolve, reject) => {
      let lastError: any;
      
      for (let attempt = 0; attempt < maxRetries; attempt++) {
        try {
          if (attempt > 0) {
            // Ensure network connection before retry
            await ensureFirestoreConnected();
          }
          const result = await operation();
          resolve(result);
          return;
        } catch (error: any) {
          lastError = error;
          
          // Don't retry for certain errors
          if (error.code === 'permission-denied' || 
              error.code === 'not-found' ||
              error.code === 'invalid-argument') {
            reject(error);
            return;
          }
          
          // For the last attempt, throw the error
          if (attempt === maxRetries - 1) {
            reject(error);
            return;
          }
          
          // Wait before retrying with exponential backoff
          const delay = baseDelay * Math.pow(2, attempt) + Math.random() * 1000;
          await new Promise(resolve => setTimeout(resolve, delay));
        }
      }
      
      reject(lastError);
    });
  }

  // Create or update user profile in Firestore
  const createUserProfile = async (user: User, provider: AuthProvider): Promise<UserProfile> => {
    try {
      const userDoc = doc(db, 'users', user.uid);
      
      // Use retry mechanism for getting user document
      const userSnap = await retryFirestoreOperation(async () => {
        return await getDoc(userDoc);
      }, 2, 300);

      if (!userSnap.exists()) {
        // Create new user profile
        const newProfile: UserProfile = {
          id: user.uid,
          email: user.email || '',
          displayName: user.displayName || 'Anonymous User',
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

        try {
          await retryFirestoreOperation(async () => {
            await setDoc(userDoc, {
              ...newProfile,
              createdAt: serverTimestamp(),
              lastActive: serverTimestamp()
            });
          }, 2, 300);
        } catch (firestoreError) {
          console.warn('Could not save profile to Firestore:', firestoreError);
          // Continue with local profile even if Firestore save fails
        }

        return newProfile;
      } else {
        // Update existing user profile
        const existingProfile = userSnap.data() as UserProfile;
        const updatedProfile = {
          ...existingProfile,
          lastActive: new Date(),
          photoURL: user.photoURL || existingProfile.photoURL,
          displayName: user.displayName || existingProfile.displayName
        };

        try {
          await retryFirestoreOperation(async () => {
            await updateDoc(userDoc, {
              lastActive: serverTimestamp(),
              photoURL: user.photoURL,
              displayName: user.displayName
            });
          }, 2, 300);
        } catch (firestoreError) {
          console.warn('Could not update profile in Firestore:', firestoreError);
          // Continue with local profile even if Firestore update fails
        }

        return updatedProfile;
      }
    } catch (error: any) {
      console.warn('Firestore error in createUserProfile, creating fallback profile:', error);
      
      // If Firestore is completely unavailable, create a basic profile from auth data
      return {
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
    }
  };

  // Sign in with Google
  const signInWithGoogle = async () => {
    try {
      setError(null);
      setLoading(true);
      const result = await signInWithPopup(auth, googleProvider);
      const profile = await createUserProfile(result.user, 'google');
      setUserProfile(profile);
    } catch (error: any) {
      console.error('❌ Google sign in error:', error);
      
      // Provide user-friendly error messages
      let userError = error.message;
      if (error.code === 'auth/popup-closed-by-user') {
        userError = 'Sign-in was cancelled. Please try again.';
      } else if (error.code === 'auth/popup-blocked') {
        userError = 'Pop-up blocked. Please allow pop-ups for this site and try again.';
      } else if (error.code === 'auth/operation-not-allowed') {
        userError = 'Google sign-in is not enabled. Please contact support.';
      } else if (error.code === 'auth/invalid-api-key') {
        userError = 'Authentication configuration error. Please contact support.';
      } else if (error.code === 'auth/unauthorized-domain') {
        userError = 'This domain is not authorized for authentication. Please contact support or try the Firebase Hosting version at ancient-history-trivia.web.app';
      } else if (error.code === 'auth/account-exists-with-different-credential') {
        userError = 'An account already exists with this email address using a different sign-in method.';
      }
      
      setError(userError);
      throw error; // Re-throw so the modal can handle it
    } finally {
      setLoading(false);
    }
  };

  // Sign in with Facebook
  const signInWithFacebook = async () => {
    try {
      setError(null);
      setLoading(true);
      const result = await signInWithPopup(auth, facebookProvider);
      const profile = await createUserProfile(result.user, 'facebook');
      setUserProfile(profile);
    } catch (error: any) {
      console.error('Facebook sign in error:', error);
      
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
      const userDoc = doc(db, 'users', user.uid);
      const updatedProfile = { ...userProfile, ...updates };
      
      await updateDoc(userDoc, {
        ...updates,
        lastActive: serverTimestamp()
      });
      
      setUserProfile(updatedProfile);
    } catch (error: any) {
      setError(error.message);
      console.error('Profile update error:', error);
    }
  };

  // Check subscription status
  const isSubscribed = (tier?: SubscriptionTier): boolean => {
    if (!userProfile) return false;
    
    const tierHierarchy = ['free', 'scholar', 'historian', 'academy'];
    const userTierIndex = tierHierarchy.indexOf(userProfile.subscription);
    const requiredTierIndex = tierHierarchy.indexOf(tier || 'scholar');
    
    return userTierIndex >= requiredTierIndex;
  };

  // Listen for auth state changes
  useEffect(() => {
    
    // Check for redirect result first
    const checkRedirectResult = async () => {
      try {
        const result = await getRedirectResult(auth);
        
        if (result && result.user) {
          try {
            const profile = await createUserProfile(result.user, 'google');
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
        
        try {
          const userDoc = doc(db, 'users', user.uid);
          
          // Use retry mechanism with timeout for more reliable fetching
          const userSnap = await retryFirestoreOperation(async () => {
            const timeoutPromise = new Promise<never>((_, reject) => {
              setTimeout(() => reject(new Error('Firestore operation timed out')), 3000); // 3 second timeout per attempt
            });
            
            return await Promise.race([getDoc(userDoc), timeoutPromise]);
          }, 2, 500); // 2 retries with 500ms base delay
          
          if (userSnap.exists()) {
            const profile = userSnap.data() as UserProfile;
            setUserProfile(profile);
          } else {
            // Create profile for existing user without one
            const provider = user.providerData[0]?.providerId.includes('google') ? 'google' :
                            user.providerData[0]?.providerId.includes('facebook') ? 'facebook' :
                            user.providerData[0]?.providerId.includes('apple') ? 'apple' :
                            user.isAnonymous ? 'anonymous' : 'email';
            
            const profile = await createUserProfile(user, provider);
            setUserProfile(profile);
          }
        } catch (error: any) {
          console.error('[AuthContext] Error loading user profile:', error);
          
          // Handle various Firestore errors by creating a temporary profile
          if (error.code === 'unavailable' || 
              error.code === 'permission-denied' ||
              error.code === 'failed-precondition' ||
              error.message?.includes('offline') || 
              error.message?.includes('Failed to get document') ||
              error.message?.includes('timed out') ||
              error.message?.includes('400') ||
              error.name === 'FirebaseError') {
            
            console.warn('[AuthContext] Creating offline profile due to Firestore error');
            
            // Create a temporary profile from auth user data
            const tempProfile: UserProfile = {
              id: user.uid,
              email: user.email || '',
              displayName: user.displayName || user.email?.split('@')[0] || 'User',
              photoURL: user.photoURL || undefined,
              provider: user.providerData[0]?.providerId.includes('google') ? 'google' :
                       user.providerData[0]?.providerId.includes('facebook') ? 'facebook' :
                       user.providerData[0]?.providerId.includes('apple') ? 'apple' :
                       user.isAnonymous ? 'anonymous' : 'email',
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
            
            setUserProfile(tempProfile);
            
            // Try to sync to Firestore in the background
            setTimeout(async () => {
              try {
                await createUserProfile(user, tempProfile.provider);
              } catch (syncError) {
                console.warn('Could not sync profile to Firestore:', syncError);
              }
            }, 2000);
          } else {
            // For any other errors, still create a temporary profile to prevent blank profile screen
            const tempProfile: UserProfile = {
              id: user.uid,
              email: user.email || '',
              displayName: user.displayName || user.email?.split('@')[0] || 'User',
              photoURL: user.photoURL || undefined,
              provider: user.providerData[0]?.providerId.includes('google') ? 'google' :
                       user.providerData[0]?.providerId.includes('facebook') ? 'facebook' :
                       user.providerData[0]?.providerId.includes('apple') ? 'apple' :
                       user.isAnonymous ? 'anonymous' : 'email',
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
            
            setUserProfile(tempProfile);
          }
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
    signInWithFacebook,
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
