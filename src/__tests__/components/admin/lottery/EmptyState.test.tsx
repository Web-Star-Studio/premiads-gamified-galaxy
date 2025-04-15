
import React from 'react';
import { render, screen } from '@testing-library/react';
import EmptyState from '@/components/admin/lottery/EmptyState';

describe('EmptyState Component', () => {
  test('renders empty state message correctly', () => {
    render(<EmptyState />);
    
    // Check if the empty state message is displayed
    expect(screen.getByText('Selecione um sorteio para visualizar seus detalhes.')).toBeInTheDocument();
    
    // Check if the button is displayed
    expect(screen.getByRole('button', { name: /Criar Novo Sorteio/i })).toBeInTheDocument();
    
    // Check if the gift icon is displayed (by its parent container)
    expect(screen.getByText('Selecione um sorteio para visualizar seus detalhes.').previousSibling).toBeInTheDocument();
  });
});
