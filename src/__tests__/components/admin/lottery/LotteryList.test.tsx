
import React from 'react';
import { render, screen, fireEvent } from '@/utils/test-utils';
import LotteryList from '@/components/admin/lottery/LotteryList';
import { Lottery } from '@/types/lottery';

describe('LotteryList Component', () => {
  const mockLotteries: Lottery[] = [
    { 
      id: "1", 
      title: 'Sorteio de Teste 1',
      name: 'Sorteio de Teste 1',
      description: 'Descrição do sorteio 1',
      detailed_description: 'Descrição detalhada do sorteio 1',
      detailedDescription: 'Descrição detalhada do sorteio 1',
      prize_type: 'electronics',
      prizeType: 'electronics',
      prize_value: 1000,
      prizeValue: 1000,
      imageUrl: 'https://example.com/image1.jpg',
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
      progress: 0,
      numbersSold: 0,
      numbers: [],
      created_at: '',
      updated_at: '',
      winner: null,
      prizes: []
    },
    { 
      id: "2", 
      title: 'Sorteio de Teste 2',
      name: 'Sorteio de Teste 2',
      description: 'Descrição do sorteio 2',
      detailed_description: 'Descrição detalhada do sorteio 2',
      detailedDescription: 'Descrição detalhada do sorteio 2',
      prize_type: 'travel',
      prizeType: 'travel',
      prize_value: 2000,
      prizeValue: 2000,
      imageUrl: 'https://example.com/image2.jpg',
      start_date: '2025-04-17', 
      startDate: '2025-04-17',
      end_date: '2025-04-24',
      endDate: '2025-04-24',
      draw_date: '2025-04-25',
      drawDate: '2025-04-25',
      status: 'pending',
      numbers_total: 200,
      numbersTotal: 200,
      points: 100,
      type: 'regular',
      pointsPerNumber: 100,
      minPoints: 200,
      progress: 0,
      numbersSold: 0,
      numbers: [],
      created_at: '',
      updated_at: '',
      winner: null,
      prizes: []
    }
  ];
  
  const mockOnViewDetails = jest.fn();
  const mockOnEdit = jest.fn();
  const mockOnDelete = jest.fn();
  
  beforeEach(() => {
    jest.clearAllMocks();
  });
  
  test('renders lottery list correctly', () => {
    render(
      <LotteryList
        lotteries={mockLotteries}
        onViewDetails={mockOnViewDetails}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
      />
    );
    
    // Check if lottery items are displayed
    expect(screen.getByText('Sorteio de Teste 1')).toBeInTheDocument();
    expect(screen.getByText('Sorteio de Teste 2')).toBeInTheDocument();
    
    // Check if status badges are displayed
    expect(screen.getByText('Ativa')).toBeInTheDocument();
    expect(screen.getByText('Pendente')).toBeInTheDocument();
  });
  
  test('calls onViewDetails when view details is clicked', () => {
    render(
      <LotteryList
        lotteries={mockLotteries}
        onViewDetails={mockOnViewDetails}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
      />
    );
    
    // Click on view details button
    fireEvent.click(screen.getAllByText('Ver Detalhes')[0]);
    
    // Check if onViewDetails was called with the correct lottery
    expect(mockOnViewDetails).toHaveBeenCalledWith(mockLotteries[0]);
  });
  
  test('displays empty state when no lotteries exist', () => {
    render(
      <LotteryList
        lotteries={[]}
        onViewDetails={mockOnViewDetails}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
      />
    );
    
    // Check if empty state message is displayed
    expect(screen.queryByText('Sorteio de Teste 1')).not.toBeInTheDocument();
  });
});
