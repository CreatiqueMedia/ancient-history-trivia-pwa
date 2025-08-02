import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

// Hook to use auth context - separate file to avoid Fast Refresh issues
export const useAuth = () => {
  const context = useContext(AuthContext);
  
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  
  // Additional null check for React duplication issues
  if (context === null) {
    console.error('[useAuth] Context is null - possible React duplication issue');
    throw new Error('AuthContext is null - possible React duplication. Make sure there is only one React instance.');
  }
  
  return context;
};
