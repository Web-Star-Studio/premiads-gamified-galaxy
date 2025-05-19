
import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import SubmissionsList from './SubmissionsList';
import SubmissionsEmptyState from './SubmissionsEmptyState';
import SubmissionsLoading from './SubmissionsLoading';
import { useToast } from '@/hooks/use-toast';
import { Submission, toSubmission } from '@/types/missions';
import { Button } from "@/components/ui/button";

interface ModerationContentProps {
  refreshKey: number;
}

export interface FilterOptions {
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
  
  // Set up real-time listener for mission submissions
  useEffect(() => {
    console.log('Setting up realtime channel for mission_submissions');
    
    // Subscribe to mission_submissions changes
    const channel = supabase
      .channel('mission-submissions-changes')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'mission_submissions'
      }, (payload) => {
        console.log('Mission submission change detected:', payload);
        // Refresh data when changes occur
        fetchData();
      })
      .subscribe();
      
    // Clean up subscription
    return () => {
      console.log('Cleaning up realtime channel');
      supabase.removeChannel(channel);
    };
  }, []);
  
  // Fetch missions and submissions
  useEffect(() => {
    fetchData();
  }, [refreshKey, activeTab, selectedMissionId]);
  
  const fetchData = async () => {
    setLoading(true);
    setError(null);
    
    try {
      // Get user ID from session
      const { data: session } = await supabase.auth.getSession();
      const userId = session?.session?.user?.id;
      
      if (!userId) throw new Error('Usuário não autenticado');
      
      console.log('Fetching missions for user:', userId);
      
      // Get all missions for this advertiser using created_by field
      const { data: missionsData, error: missionsError } = await supabase
        .from('missions')
        .select('id, title')
        .eq('created_by', userId);
        
      if (missionsError) throw missionsError;
      
      console.log('Missions found:', missionsData?.length || 0);
      
      if (!missionsData || missionsData.length === 0) {
        setMissions([])
        setSubmissions([]);
        setLoading(false);
        return;
      }
      
      setMissions(missionsData)
      const missionIds = missionsData.map(m => m.id);
      
      console.log('Fetching submissions for mission IDs:', missionIds);
      console.log('Current active tab:', activeTab);
      
      // Get submissions for selected mission(s)
      let submissionsQuery = supabase
        .from('mission_submissions')
        .select(
          `*, 
          user:user_id(profiles(full_name, avatar_url)), 
          missions:mission_id(title)`
        );
        
      if (selectedMissionId === 'all') {
        submissionsQuery = submissionsQuery.in('mission_id', missionIds)
      } else {
        submissionsQuery = submissionsQuery.eq('mission_id', selectedMissionId)
      }
      
      // Filter by status
      submissionsQuery = submissionsQuery.eq('status', activeTab).order('submitted_at', { ascending: false })
      
      const { data: submissionsData, error: submissionsError } = await submissionsQuery;
      
      if (submissionsError) throw submissionsError;
      
      console.log('Submissions found:', submissionsData?.length || 0);
      
      // Transform data to match the Submission interface
      const transformedSubmissions = (submissionsData || []).map((sub: any) => {
        return toSubmission({
          ...sub,
          user_name: sub.user?.profiles?.[0]?.full_name || 'Usuário',
          user_avatar: sub.user?.profiles?.[0]?.avatar_url,
          mission_title: sub.missions?.title || 'Missão',
          updated_at: sub.updated_at || sub.submitted_at,
        });
      }) as Submission[];
      
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
  
  const handleApprove = async (submission: Submission) => {
    try {
      const { data: session } = await supabase.auth.getSession();
      const approverId = session?.session?.user?.id;
      
      if (!approverId) {
        throw new Error('Usuário não autenticado');
      }
      
      console.log(`Approving submission ${submission.id}, second instance: ${submission.second_instance}`);
      
      // Call finalize_submission RPC directly
      const { data, error } = await supabase.rpc('finalize_submission', {
        p_submission_id: submission.id,
        p_approver_id: approverId,
        p_decision: 'approve',
        p_stage: submission.second_instance ? 'advertiser_second' : 'advertiser_first'
      });
      
      if (error) throw error;
      
      console.log('Submission approved successfully:', data);
      
      // Show success toast
      toast({
        title: "Submissão aprovada",
        description: `Submissão de ${submission.user_name || 'usuário'} foi aprovada com sucesso! ${data.points_awarded} pontos e ${data.tokens_awarded} tokens atribuídos.`,
      });
      
      // Play sound effect
      // This would require importing and using the useSounds hook
      
      // Refetch data
      fetchData();
      
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
    try {
      const { data: session } = await supabase.auth.getSession();
      const approverId = session?.session?.user?.id;
      
      if (!approverId) {
        throw new Error('Usuário não autenticado');
      }
      
      console.log(`Rejecting submission ${submission.id}, second instance: ${submission.second_instance}`);
      
      // Call finalize_submission RPC directly
      const { data, error } = await supabase.rpc('finalize_submission', {
        p_submission_id: submission.id,
        p_approver_id: approverId,
        p_decision: 'reject',
        p_stage: submission.second_instance ? 'advertiser_second' : 'advertiser_first'
      });
      
      if (error) throw error;
      
      // If feedback is provided, update the submission
      if (feedback) {
        await supabase
          .from('mission_submissions')
          .update({ feedback })
          .eq('id', submission.id);
      }
      
      console.log('Submission rejected successfully:', data);
      
      // Show success toast
      toast({
        title: "Submissão rejeitada",
        description: `Submissão de ${submission.user_name || 'usuário'} foi rejeitada.`,
      });
      
      // Refetch data
      fetchData();
      
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

export default ModerationContent;
