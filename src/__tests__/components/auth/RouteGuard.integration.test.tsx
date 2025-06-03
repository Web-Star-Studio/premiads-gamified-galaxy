
import React from 'react';
import { render, screen, waitFor } from '@/utils/test-utils';
import { BrowserRouter } from 'react-router-dom';
import RouteGuard from '@/components/auth/RouteGuard';

// Mock the auth context
jest.mock('@/context/AuthContext', () => ({
  useAuth: () => ({
    user: null,
    isLoading: false,
    signOut: jest.fn(),
  }),
}));

describe('RouteGuard Integration', () => {
  test('redirects unauthenticated users', async () => {
    render(
      <BrowserRouter>
        <RouteGuard>
          <div>Protected Content</div>
        </RouteGuard>
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(screen.queryByText('Protected Content')).not.toBeInTheDocument();
    });
  });
});
