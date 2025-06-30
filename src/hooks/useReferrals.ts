import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useSounds } from "@/hooks/use-sounds";
import { useAuthStore } from "@/stores/authStore";

// Função standalone para validar códigos de referência (não requer autenticação)
export const validateReferralCodeStandalone = async (codigo: string) => {
  try {
    // Verificar se o código não está vazio
    if (!codigo || codigo.trim().length === 0) {
      return { valid: false, error: 'Código de referência não pode estar vazio' };
    }

    // Limpar e normalizar o código
    const cleanCode = codigo.trim().toUpperCase();
    
    // Verificar comprimento mínimo
    if (cleanCode.length < 3) {
      return { valid: false, error: 'Código de referência muito curto' };
    }

    // Primeiro, tentar usar a Edge Function se disponível
    try {
      const { data: functionResult, error: functionError } = await supabase.functions.invoke('validate-referral-code', {
        body: { codigo: cleanCode }
      });

      if (!functionError && functionResult) {
        return functionResult;
      }
    } catch (functionError) {
      console.warn('Edge Function não disponível, usando fallback direto:', functionError);
    }

    // Fallback: consulta direta ao banco
    const { data: referencia, error } = await supabase
      .from('referencias')
      .select('id, participante_id')
      .eq('codigo', cleanCode)
      .maybeSingle();

    if (error) {
      console.error('Erro ao validar código de referência:', error);
      return { valid: false, error: 'Erro ao validar código de referência' };
    }

    if (!referencia) {
      return { valid: false, error: 'Código de referência inválido ou não encontrado' };
    }

    // Verificar se o usuário está ativo
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('full_name, active')
      .eq('id', referencia.participante_id)
      .single();

    if (profileError || !profile?.active) {
      return { valid: false, error: 'Código de referência inválido ou inativo' };
    }

    return { 
      valid: true, 
      referenciaId: referencia.id, 
      participanteId: referencia.participante_id,
      ownerName: profile.full_name
    };
  } catch (error) {
    console.error('Erro inesperado ao validar código:', error);
    return { valid: false, error: 'Erro inesperado ao validar código' };
  }
};

export interface Referral {
  id: string;
  name?: string;
  email?: string;
  status: "pending" | "registered" | "completed";
  date: string;
  completedMissions?: number;
  rifasEarned?: number;
  /** Points earned by the referred user (legacy field for dashboard). */
  pointsEarned?: number;
}

export interface ReferralReward {
  id: number;
  description: string;
  type: "rifas" | "tickets" | "special" | "points";
  value: number;
  status: "available" | "claimed";
  expiresAt?: string;
}

export interface ReferralStats {
  totalConvites: number;
  pendentes: number;
  registrados: number;
  pontosGanhos: number;
}

export const useReferrals = () => {
  const { toast } = useToast();
  const { playSound } = useSounds();
  const user = useAuthStore(state => state.user);
  
  const [loading, setLoading] = useState(false);
  const [referrals, setReferrals] = useState<Referral[]>([]);
  const [referralCode, setReferralCode] = useState("");
  const [referralLink, setReferralLink] = useState("");
  const [stats, setStats] = useState<ReferralStats>({
    totalConvites: 0,
    pendentes: 0,
    registrados: 0,
    pontosGanhos: 0
  });

  // Gerar código único baseado no username + ano
  const generateReferralCode = async (userId: string) => {
    try {
      // Buscar o perfil do usuário para pegar o nome
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('full_name')
        .eq('id', userId)
        .single();

      if (profileError) throw profileError;

      const year = new Date().getFullYear();
      const username = profile?.full_name?.replace(/\s+/g, '').toUpperCase() || 'USER';
      let baseCode = `${username}${year}`;
      
      // Garantir que o código seja único
      let finalCode = baseCode;
      let counter = 1;
      
      while (true) {
        const { data: existing, error } = await supabase
          .from('referencias')
          .select('codigo')
          .eq('codigo', finalCode)
          .maybeSingle();
        
        if (error && error.code !== 'PGRST116') throw error;
        
        if (!existing) break;
        
        finalCode = `${baseCode}${counter}`;
        counter++;
      }
      
      return finalCode;
    } catch (error) {
      console.error('Erro ao gerar código:', error);
      // Fallback para código simples
      return `USER${new Date().getFullYear()}${Math.floor(Math.random() * 1000)}`;
    }
  };

  // Criar ou recuperar código de referência
  const ensureReferralCode = async (userId: string) => {
    try {
      // Verificar se já existe um código para este usuário
      const { data: existingRef, error: refError } = await supabase
        .from('referencias')
        .select('codigo')
        .eq('participante_id', userId)
        .maybeSingle();

      if (refError && refError.code !== 'PGRST116') throw refError;

      if (existingRef) {
        return existingRef.codigo;
      }

      // Gerar novo código
      const newCode = await generateReferralCode(userId);
      
      // Criar nova referência
      const { error: insertError } = await supabase
        .from('referencias')
        .insert({
          codigo: newCode,
          participante_id: userId
        });

      if (insertError) throw insertError;

      return newCode;
    } catch (error) {
      console.error('Erro ao garantir código de referência:', error);
      throw error;
    }
  };

  // Buscar estatísticas de referência
  const fetchReferralStats = async (userId: string) => {
    try {
      // Buscar a referência do usuário
      const { data: userRef, error: refError } = await supabase
        .from('referencias')
        .select('id')
        .eq('participante_id', userId)
        .single();

      if (refError) {
        console.log('Usuário ainda não tem código de referência');
        return {
          totalConvites: 0,
          pendentes: 0,
          registrados: 0,
          pontosGanhos: 0
        };
      }

      // Buscar indicações usando as tabelas corretas
      const { data: indicacoes, error: indError } = await supabase
        .from('indicacoes')
        .select('status')
        .eq('referenciador_id', userId);

      if (indError) {
        console.error('Erro ao buscar indicações:', indError);
        return {
          totalConvites: 0,
          pendentes: 0,
          registrados: 0,
          pontosGanhos: 0
        };
      }

      const totalConvites = indicacoes?.length || 0;
      const pendentes = indicacoes?.filter(i => i.status === 'pendente').length || 0;
      const registrados = indicacoes?.filter(i => i.status === 'completo').length || 0;
      const pontosGanhos = registrados * 200; // 200 pontos por indicação completa

      return {
        totalConvites,
        pendentes,
        registrados,
        pontosGanhos
      };
    } catch (error) {
      console.error('Erro ao buscar estatísticas:', error);
      return {
        totalConvites: 0,
        pendentes: 0,
        registrados: 0,
        pontosGanhos: 0
      };
    }
  };

  useEffect(() => {
    const fetchReferrals = async () => {
      if (!user?.id) return;

      try {
        setLoading(true);

        // Buscar a referência do usuário
        const { data: userRef, error: refError } = await supabase
          .from('referencias')
          .select('id')
          .eq('participante_id', user.id)
          .single();

        if (refError) {
          console.log('Usuário ainda não tem código de referência');
          setReferrals([]);
          setStats({
            totalConvites: 0,
            pendentes: 0,
            registrados: 0,
            pontosGanhos: 0
          });
          return;
        }

        // Buscar indicações com dados dos usuários convidados
        const { data: indicacoes, error: indError } = await supabase
          .from('indicacoes')
          .select(`
            id,
            status,
            created_at,
            profiles!indicacoes_indicado_id_fkey(
              id,
              full_name,
              email
            )
          `)
          .eq('referenciador_id', user.id)
          .order('created_at', { ascending: false });

        if (indError) {
          console.error('Erro ao buscar indicações:', indError);
          setReferrals([]);
          return;
        }

        // Transformar dados para o formato esperado
        const referralsData: Referral[] = (indicacoes || []).map(ind => {
          const profile = (ind as any).profiles;
          return {
            id: ind.id,
            name: profile?.full_name || 'Nome não disponível',
            email: profile?.email || 'Email não disponível',
            status: ind.status === 'pendente' ? 'pending' : 
                   ind.status === 'completo' ? 'completed' : 'registered',
            date: ind.created_at,
            completedMissions: ind.status === 'completo' ? 1 : 0,
            rifasEarned: ind.status === 'completo' ? 200 : 0,
            pointsEarned: ind.status === 'completo' ? 200 : 0
          };
        });

        setReferrals(referralsData);

        // Calcular estatísticas
        const totalConvites = referralsData.length;
        const pendentes = referralsData.filter(r => r.status === 'pending').length;
        const registrados = referralsData.filter(r => r.status === 'completed').length;
        const pontosGanhos = registrados * 200;

        setStats({
          totalConvites,
          pendentes,
          registrados,
          pontosGanhos
        });

        // Buscar/gerar código de referência
        const userReferralCode = await ensureReferralCode(user.id);
        setReferralCode(userReferralCode);
        setReferralLink(`${window.location.origin}/registro?ref=${userReferralCode}`);

      } catch (error) {
        console.error('Erro ao buscar referências:', error);
        toast({
          title: "Erro",
          description: "Não foi possível carregar suas referências.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchReferrals();
  }, [toast, playSound]);

  // Validar código de referência durante cadastro (não requer autenticação)
  const validateReferralCode = async (codigo: string) => {
    try {
      const { data: referencia, error } = await supabase
        .from('referencias')
        .select('id, participante_id')
        .eq('codigo', codigo.toUpperCase())
        .single();

      if (error) {
        return { valid: false, error: 'Código de referência inválido' };
      }

      return { valid: true, referenciaId: referencia.id, participanteId: referencia.participante_id };
    } catch (error) {
      return { valid: false, error: 'Erro ao validar código' };
    }
  };

  // Registrar nova indicação
  const registerReferral = async (referenciadorId: string, indicadoId: string) => {
    try {
      const { error } = await supabase
        .from('indicacoes')
        .insert({
          referenciador_id: referenciadorId,
          indicado_id: indicadoId,
          status: 'pendente'
        });

      if (error) throw error;

      return { success: true };
    } catch (error) {
      console.error('Erro ao registrar indicação:', error);
      return { success: false, error: 'Erro ao registrar indicação' };
    }
  };

  // Atualizar status para completo quando primeira missão for concluída
  const completeReferral = async (convidadoId: string) => {
    try {
      // Buscar indicação pendente
      const { data: indicacao, error: searchError } = await supabase
        .from('indicacoes')
        .select('id, referenciador_id')
        .eq('indicado_id', convidadoId)
        .eq('status', 'pendente')
        .maybeSingle();

      if (searchError || !indicacao) return { success: false };

      // Atualizar status
      const { error: updateError } = await supabase
        .from('indicacoes')
        .update({ status: 'completo' })
        .eq('id', indicacao.id);

      if (updateError) throw updateError;

      // Verificar e gerar recompensas
      await checkAndGenerateRewards(indicacao.referenciador_id);

      return { success: true };
    } catch (error) {
      console.error('Erro ao completar indicação:', error);
      return { success: false };
    }
  };

  // Verificar e gerar recompensas baseadas em marcos
  const checkAndGenerateRewards = async (referenciadorId: string) => {
    try {
      // Contar indicações completas
      const { data: indicacoes, error } = await supabase
        .from('indicacoes')
        .select('id')
        .eq('referenciador_id', referenciadorId)
        .eq('status', 'completo');

      if (error) throw error;

      const totalCompletas = indicacoes?.length || 0;

      // Verificar se já foi gerada recompensa para 3 amigos
      if (totalCompletas >= 3) {
        const { data: existing3 } = await supabase
          .from('recompensas_indicacao')
          .select('id')
          .eq('referenciador_id', referenciadorId)
          .eq('tipo', 'bonus_3_amigos')
          .maybeSingle();

        if (!existing3) {
          await supabase
            .from('recompensas_indicacao')
            .insert({
              referenciador_id: referenciadorId,
              tipo: 'bonus_3_amigos',
              pontos: 500,
              status: 'disponivel'
            });
        }
      }

      // Verificar se já foi gerada recompensa para 5 amigos
      if (totalCompletas >= 5) {
        const { data: existing5 } = await supabase
          .from('recompensas_indicacao')
          .select('id')
          .eq('referenciador_id', referenciadorId)
          .eq('tipo', 'bonus_5_amigos')
          .maybeSingle();

        if (!existing5) {
          await supabase
            .from('recompensas_indicacao')
            .insert({
              referenciador_id: referenciadorId,
              tipo: 'bonus_5_amigos',
              pontos: 1000,
              status: 'disponivel'
            });
        }
      }

      // Gerar bilhetes extras (3 bilhetes a cada indicação completa)
      await supabase
        .from('recompensas_indicacao')
        .insert({
          referenciador_id: referenciadorId,
          tipo: 'bilhetes_extras',
          bilhetes: 3,
          status: 'disponivel'
        });

    } catch (error) {
      console.error('Erro ao verificar recompensas:', error);
    }
  };

  // Send referral invites
  const sendInvites = async (emails: string[], message: string) => {
    try {
      setLoading(true);
      // Filter valid emails
      const validEmails = emails.filter(email => email.trim() !== "");
      
      if (validEmails.length === 0) {
        playSound("error");
        toast({
          title: "Nenhum email válido",
          description: "Por favor, insira pelo menos um email para enviar convites.",
          variant: "destructive",
        });
        return false;
      }
      
      // In a real app, this would make an API call to send emails
      
      // Simulate a network request
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      playSound("chime");
      toast({
        title: "Convites enviados",
        description: `${validEmails.length} convites foram enviados com sucesso.`,
      });
      
      return true;
    } catch (error: any) {
      console.error("Error sending invites:", error);
      toast({
        title: "Erro ao enviar convites",
        description: error.message,
        variant: "destructive",
      });
      return false;
    } finally {
      setLoading(false);
    }
  };

  return { 
    loading, 
    referrals, 
    referralCode, 
    referralLink, 
    stats,
    sendInvites,
    validateReferralCode,
    registerReferral,
    completeReferral
  };
};

// Nova função encapsulada usando consulta direta
export async function validateReferralCodeMCP(codigo: string) {
  try {
    if (!codigo || codigo.trim().length < 3) {
      return { isValid: false, error: 'Código deve ter pelo menos 3 caracteres' }
    }

    const trimmedCode = codigo.trim().toUpperCase()
    console.log('Validando código:', trimmedCode)

    // Primeira consulta: buscar referência
    const { data: referenciaData, error: refError } = await supabase
      .from('referencias')
      .select('*')
      .eq('codigo', trimmedCode)
      .single()

    console.log('Resultado da consulta:', { referenciaData, refError })
    console.log('Estrutura da referência:', Object.keys(referenciaData || {}))

    if (refError || !referenciaData) {
      console.error('Erro ao buscar referência:', refError)
      return { isValid: false, error: 'Código inválido ou não encontrado' }
    }

    // Verificar se a referência está ativa (campo pode ser 'ativo' ou 'active')
    const isActive = referenciaData.ativo ?? referenciaData.active ?? true
    if (!isActive) {
      return { isValid: false, error: 'Código de referência inativo' }
    }

    // Obter ID do participante (campo pode ter nomes diferentes)
    const participanteId = referenciaData.participante_id ?? referenciaData.user_id ?? referenciaData.owner_id
    console.log('ID do participante encontrado:', participanteId)

    if (!participanteId) {
      return { isValid: false, error: 'Referência inválida - ID do participante não encontrado' }
    }

    // Segunda consulta: buscar dados do perfil
    const { data: profileData, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', participanteId)
      .maybeSingle()

    console.log('Resultado do perfil:', { profileData, profileError })
    if (profileData) {
      console.log('Estrutura do perfil:', Object.keys(profileData))
    }

    if (profileError) {
      console.error('Erro ao buscar perfil:', profileError)
      return { isValid: false, error: 'Erro ao validar usuário do código' }
    }

    if (!profileData) {
      // Fallback: se não encontrar o perfil, buscar pelo código na própria referência
      // Isso pode acontecer se houver inconsistência entre tabelas
      console.warn('Perfil não encontrado, usando dados da referência como fallback')
      
      return {
        isValid: true,
        ownerName: `Usuário ${referenciaData.codigo}`, // Nome temporário baseado no código
        ownerId: participanteId,
        referenciaId: referenciaData.id
      }
    }

    // Verificar se está ativo (campo pode ser 'active' ou outro)
    const isUserActive = profileData.active ?? profileData.ativo ?? true
    if (!isUserActive) {
      return { isValid: false, error: 'Usuário do código não está ativo' }
    }

    return {
      isValid: true,
      ownerName: profileData.full_name || `Usuário ${referenciaData.codigo}`,
      ownerId: participanteId,
      referenciaId: referenciaData.id
    }

  } catch (error) {
    console.error('Erro na validação:', error)
    return { isValid: false, error: 'Erro interno do servidor' }
  }
}
