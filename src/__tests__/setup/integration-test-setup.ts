
import "@testing-library/jest-dom";
import { server } from '../mocks/server';

// Start mock service worker for API mocking
beforeAll(() => {
  // Start the interception
  server.listen({ onUnhandledRequest: 'warn' });
});

// Clean up after each test
afterEach(() => {
  // Reset any runtime handlers
  server.resetHandlers();
});

// Clean up after all tests
afterAll(() => {
  server.close();
});

// Mock IntersectionObserver
class MockIntersectionObserver {
  readonly root: Element | null;
  readonly rootMargin: string;
  readonly thresholds: ReadonlyArray<number>;
  
  constructor() {
    this.root = null;
    this.rootMargin = "";
    this.thresholds = [];
  }
  
  observe() {
    return null;
  }
  
  unobserve() {
    return null;
  }
  
  disconnect() {
    return null;
  }
}

global.IntersectionObserver = MockIntersectionObserver;

// Mock window.matchMedia
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

// Mock ResizeObserver
global.ResizeObserver = class MockResizeObserver {
  observe() {
    return null;
  }
  unobserve() {
    return null;
  }
  disconnect() {
    return null;
  }
};

// Create a mock for MSW server
<lov-write file_path="src/__tests__/mocks/server.ts">
import { setupServer } from 'msw/node';
import { rest } from 'msw';

// Define handlers for your API endpoints
const handlers = [
  // Example API route handler for documentation
  rest.get('/api/v1/:section', (req, res, ctx) => {
    const section = req.params.section;
    
    return res(
      ctx.status(200),
      ctx.json({
        title: `${section} Documentation`,
        content: `This is the content for ${section} documentation`,
        lastUpdated: '2025-04-17T12:00:00Z'
      })
    );
  }),
];

// Setup MSW server with the handlers
export const server = setupServer(...handlers);
