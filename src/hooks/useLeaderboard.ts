import { useContext } from 'react';
import { LeaderboardContext } from '../context/LeaderboardContext';

// Hook to use leaderboard context - separate file to avoid Fast Refresh issues
export const useLeaderboard = () => {
  const context = useContext(LeaderboardContext);
  if (!context) {
    throw new Error('useLeaderboard must be used within a LeaderboardProvider');
  }
  return context;
};
