import React, { createContext, useContext, ReactNode } from 'react';
import { StripeTrialService } from '../services/StripeTrialService';
import { TrialStatus } from '../types/enhancements';

interface TrialContextType {
  startTrial: (userId: string) => Promise<TrialStatus>;
  getTrialStatus: () => TrialStatus | null;
  isTrialActive: () => boolean;
  trackBundleAccess: (bundleId: string) => void;
}

const TrialContext = createContext<TrialContextType | undefined>(undefined);

export function useTrial() {
  const context = useContext(TrialContext);
  if (context === undefined) {
    throw new Error('useTrial must be used within a TrialProvider');
  }
  return context;
}

export function TrialProvider({ children }: { children: ReactNode }) {
  const trialService = {
    startTrial: StripeTrialService.startTrial,
    getTrialStatus: StripeTrialService.getTrialStatus,
    isTrialActive: StripeTrialService.isInTrial,
    trackBundleAccess: StripeTrialService.trackBundleAccess,
  };

  return (
    <TrialContext.Provider value={trialService}>
      {children}
    </TrialContext.Provider>
  );
}
