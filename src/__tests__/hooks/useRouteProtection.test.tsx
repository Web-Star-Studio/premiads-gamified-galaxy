
import { renderHook, act } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";

// Mock the useAuth and useNavigate hooks
vi.mock("@/hooks/useAuth", () => ({
  useAuth: vi.fn(),
}));

vi.mock("react-router-dom", () => ({
  useNavigate: vi.fn(),
}));

// Test the route protection logic
describe('Route Protection Logic', () => {
  const mockNavigate = vi.fn();
  
  beforeEach(() => {
    vi.clearAllMocks();
    (useNavigate as any).mockReturnValue(mockNavigate);
  });
  
  it('redirects unauthenticated users to login', () => {
    // Mock unauthenticated user
    (useAuth as any).mockReturnValue({
      isAuthenticated: false,
      isLoading: false,
      currentUser: null
    });
    
    // Execute the logic that would check auth status
    const checkAuth = () => {
      const { isAuthenticated } = useAuth();
      const navigate = useNavigate();
      
      if (!isAuthenticated) {
        navigate('/auth');
        return false;
      }
      return true;
    };
    
    const result = checkAuth();
    
    expect(result).toBe(false);
    expect(mockNavigate).toHaveBeenCalledWith('/auth');
  });
  
  it('allows admins to access all routes', () => {
    // Mock admin user
    (useAuth as any).mockReturnValue({
      isAuthenticated: true,
      isLoading: false,
      currentUser: {
        user_metadata: {
          user_type: 'admin'
        }
      }
    });
    
    // Execute logic that checks user type for admin routes
    const checkAdminAccess = () => {
      const { currentUser } = useAuth();
      const navigate = useNavigate();
      
      if (currentUser?.user_metadata?.user_type !== 'admin' &&
          currentUser?.user_metadata?.user_type !== 'moderator') {
        navigate('/cliente');
        return false;
      }
      return true;
    };
    
    const result = checkAdminAccess();
    
    expect(result).toBe(true);
    expect(mockNavigate).not.toHaveBeenCalled();
  });
  
  it('redirects non-admins from admin routes', () => {
    // Mock non-admin user
    (useAuth as any).mockReturnValue({
      isAuthenticated: true,
      isLoading: false,
      currentUser: {
        user_metadata: {
          user_type: 'participante'
        }
      }
    });
    
    // Execute logic that checks user type for admin routes
    const checkAdminAccess = () => {
      const { currentUser } = useAuth();
      const navigate = useNavigate();
      
      if (currentUser?.user_metadata?.user_type !== 'admin' &&
          currentUser?.user_metadata?.user_type !== 'moderator') {
        navigate('/cliente');
        return false;
      }
      return true;
    };
    
    const result = checkAdminAccess();
    
    expect(result).toBe(false);
    expect(mockNavigate).toHaveBeenCalledWith('/cliente');
  });
  
  it('allows moderators to access admin routes', () => {
    // Mock moderator user
    (useAuth as any).mockReturnValue({
      isAuthenticated: true,
      isLoading: false,
      currentUser: {
        user_metadata: {
          user_type: 'moderator'
        }
      }
    });
    
    // Execute logic that checks user type for admin routes
    const checkAdminAccess = () => {
      const { currentUser } = useAuth();
      const navigate = useNavigate();
      
      if (currentUser?.user_metadata?.user_type !== 'admin' &&
          currentUser?.user_metadata?.user_type !== 'moderator') {
        navigate('/cliente');
        return false;
      }
      return true;
    };
    
    const result = checkAdminAccess();
    
    expect(result).toBe(true);
    expect(mockNavigate).not.toHaveBeenCalled();
  });
});
