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
      setShowStatus(true);
      setInitializationStatus('Checking Firestore...');

      try {
        // Check if questions already exist in Firestore
        const stats = await FirestoreQuestionService.getBundleStatistics();
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
        console.error('❌ Failed to initialize Firestore:', error);
        setInitializationStatus('❌ Failed to initialize Firestore');
        
        // Hide status after 5 seconds
        setTimeout(() => {
          setShowStatus(false);
        }, 5000);
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
      <div className="bg-blue-600 text-white px-4 py-3 rounded-lg shadow-lg max-w-sm">
        <div className="flex items-center space-x-3">
          {isInitializing && (
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
          )}
          <div>
            <div className="text-sm">{initializationStatus}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FirestoreInitializer;
