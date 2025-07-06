import { useState, useEffect, useCallback } from "react";
import { getSupabaseClient } from "@/lib/supabaseClient";
import { useToast } from "@/hooks/use-toast";
import { useSounds } from "@/hooks/use-sounds";
import { validateReferralCodeStandalone, getReferralStats as getReferralStatsService } from '@/lib/services/referrals'

export { validateReferralCodeStandalone }

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

interface ValidationResult {
  valid: boolean;
  ownerId?: string;
  ownerName?: string;
  error?: string;
}

interface UserReferralCode {
  code: string | null;
  active: boolean;
}

// Cache para evitar múltiplas chamadas simultâneas
const referralCodeCache = new Map<string, Promise<string>>();

export function useReferrals() {
  const [isValidating, setIsValidating] = useState(false);
  const [isLoadingStats, setIsLoadingStats] = useState(false);
  const [isLoadingUserCode, setIsLoadingUserCode] = useState(false);
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

  // Validar código de referência dinamicamente
  const validateReferralCode = useCallback(async (code: string): Promise<ValidationResult> => {
    setIsValidating(true)
    try {
      return await validateReferralCodeStandalone(code)
    } finally {
      setIsValidating(false)
    }
  }, [])

  // Buscar estatísticas de referência dinamicamente
  const getReferralStats = useCallback(async (userId: string): Promise<ReferralStats | null> => {
    if (!userId) return null
    setIsLoadingStats(true)
    try {
      const stats = await getReferralStatsService({ userId })
      return stats
    } catch (error) {
      console.error('Erro ao buscar estatísticas via MCP:', error)
      return null
    } finally {
      setIsLoadingStats(false)
    }
  }, [])

  // Buscar código do usuário dinamicamente
  const getUserReferralCode = useCallback(async (userId: string): Promise<UserReferralCode | null> => {
    const supabase = await getSupabaseClient()
    if (!userId) return null;

    setIsLoadingUserCode(true);
    
    try {
      const { data: referralData, error } = await supabase
        .from('referencias')
        .select('codigo')
        .eq('participante_id', userId)
        .maybeSingle();

      if (error) {
        console.error('Erro ao buscar código do usuário:', error);
        return null;
      }

      return {
        code: referralData?.codigo || null,
        active: !!referralData?.codigo
      };
    } catch (error) {
      console.error('Erro inesperado ao buscar código:', error);
      return null;
    } finally {
      setIsLoadingUserCode(false);
    }
  }, []);

  // Buscar todos os códigos ativos dinamicamente
  const getAllReferralCodes = useCallback(async (): Promise<Array<{id: string, code: string, user_name: string}> | null> => {
    const supabase = await getSupabaseClient()
    try {
      const { data, error } = await supabase
        .from('referencias')
        .select(`
          id,
          codigo,
          profiles!inner(full_name, active, user_type)
        `)
        .eq('profiles.active', true)
        .eq('profiles.user_type', 'participante')
        .order('criado_em', { ascending: false });

      if (error) {
        console.error('Erro ao buscar códigos:', error);
        return null;
      }

      return data?.map((item: any) => ({
        id: item.id,
        code: item.codigo,
        user_name: item.profiles?.full_name || 'Usuário'
      })) || [];
    } catch (error) {
      console.error('Erro inesperado ao buscar códigos:', error);
      return null;
    }
  }, []);

  // Gerar código único baseado no username + ano
  const generateReferralCode = async (userId: string) => {
    const supabase = await getSupabaseClient()
    try {
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('full_name')
        .eq('id', userId)
        .single();

      if (profileError) throw profileError;

      const year = new Date().getFullYear();
      const username = profile?.full_name?.replace(/\s+/g, '').toUpperCase() || 'USER';
      let baseCode = `${username}${year}`;
      
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
      return `USER${new Date().getFullYear()}${Math.floor(Math.random() * 1000)}`;
    }
  };

  // Criar ou recuperar código de referência
  const ensureReferralCode = async (userId: string) => {
    const supabase = await getSupabaseClient()
    if (referralCodeCache.has(userId)) {
      return await referralCodeCache.get(userId)!;
    }

    const promise = (async () => {
      const supabase = await getSupabaseClient()
      try {
        const { data: existingRef, error: refError } = await supabase
          .from('referencias')
          .select('codigo')
          .eq('participante_id', userId)
          .maybeSingle();

        if (refError && refError.code !== 'PGRST116') throw refError;

        if (existingRef) {
          return existingRef.codigo;
        }

        let attempts = 0;
        const maxAttempts = 5;
        
        while (attempts < maxAttempts) {
          try {
            const baseCode = await generateReferralCode(userId);
            const finalCode = attempts === 0 ? baseCode : `${baseCode}${Math.floor(Math.random() * 1000)}`;
            
            const { error: insertError } = await supabase
              .from('referencias')
              .insert({
                codigo: finalCode,
                participante_id: userId
              });

            if (!insertError) {
              return finalCode;
            }

            if (insertError.code !== '23505') {
              throw insertError;
            }

            attempts++;
          } catch (error: any) {
            if (error.code !== '23505') {
              throw error;
            }
            attempts++;
          }
        }

        throw new Error('Não foi possível gerar código de referência único após múltiplas tentativas');
      } catch (error) {
        console.error('Erro ao garantir código de referência:', error);
        throw error;
      } finally {
        referralCodeCache.delete(userId);
      }
    })();

    referralCodeCache.set(userId, promise);
    
    return await promise;
  };

  useEffect(() => {
    const fetchReferrals = async () => {
      const supabase = await getSupabaseClient()
      try {
        const session = await supabase.auth.getSession();
        const userId = session.data.session?.user.id;
        
        if (!userId) {
          setLoading(false);
          return;
        }
        
        const userReferralCode = await ensureReferralCode(userId);
        setReferralCode(userReferralCode);
        setReferralLink(`${window.location.origin}/registro?ref=${userReferralCode}`);
        
        const referralStats = await getReferralStats(userId);
        setStats(referralStats);
        
        const { data: userRef } = await supabase
          .from('referencias')
          .select('id')
          .eq('participante_id', userId)
          .maybeSingle();

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

  // Registrar nova indicação
  const registerReferral = async (referenciaId: string, convidadoId: string) => {
    const supabase = await getSupabaseClient()
    try {
      const { error } = await supabase
        .from('indicacoes')
        .insert({
          referencia_id: referenciaId,
          convidado_id: convidadoId,
          status: 'pendente'
        });

      if (error) throw error;
      
      toast({
        title: "Indicação registrada!",
        description: "Sua indicação foi registrada com sucesso.",
      });
      
      playSound("success");
    } catch (error: any) {
      console.error('Erro ao registrar indicação:', error);
      toast({
        title: "Erro ao registrar indicação",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  // Completar indicação
  const completeReferral = async (convidadoId: string) => {
    const supabase = await getSupabaseClient()
    try {
      const { error } = await supabase.functions.invoke('referral-system', {
        body: {
          action: 'process_mission_completion',
          userId: convidadoId
        }
      });

      if (error) throw error;
      
      toast({
        title: "Indicação completada!",
        description: "Recompensa de 200 rifas foi concedida.",
      });
      
      playSound("success");
    } catch (error: any) {
      console.error('Erro ao completar indicação:', error);
      toast({
        title: "Erro ao completar indicação",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  return {
    loading,
    referrals,
    referralCode,
    referralLink,
    stats,
    validateReferralCode,
    registerReferral,
    completeReferral,
    isValidating,
    isLoadingStats,
    isLoadingUserCode,
    getReferralStats,
    getUserReferralCode,
    getAllReferralCodes
  };
}

// Nova função encapsulada usando MCP direto
export async function validateReferralCodeMCP(codigo: string) {
  const supabase = await getSupabaseClient()
  try {
    if (!codigo?.trim()) {
      return { valid: false, error: 'Código é obrigatório' };
    }

    const cleanCode = codigo.trim().toUpperCase();

    const { data, error } = await supabase.functions.invoke('referral-system', {
      body: {
        action: 'validate_code',
        referralCode: cleanCode
      }
    });

    if (error) {
      console.error('Erro na validação MCP:', error);
      return { valid: false, error: 'Erro ao validar código' };
    }

    if (!data?.success) {
      return { valid: false, error: data?.error || 'Código inválido' };
    }

    return {
      valid: true,
      ownerId: data.data?.ownerId,
      ownerName: data.data?.ownerName
    };
  } catch (error) {
    console.error('Erro inesperado na validação MCP:', error);
    return { valid: false, error: 'Erro inesperado' };
  }
}
