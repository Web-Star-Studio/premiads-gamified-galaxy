import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Submission } from '@/types/missions';
import { toSubmission } from '@/types/missions';
import { finalizeMissionSubmission } from '@/lib/submissions/missionModeration';
import AdminSubmissionsList from './AdminSubmissionsList';
import SubmissionsLoading from '@/components/advertiser/moderation/SubmissionsLoading';
import AdminSubmissionsEmptyState from './AdminSubmissionsEmptyState';

interface AdminModerationContentProps {
  refreshKey: number;
  onRefresh: () => void;
}

/**
 * Componente principal de moderação para administradores
 * Gerencia submissões em segunda instância
 */
function AdminModerationContent({ refreshKey }: AdminModerationContentProps) {
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    fetchSecondInstanceSubmissions();
  }, [refreshKey]);

  /**
   * Busca submissões que estão em segunda instância (aguardando moderação do admin)
   */
  const fetchSecondInstanceSubmissions = async () => {
    try {
      setLoading(true);
      setError(null);

      // Buscar submissões em segunda instância
      const { data: submissionsData, error: submissionsError } = await supabase
        .from('mission_submissions')
        .select(`
          *,
          missions!inner(
            id,
            title,
            advertiser_id
          )
        `)
        .eq('status', 'second_instance')
        .eq('second_instance_status', 'pending_admin_review')
        .order('submitted_at', { ascending: false });

      if (submissionsError) {
        throw submissionsError;
      }

      if (submissionsData && submissionsData.length > 0) {
        // Buscar perfis dos usuários
        const userIds = [...new Set(submissionsData.map(sub => sub.user_id))];
        const { data: userProfiles, error: profilesError } = await supabase
          .from('profiles')
          .select('id, full_name, avatar_url')
          .in('id', userIds);

        if (profilesError) {
          console.error('Error fetching user profiles:', profilesError);
        }

        // Mapear perfis dos usuários
        const userProfilesMap = (userProfiles || []).reduce((acc, profile) => {
          acc[profile.id] = profile;
          return acc;
        }, {} as Record<string, any>);

        // Transformar submissões com dados do usuário e missão
        const transformedSubmissions = submissionsData.map(sub => {
          const userProfile = userProfilesMap[sub.user_id] || {};
          
          return toSubmission({
            ...sub,
            user_name: userProfile.full_name || 'Usuário',
            user_avatar: userProfile.avatar_url,
            mission_title: sub.missions?.title || 'Missão',
            user: {
              name: userProfile.full_name || 'Usuário',
              id: sub.user_id,
              avatar_url: userProfile.avatar_url
            },
            missions: {
              title: sub.missions?.title || 'Missão'
            }
          });
        });

        setSubmissions(transformedSubmissions);
      } else {
        setSubmissions([]);
      }
    } catch (err: any) {
      console.error('Error fetching second instance submissions:', err);
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

  /**
   * Aprova uma submissão em segunda instância (retorna para o anunciante)
   */
  const handleApprove = async (submission: Submission) => {
    try {
      console.log(`Admin approving submission ${submission.id} in second instance`);
      
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Usuário não autenticado');
      
      const result = await finalizeMissionSubmission({
        submissionId: submission.id,
        moderatorId: user.id,
        decision: 'approve',
        stage: 'admin',
      });
      
      if (!result.success || result.error) {
        throw new Error(result.error || 'Erro ao aprovar submissão');
      }
      
      console.log('Submission approved by admin successfully:', result);
      
      toast({
        title: "Submissão aprovada",
        description: `Submissão de ${submission.user_name || 'usuário'} foi retornada para o anunciante.`,
      });
      
      // Atualizar lista
      fetchSecondInstanceSubmissions();
      
    } catch (err: any) {
      console.error('Error approving submission:', err);
      toast({
        title: 'Erro ao aprovar submissão',
        description: err.message,
        variant: 'destructive',
      });
    }
  };

  /**
   * Rejeita definitivamente uma submissão em segunda instância
   */
  const handleReject = async (submission: Submission, rejectionReason: string = '') => {
    try {
      console.log(`Admin rejecting submission ${submission.id} in second instance`);
      
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Usuário não autenticado');
      
      const result = await finalizeMissionSubmission({
        submissionId: submission.id,
        moderatorId: user.id,
        decision: 'reject',
        stage: 'admin',
      });
      
      if (!result.success || result.error) {
        throw new Error(result.error || 'Erro ao rejeitar submissão');
      }
      
      // Se houver motivo da rejeição, adicionar aos dados da submissão
      if (rejectionReason) {
        const currentData = submission.submission_data || {};
        await supabase
          .from('mission_submissions')
          .update({ 
            submission_data: { 
              ...currentData, 
              admin_rejection_reason: rejectionReason 
            }
          })
          .eq('id', submission.id);
      }
      
      console.log('Submission rejected by admin successfully:', result);
      
      toast({
        title: "Submissão rejeitada",
        description: `Submissão de ${submission.user_name || 'usuário'} foi rejeitada definitivamente.`,
      });
      
      // Atualizar lista
      fetchSecondInstanceSubmissions();
      
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
      {loading && <SubmissionsLoading />}
      {!loading && error && (
        <div className="text-red-500">
          Erro ao carregar submissões: {error.message}
        </div>
      )}
      {!loading && !error && submissions.length === 0 && (
        <AdminSubmissionsEmptyState />
      )}
      {!loading && !error && submissions.length > 0 && (
        <AdminSubmissionsList 
          submissions={submissions}
          onApprove={handleApprove}
          onReject={handleReject}
        />
      )}
    </div>
  );
}

export default AdminModerationContent;
