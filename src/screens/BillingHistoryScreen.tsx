import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  CreditCardIcon,
  CalendarDaysIcon,
  CurrencyDollarIcon,
  DocumentTextIcon,
  ArrowLeftIcon,
  CheckCircleIcon,
  XCircleIcon,
  ClockIcon,
  ShoppingBagIcon,
  StarIcon,
  ChartBarIcon
} from '@heroicons/react/24/outline';
import { useAuth } from '../context/AuthContext';
import { usePurchase } from '../context/PurchaseContext';
import AuthModal from '../components/AuthModal';

interface PaymentRecord {
  id: string;
  date: Date;
  type: 'subscription' | 'bundle';
  description: string;
  amount: number;
  status: 'completed' | 'pending' | 'failed';
  method: string;
  bundleId?: string;
  subscriptionPeriod?: string;
}

interface BillingStats {
  totalSpent: number;
  totalPurchases: number;
  bundlesPurchased: number;
  subscriptionMonths: number;
  averageMonthlySpend: number;
  lastPayment?: Date;
}

const BillingHistoryScreen: React.FC = () => {
  const navigate = useNavigate();
  const { user, userProfile } = useAuth();
  const { subscriptionTier, subscriptionPeriod, subscriptionExpiry } = usePurchase();
  
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [paymentHistory, setPaymentHistory] = useState<PaymentRecord[]>([]);
  const [billingStats, setBillingStats] = useState<BillingStats>({
    totalSpent: 0,
    totalPurchases: 0,
    bundlesPurchased: 0,
    subscriptionMonths: 0,
    averageMonthlySpend: 0
  });
  const [loading, setLoading] = useState(true);

  // Check authentication
  useEffect(() => {
    if (!user) {
      setShowAuthModal(true);
      return;
    }
    
    // Load payment history for authenticated user
    loadPaymentHistory();
  }, [user]);

  const loadPaymentHistory = async () => {
    if (!user) return;
    
    try {
      setLoading(true);
      
      // In a real app, this would fetch from your backend/Stripe
      // For now, we'll simulate with localStorage data
      const mockPaymentHistory = generateMockPaymentHistory();
      setPaymentHistory(mockPaymentHistory);
      
      // Calculate billing stats
      const stats = calculateBillingStats(mockPaymentHistory);
      setBillingStats(stats);
      
    } catch (error) {
      console.error('Error loading payment history:', error);
    } finally {
      setLoading(false);
    }
  };

  const generateMockPaymentHistory = (): PaymentRecord[] => {
    // This would be replaced with actual Stripe/backend data
    const mockData: PaymentRecord[] = [
      {
        id: 'pay_1',
        date: new Date('2025-01-15'),
        type: 'subscription',
        description: 'Pro Monthly Subscription',
        amount: 9.99,
        status: 'completed',
        method: 'Visa ****4242',
        subscriptionPeriod: 'monthly'
      },
      {
        id: 'pay_2',
        date: new Date('2024-12-20'),
        type: 'bundle',
        description: 'Ancient Egypt Bundle',
        amount: 2.99,
        status: 'completed',
        method: 'Visa ****4242',
        bundleId: 'egypt'
      },
      {
        id: 'pay_3',
        date: new Date('2024-12-15'),
        type: 'subscription',
        description: 'Pro Monthly Subscription',
        amount: 9.99,
        status: 'completed',
        method: 'Visa ****4242',
        subscriptionPeriod: 'monthly'
      },
      {
        id: 'pay_4',
        date: new Date('2024-11-28'),
        type: 'bundle',
        description: 'Roman Empire Bundle',
        amount: 2.99,
        status: 'completed',
        method: 'Visa ****4242',
        bundleId: 'rome'
      },
      {
        id: 'pay_5',
        date: new Date('2024-11-15'),
        type: 'subscription',
        description: 'Pro Monthly Subscription',
        amount: 9.99,
        status: 'completed',
        method: 'Visa ****4242',
        subscriptionPeriod: 'monthly'
      }
    ];

    return mockData.sort((a, b) => b.date.getTime() - a.date.getTime());
  };

  const calculateBillingStats = (history: PaymentRecord[]): BillingStats => {
    const completedPayments = history.filter(p => p.status === 'completed');
    
    const totalSpent = completedPayments.reduce((sum, payment) => sum + payment.amount, 0);
    const bundlesPurchased = completedPayments.filter(p => p.type === 'bundle').length;
    const subscriptionPayments = completedPayments.filter(p => p.type === 'subscription');
    const subscriptionMonths = subscriptionPayments.length;
    
    const lastPayment = completedPayments.length > 0 ? completedPayments[0].date : undefined;
    
    // Calculate average monthly spend over the last 6 months
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
    const recentPayments = completedPayments.filter(p => p.date >= sixMonthsAgo);
    const recentSpend = recentPayments.reduce((sum, payment) => sum + payment.amount, 0);
    const averageMonthlySpend = recentSpend / 6;

    return {
      totalSpent,
      totalPurchases: completedPayments.length,
      bundlesPurchased,
      subscriptionMonths,
      averageMonthlySpend,
      lastPayment
    };
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircleIcon className="w-5 h-5 text-green-500" />;
      case 'pending':
        return <ClockIcon className="w-5 h-5 text-yellow-500" />;
      case 'failed':
        return <XCircleIcon className="w-5 h-5 text-red-500" />;
      default:
        return <ClockIcon className="w-5 h-5 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'text-green-600 bg-green-50 dark:text-green-400 dark:bg-green-900/20';
      case 'pending':
        return 'text-yellow-600 bg-yellow-50 dark:text-yellow-400 dark:bg-yellow-900/20';
      case 'failed':
        return 'text-red-600 bg-red-50 dark:text-red-400 dark:bg-red-900/20';
      default:
        return 'text-gray-600 bg-gray-50 dark:text-gray-400 dark:bg-gray-900/20';
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    }).format(date);
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <CreditCardIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            Sign In Required
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            Please sign in to view your billing history and payment details.
          </p>
          <button
            onClick={() => setShowAuthModal(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
          >
            Sign In
          </button>
        </div>
        
        <AuthModal 
          isOpen={showAuthModal} 
          onClose={() => setShowAuthModal(false)} 
          initialMode="login"
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 shadow-sm">
        <div className="max-w-6xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => navigate(-1)}
                className="p-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                <ArrowLeftIcon className="w-6 h-6" />
              </button>
              <div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
                  <CreditCardIcon className="w-8 h-8 text-blue-600" />
                  Billing History
                </h1>
                <p className="text-gray-600 dark:text-gray-400 mt-1">
                  View your payment history and subscription details
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8">
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        ) : (
          <>
            {/* Billing Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Spent</p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">
                      {formatCurrency(billingStats.totalSpent)}
                    </p>
                  </div>
                  <CurrencyDollarIcon className="w-8 h-8 text-green-600" />
                </div>
              </div>

              <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Purchases</p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">
                      {billingStats.totalPurchases}
                    </p>
                  </div>
                  <ShoppingBagIcon className="w-8 h-8 text-blue-600" />
                </div>
              </div>

              <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Bundles Owned</p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">
                      {billingStats.bundlesPurchased}
                    </p>
                  </div>
                  <StarIcon className="w-8 h-8 text-purple-600" />
                </div>
              </div>

              <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Avg Monthly</p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">
                      {formatCurrency(billingStats.averageMonthlySpend)}
                    </p>
                  </div>
                  <ChartBarIcon className="w-8 h-8 text-orange-600" />
                </div>
              </div>
            </div>

            {/* Current Subscription Status */}
            {subscriptionTier && subscriptionTier !== 'free' && (
              <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-lg p-6 mb-8 border border-blue-200 dark:border-blue-800">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="bg-blue-100 dark:bg-blue-900/30 rounded-full p-3">
                      <StarIcon className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                        Active Subscription
                      </h3>
                      <p className="text-gray-600 dark:text-gray-400">
                        Pro {subscriptionPeriod === 'monthly' ? 'Monthly' : 'Annual'} Plan
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {subscriptionExpiry && `Expires ${formatDate(new Date(subscriptionExpiry))}`}
                    </p>
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">
                      Active
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* Payment History */}
            <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
              <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                  <DocumentTextIcon className="w-6 h-6" />
                  Payment History
                </h2>
              </div>

              {paymentHistory.length === 0 ? (
                <div className="text-center py-12">
                  <CreditCardIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                    No Payment History
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    You haven't made any purchases yet.
                  </p>
                </div>
              ) : (
                <div className="divide-y divide-gray-200 dark:divide-gray-700">
                  {paymentHistory.map((payment) => (
                    <div key={payment.id} className="px-6 py-4 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <div className="flex-shrink-0">
                            {getStatusIcon(payment.status)}
                          </div>
                          <div>
                            <h3 className="text-sm font-medium text-gray-900 dark:text-white">
                              {payment.description}
                            </h3>
                            <div className="flex items-center space-x-4 mt-1">
                              <p className="text-sm text-gray-600 dark:text-gray-400">
                                {formatDate(payment.date)}
                              </p>
                              <p className="text-sm text-gray-600 dark:text-gray-400">
                                {payment.method}
                              </p>
                              <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(payment.status)}`}>
                                {payment.status.charAt(0).toUpperCase() + payment.status.slice(1)}
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-lg font-semibold text-gray-900 dark:text-white">
                            {formatCurrency(payment.amount)}
                          </p>
                          <p className="text-sm text-gray-600 dark:text-gray-400 capitalize">
                            {payment.type}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Help Section */}
            <div className="mt-8 bg-gray-100 dark:bg-gray-800 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Need Help?
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h4 className="font-medium text-gray-900 dark:text-white mb-2">
                    Billing Questions
                  </h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    If you have questions about your billing or need to update your payment method, contact our support team.
                  </p>
                </div>
                <div>
                  <h4 className="font-medium text-gray-900 dark:text-white mb-2">
                    Refund Policy
                  </h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    We offer refunds within 30 days of purchase. Contact support for assistance with refund requests.
                  </p>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default BillingHistoryScreen;
