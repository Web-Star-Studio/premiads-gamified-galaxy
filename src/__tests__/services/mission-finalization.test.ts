
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { finalizeMissionSubmission } from '@/lib/submissions/missionModeration';
import { supabase } from '@/integrations/supabase/client';

// Mock do Supabase
vi.mock('@/integrations/supabase/client', () => ({
  supabase: {
    functions: {
      invoke: vi.fn(),
    },
  },
}));

describe('Mission Finalization Service', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('finalizeMissionSubmission', () => {
    it('should successfully approve first instance submission', async () => {
      const mockResponse = {
        data: { success: true, message: 'Submission approved successfully' },
        error: null,
      };

      vi.mocked(supabase.functions.invoke).mockResolvedValue(mockResponse);

      const result = await finalizeMissionSubmission({
        submissionId: 'test-submission-id',
        moderatorId: 'test-moderator-id',
        decision: 'approve',
        stage: 'advertiser_first',
      });

      expect(result.success).toBe(true);
      expect(supabase.functions.invoke).toHaveBeenCalledWith('moderate-mission-submission', {
        body: {
          submission_id: 'test-submission-id',
          action: 'ADVERTISER_APPROVE_FIRST_INSTANCE',
        },
      });
    });

    it('should successfully reject to second instance', async () => {
      const mockResponse = {
        data: { success: true, message: 'Submission sent to second instance' },
        error: null,
      };

      vi.mocked(supabase.functions.invoke).mockResolvedValue(mockResponse);

      const result = await finalizeMissionSubmission({
        submissionId: 'test-submission-id',
        moderatorId: 'test-moderator-id',
        decision: 'reject',
        stage: 'advertiser_first',
      });

      expect(result.success).toBe(true);
      expect(supabase.functions.invoke).toHaveBeenCalledWith('moderate-mission-submission', {
        body: {
          submission_id: 'test-submission-id',
          action: 'ADVERTISER_REJECT_TO_SECOND_INSTANCE',
        },
      });
    });

    it('should handle edge function errors', async () => {
      const mockError = {
        data: null,
        error: { message: 'Edge function error' },
      };

      vi.mocked(supabase.functions.invoke).mockResolvedValue(mockError);

      const result = await finalizeMissionSubmission({
        submissionId: 'test-submission-id',
        moderatorId: 'test-moderator-id',
        decision: 'approve',
        stage: 'advertiser_first',
      });

      expect(result.success).toBe(false);
      expect(result.error).toBe('Edge function error');
    });

    it('should handle invalid stage/decision combinations', async () => {
      const result = await finalizeMissionSubmission({
        submissionId: 'test-submission-id',
        moderatorId: 'test-moderator-id',
        decision: 'approve' as any,
        stage: 'invalid_stage' as any,
      });

      expect(result.success).toBe(false);
      expect(result.error).toContain('Ação de moderação inválida');
    });

    it('should handle permission denied errors', async () => {
      const mockError = {
        data: null,
        error: { message: "Permission denied: User is not an 'advertiser'" },
      };

      vi.mocked(supabase.functions.invoke).mockResolvedValue(mockError);

      const result = await finalizeMissionSubmission({
        submissionId: 'test-submission-id',
        moderatorId: 'test-moderator-id',
        decision: 'approve',
        stage: 'advertiser_first',
      });

      expect(result.success).toBe(false);
      expect(result.error).toBe("Permission denied: User is not an 'advertiser'");
    });
  });
});
