import { useContext } from 'react';
import { StatsContext } from '../context/StatsContext';

// Hook to use stats context - separate file to avoid Fast Refresh issues
export const useStats = () => {
  const context = useContext(StatsContext);
  if (context === undefined) {
    throw new Error('useStats must be used within a StatsProvider');
  }
  return context;
};
