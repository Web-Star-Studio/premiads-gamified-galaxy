
import '@testing-library/jest-dom';

declare global {
  namespace jest {
    interface Matchers<R> {
      toBeInTheDocument(): R;
      toBeVisible(): R;
      toHaveTextContent(text: string): R;
      toHaveAttribute(attr: string, value?: string): R;
      toBeDisabled(): R;
      toBeEnabled(): R;
      toBeChecked(): R;
      toHaveClass(className: string): R;
      toHaveFocus(): R;
      toHaveStyle(style: Record<string, any>): R;
      // Add other matchers as needed
    }
  }
}
