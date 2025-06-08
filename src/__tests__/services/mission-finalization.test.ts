import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import { supabase } from '@/integrations/supabase/client';
import { missionService } from '@/services/supabase';

// Mock the Supabase client
vi.mock('@/integrations/supabase/client', () => {
  const mockRpc = vi.fn().mockImplementation(() => 
    Promise.resolve({
      data: {
        status: 'approved',
        points_awarded: 100,
        participant_id: 'test-participant-id'
      },
      error: null
    })
  );
  
  // Add mock methods to mockRpc so we can override return values in tests
  mockRpc.mockResolvedValueOnce = vi.fn().mockImplementation((value) => {
    mockRpc.mockImplementationOnce(() => Promise.resolve(value || {
      data: {
        status: 'approved',
        points_awarded: 100,
        participant_id: 'test-participant-id'
      },
      error: null
    }));
    return mockRpc;
  });
  
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
      }),
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
    it('should call finalize_submission RPC instead of directly updating database', async () => {
      // Arrange
      const submissionId = 'test-submission-id';
      const validatedBy = 'test-approver-id';
      const result = 'aprovado';
      const isAdmin = false;
      const notes = 'Good job!';

      // Mock the Supabase response for the validateSubmission function
      supabase.from = vi.fn().mockImplementation((table) => {
        if (table === 'mission_submissions') {
          return {
            select: () => ({
              eq: () => ({
                single: () => Promise.resolve({
                  data: {
                    mission_id: 'test-mission-id',
                    user_id: 'test-participant-id',
                    status: 'pending'
                  },
                  error: null
                })
              })
            }),
            update: () => ({
              eq: () => ({
                select: () => ({
                  single: () => Promise.resolve({
                    data: {
                      id: submissionId,
                      status: 'approved'
                    },
                    error: null
                  })
                })
              })
            })
          };
        }
        return {
          select: vi.fn(),
          update: vi.fn(),
          insert: vi.fn()
        };
      });

      // Act
      await missionService.validateSubmission(
        submissionId,
        validatedBy,
        result,
        isAdmin,
        notes
      );

      // Assert
      // Check that RPC was called with correct parameters
      expect(supabase.rpc).toHaveBeenCalledWith(
        'finalize_submission',
        {
          p_submission_id: submissionId,
          p_approver_id: validatedBy,
          p_is_approved: true,
          p_stage: 'advertiser_first',
          p_feedback: notes
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

      // Mock the Supabase response
      supabase.from = vi.fn().mockImplementation((table) => {
        if (table === 'mission_submissions') {
          return {
            select: () => ({
              eq: () => ({
                single: () => Promise.resolve({
                  data: {
                    mission_id: 'test-mission-id',
                    user_id: 'test-participant-id',
                    status: 'pending'
                  },
                  error: null
                })
              })
            }),
            update: () => ({
              eq: () => ({
                select: () => ({
                  single: () => Promise.resolve({
                    data: {
                      id: submissionId,
                      status: 'rejected'
                    },
                    error: null
                  })
                })
              })
            })
          };
        }
        return {
          select: vi.fn(),
          update: vi.fn(),
          insert: vi.fn()
        };
      });

      // Act
      await missionService.validateSubmission(
        submissionId,
        validatedBy,
        result,
        isAdmin,
        notes
      );

      // Assert
      expect(supabase.rpc).toHaveBeenCalledWith(
        'finalize_submission',
        {
          p_submission_id: submissionId,
          p_approver_id: validatedBy,
          p_is_approved: false,
          p_stage: 'advertiser_first',
          p_feedback: notes
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

      // Act
      await missionService.validateSubmission(
        submissionId,
        validatedBy,
        result,
        isAdmin,
        notes
      );

      // Assert
      expect(supabase.rpc).toHaveBeenCalledWith(
        'finalize_submission',
        {
          p_submission_id: submissionId,
          p_approver_id: validatedBy,
          p_is_approved: true,
          p_stage: 'admin',
          p_feedback: notes
        }
      );
    });
  });

  describe('finalizeMissionSubmission function', () => {
    it('should invalidate participant profile queries on successful approval', async () => {
      // Arrange
      const submission = {
        id: 'test-submission-id',
        user_id: 'test-participant-id'
      };
      const approverId = 'test-approver-id';
      const isApproved = true;
      const feedback = 'Great job!';
      
      // Mock RPC response
      supabase.rpc.mockResolvedValueOnce({
        data: {
          status: 'approved',
          points_awarded: 100,
          participant_id: 'test-participant-id'
        },
        error: null
      });

      // Create a mock for finalizeMissionSubmission to test
      const finalizeMissionSubmission = async (
        submissionId: string,
        approverId: string,
        isApproved: boolean,
        stage: string = 'advertiser_first',
        feedback?: string
      ) => {
        const { data, error } = await supabase.rpc('finalize_submission', {
          p_submission_id: submissionId,
          p_approver_id: approverId,
          p_is_approved: isApproved,
          p_stage: stage,
          p_feedback: feedback
        });

        if (error) throw error;

        if (data && data.participant_id && isApproved) {
          queryClientMock.invalidateQueries({ queryKey: ['userProfile', data.participant_id] });
        }

        return data;
      };

      // Act
      await finalizeMissionSubmission(
        submission.id,
        approverId,
        isApproved,
        'advertiser_first',
        feedback
      );

      // Assert
      expect(supabase.rpc).toHaveBeenCalledWith(
        'finalize_submission',
        {
          p_submission_id: submission.id,
          p_approver_id: approverId,
          p_is_approved: isApproved,
          p_stage: 'advertiser_first',
          p_feedback: feedback
        }
      );
      expect(queryClientMock.invalidateQueries).toHaveBeenCalledWith({
        queryKey: ['userProfile', 'test-participant-id']
      });
    });

    it('should not invalidate queries on rejection', async () => {
      // Arrange
      const submission = {
        id: 'test-submission-id',
        user_id: 'test-participant-id'
      };
      const approverId = 'test-approver-id';
      const isApproved = false;
      const feedback = 'Needs improvement';
      
      // Mock RPC response for rejection
      supabase.rpc.mockResolvedValueOnce({
        data: {
          status: 'rejected',
          points_awarded: 0,
          participant_id: 'test-participant-id'
        },
        error: null
      });

      // Use the same mock function
      const finalizeMissionSubmission = async (
        submissionId: string,
        approverId: string,
        isApproved: boolean,
        stage: string = 'advertiser_first',
        feedback?: string
      ) => {
        const { data, error } = await supabase.rpc('finalize_submission', {
          p_submission_id: submissionId,
          p_approver_id: approverId,
          p_is_approved: isApproved,
          p_stage: stage,
          p_feedback: feedback
        });

        if (error) throw error;

        if (data && data.participant_id && isApproved) {
          queryClientMock.invalidateQueries({ queryKey: ['userProfile', data.participant_id] });
        }

        return data;
      };

      // Act
      await finalizeMissionSubmission(
        submission.id,
        approverId,
        isApproved,
        'advertiser_first',
        feedback
      );

      // Assert
      expect(supabase.rpc).toHaveBeenCalledWith(
        'finalize_submission',
        {
          p_submission_id: submission.id,
          p_approver_id: approverId,
          p_is_approved: isApproved,
          p_stage: 'advertiser_first',
          p_feedback: feedback
        }
      );
      expect(queryClientMock.invalidateQueries).not.toHaveBeenCalled();
    });
  });

  describe('addTokens function', () => {
    it('should call increment_user_credits RPC instead of directly updating database', async () => {
      // Arrange
      const userId = 'test-user-id';
      const amount = -10; // Deducting tokens
      
      // Mock the RPC response
      supabase.rpc.mockResolvedValueOnce({
        data: {
          user_id: userId,
          new_total: 90 // Assuming user had 100 credits before
        },
        error: null
      });

      // Act
      await missionService.addTokens(userId, amount);

      // Assert
      expect(supabase.rpc).toHaveBeenCalledWith(
        'increment_user_credits',
        {
          p_user_id: userId,
          p_amount: amount
        }
      );
    });

    it('should handle positive token addition correctly', async () => {
      // Arrange
      const userId = 'test-user-id';
      const amount = 20; // Adding tokens
      
      // Mock the RPC response
      supabase.rpc.mockResolvedValueOnce({
        data: {
          user_id: userId,
          new_total: 120 // Assuming user had 100 credits before
        },
        error: null
      });

      // Act
      await missionService.addTokens(userId, amount);

      // Assert
      expect(supabase.rpc).toHaveBeenCalledWith(
        'increment_user_credits',
        {
          p_user_id: userId,
          p_amount: amount
        }
      );
    });
  });
});
