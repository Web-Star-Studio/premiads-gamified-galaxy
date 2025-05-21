
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { finalizeMissionSubmission } from '@/lib/submissions/missionModeration';
import { useToast } from './use-toast';

export type ValidationResult = 'approve' | 'reject';

export const useMissionModeration = () => {
  const [processing, setProcessing] = useState(false);
  const { toast } = useToast();

  const handleSubmission = async ({
    submissionId,
    decision,
    stage,
    feedback
  }: {
    submissionId: string;
    decision: 'approve' | 'reject';
    stage: 'advertiser_first' | 'admin' | 'advertiser_second';
    feedback?: string;
  }) => {
    if (!submissionId) {
      toast({
        title: 'Erro',
        description: 'ID da submissão é obrigatório',
        variant: 'destructive',
      });
      return { success: false };
    }

    setProcessing(true);

    try {
      // Get current user
      const { data: userData, error: userError } = await supabase.auth.getUser();
      
      if (userError || !userData.user) {
        throw new Error('Usuário não autenticado');
      }

      const approverId = userData.user.id;

      // Process submission
      const result = await finalizeMissionSubmission({
        submissionId,
        approverId,
        decision,
        stage,
        feedback
      });

      if (!result.success) {
        throw new Error(result.error || 'Erro ao processar submissão');
      }

      const successMessage = decision === 'approve' 
        ? 'Submissão aprovada com sucesso' 
        : 'Submissão rejeitada';

      toast({
        title: 'Sucesso',
        description: successMessage,
      });

      return result;
    } catch (error: any) {
      console.error('Error handling submission:', error);
      toast({
        title: 'Erro',
        description: error.message || 'Ocorreu um erro ao processar a submissão',
        variant: 'destructive',
      });
      return { success: false };
    } finally {
      setProcessing(false);
    }
  };

  return {
    processing,
    handleSubmission
  };
};
