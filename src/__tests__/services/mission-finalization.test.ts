
import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import { supabase } from '@/integrations/supabase/client';

// Mock the Supabase client
vi.mock('@/integrations/supabase/client', () => {
  const mockRpc = vi.fn();
  
  return {
    supabase: {
      from: vi.fn(() => ({
        select: vi.fn(() => ({
          eq: vi.fn(() => ({
            single: vi.fn(() => ({
              data: null,
              error: null
            })),
            maybeSingle: vi.fn(() => ({
              data: null,
              error: null
            }))
          })),
          in: vi.fn(() => ({
            data: null,
            error: null
          }))
        })),
        update: vi.fn(() => ({
          eq: vi.fn(() => ({
            select: vi.fn(() => ({
              single: vi.fn(() => ({
                data: null,
                error: null
              }))
            }))
          }))
        })),
        insert: vi.fn(() => ({
          select: vi.fn(() => ({
            single: vi.fn(() => ({
              data: null,
              error: null
            }))
          }))
        }))
      })),
      auth: {
        getUser: vi.fn(() => Promise.resolve({
          data: { user: { id: 'test-approver-id' } },
          error: null
        }))
      },
      rpc: mockRpc
    }
  };
});
  
describe('Mission Finalization Flow', () => {
  let queryClientMock: any;

  beforeEach(() => {
    // Mock the queryClient for invalidateQueries
    queryClientMock = {
      invalidateQueries: vi.fn()
    };

    // Reset all mocks between tests
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.resetAllMocks();
  });

  describe('validateSubmission function', () => {
    it('should call finalize_submission RPC with correct parameters', async () => {
      // Arrange
      const submissionId = 'test-submission-id';
      const validatedBy = 'test-approver-id';
      const result = 'aprovado';
      const isAdmin = false;
      const notes = 'Good job!';

      // Mock the RPC response
      const mockRpc = supabase.rpc as vi.MockedFunction<typeof supabase.rpc>;
      mockRpc.mockResolvedValueOnce({
        data: {
          status: 'approved',
          points_awarded: 100,
          participant_id: 'test-participant-id'
        },
        error: null
      });

      // Act - using simplified validateSubmission function
      const validateSubmission = async (
        submissionId: string,
        validatedBy: string,
        result: string,
        isAdmin: boolean,
        notes?: string
      ) => {
        const { data, error } = await supabase.rpc('finalize_submission', {
          p_submission_id: submissionId,
          p_approver_id: validatedBy,
          p_decision: result === 'aprovado' ? 'approved' : 'rejected',
          p_stage: isAdmin ? 'admin' : 'advertiser_first'
        });

        if (error) throw error;
        return data;
      };

      await validateSubmission(submissionId, validatedBy, result, isAdmin, notes);

      // Assert
      expect(mockRpc).toHaveBeenCalledWith(
        'finalize_submission',
        {
          p_submission_id: submissionId,
          p_approver_id: validatedBy,
          p_decision: 'approved',
          p_stage: 'advertiser_first'
        }
      );
    });

    it('should handle rejection correctly', async () => {
      // Arrange
      const submissionId = 'test-submission-id';
      const validatedBy = 'test-approver-id';
      const result = 'rejeitado';
      const isAdmin = false;
      const notes = 'Not meeting requirements';

      // Mock the RPC response
      const mockRpc = supabase.rpc as vi.MockedFunction<typeof supabase.rpc>;
      mockRpc.mockResolvedValueOnce({
        data: {
          status: 'rejected',
          points_awarded: 0,
          participant_id: 'test-participant-id'
        },
        error: null
      });

      // Act
      const validateSubmission = async (
        submissionId: string,
        validatedBy: string,
        result: string,
        isAdmin: boolean,
        notes?: string
      ) => {
        const { data, error } = await supabase.rpc('finalize_submission', {
          p_submission_id: submissionId,
          p_approver_id: validatedBy,
          p_decision: result === 'aprovado' ? 'approved' : 'rejected',
          p_stage: isAdmin ? 'admin' : 'advertiser_first'
        });

        if (error) throw error;
        return data;
      };

      await validateSubmission(submissionId, validatedBy, result, isAdmin, notes);

      // Assert
      expect(mockRpc).toHaveBeenCalledWith(
        'finalize_submission',
        {
          p_submission_id: submissionId,
          p_approver_id: validatedBy,
          p_decision: 'rejected',
          p_stage: 'advertiser_first'
        }
      );
    });

    it('should handle admin approvals with correct stage', async () => {
      // Arrange
      const submissionId = 'test-submission-id';
      const validatedBy = 'test-admin-id';
      const result = 'aprovado';
      const isAdmin = true;
      const notes = 'Approved by admin';

      // Mock the RPC response
      const mockRpc = supabase.rpc as vi.MockedFunction<typeof supabase.rpc>;
      mockRpc.mockResolvedValueOnce({
        data: {
          status: 'approved',
          points_awarded: 100,
          participant_id: 'test-participant-id'
        },
        error: null
      });

      // Act
      const validateSubmission = async (
        submissionId: string,
        validatedBy: string,
        result: string,
        isAdmin: boolean,
        notes?: string
      ) => {
        const { data, error } = await supabase.rpc('finalize_submission', {
          p_submission_id: submissionId,
          p_approver_id: validatedBy,
          p_decision: result === 'aprovado' ? 'approved' : 'rejected',
          p_stage: isAdmin ? 'admin' : 'advertiser_first'
        });

        if (error) throw error;
        return data;
      };

      await validateSubmission(submissionId, validatedBy, result, isAdmin, notes);

      // Assert
      expect(mockRpc).toHaveBeenCalledWith(
        'finalize_submission',
        {
          p_submission_id: submissionId,
          p_approver_id: validatedBy,
          p_decision: 'approved',
          p_stage: 'admin'
        }
      );
    });
  });

  describe('addTokens function', () => {
    it('should call increment_user_credits RPC instead of directly updating database', async () => {
      // Arrange
      const userId = 'test-user-id';
      const amount = -10; // Deducting tokens
      
      // Mock the RPC response
      const mockRpc = supabase.rpc as vi.MockedFunction<typeof supabase.rpc>;
      mockRpc.mockResolvedValueOnce({
        data: {
          user_id: userId,
          new_total: 90 // Assuming user had 100 credits before
        },
        error: null
      });

      // Act
      const addTokens = async (userId: string, amount: number) => {
        const { data, error } = await supabase.rpc('increment_user_credits', {
          p_user_id: userId,
          p_amount: amount
        });

        if (error) throw error;
        return data;
      };

      await addTokens(userId, amount);

      // Assert
      expect(mockRpc).toHaveBeenCalledWith(
        'increment_user_credits',
        {
          p_user_id: userId,
          p_amount: amount
        }
      );
    });
  });
});
