import React, { useState } from 'react';

interface LogoProps {
  className?: string;
  size?: number;
  animated?: boolean;
}

export const Logo: React.FC<LogoProps> = ({ 
  className = '', 
  size = 64, 
  animated = false 
}) => {
  const [imageLoaded, setImageLoaded] = useState(false);

  // Always use logo_192.svg as requested
  const basePath = import.meta.env.BASE_URL;
  const normalizedBasePath = basePath.endsWith('/') ? basePath : `${basePath}/`;
  const logoSrc = `${normalizedBasePath}logos/logo_192.svg`;

  const handleImageLoad = () => {
    setImageLoaded(true);
  };

  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    console.error('❌ Logo failed to load from:', logoSrc);
    console.error('Error details:', e);
  };

  return (
    <div className="relative" style={{ width: size, height: size }}>
      {!imageLoaded && (
        <div 
          className="absolute inset-0 bg-gray-200 dark:bg-gray-700 animate-pulse rounded-full"
          style={{ width: size, height: size }}
        />
      )}
      <img
        src={logoSrc}
        alt="Ancient History Trivia - Eye of Ra Logo"
        width={size}
        height={size}
        className={`${className} ${animated ? 'animate-pulse' : ''} ${!imageLoaded ? 'opacity-0' : 'opacity-100'} transition-opacity duration-300`}
        style={{ 
          width: size, 
          height: size,
          objectFit: 'contain'
        }}
        onLoad={handleImageLoad}
        onError={handleImageError}
      />
    </div>
  );
};

export default Logo;
