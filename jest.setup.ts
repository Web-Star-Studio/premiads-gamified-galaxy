
import '@testing-library/jest-dom';

// Mock global properties that might not be available in jsdom
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(),
    removeListener: jest.fn(),
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
});

// Mock IntersectionObserver
global.IntersectionObserver = class IntersectionObserver {
  constructor(callback: any) {}
  observe() { return null; }
  unobserve() { return null; }
  disconnect() { return null; }
};

// Suppress React 18 console warnings in tests
jest.spyOn(console, 'error').mockImplementation((...args) => {
  if (typeof args[0] === 'string' && 
      (args[0].includes('ReactDOM.render') || 
       args[0].includes('Warning: An update'))) {
    return;
  }
  console.error(...args);
});
