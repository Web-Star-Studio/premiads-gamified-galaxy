import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useSounds } from '@/hooks/use-sounds';
import { FormData } from "@/components/advertiser/campaign-form/types";
import { MissionType, Mission } from "@/hooks/useMissionsTypes";
import { useAuth } from '@/hooks/useAuth';
import { missionService } from '@/services/supabase';

export const useCampaignOperations = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const { playSound } = useSounds();
  const { currentUser } = useAuth();

  /**
   * Mapeia os tipos de missão do formulário para os tipos usados no backend
   */
  const mapMissionType = (formType: string): string => {
    const typeMap: Record<string, string> = {
      'form': 'formulario',
      'photo': 'foto',
      'video': 'video',
      'checkin': 'check-in',
      'social': 'redes_sociais',
      'coupon': 'cupom',
      'survey': 'pesquisa',
      'review': 'avaliacao'
    };
    
    return typeMap[formType] || formType;
  };

  /**
   * Calcula o custo em tokens com base no tipo de missão e público-alvo
   */
  const calculateTokenCost = (type: string, audience: string): number => {
    // Valores base por tipo de missão
    const baseCosts: Record<string, number> = {
      'formulario': 10,
      'foto': 15,
      'video': 20,
      'check-in': 12,
      'redes_sociais': 15,
      'cupom': 8,
      'pesquisa': 15,
      'avaliacao': 12
    };
    
    // Multiplicadores por público
    const audienceMultipliers: Record<string, number> = {
      'todos': 1.0,
      'premium': 1.5,
      'beta': 1.2
    };
    
    const baseTokens = baseCosts[mapMissionType(type)] || 10;
    const multiplier = audienceMultipliers[audience] || 1.0;
    
    return Math.round(baseTokens * multiplier);
  };

  /**
   * Criar uma nova campanha/missão
   */
  const createCampaign = async (formData: FormData): Promise<boolean> => {
    if (!currentUser?.id) {
      toast({
        title: "Erro",
        description: "Você precisa estar logado para criar uma campanha.",
        variant: "destructive",
      });
      return false;
    }
    
    setIsLoading(true);
    
    try {
      // Verificar se o usuário tem tokens suficientes
      const userTokens = await missionService.getUserTokens(currentUser.id);
      const availableTokens = userTokens.total_tokens - userTokens.used_tokens;
      const cost = calculateTokenCost(formData.type, formData.audience);
      
      if (availableTokens < cost) {
        toast({
          title: "Tokens insuficientes",
          description: `Você precisa de ${cost} tokens para criar esta campanha. Atualmente você tem ${availableTokens} tokens disponíveis.`,
          variant: "destructive",
        });
        return false;
      }
      
      // Preparar dados da missão
      const mission: Partial<Mission> = {
        title: formData.title,
        description: formData.description,
        requirements: Array.isArray(formData.requirements) 
          ? formData.requirements.join('\n') 
          : formData.requirements,
        type: mapMissionType(formData.type) as MissionType,
        target_audience: formData.audience,
        points: formData.randomPoints 
          ? Math.floor(Math.random() * (formData.pointsRange[1] - formData.pointsRange[0] + 1)) + formData.pointsRange[0]
          : (formData.pointsValue || formData.pointsRange[0]),
        created_by: currentUser.id,
        cost_in_tokens: cost,
        status: 'pendente' as const, // Começa como pendente, admin pode aprovar para 'ativa'
        expires_at: formData.endDate ? new Date(formData.endDate).toISOString() : undefined,
        streak_bonus: formData.streakBonus,
        streak_multiplier: formData.streakBonus ? formData.streakMultiplier || 1.2 : null,
        start_date: formData.startDate ? new Date(formData.startDate).toISOString() : undefined,
        target_filter: {
          audience: formData.audience,
          // Adicionar outros filtros conforme necessário
        }
      };
      
      // Criar missão no Supabase
      const createdMission = await missionService.createMission(mission as Mission);
      
      toast({
        title: "Missão criada com sucesso",
        description: "Sua campanha foi criada e está aguardando aprovação.",
      });
      
      return true;
    } catch (error: any) {
      console.error("Erro ao criar campanha:", error);
      
      toast({
        title: "Erro ao criar campanha",
        description: error.message || "Ocorreu um erro ao criar a campanha.",
        variant: "destructive",
      });
      
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Atualizar uma campanha existente
   */
  const updateCampaign = async (campaignId: string, formData: FormData): Promise<boolean> => {
    if (!currentUser?.id) {
      toast({
        title: "Erro",
        description: "Você precisa estar logado para atualizar uma campanha.",
        variant: "destructive",
      });
      return false;
    }
    
    setIsLoading(true);
    
    try {
      // Buscar missão existente
      const existingMission = await missionService.getMissionById(campaignId);
      
      // Verificar permissão
      if (existingMission.created_by !== currentUser.id) {
        toast({
          title: "Permissão negada",
          description: "Você não tem permissão para editar esta campanha.",
          variant: "destructive",
        });
        return false;
      }
      
      // Preparar dados da missão
      const updatedMission: Partial<Mission> = {
        title: formData.title,
        description: formData.description,
        requirements: Array.isArray(formData.requirements) 
          ? formData.requirements.join('\n') 
          : formData.requirements,
        type: mapMissionType(formData.type) as MissionType,
        target_audience: formData.audience,
        points: formData.randomPoints 
          ? Math.floor(Math.random() * (formData.pointsRange[1] - formData.pointsRange[0] + 1)) + formData.pointsRange[0]
          : (formData.pointsValue || formData.pointsRange[0]),
        expires_at: formData.endDate ? new Date(formData.endDate).toISOString() : undefined,
        updated_at: new Date().toISOString(),
        streak_bonus: formData.streakBonus,
        streak_multiplier: formData.streakBonus ? formData.streakMultiplier || 1.2 : null,
        start_date: formData.startDate ? new Date(formData.startDate).toISOString() : undefined,
        target_filter: {
          audience: formData.audience,
          // Adicionar outros filtros conforme necessário
        }
      };
      
      // Atualizar missão no Supabase
      await supabase
        .from('missions')
        .update(updatedMission)
        .eq('id', campaignId);
      
      toast({
        title: "Campanha atualizada",
        description: "As alterações foram salvas com sucesso.",
      });
      
      return true;
    } catch (error: any) {
      console.error("Erro ao atualizar campanha:", error);
      
      toast({
        title: "Erro ao atualizar campanha",
        description: error.message || "Ocorreu um erro ao atualizar a campanha.",
        variant: "destructive",
      });
      
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Atualizar o status de uma campanha
   */
  const updateCampaignStatus = async (campaignId: string, status: 'ativa' | 'pendente' | 'encerrada'): Promise<boolean> => {
    if (!currentUser?.id) {
      toast({
        title: "Erro",
        description: "Você precisa estar logado para atualizar o status da campanha.",
        variant: "destructive",
      });
      return false;
    }
    
    setIsLoading(true);
    
    try {
      // Verificar permissão
      const existingMission = await missionService.getMissionById(campaignId);
      
      const isAdmin = currentUser?.user_metadata?.user_type === 'admin';
      const isOwner = existingMission.created_by === currentUser.id;
      
      if (!isAdmin && !isOwner) {
        toast({
          title: "Permissão negada",
          description: "Você não tem permissão para atualizar o status desta campanha.",
          variant: "destructive",
        });
        return false;
      }
      
      // Atualizar status
      await missionService.updateMissionStatus(campaignId, status);
      
      toast({
        title: "Status atualizado",
        description: `A campanha agora está ${status}.`,
      });
      
      return true;
    } catch (error: any) {
      console.error("Erro ao atualizar status:", error);
      
      toast({
        title: "Erro ao atualizar status",
        description: error.message || "Ocorreu um erro ao atualizar o status da campanha.",
        variant: "destructive",
      });
      
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    isLoading,
    createCampaign,
    updateCampaign,
    updateCampaignStatus
  };
};
