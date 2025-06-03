
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@/utils/test-utils';
import { BrowserRouter } from 'react-router-dom';
import AdminRoutes from '@/routes/AdminRoutes';

// Mock admin components
jest.mock('@/pages/admin/AdminDashboard', () => function MockAdminDashboard() {
    return <div data-testid="admin-dashboard">Admin Dashboard</div>;
  });

describe('AdminRoutes', () => {
  test('renders admin routes correctly', async () => {
    render(
      <BrowserRouter>
        <AdminRoutes />
      </BrowserRouter>
    );
    
    await waitFor(() => {
      expect(screen.getByTestId('admin-dashboard')).toBeInTheDocument();
    });
  });
});
