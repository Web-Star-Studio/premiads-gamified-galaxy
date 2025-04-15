
import { toast } from '@/hooks/use-toast';
import { 
  toastInfo, 
  toastSuccess, 
  toastError, 
  toastWarning 
} from '@/utils/toast';

// Mock the toast function
jest.mock('@/hooks/use-toast', () => ({
  toast: jest.fn(),
  useToast: jest.fn(),
}));

describe('Toast Utility Functions', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });
  
  test('toastInfo calls toast with correct parameters', () => {
    const title = 'Info Title';
    const description = 'Info Description';
    
    toastInfo(title, description);
    
    expect(toast).toHaveBeenCalledWith({
      title,
      description,
      variant: 'default',
    });
  });
  
  test('toastSuccess calls toast with correct parameters', () => {
    const title = 'Success Title';
    const description = 'Success Description';
    
    toastSuccess(title, description);
    
    expect(toast).toHaveBeenCalledWith({
      title,
      description,
      variant: 'default', // This was changed from 'success' to 'default'
    });
  });
  
  test('toastError calls toast with correct parameters', () => {
    const title = 'Error Title';
    const description = 'Error Description';
    
    toastError(title, description);
    
    expect(toast).toHaveBeenCalledWith({
      title,
      description,
      variant: 'destructive',
    });
  });
  
  test('toastWarning calls toast with correct parameters', () => {
    const title = 'Warning Title';
    const description = 'Warning Description';
    
    toastWarning(title, description);
    
    expect(toast).toHaveBeenCalledWith({
      title,
      description,
      variant: 'default', // This was changed from 'warning' to 'default'
    });
  });
  
  test('all toast functions work without description', () => {
    const title = 'Title Only';
    
    toastInfo(title);
    toastSuccess(title);
    toastError(title);
    toastWarning(title);
    
    expect(toast).toHaveBeenCalledTimes(4);
    
    // Check the first call (toastInfo)
    expect(toast).toHaveBeenNthCalledWith(1, {
      title,
      description: undefined,
      variant: 'default',
    });
  });
});
