import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useSounds } from "@/hooks/use-sounds";

// Função standalone para validar códigos de referência (não requer autenticação)
export const validateReferralCodeStandalone = async (codigo: string) => {
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
  const [loading, setLoading] = useState(true);
  const [referrals, setReferrals] = useState<Referral[]>([]);
  const [referralCode, setReferralCode] = useState("");
  const [referralLink, setReferralLink] = useState("");
  const [stats, setStats] = useState<ReferralStats>({
    totalConvites: 0,
    pendentes: 0,
    registrados: 0,
    pontosGanhos: 0
  });
  const { toast } = useToast();
  const { playSound } = useSounds();

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

      if (refError) throw refError;

      // Buscar indicações
      const { data: indicacoes, error: indError } = await supabase
        .from('indicacoes')
        .select('status')
        .eq('referencia_id', userRef.id);

      if (indError) throw indError;

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
      try {
        const session = await supabase.auth.getSession();
        const userId = session.data.session?.user.id;
        
        if (!userId) {
          // Se não há usuário autenticado, apenas define loading como false
          setLoading(false);
          return;
        }
        
        // Garantir que o usuário tenha um código de referência
        const userReferralCode = await ensureReferralCode(userId);
        setReferralCode(userReferralCode);
        setReferralLink(`${window.location.origin}/registro?ref=${userReferralCode}`);
        
        // Buscar estatísticas
        const referralStats = await fetchReferralStats(userId);
        setStats(referralStats);
        
        // Buscar indicações detalhadas (mantendo compatibilidade)
        const { data: userRef } = await supabase
          .from('referencias')
          .select('id')
          .eq('participante_id', userId)
          .single();

        if (userRef) {
          const { data: indicacoes } = await supabase
            .from('indicacoes')
            .select(`
              id,
              status,
              criado_em,
              convidado_id
            `)
            .eq('referencia_id', userRef.id);

          if (indicacoes) {
            // Buscar perfis dos convidados
            const convidadoIds = indicacoes.map(i => i.convidado_id).filter(Boolean);
            let profiles: any[] = [];
            
            if (convidadoIds.length > 0) {
              const { data: profilesData } = await supabase
                .from('profiles')
                .select('id, full_name, email')
                .in('id', convidadoIds);
              
              profiles = profilesData || [];
            }

            const profileMap = new Map();
            profiles.forEach(profile => {
              profileMap.set(profile.id, profile);
            });

            const mappedReferrals: Referral[] = indicacoes.map(indicacao => {
              const profile = indicacao.convidado_id ? profileMap.get(indicacao.convidado_id) : null;
              
              return {
                id: indicacao.id,
                name: profile?.full_name || "Amigo convidado",
                email: profile?.email,
                status: indicacao.status === 'completo' ? 'completed' : 'pending' as Referral['status'],
                date: indicacao.criado_em,
                completedMissions: indicacao.status === 'completo' ? 1 : 0,
                rifasEarned: indicacao.status === 'completo' ? 200 : 0
              };
            });

            setReferrals(mappedReferrals);
          }
        }
        
        playSound("chime");
      } catch (error: any) {
        console.error("Error fetching referrals:", error);
        toast({
          title: "Erro ao carregar referências",
          description: error.message,
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
  const registerReferral = async (referenciaId: string, convidadoId: string) => {
    try {
      const { error } = await supabase
        .from('indicacoes')
        .insert({
          referencia_id: referenciaId,
          convidado_id: convidadoId,
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
        .select('id, referencia_id')
        .eq('convidado_id', convidadoId)
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
      await checkAndGenerateRewards(indicacao.referencia_id);

      return { success: true };
    } catch (error) {
      console.error('Erro ao completar indicação:', error);
      return { success: false };
    }
  };

  // Verificar e gerar recompensas baseadas em marcos
  const checkAndGenerateRewards = async (referenciaId: string) => {
    try {
      // Contar indicações completas
      const { data: indicacoes, error } = await supabase
        .from('indicacoes')
        .select('id')
        .eq('referencia_id', referenciaId)
        .eq('status', 'completo');

      if (error) throw error;

      const totalCompletas = indicacoes?.length || 0;

      // Verificar se já foi gerada recompensa para 3 amigos
      if (totalCompletas >= 3) {
        const { data: existing3 } = await supabase
          .from('recompensas_indicacao')
          .select('id')
          .eq('referencia_id', referenciaId)
          .eq('tipo', 'bonus_3_amigos')
          .maybeSingle();

        if (!existing3) {
          await supabase
            .from('recompensas_indicacao')
            .insert({
              referencia_id: referenciaId,
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
          .eq('referencia_id', referenciaId)
          .eq('tipo', 'bonus_5_amigos')
          .maybeSingle();

        if (!existing5) {
          await supabase
            .from('recompensas_indicacao')
            .insert({
              referencia_id: referenciaId,
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
          referencia_id: referenciaId,
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
