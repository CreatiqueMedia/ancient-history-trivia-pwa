import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { 
  LeaderboardEntry, 
  Challenge, 
  ChallengeNotification, 
  LeaderboardFilters,
  ChallengeQuestion,
  ChallengeResult
} from '../types/leaderboard';
import { getRandomChallengeQuestions } from '../data/challengeQuestions';

interface LeaderboardContextType {
  // Leaderboard data
  leaderboard: LeaderboardEntry[];
  userRank: number | null;
  isLoadingLeaderboard: boolean;
  
  // Challenge data
  activeChallenges: Challenge[];
  pendingChallenges: Challenge[];
  completedChallenges: Challenge[];
  notifications: ChallengeNotification[];
  unreadNotifications: number;
  
  // Actions
  refreshLeaderboard: (filters?: LeaderboardFilters) => Promise<void>;
  sendChallenge: (targetUserId: string, difficulty?: 'easy' | 'medium' | 'hard' | 'mixed') => Promise<boolean>;
  acceptChallenge: (challengeId: string) => Promise<boolean>;
  declineChallenge: (challengeId: string) => Promise<boolean>;
  submitChallengeResult: (challengeId: string, result: ChallengeResult) => Promise<boolean>;
  markNotificationRead: (notificationId: string) => void;
  markAllNotificationsRead: () => void;
  
  // Current challenge state
  currentChallenge: Challenge | null;
  setCurrentChallenge: (challenge: Challenge | null) => void;
}

const LeaderboardContext = createContext<LeaderboardContextType | undefined>(undefined);

export { LeaderboardContext };

export const LeaderboardProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  
  // State management
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [userRank, setUserRank] = useState<number | null>(null);
  const [isLoadingLeaderboard, setIsLoadingLeaderboard] = useState(false);
  
  const [activeChallenges, setActiveChallenges] = useState<Challenge[]>([]);
  const [pendingChallenges, setPendingChallenges] = useState<Challenge[]>([]);
  const [completedChallenges, setCompletedChallenges] = useState<Challenge[]>([]);
  const [notifications, setNotifications] = useState<ChallengeNotification[]>([]);
  const [currentChallenge, setCurrentChallenge] = useState<Challenge | null>(null);

  // Load initial data
  useEffect(() => {
    if (user) {
      loadLeaderboardData();
      loadChallengeData();
      loadNotifications();
    }
  }, [user?.uid]); // Only depend on user ID to prevent excessive re-renders

  // Generate mock leaderboard data (in production, this would come from your backend)
  const generateMockLeaderboard = (): LeaderboardEntry[] => {
    const mockUsers = [
      { username: 'HistoryBuff2024', displayName: 'Alexander the Great', totalScore: 15420, totalQuizzes: 89, winStreak: 12, challengesWon: 34, challengesLost: 8 },
      { username: 'AncientWisdom', displayName: 'Cleopatra VII', totalScore: 14890, totalQuizzes: 76, winStreak: 8, challengesWon: 28, challengesLost: 12 },
      { username: 'RomanLegion', displayName: 'Julius Caesar', totalScore: 14320, totalQuizzes: 82, winStreak: 15, challengesWon: 31, challengesLost: 9 },
      { username: 'PharaohMaster', displayName: 'Ramesses II', totalScore: 13950, totalQuizzes: 71, winStreak: 6, challengesWon: 25, challengesLost: 14 },
      { username: 'SpartanWarrior', displayName: 'Leonidas', totalScore: 13680, totalQuizzes: 68, winStreak: 9, challengesWon: 22, challengesLost: 11 },
      { username: 'MayaExplorer', displayName: 'Pacal the Great', totalScore: 13210, totalQuizzes: 64, winStreak: 4, challengesWon: 19, challengesLost: 15 },
      { username: 'VikingRaider', displayName: 'Ragnar Lothbrok', totalScore: 12890, totalQuizzes: 59, winStreak: 7, challengesWon: 18, challengesLost: 13 },
      { username: 'ChineseEmperor', displayName: 'Qin Shi Huang', totalScore: 12560, totalQuizzes: 61, winStreak: 3, challengesWon: 16, challengesLost: 17 },
      { username: 'GreekPhilosopher', displayName: 'Aristotle', totalScore: 12340, totalQuizzes: 57, winStreak: 5, challengesWon: 15, challengesLost: 16 },
      { username: 'CelticDruid', displayName: 'Boudica', totalScore: 11980, totalQuizzes: 54, winStreak: 2, challengesWon: 14, challengesLost: 18 }
    ];

    return mockUsers.map((mockUser, index) => ({
      id: `user_${index + 1}`,
      userId: `user_${index + 1}`,
      username: mockUser.username,
      displayName: mockUser.displayName,
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${mockUser.username}`,
      totalScore: mockUser.totalScore,
      totalQuizzes: mockUser.totalQuizzes,
      averageScore: Math.round((mockUser.totalScore / mockUser.totalQuizzes) * 100) / 100,
      winStreak: mockUser.winStreak,
      challengesWon: mockUser.challengesWon,
      challengesLost: mockUser.challengesLost,
      rank: index + 1,
      lastActive: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString(),
      achievements: generateRandomAchievements()
    }));
  };

  const generateRandomAchievements = (): string[] => {
    const allAchievements = [
      'First Victory', 'Quiz Master', 'Speed Demon', 'Perfect Score', 'Challenge Champion',
      'History Scholar', 'Ancient Expert', 'Trivia Titan', 'Knowledge Seeker', 'Victory Streak'
    ];
    const count = Math.floor(Math.random() * 5) + 1;
    return allAchievements.slice(0, count);
  };

  const loadLeaderboardData = async () => {
    setIsLoadingLeaderboard(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const mockLeaderboard = generateMockLeaderboard();
      setLeaderboard(mockLeaderboard);
      
      // Find current user's rank
      if (user) {
        const userEntry = mockLeaderboard.find(entry => entry.userId === user.uid);
        setUserRank(userEntry?.rank || null);
      }
    } catch (error) {
      console.error('Error loading leaderboard:', error);
    } finally {
      setIsLoadingLeaderboard(false);
    }
  };

  const loadChallengeData = async () => {
    try {
      // Load from localStorage (in production, this would be from your backend)
      const storedChallenges = localStorage.getItem('userChallenges');
      if (storedChallenges) {
        const challenges: Challenge[] = JSON.parse(storedChallenges);
        
        // Separate challenges by status
        setActiveChallenges(challenges.filter(c => c.status === 'in_progress'));
        setPendingChallenges(challenges.filter(c => c.status === 'pending' && c.challengedId === user?.uid));
        setCompletedChallenges(challenges.filter(c => c.status === 'completed'));
      }
    } catch (error) {
      console.error('Error loading challenge data:', error);
    }
  };

  const loadNotifications = async () => {
    try {
      const storedNotifications = localStorage.getItem('challengeNotifications');
      if (storedNotifications) {
        setNotifications(JSON.parse(storedNotifications));
      }
    } catch (error) {
      console.error('Error loading notifications:', error);
    }
  };

  const refreshLeaderboard = async (filters?: LeaderboardFilters) => {
    await loadLeaderboardData();
  };

  const sendChallenge = async (
    targetUserId: string, 
    difficulty: 'easy' | 'medium' | 'hard' | 'mixed' = 'mixed'
  ): Promise<boolean> => {
    if (!user) return false;

    try {
      // Find target user
      const targetUser = leaderboard.find(entry => entry.userId === targetUserId);
      if (!targetUser) return false;

      // Generate challenge questions
      const questions = getRandomChallengeQuestions(20, difficulty);
      
      // Create challenge
      const challenge: Challenge = {
        id: `challenge_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        challengerId: user.uid,
        challengerName: user.displayName || user.email || 'Anonymous',
        challengedId: targetUserId,
        challengedName: targetUser.displayName,
        status: 'pending',
        createdAt: new Date().toISOString(),
        expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), // 24 hours
        questions,
        difficulty
      };

      // Save challenge
      const existingChallenges = JSON.parse(localStorage.getItem('userChallenges') || '[]');
      const updatedChallenges = [...existingChallenges, challenge];
      localStorage.setItem('userChallenges', JSON.stringify(updatedChallenges));

      // Create notification for target user
      const notification: ChallengeNotification = {
        id: `notification_${Date.now()}`,
        type: 'challenge_received',
        fromUserId: user.uid,
        fromUserName: user.displayName || user.email || 'Anonymous',
        challengeId: challenge.id,
        message: `${user.displayName || 'Someone'} has challenged you to a trivia duel!`,
        createdAt: new Date().toISOString(),
        read: false
      };

      // Save notification (in production, this would be sent to the target user)
      const existingNotifications = JSON.parse(localStorage.getItem('challengeNotifications') || '[]');
      const updatedNotifications = [...existingNotifications, notification];
      localStorage.setItem('challengeNotifications', JSON.stringify(updatedNotifications));

      await loadChallengeData();
      return true;
    } catch (error) {
      console.error('Error sending challenge:', error);
      return false;
    }
  };

  const acceptChallenge = async (challengeId: string): Promise<boolean> => {
    try {
      const existingChallenges = JSON.parse(localStorage.getItem('userChallenges') || '[]');
      const updatedChallenges = existingChallenges.map((challenge: Challenge) => {
        if (challenge.id === challengeId) {
          return {
            ...challenge,
            status: 'accepted',
            acceptedAt: new Date().toISOString()
          };
        }
        return challenge;
      });

      localStorage.setItem('userChallenges', JSON.stringify(updatedChallenges));
      await loadChallengeData();
      return true;
    } catch (error) {
      console.error('Error accepting challenge:', error);
      return false;
    }
  };

  const declineChallenge = async (challengeId: string): Promise<boolean> => {
    try {
      const existingChallenges = JSON.parse(localStorage.getItem('userChallenges') || '[]');
      const updatedChallenges = existingChallenges.map((challenge: Challenge) => {
        if (challenge.id === challengeId) {
          return {
            ...challenge,
            status: 'declined'
          };
        }
        return challenge;
      });

      localStorage.setItem('userChallenges', JSON.stringify(updatedChallenges));
      await loadChallengeData();
      return true;
    } catch (error) {
      console.error('Error declining challenge:', error);
      return false;
    }
  };

  const submitChallengeResult = async (challengeId: string, result: ChallengeResult): Promise<boolean> => {
    try {
      const existingChallenges = JSON.parse(localStorage.getItem('userChallenges') || '[]');
      const challenge = existingChallenges.find((c: Challenge) => c.id === challengeId);
      
      if (!challenge) return false;

      // Update challenge with result
      const updatedChallenges = existingChallenges.map((c: Challenge) => {
        if (c.id === challengeId) {
          const updatedChallenge = { ...c };
          
          if (result.userId === c.challengerId) {
            updatedChallenge.challengerScore = result.score;
          } else {
            updatedChallenge.challengedScore = result.score;
          }

          // Check if both players have completed
          if (updatedChallenge.challengerScore !== undefined && updatedChallenge.challengedScore !== undefined) {
            updatedChallenge.status = 'completed';
            updatedChallenge.completedAt = new Date().toISOString();
            
            // Determine winner
            if (updatedChallenge.challengerScore > updatedChallenge.challengedScore) {
              updatedChallenge.winnerId = c.challengerId;
            } else if (updatedChallenge.challengedScore > updatedChallenge.challengerScore) {
              updatedChallenge.winnerId = c.challengedId;
            }
            // If scores are equal, it's a tie (winnerId remains undefined)
          } else {
            updatedChallenge.status = 'in_progress';
          }

          return updatedChallenge;
        }
        return c;
      });

      localStorage.setItem('userChallenges', JSON.stringify(updatedChallenges));
      await loadChallengeData();
      return true;
    } catch (error) {
      console.error('Error submitting challenge result:', error);
      return false;
    }
  };

  const markNotificationRead = (notificationId: string) => {
    const updatedNotifications = notifications.map(notification => 
      notification.id === notificationId 
        ? { ...notification, read: true }
        : notification
    );
    setNotifications(updatedNotifications);
    localStorage.setItem('challengeNotifications', JSON.stringify(updatedNotifications));
  };

  const markAllNotificationsRead = () => {
    const updatedNotifications = notifications.map(notification => ({ ...notification, read: true }));
    setNotifications(updatedNotifications);
    localStorage.setItem('challengeNotifications', JSON.stringify(updatedNotifications));
  };

  const unreadNotifications = notifications.filter(n => !n.read).length;

  const value: LeaderboardContextType = {
    // Leaderboard data
    leaderboard,
    userRank,
    isLoadingLeaderboard,
    
    // Challenge data
    activeChallenges,
    pendingChallenges,
    completedChallenges,
    notifications,
    unreadNotifications,
    
    // Actions
    refreshLeaderboard,
    sendChallenge,
    acceptChallenge,
    declineChallenge,
    submitChallengeResult,
    markNotificationRead,
    markAllNotificationsRead,
    
    // Current challenge state
    currentChallenge,
    setCurrentChallenge
  };

  return (
    <LeaderboardContext.Provider value={value}>
      {children}
    </LeaderboardContext.Provider>
  );
};
