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
    if (requestedSize <= 64) return `${basePath}logos/logo_64.svg`;
    if (requestedSize <= 128) return `${basePath}logos/logo_128.svg`;
    if (requestedSize <= 192) return `${basePath}logos/logo_192.svg`;
    return `${basePath}logos/logo_512.svg`;
  };

  const logoSrc = getLogoSrc(size);

  const handleImageLoad = () => {
    setImageLoaded(true);
    setImageError(false);
  };

  const handleImageError = () => {
    setImageError(true);
  };

  // Fallback SVG if image fails to load
  const FallbackLogo = () => (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <circle cx="32" cy="32" r="30" fill="#FFD700" stroke="#B8860B" strokeWidth="2"/>
      <path d="M16 32 Q32 24 48 32 Q32 40 16 32 Z" fill="#8B4513" stroke="#654321" strokeWidth="1"/>
      <ellipse cx="32" cy="32" rx="12" ry="6" fill="#FFFFFF"/>
      <circle cx="32" cy="32" r="4" fill="#000000"/>
      <circle cx="33" cy="30" r="1.5" fill="#FFFFFF"/>
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
