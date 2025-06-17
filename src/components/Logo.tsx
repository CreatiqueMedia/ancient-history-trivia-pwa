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
  const [imageError, setImageError] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

  // Use Vite's base URL to ensure proper paths in both dev and production
  const getLogoSrc = (requestedSize: number): string => {
    const basePath = import.meta.env.BASE_URL;
    // Ensure base path ends with / and logo path doesn't start with /
    const normalizedBasePath = basePath.endsWith('/') ? basePath : `${basePath}/`;
    
    if (requestedSize <= 64) return `${normalizedBasePath}logos/logo_64.svg`;
    if (requestedSize <= 128) return `${normalizedBasePath}logos/logo_128.svg`;
    return `${normalizedBasePath}logos/logo_192.png`;
  };

  const logoSrc = getLogoSrc(size);

  const handleImageLoad = () => {
    setImageLoaded(true);
    setImageError(false);
  };

  const handleImageError = () => {
    setImageError(true);
  };

  // Clean, simple fallback SVG if image fails to load
  const FallbackLogo = () => (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* Simple, clean eye design matching your brand */}
      <circle cx="32" cy="32" r="28" fill="currentColor" fillOpacity="0.1" stroke="currentColor" strokeWidth="2"/>
      <path d="M12 32 Q32 20 52 32 Q32 44 12 32 Z" fill="currentColor" fillOpacity="0.2"/>
      <ellipse cx="32" cy="32" rx="8" ry="4" fill="currentColor" fillOpacity="0.8"/>
      <circle cx="32" cy="32" r="2" fill="currentColor"/>
    </svg>
  );

  if (imageError) {
    return <FallbackLogo />;
  }

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
