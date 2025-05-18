
import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import SubmissionsList from './SubmissionsList';
import SubmissionsEmptyState from './SubmissionsEmptyState';
import SubmissionsLoading from './SubmissionsLoading';
import { useToast } from '@/hooks/use-toast';
import { useMissionModeration } from '@/hooks/use-mission-moderation.hook';
import { Submission, MissionSubmission } from '@/hooks/useMissionsTypes';
import { toSubmission } from '@/types/missions';

interface ModerationContentProps {
  refreshKey: number;
}

const ModerationContent = ({ refreshKey }: ModerationContentProps) => {
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const { toast } = useToast();
  const { mutate: finalizeMissionSubmission, isPending: isProcessing } = useMissionModeration();
  
  // Fetch submissions that require moderator action
  useEffect(() => {
    const fetchSubmissions = async () => {
      setLoading(true);
      setError(null);
      
      try {
        // Get user ID from session
        const { data: session } = await supabase.auth.getSession();
        const userId = session?.session?.user?.id;
        
        if (!userId) {
          throw new Error('Usuário não autenticado');
        }
        
        // Get all missions created by this advertiser
        const { data: advertiserMissions, error: missionsError } = await supabase
          .from('missions')
          .select('id')
          .eq('advertiser_id', userId);
          
        if (missionsError) throw missionsError;
        
        if (!advertiserMissions || advertiserMissions.length === 0) {
          setSubmissions([]);
          setLoading(false);
          return;
        }
        
        // Get mission IDs
        const missionIds = advertiserMissions.map(m => m.id);
        
        // Get submissions for these missions
        const { data: submissionsData, error: submissionsError } = await supabase
          .from('mission_submissions')
          .select(`
            *,
            user:user_id (
              name,
              avatar_url
            ),
            missions:mission_id (
              title
            )
          `)
          .in('mission_id', missionIds)
          .eq('status', 'pending')
          .order('submitted_at', { ascending: false });
        
        if (submissionsError) throw submissionsError;
        
        // Transform data to match the Submission interface
        const transformedSubmissions = (submissionsData || []).map((sub: any) => ({
          ...sub,
          user_name: sub.user?.name || 'Usuário',
          user_avatar: sub.user?.avatar_url,
          mission_title: sub.missions?.title || 'Missão',
          updated_at: sub.updated_at || sub.submitted_at,
        }));
        
        setSubmissions(transformedSubmissions as Submission[]);
      } catch (err: any) {
        console.error('Error fetching submissions:', err);
        setError(err);
        toast({
          title: 'Erro ao carregar submissões',
          description: err.message,
          variant: 'destructive',
        });
      } finally {
        setLoading(false);
      }
    };
    
    fetchSubmissions();
  }, [refreshKey, toast]);
  
  const handleApprove = async (submission: Submission) => {
    if (!submission?.id) return;
    
    try {
      // Get current user ID
      const { data: session } = await supabase.auth.getSession();
      const approverId = session?.session?.user?.id;
      
      if (!approverId) {
        throw new Error('Usuário não autenticado');
      }
      
      finalizeMissionSubmission({
        submissionId: submission.id,
        approverId,
        decision: 'approve',
        stage: 'advertiser_first'
      });
      
      // Remove this submission from the list
      setSubmissions(prev => prev.filter(s => s.id !== submission.id));
      
    } catch (err: any) {
      console.error('Error approving submission:', err);
      toast({
        title: 'Erro ao aprovar submissão',
        description: err.message,
        variant: 'destructive',
      });
    }
  };
  
  const handleReject = async (submission: Submission, feedback: string = '') => {
    if (!submission?.id) return;
    
    try {
      // Get current user ID
      const { data: session } = await supabase.auth.getSession();
      const approverId = session?.session?.user?.id;
      
      if (!approverId) {
        throw new Error('Usuário não autenticado');
      }
      
      finalizeMissionSubmission({
        submissionId: submission.id,
        approverId,
        decision: 'reject',
        stage: 'advertiser_first'
      });
      
      // Remove this submission from the list
      setSubmissions(prev => prev.filter(s => s.id !== submission.id));
      
    } catch (err: any) {
      console.error('Error rejecting submission:', err);
      toast({
        title: 'Erro ao rejeitar submissão',
        description: err.message,
        variant: 'destructive',
      });
    }
  };
  
  // Show loading state
  if (loading) {
    return <SubmissionsLoading />;
  }
  
  // Show empty state if no submissions
  if (submissions.length === 0) {
    return <SubmissionsEmptyState />;
  }
  
  // Show list of submissions
  return (
    <SubmissionsList 
      submissions={submissions}
      onApprove={handleApprove}
      onReject={handleReject}
      isProcessing={isProcessing}
    />
  );
};

export default ModerationContent;
