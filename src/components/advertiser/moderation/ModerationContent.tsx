import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import SubmissionsList from './SubmissionsList';
import SubmissionsEmptyState from './SubmissionsEmptyState';
import SubmissionsLoading from './SubmissionsLoading';
import { useToast } from '@/hooks/use-toast';
import { useMissionModeration } from '@/hooks/use-mission-moderation.hook';
import { Submission, MissionSubmission } from '@/types/missions';
import { Button } from "@/components/ui/button";

interface ModerationContentProps {
  refreshKey: number;
}

interface FilterOptions {
  status: string;
  searchQuery: string;
}

export interface SubmissionsEmptyStateProps {
  activeTab: string;
}

const ModerationContent = ({ refreshKey }: ModerationContentProps) => {
  const [missions, setMissions] = useState<{ id: string; title: string }[]>([])
  const [selectedMissionId, setSelectedMissionId] = useState<string>('all')
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [activeTab, setActiveTab] = useState<string>('pending'); 
  const { toast } = useToast();
  const { mutate: finalizeMissionSubmission, isPending: isProcessing } = useMissionModeration();
  
  // Fetch missions and submissions
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      
      try {
        // Get user ID from session
        const { data: session } = await supabase.auth.getSession();
        const userId = session?.session?.user?.id;
        
        if (!userId) throw new Error('Usuário não autenticado');
        
        // Get all missions for this advertiser
        const { data: missionsData, error: missionsError } = await supabase
          .from('missions')
          .select('id, title')
          .eq('advertiser_id', userId);
        if (missionsError) throw missionsError;
        if (!missionsData || missionsData.length === 0) {
          setMissions([])
          setSubmissions([]);
          setLoading(false);
          return;
        }
        setMissions(missionsData)
        const missionIds = missionsData.map(m => m.id);
        
        // Get submissions for selected mission(s)
        let submissionsQuery = supabase
          .from('mission_submissions')
          .select(
            `*, user:user_id(profiles(full_name, avatar_url)), missions:mission_id(title)`
          );
        if (selectedMissionId === 'all') {
          submissionsQuery = submissionsQuery.in('mission_id', missionIds)
        } else {
          submissionsQuery = submissionsQuery.eq('mission_id', selectedMissionId)
        }
        submissionsQuery = submissionsQuery.eq('status', activeTab).order('submitted_at', { ascending: false })
        const { data: submissionsData, error: submissionsError } = await submissionsQuery;
        if (submissionsError) throw submissionsError;
        
        // Transform data to match the Submission interface
        const transformedSubmissions = (submissionsData || []).map((sub: any) => ({
          ...sub,
          user_name: sub.user?.full_name || 'Usuário',
          user_avatar: sub.user?.avatar_url,
          mission_title: sub.missions?.title || 'Missão',
          updated_at: sub.updated_at || sub.submitted_at,
        })) as Submission[];
        setSubmissions(transformedSubmissions);
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
    }
    fetchData();
  }, [refreshKey, toast, activeTab, selectedMissionId]);
  
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
        stage: submission.second_instance ? 'advertiser_second' : 'advertiser_first'
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
        stage: submission.second_instance ? 'advertiser_second' : 'advertiser_first'
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
  
  return (
    <div>
      {/* Mission filter dropdown */}
      <div className="mb-4">
        <label htmlFor="missionSelect" className="sr-only">Selecione Missão</label>
        <select
          id="missionSelect"
          value={selectedMissionId}
          onChange={e => setSelectedMissionId(e.target.value)}
          className="px-3 py-2 rounded-md bg-galaxy-dark border border-galaxy-purple text-white"
        >
          <option value="all">Todas as Missões</option>
          {missions.map(m => (
            <option key={m.id} value={m.id}>{m.title}</option>
          ))}
        </select>
      </div>
      {/* Status tabs */}
      <div className="mb-4 flex space-x-2">
        <Button
          variant={activeTab === 'pending' ? 'default' : 'outline'}
          onClick={() => setActiveTab('pending')}
        >
          Pendentes
        </Button>
        <Button
          variant={activeTab === 'approved' ? 'default' : 'outline'}
          onClick={() => setActiveTab('approved')}
        >
          Aprovadas
        </Button>
        <Button
          variant={activeTab === 'rejected' ? 'default' : 'outline'}
          onClick={() => setActiveTab('rejected')}
        >
          Rejeitadas
        </Button>
         <Button
          variant={activeTab === 'second_instance_pending' ? 'default' : 'outline'}
          onClick={() => setActiveTab('second_instance_pending')}
        >
          Segunda Instância
        </Button>
        <Button
          variant={activeTab === 'returned_to_advertiser' ? 'default' : 'outline'}
          onClick={() => setActiveTab('returned_to_advertiser')}
        >
          Retornadas
        </Button>
      </div>

      {loading && <SubmissionsLoading />}
      {!loading && error && (
        <div className="text-red-500">
          Erro ao carregar submissões: {error.message}
        </div>
      )}
      {!loading && !error && submissions.length === 0 && (
        <SubmissionsEmptyState activeTab={activeTab} />
      )}
      {!loading && !error && submissions.length > 0 && (
        <SubmissionsList 
          submissions={submissions}
          onApprove={handleApprove}
          onReject={handleReject}
        />
      )}
    </div>
  );
};

export type { Submission, FilterOptions };
export default ModerationContent;
