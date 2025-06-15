import React from 'react';

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
  // Get the base path for assets (GitHub Pages needs the repo path in production)
  const basePath = import.meta.env.MODE === 'production' ? '/ancient-history-trivia-pwa' : '';
  
  // Choose the appropriate logo based on requested size
  const getLogoSrc = (requestedSize: number): string => {
    if (requestedSize <= 64) return `${basePath}/logos/logo_64.svg`;
    if (requestedSize <= 128) return `${basePath}/logos/logo_128.svg`;
    if (requestedSize <= 192) return `${basePath}/logos/logo_192.svg`;
    return `${basePath}/logos/logo_512.svg`;
  };

  const logoSrc = getLogoSrc(size);

  return (
    <img
      src={logoSrc}
      alt="Ancient History Trivia - Eye of Ra Logo"
      width={size}
      height={size}
      className={`${className} ${animated ? 'animate-pulse' : ''}`}
      style={{ 
        width: size, 
        height: size,
        objectFit: 'contain'
      }}
    />
  );
};

export default Logo;
