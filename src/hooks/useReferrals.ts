import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { useSounds } from "@/hooks/use-sounds";
import { supabase } from "@/integrations/supabase/client";

export interface Referral {
  id: string;
  name?: string;
  email?: string;
  status: "pending" | "registered" | "completed";
  date: string;
  completedMissions?: number;
  pointsEarned?: number;
}

export interface ReferralReward {
  id: number;
  description: string;
  type: "points" | "tickets" | "special";
  value: number;
  status: "available" | "claimed";
  expiresAt?: string;
}

export const useReferrals = () => {
  const [loading, setLoading] = useState(true);
  const [referrals, setReferrals] = useState<Referral[]>([]);
  const [referralCode, setReferralCode] = useState("");
  const [referralLink, setReferralLink] = useState("");
  const { toast } = useToast();
  const { playSound } = useSounds();

  useEffect(() => {
    const fetchReferrals = async () => {
      try {
        const session = await supabase.auth.getSession();
        const userId = session.data.session?.user.id;
        
        if (!userId) {
          throw new Error("Usuário não autenticado");
        }
        
        // Get user's referral code
        const { data: referralData, error: referralError } = await supabase
          .from('referrals')
          .select('referral_code')
          .eq('referrer_id', userId)
          .maybeSingle();
        
        if (referralError) throw referralError;
        
        let userReferralCode = "";
        
        if (referralData?.referral_code) {
          userReferralCode = referralData.referral_code;
        } else {
          // Generate new referral code
          userReferralCode = `${userId.substring(0, 8).toUpperCase()}${Math.floor(Math.random() * 1000)}`;
          
          const { error: insertError } = await supabase
            .from("referrals")
            .insert({
              referrer_id: userId,
              referral_code: userReferralCode,
            });
          
          if (insertError) throw insertError;
        }
        
        setReferralCode(userReferralCode);
        setReferralLink(`https://premiads.com/r/${userReferralCode}`);
        
        // Get user's referrals
        const { data: allReferrals, error: allReferralsError } = await supabase
          .from('referrals')
          .select(`
            id,
            referred_id,
            status,
            created_at,
            completed_at,
            points_awarded,
            referred:profiles!referrals_referred_id_fkey(
              full_name,
              email
            )
          `)
          .eq('referrer_id', userId);
        
        if (allReferralsError) throw allReferralsError;
        
        const mappedReferrals: Referral[] = (allReferrals || []).map(referral => ({
          id: referral.id,
          name: referral.referred?.full_name || "Amigo convidado",
          email: referral.referred?.email,
          status: referral.status as Referral['status'],
          date: referral.created_at,
          completedMissions: referral.status === "completed" ? 1 : 0,
          pointsEarned: referral.points_awarded || 0
        }));
        
        setReferrals(mappedReferrals);
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
      // For demo purposes, we'll just show a success toast
      
      playSound("reward");
      toast({
        title: "Convites enviados!",
        description: `${validEmails.length} convite(s) enviado(s) com sucesso.`,
      });
      
      return true;
    } catch (error: any) {
      console.error("Error sending invites:", error);
      toast({
        title: "Erro ao enviar convites",
        description: error.message || "Ocorreu um erro ao enviar os convites",
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
    sendInvites
  };
};
