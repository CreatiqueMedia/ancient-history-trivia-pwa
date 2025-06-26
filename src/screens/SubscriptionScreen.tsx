// This screen is deprecated and intentionally left blank. All subscription management is handled in the Store screen and user profile.
const SubscriptionScreen: React.FC = () => (
  <div className="flex items-center justify-center min-h-[60vh]">
    <div className="text-center">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">Subscription Management</h1>
      <p className="text-lg text-gray-600 dark:text-gray-400 mb-6">
        Subscription management is now handled in the <b>Store</b> and <b>User Profile</b> screens.
      </p>
      <p className="text-gray-500 dark:text-gray-500">This page is no longer in use.</p>
    </div>
  </div>
);

export default SubscriptionScreen;
