import React from 'react';

// Simple fallback component to test if React is working
const FallbackApp: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center p-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Ancient History Trivia
        </h1>
        <p className="text-xl text-gray-600 mb-6">
          Test your knowledge of ancient civilizations
        </p>
        <div className="bg-blue-600 text-white px-6 py-3 rounded-lg inline-block">
          App is loading...
        </div>
        <div className="mt-4 text-sm text-gray-500">
          Environment: {window.location.hostname}
        </div>
      </div>
    </div>
  );
};

export default FallbackApp;
