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
  // Choose the appropriate logo based on requested size
  const getLogoSrc = (requestedSize: number): string => {
    if (requestedSize <= 64) return '/src/assets/logos/logo-64.svg';
    if (requestedSize <= 128) return '/src/assets/logos/logo-128.svg';
    if (requestedSize <= 192) return '/src/assets/logos/logo-192.svg';
    return '/src/assets/logos/logo-512.svg';
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
