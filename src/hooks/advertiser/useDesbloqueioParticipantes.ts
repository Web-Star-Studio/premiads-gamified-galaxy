import { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { getSupabaseClient } from '@/services/supabase';
import { toast } from '@/components/ui/use-toast';

interface DesbloqueioData {
  hasUnlocked: boolean;
  canUnlock: boolean;
  rifasBalance: number;
  requiredRifas: number;
  participantDemographics?: {
    age?: string;
    gender?: string;
    location?: string;
    income?: string;
    profession?: string;
    education?: string;
    interests?: string[];
    maritalStatus?: string;
  };
}

interface UnlockParams {
  advertiserId: string;
  participantId: string;
  missionId: string;
}

/**
 * Hook para gerenciar o desbloqueio dos dados demográficos dos participantes
 * Agora cobra 2 rifas por participante individual para acesso aos dados pessoais
 */
export function useDesbloqueioParticipante(advertiserId: string, participantId: string, missionId: string) {
  const [isUnlocking, setIsUnlocking] = useState(false);
  const queryClient = useQueryClient();

  // Verificar se o anunciante já desbloqueou este participante específico
  const { data: desbloqueioStatus, isLoading } = useQuery<DesbloqueioData>({
    queryKey: ['desbloqueio-participante-status', advertiserId, participantId, missionId],
    queryFn: async () => {
      if (!advertiserId || !participantId || !missionId) {
        return {
          hasUnlocked: false,
          canUnlock: false,
          rifasBalance: 0,
          requiredRifas: 2
        };
      }

      const client = await getSupabaseClient();
      
      try {
        // Verificar se já desbloqueou este participante específico
        const { data: unlockData, error: unlockError } = await client
          .from('advertiser_participant_unlocks')
          .select('id, rifas_cost')
          .eq('advertiser_id', advertiserId)
          .eq('participant_id', participantId)
          .eq('mission_id', missionId)
          .maybeSingle();

        if (unlockError && unlockError.code !== 'PGRST116') {
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
        
        // Verificar se este participante específico já foi desbloqueado
        const hasUnlocked = !!unlockData;

        let participantDemographics;

        // Se desbloqueado, buscar dados demográficos reais do participante
        if (hasUnlocked) {
          try {
            const { data: participantProfile } = await client
              .from('profiles')
              .select('profile_data, income_range')
              .eq('id', participantId)
              .single();

            if (participantProfile) {
              const profileData = participantProfile.profile_data as any;
              
              // Mapear dados demográficos do formato do banco para exibição
              participantDemographics = {
                age: profileData?.ageRange ? 
                  profileData.ageRange === '18-24' ? '18-24 anos' :
                  profileData.ageRange === '25-34' ? '25-34 anos' :
                  profileData.ageRange === '35-44' ? '35-44 anos' :
                  profileData.ageRange === '45-54' ? '45-54 anos' :
                  profileData.ageRange === '55-64' ? '55-64 anos' :
                  profileData.ageRange === '65+' ? '65+ anos' : profileData.ageRange
                  : undefined,
                gender: profileData?.gender === 'male' ? 'Masculino' : 
                        profileData?.gender === 'female' ? 'Feminino' : 
                        profileData?.gender || undefined,
                location: profileData?.location || undefined,
                income: participantProfile.income_range || undefined,
                profession: profileData?.profession || undefined,
                education: profileData?.educationLevel === 'elementary' ? 'Ensino Fundamental' :
                          profileData?.educationLevel === 'high_school' ? 'Ensino Médio' :
                          profileData?.educationLevel === 'university' ? 'Ensino Superior' :
                          profileData?.educationLevel === 'postgraduate' ? 'Pós-graduação' :
                          profileData?.educationLevel || undefined,
                interests: profileData?.interests ? (Array.isArray(profileData.interests) ? profileData.interests : []) : undefined,
                maritalStatus: profileData?.maritalStatus === 'single' ? 'Solteiro(a)' :
                              profileData?.maritalStatus === 'married' ? 'Casado(a)' :
                              profileData?.maritalStatus === 'relationship' ? 'Em relacionamento' :
                              profileData?.maritalStatus === 'divorced' ? 'Divorciado(a)' :
                              profileData?.maritalStatus || undefined
              };
            }
          } catch (error) {
            console.warn('Error fetching participant demographics:', error);
          }
        }

        return {
          hasUnlocked,
          canUnlock: rifasBalance >= requiredRifas,
          rifasBalance,
          requiredRifas,
          participantDemographics
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
    enabled: !!advertiserId && !!participantId && !!missionId
  });

  // Mutation para desbloquear dados usando Edge Function
  const unlockDataMutation = useMutation({
    mutationFn: async ({ advertiserId, participantId, missionId }: UnlockParams) => {
      setIsUnlocking(true);
      const client = await getSupabaseClient();

      try {
        // Chamar Edge Function para desbloqueio específico do participante
        const { data, error } = await client.functions.invoke('unlock-crm-details', {
          body: { 
            advertiserId, 
            participantId, 
            missionId 
          }
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
      queryClient.invalidateQueries({ queryKey: ['desbloqueio-participante-status'] });
      queryClient.invalidateQueries({ queryKey: ['advertiser-crm'] });
      
      toast({
        title: 'Dados desbloqueados!',
        description: 'Agora você pode visualizar os dados demográficos deste participante.',
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
    if (!advertiserId || !participantId || !missionId) return;
    unlockDataMutation.mutate({ advertiserId, participantId, missionId });
  };

  return {
    desbloqueioStatus,
    isLoading,
    isUnlocking,
    unlockData,
    canUnlock: desbloqueioStatus?.canUnlock || false,
    hasUnlocked: desbloqueioStatus?.hasUnlocked || false,
    rifasBalance: desbloqueioStatus?.rifasBalance || 0,
    requiredRifas: desbloqueioStatus?.requiredRifas || 2,
    participantDemographics: desbloqueioStatus?.participantDemographics
  };
}

// Hook para gerenciar desbloqueios em massa (quando necessário visualizar estatísticas gerais)
export function useDesbloqueiosParticipantes(advertiserId: string, missionId: string) {
  const queryClient = useQueryClient();

  const { data: participantesDesbloqueados } = useQuery({
    queryKey: ['participantes-desbloqueados', advertiserId, missionId],
    queryFn: async () => {
      if (!advertiserId || !missionId) return [];

      const client = await getSupabaseClient();
      
      // Buscar todos os desbloqueios para esta missão específica
      const { data, error } = await client
        .from('advertiser_crm_unlocks')
        .select('*')
        .eq('advertiser_id', advertiserId)
        .eq('mission_id', missionId);

      if (error) {
        console.error('Error fetching participant unlocks:', error);
        return [];
      }

      return data || [];
    },
    enabled: !!advertiserId && !!missionId
  });

  return {
    participantesDesbloqueados: participantesDesbloqueados || []
  };
} 