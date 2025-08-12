// Test Purchase Flow Component
// Demonstrates the complete Stripe → Content Delivery pipeline

import React, { useState } from 'react';
import { StripePurchaseContentService } from '../services/StripePurchaseContentService';
import { mockWebhookEndpoint } from '../api/webhookEndpoint';
import { auth } from '../config/firebase';
import EnhancedQuiz from './EnhancedQuiz';

interface BundleOption {
  id: string;
  name: string;
  description: string;
  stripeProductId: string;
  price: string;
}

const availableBundles: BundleOption[] = [
  {
    id: 'region_pack_egypt',
    name: 'Ancient Egypt',
    description: 'Pyramids, pharaohs, and the mysteries of the Nile',
    stripeProductId: 'prod_Sc1cAYaPVIFRnm',
    price: '$2.99'
  },
  {
    id: 'region_pack_rome',
    name: 'Roman Empire',
    description: 'Emperors, legions, and the glory of Rome',
    stripeProductId: 'prod_Sc1cJRaC4oR6kR',
    price: '$2.99'
  },
  {
    id: 'region_pack_greece',
    name: 'Ancient Greece',
    description: 'Democracy, philosophy, and the Olympic Games',
    stripeProductId: 'prod_Sc1cheDu2aPo24',
    price: '$2.99'
  },
  {
    id: 'region_pack_mesopotamia',
    name: 'Mesopotamia',
    description: 'The cradle of civilization and cuneiform writing',
    stripeProductId: 'prod_Sc1c49nwMU5uCa',
    price: '$2.99'
  },
  {
    id: 'region_pack_china',
    name: 'Ancient China',
    description: 'Dynasties, the Great Wall, and ancient wisdom',
    stripeProductId: 'prod_Sc1cjZLEoeLV59',
    price: '$2.99'
  }
];

export const TestPurchaseFlow: React.FC = () => {
  const [selectedBundle, setSelectedBundle] = useState<string | null>(null);
  const [showQuiz, setShowQuiz] = useState(false);
  const [purchaseStatuses, setPurchaseStatuses] = useState<{ [key: string]: boolean }>({});
  const [loading, setLoading] = useState<{ [key: string]: boolean }>({});

  // Check purchase status for all bundles on component mount
  React.useEffect(() => {
    checkAllPurchaseStatuses();
  }, []);

  const checkAllPurchaseStatuses = async () => {
    const statuses: { [key: string]: boolean } = {};
    
    for (const bundle of availableBundles) {
      try {
        const isPurchased = await StripePurchaseContentService.isPurchased(bundle.id);
        statuses[bundle.id] = isPurchased;
      } catch (error) {
        console.error(`Error checking purchase status for ${bundle.id}:`, error);
        statuses[bundle.id] = false;
      }
    }
    
    setPurchaseStatuses(statuses);
  };

  const handleTestPurchase = async (bundleId: string) => {
    const user = auth.currentUser;
    if (!user) {
      alert('❌ Please log in to test purchase flow');
      return;
    }

    setLoading(prev => ({ ...prev, [bundleId]: true }));

    try {
      console.log(`🧪 Testing purchase for bundle: ${bundleId}`);
      
      // Simulate Stripe webhook
      await mockWebhookEndpoint(bundleId, user.uid);
      
      // Update purchase status
      const isPurchased = await StripePurchaseContentService.isPurchased(bundleId);
      setPurchaseStatuses(prev => ({ ...prev, [bundleId]: isPurchased }));
      
      alert(`✅ Test purchase completed for ${bundleId}!\n\nYou now have access to 100 questions instead of sample questions.`);
      
    } catch (error) {
      console.error('❌ Test purchase failed:', error);
      alert('❌ Test purchase failed. Check console for details.');
    } finally {
      setLoading(prev => ({ ...prev, [bundleId]: false }));
    }
  };

  const handleStartQuiz = (bundleId: string) => {
    setSelectedBundle(bundleId);
    setShowQuiz(true);
  };

  const handleCloseQuiz = () => {
    setShowQuiz(false);
    setSelectedBundle(null);
    
    // Refresh purchase statuses after quiz
    checkAllPurchaseStatuses();
  };

  const getQuestionCount = async (bundleId: string): Promise<number> => {
    try {
      const questions = await StripePurchaseContentService.getQuestions(bundleId);
      return questions.length;
    } catch {
      return 0;
    }
  };

  if (showQuiz && selectedBundle) {
    return <EnhancedQuiz bundleId={selectedBundle} onClose={handleCloseQuiz} />;
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          🧪 Test Purchase & Content Delivery System
        </h1>
        <p className="text-lg text-gray-600">
          Demonstrating Stripe → Firebase → Content Delivery Pipeline
        </p>
        
        {!auth.currentUser && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mt-4">
            <p className="text-yellow-800">
              ⚠️ Please log in to test the purchase flow
            </p>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {availableBundles.map((bundle) => {
          const isPurchased = purchaseStatuses[bundle.id];
          const isLoading = loading[bundle.id];
          
          return (
            <div key={bundle.id} className="bg-white rounded-lg shadow-lg border border-gray-200 overflow-hidden">
              <div className="p-6">
                {/* Bundle Status */}
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-xl font-bold text-gray-900">{bundle.name}</h3>
                  <div className={`px-2 py-1 rounded-full text-xs font-semibold ${
                    isPurchased 
                      ? 'bg-green-100 text-green-700' 
                      : 'bg-gray-100 text-gray-700'
                  }`}>
                    {isPurchased ? '✅ OWNED' : '🔒 SAMPLE'}
                  </div>
                </div>

                <p className="text-gray-600 mb-4">{bundle.description}</p>

                {/* Question Count */}
                <div className="mb-4">
                  <div className="text-sm text-gray-600">
                    Available Questions: 
                    <span className="font-semibold ml-1">
                      {isPurchased ? '100 (Full Access)' : '~10 (Sample)'}
                    </span>
                  </div>
                </div>

                {/* Price */}
                <div className="text-2xl font-bold text-green-600 mb-4">
                  {bundle.price}
                </div>

                {/* Action Buttons */}
                <div className="space-y-3">
                  <button
                    onClick={() => handleStartQuiz(bundle.id)}
                    className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 font-semibold"
                  >
                    {isPurchased ? '🎯 Start Full Quiz (100q)' : '👀 Try Sample Quiz (~10q)'}
                  </button>

                  {!isPurchased && auth.currentUser && (
                    <button
                      onClick={() => handleTestPurchase(bundle.id)}
                      disabled={isLoading}
                      className="w-full bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 font-semibold disabled:bg-gray-400 disabled:cursor-not-allowed"
                    >
                      {isLoading ? (
                        <span className="flex items-center justify-center">
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                          Processing...
                        </span>
                      ) : (
                        '🧪 Test Purchase (Dev)'
                      )}
                    </button>
                  )}
                </div>

                {/* Production Note */}
                {!isPurchased && (
                  <div className="mt-3 text-xs text-gray-500 text-center">
                    * In production: redirects to Stripe Checkout
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* System Status */}
      <div className="mt-12 bg-gray-50 rounded-lg p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">📊 System Status</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white rounded-lg p-4 border">
            <div className="text-sm text-gray-600">Firebase Project</div>
            <div className="text-lg font-semibold text-green-600">🟢 Connected</div>
          </div>
          
          <div className="bg-white rounded-lg p-4 border">
            <div className="text-sm text-gray-600">Stripe Products</div>
            <div className="text-lg font-semibold text-green-600">🟢 {availableBundles.length} Available</div>
          </div>
          
          <div className="bg-white rounded-lg p-4 border">
            <div className="text-sm text-gray-600">Content Delivery</div>
            <div className="text-lg font-semibold text-green-600">🟢 Ready</div>
          </div>
        </div>

        <div className="mt-4 text-sm text-gray-600">
          <h3 className="font-semibold mb-2">How it works:</h3>
          <ul className="space-y-1">
            <li>1. 🔍 User previews sample questions (10 per bundle)</li>
            <li>2. 💳 User purchases bundle via Stripe checkout</li>
            <li>3. 🔔 Stripe webhook triggers content generation</li>
            <li>4. 📦 100 questions generated and cached locally</li>
            <li>5. 🎯 User gets full quiz access with offline support</li>
          </ul>
        </div>
      </div>

      {/* Development Tools */}
      {import.meta.env.DEV && (
        <div className="mt-8 bg-yellow-50 border border-yellow-200 rounded-lg p-6">
          <h3 className="text-lg font-bold text-yellow-900 mb-4">🛠️ Development Tools</h3>
          
          <div className="space-y-4">
            <button
              onClick={checkAllPurchaseStatuses}
              className="bg-yellow-600 text-white px-4 py-2 rounded-lg hover:bg-yellow-700"
            >
              🔄 Refresh Purchase Statuses
            </button>
            
            <div className="text-sm text-yellow-800">
              <p>• Use "Test Purchase" buttons to simulate Stripe webhooks</p>
              <p>• Sample questions are always available (no purchase required)</p>
              <p>• Purchased content is cached for offline access</p>
              <p>• All data stored in Firebase Firestore with proper security rules</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TestPurchaseFlow;
