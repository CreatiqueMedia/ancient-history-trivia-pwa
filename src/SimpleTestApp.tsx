import React from 'react';

const SimpleTestApp: React.FC = () => {
  console.log('🎯 SimpleTestApp rendering...');
  
  // Clear the initial loading state when React mounts
  React.useEffect(() => {
    console.log('🧹 Clearing initial loading state...');
    const root = document.getElementById('root');
    if (root) {
      // Clear all children except our React app
      const children = Array.from(root.children);
      children.forEach(child => {
        if (child.className === 'loading-spinner') {
          console.log('🗑️ Removing loading spinner');
          child.remove();
        }
      });
    }
  }, []);
  
  return (
    <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4">
          ✅ React is Working! (Updated)
        </h1>
        <p className="text-xl text-gray-300">
          Ancient History Trivia PWA
        </p>
        <div className="mt-4 text-sm text-gray-500">
          If you see this, React is rendering properly
        </div>
      </div>
    </div>
  );
};

export default SimpleTestApp;
