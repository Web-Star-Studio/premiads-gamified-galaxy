import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useSounds } from "@/hooks/use-sounds";

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

    // Consulta direta ao banco
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
      // Primeiro, garantir que existe uma referência para o usuário
      const { data: referencia, error: refError } = await supabase
        .from('referencias')
        .select('id')
        .eq('participante_id', userId)
        .maybeSingle();

<<<<<<< HEAD
      if (refError) throw refError;

      // Buscar indicações
      const { data: indicacoes, error: indError } = await supabase
        .from('indicacoes')
        .select('status')
        .eq('referencia_id', userRef.id);

      if (indError) throw indError;
=======
      if (refError && refError.code !== 'PGRST116') throw refError;

      if (!referencia) {
        // Se não existe referência, retornar stats zeradas
        return {
          totalConvites: 0,
          pendentes: 0,
          registrados: 0,
          pontosGanhos: 0
        };
      }

      // Buscar estatísticas das indicações
      const { data: indicacoes, error: statsError } = await supabase
        .from('indicacoes')
        .select('status')
        .eq('referencia_id', referencia.id);

      if (statsError) throw statsError;
>>>>>>> ff71f6e (BACKUP-REVERT-FROM-MAIN)

      const totalConvites = indicacoes?.length || 0;
      const pendentes = indicacoes?.filter(i => i.status === 'pendente').length || 0;
      const registrados = indicacoes?.filter(i => i.status === 'completo').length || 0;
      
      // Calcular pontos ganhos (200 rifas por indicação completa)
      const pontosGanhos = registrados * 200;

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

<<<<<<< HEAD
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
=======
  // Buscar lista de referidos
  const fetchReferrals = async (userId: string) => {
>>>>>>> ff71f6e (BACKUP-REVERT-FROM-MAIN)
    try {
      // Primeiro, garantir que existe uma referência para o usuário
      const { data: referencia, error: refError } = await supabase
        .from('referencias')
        .select('id')
        .eq('participante_id', userId)
        .maybeSingle();

      if (refError && refError.code !== 'PGRST116') throw refError;

      if (!referencia) {
        return [];
      }

      // Buscar indicações com dados dos convidados
      const { data: indicacoes, error: indicacoesError } = await supabase
        .from('indicacoes')
        .select(`
          id,
          status,
          criado_em,
          convidado_id,
          profiles:convidado_id (
            full_name,
            email
          )
        `)
        .eq('referencia_id', referencia.id)
        .order('criado_em', { ascending: false });

      if (indicacoesError) throw indicacoesError;

      // Transformar dados para o formato esperado
      const referrals: Referral[] = (indicacoes || []).map(indicacao => ({
        id: indicacao.id,
        name: (indicacao.profiles as any)?.full_name || 'Usuário',
        email: (indicacao.profiles as any)?.email || '',
        status: indicacao.status === 'completo' ? 'completed' : 'pending',
        date: indicacao.criado_em,
        completedMissions: indicacao.status === 'completo' ? 1 : 0,
        rifasEarned: indicacao.status === 'completo' ? 200 : 0,
        pointsEarned: indicacao.status === 'completo' ? 200 : 0
      }));

      return referrals;
    } catch (error) {
      console.error('Erro ao buscar referidos:', error);
      return [];
    }
  };

<<<<<<< HEAD
  // Registrar nova indicação
  const registerReferral = async (referenciaId: string, convidadoId: string) => {
=======
  // Validar código de referência
  const validateReferralCode = async (codigo: string) => {
    try {
      const result = await validateReferralCodeStandalone(codigo);
      return result.valid;
    } catch (error) {
      console.error('Erro ao validar código:', error);
      return false;
    }
  };

  // Registrar referral
  const registerReferral = async (referenciadorId: string, indicadoId: string) => {
>>>>>>> ff71f6e (BACKUP-REVERT-FROM-MAIN)
    try {
      const { error } = await supabase
        .from('indicacoes')
        .insert({
<<<<<<< HEAD
          referencia_id: referenciaId,
          convidado_id: convidadoId,
=======
          referencia_id: referenciadorId,
          convidado_id: indicadoId,
>>>>>>> ff71f6e (BACKUP-REVERT-FROM-MAIN)
          status: 'pendente'
        });

      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Erro ao registrar referral:', error);
      return false;
    }
  };

  // Completar referral (quando faz primeira missão)
  const completeReferral = async (convidadoId: string) => {
    try {
<<<<<<< HEAD
      // Buscar indicação pendente
      const { data: indicacao, error: searchError } = await supabase
        .from('indicacoes')
        .select('id, referencia_id')
        .eq('convidado_id', convidadoId)
        .eq('status', 'pendente')
        .maybeSingle();

      if (searchError || !indicacao) return { success: false };

      // Atualizar status
=======
      // Atualizar status para completo
>>>>>>> ff71f6e (BACKUP-REVERT-FROM-MAIN)
      const { error: updateError } = await supabase
        .from('indicacoes')
        .update({ status: 'completo' })
        .eq('convidado_id', convidadoId)
        .eq('status', 'pendente');

      if (updateError) throw updateError;

<<<<<<< HEAD
      // Verificar e gerar recompensas
      await checkAndGenerateRewards(indicacao.referencia_id);
=======
      // Buscar dados da indicação para dar recompensa ao referenciador
      const { data: indicacao, error: indicacaoError } = await supabase
        .from('indicacoes')
        .select(`
          referencia_id,
          referencias:referencia_id (
            participante_id
          )
        `)
        .eq('convidado_id', convidadoId)
        .eq('status', 'completo')
        .single();
>>>>>>> ff71f6e (BACKUP-REVERT-FROM-MAIN)

      if (indicacaoError || !indicacao?.referencias || !(indicacao.referencias as any)?.participante_id) {
        console.error('Erro ao buscar dados da indicação:', indicacaoError);
        return false;
      }

      const participanteId = (indicacao.referencias as any).participante_id;

      // Dar 200 rifas para o referenciador
      const { error: bonusError } = await supabase.rpc('increment_user_rifas', {
        user_id: participanteId,
        amount: 200
      });

      if (bonusError) {
        console.error('Erro ao dar bônus ao referenciador:', bonusError);
        // Fallback: buscar rifas atuais e somar
        const { data: profile } = await supabase
          .from('profiles')
          .select('rifas')
          .eq('id', participanteId)
          .single();

        if (profile) {
          await supabase
            .from('profiles')
            .update({ rifas: (profile.rifas || 0) + 200 })
            .eq('id', participanteId);
        }
      }

      // Registrar transação
      await supabase
        .from('rifas_transactions')
        .insert({
          user_id: participanteId,
          transaction_type: 'bonus',
          amount: 200,
          description: 'Bônus por indicação completa'
        });

      return true;
    } catch (error) {
      console.error('Erro ao completar referral:', error);
      return false;
    }
  };

<<<<<<< HEAD
  // Verificar e gerar recompensas baseadas em marcos
  const checkAndGenerateRewards = async (referenciaId: string) => {
=======
  // Verificar e gerar recompensas por marcos
  const checkAndGenerateRewards = async (referenciadorId: string) => {
>>>>>>> ff71f6e (BACKUP-REVERT-FROM-MAIN)
    try {
      // Buscar número de indicações completas
      const { data: referencia } = await supabase
        .from('referencias')
        .select('id')
        .eq('participante_id', referenciadorId)
        .single();

      if (!referencia) return;

      const { data: completedReferrals } = await supabase
        .from('indicacoes')
        .select('id')
<<<<<<< HEAD
        .eq('referencia_id', referenciaId)
=======
        .eq('referencia_id', referencia.id)
>>>>>>> ff71f6e (BACKUP-REVERT-FROM-MAIN)
        .eq('status', 'completo');

      const completedCount = completedReferrals?.length || 0;

      // Marco de 3 amigos
      if (completedCount >= 3) {
        const { data: existingReward } = await supabase
          .from('recompensas_indicacao')
          .select('id')
<<<<<<< HEAD
          .eq('referencia_id', referenciaId)
=======
          .eq('referencia_id', referencia.id)
>>>>>>> ff71f6e (BACKUP-REVERT-FROM-MAIN)
          .eq('tipo', 'bonus_3_amigos')
          .maybeSingle();

        if (!existingReward) {
          await supabase
            .from('recompensas_indicacao')
            .insert({
<<<<<<< HEAD
              referencia_id: referenciaId,
=======
              referencia_id: referencia.id,
>>>>>>> ff71f6e (BACKUP-REVERT-FROM-MAIN)
              tipo: 'bonus_3_amigos',
              valor: 300,
              status: 'disponivel'
            });

          // Dar o bônus automaticamente
          await supabase.rpc('increment_user_rifas', {
            user_id: referenciadorId,
            amount: 300
          });

          await supabase
            .from('rifas_transactions')
            .insert({
              user_id: referenciadorId,
              transaction_type: 'bonus',
              amount: 300,
              description: 'Bônus por indicar 3 amigos'
            });
        }
      }

      // Marco de 5 amigos
      if (completedCount >= 5) {
        const { data: existingReward } = await supabase
          .from('recompensas_indicacao')
          .select('id')
<<<<<<< HEAD
          .eq('referencia_id', referenciaId)
=======
          .eq('referencia_id', referencia.id)
>>>>>>> ff71f6e (BACKUP-REVERT-FROM-MAIN)
          .eq('tipo', 'bonus_5_amigos')
          .maybeSingle();

        if (!existingReward) {
          await supabase
            .from('recompensas_indicacao')
            .insert({
<<<<<<< HEAD
              referencia_id: referenciaId,
=======
              referencia_id: referencia.id,
>>>>>>> ff71f6e (BACKUP-REVERT-FROM-MAIN)
              tipo: 'bonus_5_amigos',
              valor: 500,
              status: 'disponivel'
            });

          // Dar o bônus automaticamente
          await supabase.rpc('increment_user_rifas', {
            user_id: referenciadorId,
            amount: 500
          });

          await supabase
            .from('rifas_transactions')
            .insert({
              user_id: referenciadorId,
              transaction_type: 'bonus',
              amount: 500,
              description: 'Bônus por indicar 5 amigos'
            });
        }
      }
<<<<<<< HEAD

      // Gerar bilhetes extras (3 bilhetes a cada indicação completa)
      await supabase
        .from('recompensas_indicacao')
        .insert({
          referencia_id: referenciaId,
          tipo: 'bilhetes_extras',
          bilhetes: 3,
          status: 'disponivel'
        });

=======
>>>>>>> ff71f6e (BACKUP-REVERT-FROM-MAIN)
    } catch (error) {
      console.error('Erro ao verificar recompensas:', error);
    }
  };

  // Enviar convites por email
  const sendInvites = async (emails: string[], message: string) => {
    try {
      setLoading(true);
      
      if (!user?.id) {
        throw new Error('Usuário não autenticado');
      }

      const invites = emails.map(email => ({
        email,
        referralCode,
        message,
        sentBy: user.id
      }));

      // Aqui você pode implementar o envio de emails
      // Por enquanto, apenas simular sucesso
      
      toast({
        title: "Convites enviados!",
        description: `${emails.length} convite(s) enviado(s) com sucesso.`,
      });
      
      playSound('success');
      return true;
    } catch (error) {
      console.error('Erro ao enviar convites:', error);
      toast({
        title: "Erro",
        description: "Erro ao enviar convites. Tente novamente.",
        variant: "destructive",
      });
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Carregar dados iniciais
  useEffect(() => {
    const user = useAuthStore.getState().user;

    if (!user?.id) {
      setLoading(false);
      return;
    }
    
    // Apenas participantes têm programa de referência
    const userType = useAuthStore.getState().userType;
    if (userType !== 'participante') {
      setLoading(false);
      return;
    }

    let isMounted = true;

    const loadReferralData = async () => {
      setLoading(true);
      try {
        // Passo 1: Obter/Criar código de referência
        let finalCode = '';
        const { data: existingRef } = await supabase
          .from('referencias')
          .select('codigo')
          .eq('participante_id', user.id)
          .single();

        if (existingRef?.codigo) {
          finalCode = existingRef.codigo;
        } else {
          // Se não existe, cria um novo.
          finalCode = await ensureReferralCode(user.id);
        }
        
        if (!isMounted) return;
        setReferralCode(finalCode);
        setReferralLink(`${window.location.origin}/auth?ref=${finalCode}`);

        // Passo 2: Carregar estatísticas e lista de indicados
        const [statsData, referralsData] = await Promise.all([
          fetchReferralStats(user.id),
          fetchReferrals(user.id),
        ]);

        if (!isMounted) return;
        setStats(statsData);
        setReferrals(referralsData);

      } catch (error) {
        console.error('Falha crítica ao carregar dados de referência:', error);
        if (isMounted) {
          setReferralCode('ERRO');
          toast({
            title: "Erro ao carregar referências",
            description: "Não foi possível obter seus dados. Tente novamente mais tarde.",
            variant: "destructive",
          });
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    loadReferralData();

    return () => {
      isMounted = false;
    };
  }, []);

  return {
    loading,
    referrals,
    referralCode,
    referralLink,
    stats,
    validateReferralCode,
    registerReferral,
    completeReferral,
    sendInvites,
    checkAndGenerateRewards,
    refresh: () => {
      if (user?.id) {
        Promise.all([
          fetchReferralStats(user.id),
          fetchReferrals(user.id)
        ]).then(([statsData, referralsData]) => {
          setStats(statsData);
          setReferrals(referralsData);
        });
      }
    }
  };
};

<<<<<<< HEAD
// Nova função encapsulada usando MCP direto
export async function validateReferralCodeMCP(codigo: string) {
  try {
    if (!codigo || codigo.trim().length < 3) {
      return { isValid: false, error: 'Código deve ter pelo menos 3 caracteres' }
    }

    const trimmedCode = codigo.trim().toUpperCase()

    // Consulta SQL direta que faz JOIN e evita problemas de RLS
    const { data, error } = await supabase.rpc('validate_referral_code_direct', {
      input_code: trimmedCode
    })

    if (error) {
      console.error('Erro ao validar código:', error)
      return { isValid: false, error: 'Erro interno do servidor' }
    }

    if (!data || data.length === 0) {
      return { isValid: false, error: 'Código inválido ou expirado' }
    }

    const referralData = data[0]
    
    if (!referralData.active) {
      return { isValid: false, error: 'Usuário do código não está ativo' }
    }

    return {
      isValid: true,
      ownerName: referralData.full_name,
      ownerId: referralData.participante_id
    }

  } catch (error) {
    console.error('Erro na validação MCP:', error)
    return { isValid: false, error: 'Erro interno do servidor' }
  }
=======
// Função MCP para validação (mantida para compatibilidade)
export async function validateReferralCodeMCP(codigo: string) {
  const result = await validateReferralCodeStandalone(codigo);
  return {
    isValid: result.valid,
    error: result.error,
    ownerId: result.participanteId,
    ownerName: result.ownerName
  };
>>>>>>> ff71f6e (BACKUP-REVERT-FROM-MAIN)
}
