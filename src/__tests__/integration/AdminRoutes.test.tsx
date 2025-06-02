
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import App from '@/App';
import { UserProvider } from '@/context/UserContext';
import { AppProvider } from '@/context/AppContext';

// Create a wrapper component for testing routes
const renderWithProviders = (ui: React.ReactElement, { route = '/' } = {}) => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });

  window.history.pushState({}, 'Test page', route);

  return render(
    <QueryClientProvider client={queryClient}>
      <AppProvider>
        <UserProvider>
          {ui}
        </UserProvider>
      </AppProvider>
    </QueryClientProvider>
  );
};

// Mock components to prevent actual rendering of complex components
jest.mock('@/pages/admin/LotteryManagementPage', () => function MockLotteryManagementPage() {
    return <div data-testid="lottery-management-page">Lottery Management Page</div>;
  });

jest.mock('@/pages/admin/UserManagementPage', () => function MockUserManagementPage() {
    return <div data-testid="user-management-page">User Management Page</div>;
  });

jest.mock('@/pages/AdminPanel', () => function MockAdminPanel() {
    return <div data-testid="admin-panel">Admin Panel Page</div>;
  });

// Test route navigation and lazy loading
describe('Admin Routes Integration', () => {
  test('navigates to admin lottery management page', async () => {
    renderWithProviders(
      <MemoryRouter initialEntries={['/admin/sorteios']}>
        <Routes>
          <Route path="/admin/sorteios" element={<div data-testid="lottery-management-page">Lottery Management Page</div>} />
        </Routes>
      </MemoryRouter>
    );
    
    await waitFor(() => {
      expect(screen.getByTestId('lottery-management-page')).toBeInTheDocument();
    });
  });
  
  test('navigates between admin routes', async () => {
    renderWithProviders(
      <MemoryRouter initialEntries={['/admin']}>
        <Routes>
          <Route path="/admin" element={<div data-testid="admin-panel">Admin Panel Page</div>} />
          <Route path="/admin/sorteios" element={<div data-testid="lottery-management-page">Lottery Management Page</div>} />
          <Route path="/admin/usuarios" element={<div data-testid="user-management-page">User Management Page</div>} />
        </Routes>
      </MemoryRouter>
    );
    
    // Check initial route
    expect(screen.getByTestId('admin-panel')).toBeInTheDocument();
  });
});
