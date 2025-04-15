
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import LotteryManagement from '@/components/admin/LotteryManagement';
import { BrowserRouter } from 'react-router-dom';
import { useSounds } from '@/hooks/use-sounds';

// Mock the useSounds hook
jest.mock('@/hooks/use-sounds', () => ({
  useSounds: jest.fn(() => ({
    playSound: jest.fn(),
  })),
}));

// Mock the toast utilities
jest.mock('@/utils/toast', () => ({
  toastSuccess: jest.fn(),
  toastInfo: jest.fn(),
  toastError: jest.fn(),
  toastWarning: jest.fn(),
}));

describe('LotteryManagement Component', () => {
  beforeEach(() => {
    // Clear all mocks before each test
    jest.clearAllMocks();
  });

  const renderComponent = () => 
    render(
      <BrowserRouter>
        <LotteryManagement />
      </BrowserRouter>
    );

  test('renders correctly with initial lotteries', async () => {
    renderComponent();
    
    // Wait for loading to complete
    await waitFor(() => {
      expect(screen.queryByRole('progressbar')).not.toBeInTheDocument();
    });

    // Check if the component title is rendered
    expect(screen.getByText('Administração de Sorteios')).toBeInTheDocument();
    
    // Check if lottery items are rendered
    expect(screen.getByText('Sorteio Semanal de Pontos')).toBeInTheDocument();
    expect(screen.getByText('Loot Box Especial')).toBeInTheDocument();
    expect(screen.getByText('Promoção de Aniversário')).toBeInTheDocument();
  });

  test('selects a lottery when clicked', async () => {
    renderComponent();
    
    // Wait for loading to complete
    await waitFor(() => {
      expect(screen.queryByRole('progressbar')).not.toBeInTheDocument();
    });

    // Click on a lottery
    fireEvent.click(screen.getByText('Sorteio Semanal de Pontos'));
    
    // Check if lottery details are shown
    expect(screen.getByText('Detalhes do Sorteio')).toBeInTheDocument();
    expect(screen.getAllByText('Ativo')[0]).toBeInTheDocument();

    // Verify sound was played
    expect(useSounds().playSound).toHaveBeenCalledWith('pop');
  });

  test('opens new lottery dialog when "Novo" button is clicked', async () => {
    renderComponent();
    
    // Wait for loading to complete
    await waitFor(() => {
      expect(screen.queryByRole('progressbar')).not.toBeInTheDocument();
    });

    // Click on new lottery button
    fireEvent.click(screen.getByText('Novo'));
    
    // Check if the dialog is opened
    expect(screen.getByText('Novo Sorteio')).toBeInTheDocument();
    expect(screen.getByText('Configure os detalhes do novo sorteio.')).toBeInTheDocument();
  });

  test('changes lottery status when status button is clicked', async () => {
    renderComponent();
    
    // Wait for loading to complete
    await waitFor(() => {
      expect(screen.queryByRole('progressbar')).not.toBeInTheDocument();
    });

    // Select lottery
    fireEvent.click(screen.getByText('Sorteio Semanal de Pontos'));
    
    // Find and click status button
    const pauseButton = screen.getByText('Pausar');
    fireEvent.click(pauseButton);
    
    // Wait for status change
    await waitFor(() => {
      expect(screen.getByText('Atualizando...')).toBeInTheDocument();
    });
    
    // Wait for status update to complete
    await waitFor(() => {
      // Now the button should say "Ativar" instead of "Pausar"
      expect(screen.getByText('Ativar')).toBeInTheDocument();
    });
  });
});
