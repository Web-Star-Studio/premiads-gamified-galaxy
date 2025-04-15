
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import NewLotteryDialog from '@/components/admin/lottery/NewLotteryDialog';
import { Lottery } from '@/components/admin/lottery/LotteryList';

// Mock utils that rely on real implementation
jest.mock('@/utils/toast', () => ({
  toastSuccess: jest.fn(),
  toastError: jest.fn(),
}));

describe('NewLotteryDialog Component', () => {
  const mockOnOpenChange = jest.fn();
  const mockOnLotteryCreated = jest.fn();
  
  beforeEach(() => {
    jest.clearAllMocks();
  });
  
  const renderComponent = (open = true) => 
    render(
      <NewLotteryDialog 
        open={open} 
        onOpenChange={mockOnOpenChange} 
        onLotteryCreated={mockOnLotteryCreated} 
      />
    );
  
  test('renders dialog content when open', () => {
    renderComponent(true);
    
    expect(screen.getByText('Novo Sorteio')).toBeInTheDocument();
    expect(screen.getByText('Configure os detalhes do novo sorteio.')).toBeInTheDocument();
    expect(screen.getByLabelText('Nome do Sorteio')).toBeInTheDocument();
  });
  
  test('does not render dialog content when closed', () => {
    renderComponent(false);
    
    expect(screen.queryByText('Novo Sorteio')).not.toBeInTheDocument();
  });
  
  test('submits new lottery when form is filled and submitted', async () => {
    renderComponent();
    
    // Fill the form
    await userEvent.type(screen.getByLabelText('Nome do Sorteio'), 'Teste de Sorteio');
    
    // Select status
    fireEvent.click(screen.getByText('Selecione um status'));
    fireEvent.click(screen.getByText('Ativo'));
    
    // Submit the form
    fireEvent.click(screen.getByText('Criar Sorteio'));
    
    // Check loading state
    expect(screen.getByText('Criando...')).toBeInTheDocument();
    
    // Wait for submission to complete
    await waitFor(() => {
      // Check if onLotteryCreated was called with the correct data
      expect(mockOnLotteryCreated).toHaveBeenCalled();
      const createdLottery = mockOnLotteryCreated.mock.calls[0][0];
      expect(createdLottery.name).toBe('Teste de Sorteio');
      expect(createdLottery.status).toBe('active');
    });
    
    // Dialog should close
    expect(mockOnOpenChange).toHaveBeenCalledWith(false);
  });
  
  test('closes dialog when cancel button is clicked', () => {
    renderComponent();
    
    // Click cancel button
    fireEvent.click(screen.getByText('Cancelar'));
    
    // Dialog should close
    expect(mockOnOpenChange).toHaveBeenCalledWith(false);
  });
});
