
import { render, screen, fireEvent } from '@testing-library/react';
import { FormNavigation } from '@/components/advertiser/campaign-form/FormNavigation';

describe('FormNavigation', () => {
  const mockHandleNext = jest.fn();
  const mockHandleBack = jest.fn();
  const mockOnClose = jest.fn();
  
  beforeEach(() => {
    jest.clearAllMocks();
  });
  
  it('renders navigation buttons correctly', () => {
    render(
      <FormNavigation 
        step={2} 
        totalSteps={4} 
        handleNext={mockHandleNext} 
        handleBack={mockHandleBack} 
        onClose={mockOnClose} 
        isNextDisabled={false}
      />
    );
    
    expect(screen.getByText('Voltar')).toBeInTheDocument();
    expect(screen.getByText('Próximo')).toBeInTheDocument();
    expect(screen.getByText('Cancelar')).toBeInTheDocument();
  });
  
  it('handles button clicks correctly', () => {
    render(
      <FormNavigation 
        step={2} 
        totalSteps={4} 
        handleNext={mockHandleNext} 
        handleBack={mockHandleBack} 
        onClose={mockOnClose}
        isNextDisabled={false} 
      />
    );
    
    fireEvent.click(screen.getByText('Próximo'));
    expect(mockHandleNext).toHaveBeenCalledTimes(1);
    
    fireEvent.click(screen.getByText('Voltar'));
    expect(mockHandleBack).toHaveBeenCalledTimes(1);
    
    fireEvent.click(screen.getByText('Cancelar'));
    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });
  
  it('shows "Finalizar" instead of "Próximo" on the last step', () => {
    render(
      <FormNavigation 
        step={4} 
        totalSteps={4} 
        handleNext={mockHandleNext} 
        handleBack={mockHandleBack} 
        onClose={mockOnClose}
        isNextDisabled={false}
      />
    );
    
    expect(screen.getByText('Finalizar')).toBeInTheDocument();
    expect(screen.queryByText('Próximo')).not.toBeInTheDocument();
  });
  
  it('disables next button when isNextDisabled is true', () => {
    render(
      <FormNavigation 
        step={2} 
        totalSteps={4} 
        handleNext={mockHandleNext} 
        handleBack={mockHandleBack} 
        onClose={mockOnClose}
        isNextDisabled={true}
      />
    );
    
    expect(screen.getByText('Próximo')).toBeDisabled();
  });
});
