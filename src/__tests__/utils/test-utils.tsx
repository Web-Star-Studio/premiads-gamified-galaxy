
import React, { ReactElement } from 'react';
import { render, RenderOptions } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { UserProvider } from '@/context/UserContext';
import { AppProvider } from '@/context/AppContext';

// Create a custom render function that includes providers
const customRender = (
  ui: ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>,
) => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });

  return render(
    ui,
    {
      wrapper: ({ children }) => (
        <QueryClientProvider client={queryClient}>
          <AppProvider>
            <UserProvider>
              <BrowserRouter>
                {children}
              </BrowserRouter>
            </UserProvider>
          </AppProvider>
        </QueryClientProvider>
      ),
      ...options,
    }
  );
};

// Re-export everything
export * from '@testing-library/react';

// Override render method
export { customRender as render };
