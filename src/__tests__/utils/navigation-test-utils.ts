
import { act } from "react-dom/test-utils";
import { waitFor } from "@/utils/test-utils";

export const navigateAndWait = async (path: string) => {
  await act(async () => {
    window.history.pushState({}, "", path);
  });
  
  // Wait for any pending navigation effects
  await waitFor(() => {
    expect(window.location.pathname).toBe(path);
  });
};

export const mockWindowLocation = (path: string) => {
  const originalLocation = window.location;
  delete (window as any).location;
  window.location = {
    ...originalLocation,
    pathname: path,
    href: `http://localhost${path}`,
    origin: "http://localhost",
  } as Location;
};

export const mockScrollIntoView = () => {
  const originalScrollIntoView = window.HTMLElement.prototype.scrollIntoView;
  window.HTMLElement.prototype.scrollIntoView = jest.fn();
  return () => {
    window.HTMLElement.prototype.scrollIntoView = originalScrollIntoView;
  };
};

export const setupMatchMedia = () => {
  Object.defineProperty(window, "matchMedia", {
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
};
