import React, { useState, useCallback, useRef, useEffect } from 'react';

interface OptimizedImageProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  className?: string;
  loading?: 'lazy' | 'eager';
  priority?: boolean;
  placeholder?: string;
  onLoad?: () => void;
  onError?: () => void;
  sizes?: string;
  quality?: number;
}

const OptimizedImage: React.FC<OptimizedImageProps> = ({
  src,
  alt,
  width,
  height,
  className = '',
  loading = 'lazy',
  priority = false,
  placeholder,
  onLoad,
  onError,
  sizes,
  quality = 75
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [isInView, setIsInView] = useState(priority);
  const imgRef = useRef<HTMLImageElement>(null);

  // Intersection Observer for lazy loading
  useEffect(() => {
    if (priority || loading === 'eager') {
      setIsInView(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          observer.disconnect();
        }
      },
      {
        rootMargin: '50px', // Start loading 50px before entering viewport
        threshold: 0.1
      }
    );

    if (imgRef.current) {
      observer.observe(imgRef.current);
    }

    return () => observer.disconnect();
  }, [priority, loading]);

  const handleLoad = useCallback(() => {
    setIsLoaded(true);
    onLoad?.();
  }, [onLoad]);

  const handleError = useCallback(() => {
    setHasError(true);
    onError?.();
  }, [onError]);

  // Generate optimized image URLs for different formats
  const generateSrcSet = (baseSrc: string) => {
    if (!baseSrc) return '';
    
    const formats = ['webp', 'avif'];
    const densities = [1, 2];
    
    return densities
      .map(density => {
        const scaledWidth = width ? width * density : undefined;
        return `${baseSrc}${scaledWidth ? `?w=${scaledWidth}&q=${quality}` : ''} ${density}x`;
      })
      .join(', ');
  };

  // Placeholder while loading
  const PlaceholderDiv = () => (
    <div
      className={`bg-gray-200 animate-pulse flex items-center justify-center ${className}`}
      style={{ width, height }}
      role="img"
      aria-label={`Loading ${alt}`}
    >
      {placeholder ? (
        <span className="text-gray-400 text-sm">{placeholder}</span>
      ) : (
        <svg
          className="w-8 h-8 text-gray-400"
          fill="currentColor"
          viewBox="0 0 20 20"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            fillRule="evenodd"
            d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z"
            clipRule="evenodd"
          />
        </svg>
      )}
    </div>
  );

  // Error state
  if (hasError) {
    return (
      <div
        className={`bg-gray-100 border-2 border-dashed border-gray-300 flex items-center justify-center ${className}`}
        style={{ width, height }}
        role="img"
        aria-label={`Failed to load ${alt}`}
      >
        <span className="text-gray-500 text-sm">Image failed to load</span>
      </div>
    );
  }

  return (
    <div ref={imgRef} className={`relative overflow-hidden ${className}`}>
      {!isLoaded && <PlaceholderDiv />}
      
      {isInView && (
        <picture>
          {/* Modern formats with fallback */}
          <source
            type="image/avif"
            srcSet={generateSrcSet(src.replace(/\.(jpg|jpeg|png)$/i, '.avif'))}
            sizes={sizes}
          />
          <source
            type="image/webp"
            srcSet={generateSrcSet(src.replace(/\.(jpg|jpeg|png)$/i, '.webp'))}
            sizes={sizes}
          />
          
          <img
            src={src}
            alt={alt}
            width={width}
            height={height}
            loading={loading}
            className={`transition-opacity duration-300 ${
              isLoaded ? 'opacity-100' : 'opacity-0'
            } ${className}`}
            style={{ 
              width: width ? `${width}px` : 'auto',
              height: height ? `${height}px` : 'auto'
            }}
            onLoad={handleLoad}
            onError={handleError}
            sizes={sizes}
            srcSet={generateSrcSet(src)}
            decoding={priority ? 'sync' : 'async'}
            {...(priority && { fetchpriority: 'high' })}
          />
        </picture>
      )}
    </div>
  );
};

export default OptimizedImage;
