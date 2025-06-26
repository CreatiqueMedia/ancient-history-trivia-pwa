// Basic Authentication Testing Suite
// Run with: yarn test

import { describe, it, expect, beforeEach, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider, useAuth } from '../context/MockAuthContext';

// Mock external services
vi.mock('../services/AnalyticsService', () => ({
  analyticsService: {
    trackSignIn: vi.fn(),
    trackSignUp: vi.fn(),
    trackSignOut: vi.fn(),
    setUserId: vi.fn(),
    trackFeatureUsage: vi.fn(),
  }
}));

vi.mock('../services/ErrorHandlingService', () => ({
  errorHandler: {
    handleAuthError: vi.fn(),
    handleGenericError: vi.fn(),
  }
}));

const TestWrapper = ({ children }: { children: React.ReactNode }) => (
  <BrowserRouter>
    <AuthProvider>
      {children}
    </AuthProvider>
  </BrowserRouter>
);

describe('Authentication System', () => {
  beforeEach(() => {
    // Reset mocks before each test
    vi.clearAllMocks();
    localStorage.clear();
    sessionStorage.clear();
  });

  describe('Authentication Context', () => {
    it('creates user profile on first sign-in', async () => {
      const { result } = renderHook(() => useAuth(), {
        wrapper: TestWrapper
      });

      await act(async () => {
        await result.current.signInWithGoogle();
      });

      expect(result.current.user).toBeTruthy();
      expect(result.current.userProfile).toBeTruthy();
      expect(result.current.userProfile?.provider).toBe('google');
    });

    it('updates last active timestamp on sign-in', async () => {
      const { result } = renderHook(() => useAuth(), {
        wrapper: TestWrapper
      });

      const beforeSignIn = new Date();
      
      await act(async () => {
        await result.current.signInWithGoogle();
      });

      const lastActive = new Date(result.current.userProfile?.lastActive || '');
      expect(lastActive.getTime()).toBeGreaterThanOrEqual(beforeSignIn.getTime());
    });

    it('persists user session in localStorage', async () => {
      const { result } = renderHook(() => useAuth(), {
        wrapper: TestWrapper
      });

      await act(async () => {
        await result.current.signInWithGoogle();
      });

      const userProfile = localStorage.getItem(`userProfile_${result.current.user?.uid}`);
      expect(userProfile).toBeTruthy();
      
      const parsedProfile = JSON.parse(userProfile!);
      expect(parsedProfile.provider).toBe('google');
    });

    it('handles sign-up with email', async () => {
      const { result } = renderHook(() => useAuth(), {
        wrapper: TestWrapper
      });

      await act(async () => {
        await result.current.signUpWithEmail(
          'test@example.com',
          'password123',
          'Test User'
        );
      });

      expect(result.current.user).toBeTruthy();
      expect(result.current.user?.email).toBe('test@example.com');
      expect(result.current.user?.displayName).toBe('Test User');
      expect(result.current.userProfile?.subscription).toBe('free');
    });

    it('handles logout correctly', async () => {
      const { result } = renderHook(() => useAuth(), {
        wrapper: TestWrapper
      });

      // First sign in
      await act(async () => {
        await result.current.signInWithGoogle();
      });

      expect(result.current.user).toBeTruthy();

      // Then logout
      await act(async () => {
        await result.current.logout();
      });

      expect(result.current.user).toBeNull();
      expect(result.current.userProfile).toBeNull();
    });

    it('correctly identifies subscription tiers', async () => {
      const { result } = renderHook(() => useAuth(), {
        wrapper: TestWrapper
      });

      await act(async () => {
        await result.current.signInWithGoogle();
      });

      // Default should be free tier
      expect(result.current.isSubscribed()).toBe(false);
      expect(result.current.isSubscribed('free')).toBe(true);
      expect(result.current.isSubscribed('pro_monthly')).toBe(false);
      // Update to pro_monthly subscription
      await act(async () => {
        await result.current.updateUserProfile({ subscription: 'pro_monthly' });
      });
      expect(result.current.isSubscribed('pro_monthly')).toBe(true);
      expect(result.current.isSubscribed('pro_annual')).toBe(false);
      const tierHierarchy = ['free', 'pro_monthly', 'pro_annual'];
      // Update to pro_annual subscription
      await act(async () => {
        await result.current.updateUserProfile({ subscription: 'pro_annual' });
      });
      expect(result.current.isSubscribed('pro_monthly')).toBe(false);
      expect(result.current.isSubscribed('pro_annual')).toBe(true);
    });
  });
});

// Helper functions for tests
function calculateTrialDaysRemaining(trialStart: Date, trialDays: number): number {
  const now = new Date();
  const trialEnd = new Date(trialStart.getTime() + (trialDays * 24 * 60 * 60 * 1000));
  const msRemaining = trialEnd.getTime() - now.getTime();
  return Math.max(0, Math.ceil(msRemaining / (24 * 60 * 60 * 1000)));
}

function isSubscribed(profile: any, tier: string): boolean {
  const tierHierarchy = ['free', 'pro_monthly', 'pro_annual'];
  const currentTierIndex = tierHierarchy.indexOf(profile.subscription);
  const requiredTierIndex = tierHierarchy.indexOf(tier);
  return currentTierIndex >= requiredTierIndex;
}
