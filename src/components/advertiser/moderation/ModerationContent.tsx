
import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import SubmissionsList from './SubmissionsList';
import SubmissionsEmptyState from './SubmissionsEmptyState';
import SubmissionsLoading from './SubmissionsLoading';
import { useToast } from '@/hooks/use-toast';
import { Submission, toSubmission } from '@/types/missions';
import { Button } from "@/components/ui/button";
import { finalizeMissionSubmission } from '@/lib/submissions/missionModeration';
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "@/components/ui/select";

// Mapeamento de abas para status do DB
const tabStatusMap: Record<string, string> = {
  pendentes: 'pending_approval',
  aprovadas: 'approved',
  rejeitadas: 'rejected',
  segunda_instancia: 'second_instance_pending',
  retornadas: 'returned_to_advertiser',
};

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
  const [activeTab, setActiveTab] = useState<string>('pendentes'); 
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
      
      const dbStatus = tabStatusMap[activeTab];
      if (!dbStatus) {
        console.warn(`Status de banco de dados não encontrado para a aba: ${activeTab}`);
        setLoading(false);
        return;
      }
      
      // Fixed query - use status from map
      let submissionsQuery = supabase
        .from('mission_submissions')
        .select('*');
        
      if (selectedMissionId === 'all') {
        submissionsQuery = submissionsQuery.in('mission_id', missionIds)
      } else {
        submissionsQuery = submissionsQuery.eq('mission_id', selectedMissionId)
      }
      
      // Filter by status
      submissionsQuery = submissionsQuery.eq('status', dbStatus).order('submitted_at', { ascending: false })
      
      const { data: submissionsData, error: submissionsError } = await submissionsQuery;
      
      if (submissionsError) throw submissionsError;
      
      console.log('Submissions found:', submissionsData?.length || 0);
      
      // Now fetch user profiles and mission titles separately
      if (submissionsData && submissionsData.length > 0) {
        // Get unique user IDs from submissions
        const userIds = [...new Set(submissionsData.map(sub => sub.user_id))];
        
        // Fetch user profiles
        const { data: profilesData, error: profilesError } = await supabase
          .from('profiles')
          .select('id, full_name, avatar_url')
          .in('id', userIds);
          
        if (profilesError) throw profilesError;
        
        // Create a map of mission IDs to titles
        const missionTitlesMap = missionsData.reduce((acc, mission) => {
          acc[mission.id] = mission.title;
          return acc;
        }, {} as Record<string, string>);
        
        // Create a map of user IDs to profiles
        const userProfilesMap = (profilesData || []).reduce((acc, profile) => {
          acc[profile.id] = profile;
          return acc;
        }, {} as Record<string, any>);
        
        // Transform submissions with user and mission data
        const transformedSubmissions = submissionsData.map(sub => {
          const userProfile = userProfilesMap[sub.user_id] || {};
          
          return toSubmission({
            ...sub,
            user_name: userProfile.full_name || 'Usuário',
            user_avatar: userProfile.avatar_url,
            mission_title: missionTitlesMap[sub.mission_id] || 'Missão',
            user: {
              name: userProfile.full_name || 'Usuário',
              id: sub.user_id,
              avatar_url: userProfile.avatar_url
            },
            missions: {
              title: missionTitlesMap[sub.mission_id] || 'Missão'
            }
          });
        });
        
        setSubmissions(transformedSubmissions);
      } else {
        setSubmissions([]);
      }
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
      
      // Use the finalizeMissionSubmission function
      const result = await finalizeMissionSubmission({
        submissionId: submission.id,
        approverId,
        decision: 'approve',
        stage: submission.second_instance ? 'advertiser_second' : 'advertiser_first'
      });
      
      if (!result.success || result.error) {
        throw new Error(result.error || 'Erro ao aprovar submissão');
      }
      
      console.log('Submission approved successfully:', result);
      
      // Show success toast
      toast({
        title: "Submissão aprovada",
        description: `Submissão de ${submission.user_name || 'usuário'} foi aprovada com sucesso!`,
      });
      
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
  
  const handleReject = async (submission: Submission, rejectionReason: string = '') => {
    try {
      const { data: session } = await supabase.auth.getSession();
      const approverId = session?.session?.user?.id;
      
      if (!approverId) {
        throw new Error('Usuário não autenticado');
      }
      
      console.log(`Rejecting submission ${submission.id}, second instance: ${submission.second_instance}`);
      
      // Use the finalizeMissionSubmission function
      const result = await finalizeMissionSubmission({
        submissionId: submission.id,
        approverId,
        decision: 'reject',
        stage: submission.second_instance ? 'advertiser_second' : 'advertiser_first'
      });
      
      if (!result.success || result.error) {
        throw new Error(result.error || 'Erro ao rejeitar submissão');
      }
      
      // If rejection reason is provided, add to submission_data
      if (rejectionReason) {
        const currentData = submission.submission_data || {};
        await supabase
          .from('mission_submissions')
          .update({ 
            submission_data: { 
              ...currentData, 
              rejection_reason: rejectionReason 
            }
          })
          .eq('id', submission.id);
      }
      
      console.log('Submission rejected successfully:', result);
      
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
  
  const TABS = [
    { id: 'pendentes', label: 'Pendentes' },
    { id: 'aprovadas', label: 'Aprovadas' },
    { id: 'rejeitadas', label: 'Rejeitadas' },
    { id: 'segunda_instancia', label: 'Segunda Instância' },
    { id: 'retornadas', label: 'Retornadas' },
  ];

  return (
    <div>
      {/* Mission filter dropdown */}
      <div className="mb-4">
        <Select aria-label="Selecione Missão" value={selectedMissionId} onValueChange={setSelectedMissionId}>
          <SelectTrigger className="flex h-10 w-full max-w-full items-center justify-between rounded-md border border-galaxy-purple bg-galaxy-dark px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-galaxy-purple focus:ring-offset-2">
            <SelectValue placeholder="Todas as Missões" />
          </SelectTrigger>
          <SelectContent className="w-[var(--radix-select-trigger-width)] bg-galaxy-dark border border-galaxy-purple text-white">
            <SelectItem value="all">Todas as Missões</SelectItem>
            {missions.map(m => (
              <SelectItem key={m.id} value={m.id}>{m.title}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      {/* Status tabs */}
      <div className="border-b border-white/10 mb-4">
        <div className="flex space-x-4">
          {TABS.map((tab) => (
            <Button
              key={tab.id}
              variant="ghost"
              onClick={() => setActiveTab(tab.id)}
              className={`px-3 py-2 text-sm font-medium rounded-t-md transition-colors duration-200
                ${activeTab === tab.id
                  ? 'border-b-2 border-galaxy-blue text-white' 
                  : 'text-gray-400 hover:text-white'
                }`
              }
            >
              {tab.label}
            </Button>
          ))}
        </div>
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
