import React, { useEffect, useState } from 'react';
import { FirestoreQuestionService } from '../services/FirestoreQuestionService';

/**
 * Component that automatically initializes Firestore with questions
 * when running in development mode (localhost)
 */
const FirestoreInitializer: React.FC = () => {
  const [isInitializing, setIsInitializing] = useState(false);
  const [initializationStatus, setInitializationStatus] = useState<string>('');
  const [showStatus, setShowStatus] = useState(false);

  useEffect(() => {
    const initializeFirestore = async () => {
      // Only run in development mode
      if (window.location.hostname !== 'localhost') {
        return;
      }

      // Check if we've already initialized (to avoid re-running)
      const hasInitialized = localStorage.getItem('firestore_questions_initialized');
      if (hasInitialized) {
        console.log('🔥 Firestore questions already initialized');
        return;
      }

      console.log('🚀 Starting Firestore question initialization...');
      setIsInitializing(true);
      // Don't show status UI to avoid distracting users
      setShowStatus(false);
      setInitializationStatus('Checking Firestore...');

      try {
        // Test Firestore connection first
        setInitializationStatus('Testing Firestore connection...');
        console.log('🔍 Testing Firestore connection...');
        
        // Simple connection test
        const stats = await FirestoreQuestionService.getBundleStatistics();
        console.log('✅ Firestore connection successful');
        
        const bundleCount = Object.keys(stats).length;
        
        if (bundleCount > 0) {
          console.log(`✅ Found ${bundleCount} bundles already in Firestore`);
          setInitializationStatus(`Found ${bundleCount} question bundles in Firestore`);
          localStorage.setItem('firestore_questions_initialized', 'true');
          
          setTimeout(() => {
            setShowStatus(false);
          }, 3000);
          return;
        }

        // Initialize Firestore with questions
        setInitializationStatus('Generating and storing questions...');
        console.log('🔥 Initializing Firestore with questions...');
        await FirestoreQuestionService.initializeFirestoreQuestions();
        
        // Mark as initialized
        localStorage.setItem('firestore_questions_initialized', 'true');
        setInitializationStatus('✅ Firestore initialized successfully!');
        
        console.log('🎉 Firestore question initialization complete!');
        
        // Hide status after 5 seconds
        setTimeout(() => {
          setShowStatus(false);
        }, 5000);
        
      } catch (error) {
        console.log('⚠️ Firestore not available in development mode:', error);
        setInitializationStatus('⚠️ Firestore unavailable - using local storage');
        
        // Mark as "initialized" to prevent retries
        localStorage.setItem('firestore_questions_initialized', 'true');
        
        // Hide status after 3 seconds
        setTimeout(() => {
          setShowStatus(false);
        }, 3000);
      } finally {
        setIsInitializing(false);
      }
    };

    // Run initialization after a short delay to let the app load
    const timer = setTimeout(initializeFirestore, 2000);
    
    return () => clearTimeout(timer);
  }, []);

  // Don't render anything in production
  if (window.location.hostname !== 'localhost') {
    return null;
  }

  // Only show status when initializing or when there's a message
  if (!showStatus) {
    return null;
  }

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <div className="bg-gray-800 text-gray-300 px-3 py-2 rounded-md shadow-md text-xs max-w-xs opacity-80">
        <div className="flex items-center space-x-2">
          {isInitializing && (
            <div className="animate-spin rounded-full h-3 w-3 border-b border-gray-300"></div>
          )}
          <div className="text-xs">{initializationStatus}</div>
        </div>
      </div>
    </div>
  );
};

export default FirestoreInitializer;
