
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@/utils/test-utils';
import LotteryDetails from '@/components/admin/lottery/LotteryDetails';
import { toastInfo } from '@/utils/toast';
import { Lottery } from '@/types/lottery';

// Mock the toast utility
jest.mock('@/utils/toast', () => ({
  toastInfo: jest.fn(),
}));

describe('LotteryDetails Component', () => {
  const mockLottery: Lottery = {
    id: "1",
    title: 'Sorteio de Teste',
    name: 'Sorteio de Teste',
    description: 'Descrição do sorteio de teste',
    detailed_description: 'Uma descrição detalhada do sorteio de teste',
    detailedDescription: 'Uma descrição detalhada do sorteio de teste',
    prize_type: 'electronics',
    prizeType: 'electronics',
    prize_value: 1000,
    prizeValue: 1000,
    imageUrl: 'https://example.com/image.jpg',
    start_date: '2025-04-15',
    startDate: '2025-04-15',
    end_date: '2025-04-22',
    endDate: '2025-04-22',
    draw_date: '2025-04-23',
    drawDate: '2025-04-23',
    status: 'active',
    numbers_total: 100,
    numbersTotal: 100,
    points: 50,
    type: 'regular',
    pointsPerNumber: 50,
    minPoints: 100,
    numbers: [],
    created_at: '',
    updated_at: '',
    progress: 0,
    numbersSold: 0,
    winner: null,
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
      expect(mockOnStatusChange).toHaveBeenCalledWith("1", 'pending');
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
