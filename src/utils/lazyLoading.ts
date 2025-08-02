import { lazy, ComponentType, LazyExoticComponent } from 'react';

interface PreloadableComponent<T = any> extends LazyExoticComponent<ComponentType<T>> {
  preload?: () => Promise<{ default: ComponentType<T> }>;
}

/**
 * Enhanced lazy loading with preloading capabilities
 */
export function lazyWithPreload<T = any>(
  importFn: () => Promise<{ default: ComponentType<T> }>
): PreloadableComponent<T> {
  const LazyComponent = lazy(importFn) as PreloadableComponent<T>;
  
  // Add preload method to the component
  LazyComponent.preload = importFn;
  
  return LazyComponent;
}

/**
 * Preload components on user interaction (hover, focus)
 */
export function preloadOnInteraction(component: PreloadableComponent) {
  if (component.preload) {
    component.preload();
  }
}

/**
 * Preload critical route components after initial load
 */
export function preloadCriticalRoutes(components: PreloadableComponent[]) {
  // Use requestIdleCallback if available, otherwise setTimeout
  const schedulePreload = (callback: () => void) => {
    if ('requestIdleCallback' in window) {
      requestIdleCallback(callback);
    } else {
      setTimeout(callback, 100);
    }
  };

  components.forEach((component, index) => {
    schedulePreload(() => {
      setTimeout(() => {
        if (component.preload) {
          component.preload();
        }
      }, index * 100); // Stagger preloads
    });
  });
}
