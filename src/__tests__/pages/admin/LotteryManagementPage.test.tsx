
import React from 'react';
import { render, screen } from '@/utils/test-utils';
import { BrowserRouter } from 'react-router-dom';
import LotteryManagementPage from '@/pages/admin/LotteryManagementPage';

// Mock the components used in LotteryManagementPage
jest.mock('@/components/admin/AdminSidebar', () => function MockAdminSidebar() {
    return <div data-testid="admin-sidebar">Admin Sidebar</div>;
  });

jest.mock('@/components/admin/DashboardHeader', () => function MockDashboardHeader({ title, subtitle }: { title: string; subtitle: string }) {
    return (
      <header data-testid="dashboard-header">
        <h1>{title}</h1>
        <p>{subtitle}</p>
      </header>
    );
  });

jest.mock('@/components/admin/LotteryManagement', () => function MockLotteryManagement() {
    return <div data-testid="lottery-management">Lottery Management Component</div>;
  });

jest.mock('@/hooks/use-sounds', () => ({
  useSounds: () => ({
    playSound: jest.fn(),
  }),
}));

jest.mock('@/hooks/use-mobile', () => ({
  useMediaQuery: () => false,
}));

describe('LotteryManagementPage', () => {
  test('renders correctly with all components', () => {
    render(
      <BrowserRouter>
        <LotteryManagementPage />
      </BrowserRouter>
    );
    
    // Check if page components are rendered
    expect(screen.getByTestId('admin-sidebar')).toBeInTheDocument();
    expect(screen.getByTestId('dashboard-header')).toBeInTheDocument();
    expect(screen.getByText('Gestão de Sorteios')).toBeInTheDocument();
    expect(screen.getByText('Administração e controle dos sorteios do sistema')).toBeInTheDocument();
    expect(screen.getByTestId('lottery-management')).toBeInTheDocument();
  });
});
