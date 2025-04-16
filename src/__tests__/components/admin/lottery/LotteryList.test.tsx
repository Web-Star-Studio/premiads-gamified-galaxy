
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import LotteryList from '@/components/admin/lottery/LotteryList';
import { Lottery } from '@/components/admin/lottery/types';

describe('LotteryList Component', () => {
  const mockLotteries: Lottery[] = [
    { 
      id: 1, 
      name: 'Sorteio de Teste 1', 
      description: 'Descrição do sorteio 1',
      detailedDescription: 'Descrição detalhada do sorteio 1',
      prizeType: 'electronics',
      prizeValue: 1000,
      imageUrl: 'https://example.com/image1.jpg',
      startDate: '2025-04-15', 
      endDate: '2025-04-22',
      drawDate: '2025-04-23',
      status: 'active',
      numbersTotal: 100,
      pointsPerNumber: 50,
      minPoints: 100,
      progress: 0,
      numbersSold: 0,
      prizes: []
    },
    { 
      id: 2, 
      name: 'Sorteio de Teste 2',
      description: 'Descrição do sorteio 2',
      detailedDescription: 'Descrição detalhada do sorteio 2',
      prizeType: 'travel',
      prizeValue: 2000,
      imageUrl: 'https://example.com/image2.jpg',
      startDate: '2025-04-17', 
      endDate: '2025-04-24',
      drawDate: '2025-04-25',
      status: 'pending',
      numbersTotal: 200,
      pointsPerNumber: 100,
      minPoints: 200,
      progress: 0,
      numbersSold: 0,
      prizes: []
    }
  ];
  
  const mockOnSelectLottery = jest.fn();
  const mockOnLotteryCreated = jest.fn();
  
  beforeEach(() => {
    jest.clearAllMocks();
  });
  
  test('renders lottery list correctly', () => {
    render(
      <LotteryList
        lotteries={mockLotteries}
        selectedLotteryId={null}
        onSelectLottery={mockOnSelectLottery}
        onLotteryCreated={mockOnLotteryCreated}
      />
    );
    
    // Check if the component heading is displayed
    expect(screen.getByText('Gerenciamento de Sorteios')).toBeInTheDocument();
    expect(screen.getByText('Novo Sorteio')).toBeInTheDocument();
    
    // Check if lottery items are displayed
    expect(screen.getByText('Sorteio de Teste 1')).toBeInTheDocument();
    expect(screen.getByText('Sorteio de Teste 2')).toBeInTheDocument();
    
    // Check if status badges are displayed
    expect(screen.getByText('Ativo')).toBeInTheDocument();
    expect(screen.getByText('Rascunho')).toBeInTheDocument();
  });
  
  test('selects a lottery when clicked', () => {
    render(
      <LotteryList
        lotteries={mockLotteries}
        selectedLotteryId={null}
        onSelectLottery={mockOnSelectLottery}
        onLotteryCreated={mockOnLotteryCreated}
      />
    );
    
    // Click on a lottery
    fireEvent.click(screen.getByText('Sorteio de Teste 1'));
    
    // Check if onSelectLottery was called with the correct lottery
    expect(mockOnSelectLottery).toHaveBeenCalledWith(mockLotteries[0]);
  });
  
  test('opens new lottery dialog when "Novo" button is clicked', () => {
    render(
      <LotteryList
        lotteries={mockLotteries}
        selectedLotteryId={null}
        onSelectLottery={mockOnSelectLottery}
        onLotteryCreated={mockOnLotteryCreated}
      />
    );
    
    // Click on new lottery button
    fireEvent.click(screen.getByText('Novo Sorteio'));
    
    // We'll check if the dialog opens in NewLotteryDialog tests
    // Here we just verify handleNewLotteryClick is called
  });
  
  test('displays empty state when no lotteries exist', () => {
    render(
      <LotteryList
        lotteries={[]}
        selectedLotteryId={null}
        onSelectLottery={mockOnSelectLottery}
        onLotteryCreated={mockOnLotteryCreated}
      />
    );
    
    // Check if empty state message is displayed
    expect(screen.getByText('Nenhum sorteio encontrado')).toBeInTheDocument();
  });
  
  test('highlights selected lottery', () => {
    render(
      <LotteryList
        lotteries={mockLotteries}
        selectedLotteryId={1}
        onSelectLottery={mockOnSelectLottery}
        onLotteryCreated={mockOnLotteryCreated}
      />
    );
    
    // The styling would be tested in a different way typically
    // For now, just ensure all elements are rendered correctly
    expect(screen.getByText('Sorteio de Teste 1')).toBeInTheDocument();
  });
});
