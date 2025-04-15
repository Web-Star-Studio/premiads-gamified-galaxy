
import { render, screen } from '@testing-library/react';
import FormProgress from '@/components/advertiser/campaign-form/FormProgress';

describe('FormProgress', () => {
  it('renders the correct title and step', () => {
    render(<FormProgress step={2} title="Test Title" />);
    
    // Check if the title is rendered
    expect(screen.getByText('Test Title')).toBeInTheDocument();
    
    // Check if the step is announced to screen readers
    expect(screen.getByText('Passo 2 de 4')).toBeInTheDocument();
    
    // Check if the progress bar has the correct number of steps
    const progressSegments = screen.getAllByRole('presentation');
    expect(progressSegments).toHaveLength(4);
  });
});
