
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import LotteryDetails from '@/components/admin/lottery/LotteryDetails';
import { toastInfo } from '@/utils/toast';
import { Lottery } from '@/components/admin/lottery/types';

// Mock the toast utility
jest.mock('@/utils/toast', () => ({
  toastInfo: jest.fn(),
}));

describe('LotteryDetails Component', () => {
  const mockLottery: Lottery = {
    id: 1,
    name: 'Sorteio de Teste',
    description: 'Descrição do sorteio de teste',
    detailedDescription: 'Uma descrição detalhada do sorteio de teste',
    prizeType: 'electronics',
    prizeValue: 1000,
    imageUrl: 'https://example.com/image.jpg',
    startDate: '2025-04-15',
    endDate: '2025-04-22',
    drawDate: '2025-04-23',
    status: 'active',
    numbersTotal: 100,
    pointsPerNumber: 50,
    minPoints: 100,
    prizes: [
      { id: 1, name: 'Prêmio 1', rarity: 'common', probability: 60 },
      { id: 2, name: 'Prêmio 2', rarity: 'uncommon', probability: 40 }
    ]
  };
  
  const mockCompletedLottery: Lottery = {
    ...mockLottery,
    status: 'completed'
  };
  
  const mockOnStatusChange = jest.fn();
  
  beforeEach(() => {
    jest.clearAllMocks();
  });
  
  test('renders lottery details correctly', () => {
    render(
      <LotteryDetails 
        selectedLottery={mockLottery}
        onStatusChange={mockOnStatusChange}
      />
    );
    
    // Check if the details are displayed
    expect(screen.getByText('Detalhes do Sorteio')).toBeInTheDocument();
    expect(screen.getByText('Sorteio de Teste')).toBeInTheDocument();
    expect(screen.getByText('2025-04-15')).toBeInTheDocument();
    expect(screen.getByText('2025-04-22')).toBeInTheDocument();
    expect(screen.getByText('Pausar')).toBeInTheDocument();
    expect(screen.getByText('Editar')).toBeInTheDocument();
  });
  
  test('handles status change when button is clicked', async () => {
    render(
      <LotteryDetails 
        selectedLottery={mockLottery}
        onStatusChange={mockOnStatusChange}
      />
    );
    
    // Click on pause button
    fireEvent.click(screen.getByText('Pausar'));
    
    // Check loading state
    expect(screen.getByText('Atualizando...')).toBeInTheDocument();
    
    // Wait for update to complete
    await waitFor(() => {
      expect(mockOnStatusChange).toHaveBeenCalledWith(1, 'pending');
    });
  });
  
  test('does not show status or edit buttons for completed lotteries', () => {
    render(
      <LotteryDetails 
        selectedLottery={mockCompletedLottery}
        onStatusChange={mockOnStatusChange}
      />
    );
    
    // Check that buttons are not present
    expect(screen.queryByText('Pausar')).not.toBeInTheDocument();
    expect(screen.queryByText('Ativar')).not.toBeInTheDocument();
    expect(screen.queryByText('Editar')).not.toBeInTheDocument();
  });
  
  test('shows info toast when edit button is clicked', () => {
    render(
      <LotteryDetails 
        selectedLottery={mockLottery}
        onStatusChange={mockOnStatusChange}
      />
    );
    
    // Click on edit button
    fireEvent.click(screen.getByText('Editar'));
    
    // Check that toast is shown
    expect(toastInfo).toHaveBeenCalledWith(
      "Funcionalidade em desenvolvimento", 
      "A edição de sorteios será disponibilizada em breve."
    );
  });
  
  test('displays prizes correctly', () => {
    render(
      <LotteryDetails 
        selectedLottery={mockLottery}
        onStatusChange={mockOnStatusChange}
      />
    );
    
    // Check if prizes are displayed
    expect(screen.getByText('Prêmio 1')).toBeInTheDocument();
    expect(screen.getByText('Prêmio 2')).toBeInTheDocument();
    expect(screen.getByText('60%')).toBeInTheDocument();
    expect(screen.getByText('40%')).toBeInTheDocument();
  });
});
