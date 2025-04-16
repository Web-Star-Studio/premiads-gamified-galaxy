
import React from 'react';
import { render, RenderOptions } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';

// Create a custom render function that includes common providers
const customRender = (
  ui: React.ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>
) => render(ui, { wrapper: ({ children }) => <BrowserRouter>{children}</BrowserRouter>, ...options });

// Re-export everything from testing-library
export * from '@testing-library/react';

// Override the render method with our custom one
export { customRender as render };

// Utility for finding text that matches a regex
export const getByTextContent = (container: HTMLElement, regex: RegExp) => {
  const elements = Array.from(container.querySelectorAll('*'));
  const element = elements.find(el => el.textContent && regex.test(el.textContent));
  if (!element) {
    throw new Error(`Unable to find an element with text content matching ${regex}`);
  }
  return element;
};
