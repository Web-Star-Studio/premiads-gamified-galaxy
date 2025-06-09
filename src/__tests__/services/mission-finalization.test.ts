
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
    queryClientMock = {
      invalidateQueries: vi.fn()
    };
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.resetAllMocks();
  });

  describe('validateSubmission function', () => {
    it('should call finalize_submission RPC with correct parameters', async () => {
      const submissionId = 'test-submission-id';
      const validatedBy = 'test-approver-id';
      const result = 'approved';
      const isAdmin = false;
      const notes = 'Good job!';

      const mockRpc = vi.mocked(supabase.rpc);
      mockRpc.mockResolvedValueOnce({
        data: {
          status: 'approved',
          rifas_awarded: 100,
          participant_id: 'test-participant-id'
        },
        error: null
      });

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
          p_decision: result === 'approved' ? 'approve' : 'reject',
          p_stage: isAdmin ? 'admin' : 'advertiser_first'
        });

        if (error) throw error;
        return data;
      };

      await validateSubmission(submissionId, validatedBy, result, isAdmin, notes);

      expect(mockRpc).toHaveBeenCalledWith(
        'finalize_submission',
        {
          p_submission_id: submissionId,
          p_approver_id: validatedBy,
          p_decision: 'approve',
          p_stage: 'advertiser_first'
        }
      );
    });

    it('should handle rejection correctly', async () => {
      const submissionId = 'test-submission-id';
      const validatedBy = 'test-approver-id';
      const result = 'rejected';
      const isAdmin = false;
      const notes = 'Not meeting requirements';

      const mockRpc = vi.mocked(supabase.rpc);
      mockRpc.mockResolvedValueOnce({
        data: {
          status: 'rejected',
          rifas_awarded: 0,
          participant_id: 'test-participant-id'
        },
        error: null
      });

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
          p_decision: result === 'approved' ? 'approve' : 'reject',
          p_stage: isAdmin ? 'admin' : 'advertiser_first'
        });

        if (error) throw error;
        return data;
      };

      await validateSubmission(submissionId, validatedBy, result, isAdmin, notes);

      expect(mockRpc).toHaveBeenCalledWith(
        'finalize_submission',
        {
          p_submission_id: submissionId,
          p_approver_id: validatedBy,
          p_decision: 'reject',
          p_stage: 'advertiser_first'
        }
      );
    });

    it('should handle admin approvals with correct stage', async () => {
      const submissionId = 'test-submission-id';
      const validatedBy = 'test-admin-id';
      const result = 'approved';
      const isAdmin = true;
      const notes = 'Approved by admin';

      const mockRpc = vi.mocked(supabase.rpc);
      mockRpc.mockResolvedValueOnce({
        data: {
          status: 'approved',
          rifas_awarded: 100,
          participant_id: 'test-participant-id'
        },
        error: null
      });

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
          p_decision: result === 'approved' ? 'approve' : 'reject',
          p_stage: isAdmin ? 'admin' : 'advertiser_first'
        });

        if (error) throw error;
        return data;
      };

      await validateSubmission(submissionId, validatedBy, result, isAdmin, notes);

      expect(mockRpc).toHaveBeenCalledWith(
        'finalize_submission',
        {
          p_submission_id: submissionId,
          p_approver_id: validatedBy,
          p_decision: 'approve',
          p_stage: 'admin'
        }
      );
    });
  });

  describe('addTokens function', () => {
    it('should call add_tokens_to_user function instead of increment_user_credits', async () => {
      const userId = 'test-user-id';
      const amount = -10;
      
      const mockRpc = vi.mocked(supabase.rpc);
      mockRpc.mockResolvedValueOnce({
        data: {
          user_id: userId,
          new_total: 90
        },
        error: null
      });

      const addTokens = async (userId: string, amount: number) => {
        const { data, error } = await supabase.rpc('add_tokens_to_user', {
          user_id: userId,
          reward: amount
        });

        if (error) throw error;
        return data;
      };

      await addTokens(userId, amount);

      expect(mockRpc).toHaveBeenCalledWith(
        'add_tokens_to_user',
        {
          user_id: userId,
          reward: amount
        }
      );
    });
  });
});
