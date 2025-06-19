import { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { getSupabaseClient } from '@/services/supabase';
import { toast } from '@/components/ui/use-toast';

interface DesbloqueioData {
  hasUnlocked: boolean;
  canUnlock: boolean;
  rifasBalance: number;
  requiredRifas: number;
}

interface UnlockParams {
  advertiserId: string;
  missionId: string;
}

/**
 * Hook para gerenciar o desbloqueio dos dados demográficos dos participantes
 * Cobra 2 rifas por campanha para acesso aos dados pessoais
 */
export function useDesbloqueioParticipantes(advertiserId: string, missionId: string) {
  const [isUnlocking, setIsUnlocking] = useState(false);
  const queryClient = useQueryClient();

  // Verificar se o anunciante já desbloqueou esta campanha
  const { data: desbloqueioStatus, isLoading } = useQuery<DesbloqueioData>({
    queryKey: ['desbloqueio-status', advertiserId, missionId],
    queryFn: async () => {
      if (!advertiserId || !missionId) {
        return {
          hasUnlocked: false,
          canUnlock: false,
          rifasBalance: 0,
          requiredRifas: 2
        };
      }

      const client = await getSupabaseClient();
      
      try {
        // Verificar se já desbloqueou - usando query builder do Supabase
        const { data: unlockData, error: unlockError } = await client
          .from('advertiser_crm_unlocks')
          .select('id')
          .eq('advertiser_id', advertiserId)
          .eq('mission_id', missionId)
          .maybeSingle();

        if (unlockError) {
          console.warn('Error checking unlock status:', unlockError);
        }

        // Buscar saldo de rifas do anunciante
        const { data: profile } = await client
          .from('profiles')
          .select('rifas')
          .eq('id', advertiserId)
          .single();

        const rifasBalance = profile?.rifas || 0;
        const requiredRifas = 2;
        const hasUnlocked = !!unlockData;

        return {
          hasUnlocked,
          canUnlock: rifasBalance >= requiredRifas,
          rifasBalance,
          requiredRifas
        };
      } catch (error) {
        console.error('Error fetching desbloqueio status:', error);
        return {
          hasUnlocked: false,
          canUnlock: false,
          rifasBalance: 0,
          requiredRifas: 2
        };
      }
    },
    enabled: !!advertiserId && !!missionId
  });

  // Mutation para desbloquear dados usando Edge Function
  const unlockDataMutation = useMutation({
    mutationFn: async ({ advertiserId, missionId }: UnlockParams) => {
      setIsUnlocking(true);
      const client = await getSupabaseClient();

      try {
        // Chamar Edge Function para desbloqueio
        const { data, error } = await client.functions.invoke('unlock-crm-details', {
          body: { advertiserId, missionId }
        });

        if (error) throw error;
        if (data?.error) throw new Error(data.error);

        return data;
      } catch (error) {
        setIsUnlocking(false);
        throw error;
      }
    },
    onSuccess: () => {
      setIsUnlocking(false);
      // Invalidar queries para atualizar dados
      queryClient.invalidateQueries({ queryKey: ['desbloqueio-status'] });
      queryClient.invalidateQueries({ queryKey: ['advertiser-crm'] });
      
      toast({
        title: 'Dados desbloqueados!',
        description: 'Agora você pode visualizar os dados demográficos dos participantes.',
      });
    },
    onError: (error: any) => {
      setIsUnlocking(false);
      toast({
        title: 'Erro ao desbloquear dados',
        description: error.message || 'Ocorreu um erro durante o desbloqueio.',
        variant: 'destructive',
      });
    }
  });

  const unlockData = () => {
    if (!advertiserId || !missionId) return;
    unlockDataMutation.mutate({ advertiserId, missionId });
  };

  return {
    desbloqueioStatus,
    isLoading,
    isUnlocking,
    unlockData,
    canUnlock: desbloqueioStatus?.canUnlock || false,
    hasUnlocked: desbloqueioStatus?.hasUnlocked || false,
    rifasBalance: desbloqueioStatus?.rifasBalance || 0,
    requiredRifas: desbloqueioStatus?.requiredRifas || 2
  };
} 