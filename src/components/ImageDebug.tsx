import React, { useState, useEffect } from 'react';

const ImageDebug: React.FC = () => {
  const [imageTests, setImageTests] = useState<Array<{
    path: string;
    loaded: boolean;
    error: boolean;
    testComplete: boolean;
  }>>([]);

  useEffect(() => {
    const basePath = import.meta.env.BASE_URL;
    const imagePaths = [
      `${basePath}logos/logo_64.svg`,
      `${basePath}logos/logo_128.svg`,
      `${basePath}logos/logo_192.svg`,
      `${basePath}logos/logo_512.svg`
    ];

    const tests = imagePaths.map(path => ({
      path,
      loaded: false,
      error: false,
      testComplete: false
    }));

    setImageTests(tests);

    // Test each image
    imagePaths.forEach((path, index) => {
      const img = new Image();
      
      img.onload = () => {
        setImageTests(prev => prev.map((test, i) => 
          i === index ? { ...test, loaded: true, testComplete: true } : test
        ));
      };
      
      img.onerror = () => {
        setImageTests(prev => prev.map((test, i) => 
          i === index ? { ...test, error: true, testComplete: true } : test
        ));
      };
      
      img.src = path;
    });
  }, []);

  return (
    <div className="p-4 bg-gray-100 dark:bg-gray-800 rounded-lg mb-4">
      <h3 className="text-lg font-semibold mb-2">Image Loading Debug</h3>
      <p className="mb-2">Base URL: {import.meta.env.BASE_URL}</p>
      <div className="space-y-2">
        {imageTests.map((test, index) => (
          <div key={test.path} className="flex items-center space-x-2 text-sm">
            <span className={`w-3 h-3 rounded-full ${
              !test.testComplete ? 'bg-yellow-400' :
              test.loaded ? 'bg-green-400' : 
              test.error ? 'bg-red-400' : 'bg-gray-400'
            }`}></span>
            <span className="font-mono">{test.path}</span>
            <span className="text-gray-600">
              {!test.testComplete ? 'Testing...' :
               test.loaded ? 'Loaded' :
               test.error ? 'Failed' : 'Unknown'}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ImageDebug;
