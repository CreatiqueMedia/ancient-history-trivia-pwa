import '@testing-library/jest-dom'
import { vi } from 'vitest'

// Mock implementations for browser APIs
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(), // deprecated
    removeListener: vi.fn(), // deprecated
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});

// Mock localStorage with actual storage functionality
const createMockStorage = () => {
  let store: Record<string, string> = {};
  return {
    getItem: vi.fn((key: string) => store[key] || null),
    setItem: vi.fn((key: string, value: string) => {
      store[key] = value;
    }),
    removeItem: vi.fn((key: string) => {
      delete store[key];
    }),
    clear: vi.fn(() => {
      store = {};
    }),
  };
};

Object.defineProperty(window, 'localStorage', {
  value: createMockStorage(),
  writable: true,
});

// Mock sessionStorage with actual storage functionality
Object.defineProperty(window, 'sessionStorage', {
  value: createMockStorage(),
  writable: true,
});

// Mock Navigator
Object.defineProperty(window, 'navigator', {
  value: {
    serviceWorker: {
      register: vi.fn(),
      addEventListener: vi.fn(),
    },
    userAgent: 'test',
  },
  writable: true,
});

// Mock URL constructor
global.URL = URL;

// Mock gtag for analytics
globalThis.gtag = vi.fn();

// Mock React DOM for testing
(globalThis as any).IS_REACT_ACT_ENVIRONMENT = true;
