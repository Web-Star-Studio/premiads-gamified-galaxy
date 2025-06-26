import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/core/useAuth';
import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * Hook para buscar submissões pendentes de validação
 */
export function usePendingSubmissions() {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['advertiser', 'pending-submissions', user?.id],
    queryFn: async () => {
      if (!user) return [];

      const { data, error } = await supabase
        .from('mission_submissions')
        .select(`
          id,
          mission_id,
          user_id,
          status,
          submitted_at,
          submission_data,
          missions!inner (
            id,
            title,
            advertiser_id
          )
        `)
        .eq('missions.advertiser_id', user.id)
        .eq('status', 'pending')
        .order('submitted_at', { ascending: false });

      if (error) {
        console.error('Error fetching pending submissions:', error);
        throw error;
      }

      return data || [];
    },
    enabled: !!user,
    staleTime: 30000, // 30 segundos
    retry: 2,
  });
}

interface PendingSubmissionState {
  fromCampaignCreation?: boolean;
  campaignCreated?: boolean;
  timestamp?: number;
}

/**
 * Hook personalizado para detectar e gerenciar redirecionamentos após criação de campanhas
 * Resolve o problema de estado persistente quando o redirecionamento acontece na mesma rota
 */
export function useCampaignFormReset() {
  const [shouldResetForm, setShouldResetForm] = useState(false);
  const [submissionProcessed, setSubmissionProcessed] = useState(false);
  const location = useLocation();
  
  useEffect(() => {
    const state = location.state as PendingSubmissionState;
    
    // Detectar se chegamos aqui após uma criação de campanha bem-sucedida
    if (state?.fromCampaignCreation && state?.campaignCreated && !submissionProcessed) {
      console.log('🔄 useCampaignFormReset: Detectado redirecionamento de criação de campanha');
      
      // Definir que o formulário deve ser resetado
      setShouldResetForm(true);
      setSubmissionProcessed(true);
      
      // Limpar o estado da navegação imediatamente
      window.history.replaceState({}, document.title);
      
      console.log('✅ useCampaignFormReset: Estado de redirecionamento processado');
    }
  }, [location.state, submissionProcessed]);
  
  const clearResetFlag = () => {
    setShouldResetForm(false);
  };
  
  return {
    shouldResetForm,
    clearResetFlag,
    isRedirectFromCampaignCreation: shouldResetForm
  };
} 