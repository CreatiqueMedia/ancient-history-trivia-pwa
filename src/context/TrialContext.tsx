import React, { createContext, useContext, ReactNode } from 'react';
import { TrialService } from '../services/TrialService';
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
    startTrial: TrialService.startTrial,
    getTrialStatus: TrialService.getTrialStatus,
    isTrialActive: TrialService.isInTrial,
    trackBundleAccess: TrialService.trackBundleAccess,
  };

  return (
    <TrialContext.Provider value={trialService}>
      {children}
    </TrialContext.Provider>
  );
}
