
import { act } from "react-dom/test-utils";
import { RenderResult } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";

/**
 * Helper to wait for a specified time in tests
 */
export const wait = (ms: number): Promise<void> => {
  return new Promise(resolve => setTimeout(resolve, ms));
};

/**
 * Helper to wait for an element to appear in the DOM
 */
export const waitForElement = async (
  callback: () => HTMLElement | null,
  timeout: number = 1000,
  interval: number = 50
): Promise<HTMLElement> => {
  return new Promise((resolve, reject) => {
    const startTime = Date.now();
    
    const checkForElement = () => {
      const element = callback();
      
      if (element) {
        resolve(element);
        return;
      }
      
      if (Date.now() - startTime > timeout) {
        reject(new Error(`Element not found within ${timeout}ms`));
        return;
      }
      
      setTimeout(checkForElement, interval);
    };
    
    checkForElement();
  });
};

/**
 * Helper to simulate component rendering after route change
 */
export const changeRoute = async (route: string): Promise<void> => {
  await act(async () => {
    window.history.pushState({}, 'Test Page', route);
    // Dispatch popstate event to simulate route change
    const popStateEvent = new PopStateEvent('popstate', { state: {} });
    window.dispatchEvent(popStateEvent);
  });
};

/**
 * Helper to simulate typing with delay between keystrokes
 */
export const typeWithDelay = async (
  element: HTMLElement,
  text: string,
  delayMs: number = 50
): Promise<void> => {
  for (let i = 0; i < text.length; i++) {
    await act(async () => {
      await userEvent.type(element, text[i]);
      await wait(delayMs);
    });
  }
};

/**
 * Helper to simulate screen resize for responsive tests
 */
export const resizeWindow = (width: number, height: number): void => {
  Object.defineProperty(window, 'innerWidth', { writable: true, configurable: true, value: width });
  Object.defineProperty(window, 'innerHeight', { writable: true, configurable: true, value: height });
  window.dispatchEvent(new Event('resize'));
};

/**
 * Device screen sizes for responsive testing
 */
export const SCREEN_SIZES = {
  MOBILE: { width: 375, height: 667 },
  TABLET: { width: 768, height: 1024 },
  DESKTOP: { width: 1366, height: 768 },
  LARGE_DESKTOP: { width: 1920, height: 1080 },
};

/**
 * Helper to test all screen sizes
 */
export const testAllScreenSizes = async (
  testFn: (size: { width: number; height: number }) => Promise<void>
): Promise<void> => {
  for (const [sizeName, dimensions] of Object.entries(SCREEN_SIZES)) {
    console.log(`Testing on ${sizeName}`);
    resizeWindow(dimensions.width, dimensions.height);
    await testFn(dimensions);
  }
};
