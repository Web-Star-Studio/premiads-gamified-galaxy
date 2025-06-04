
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useSounds } from "@/hooks/use-sounds";

export interface Referral {
  id: string;
  name?: string;
  email?: string;
  status: "pending" | "registered" | "completed";
  date: string;
  completedMissions?: number;
  rifasEarned?: number;
}

export interface ReferralReward {
  id: number;
  description: string;
  type: "rifas" | "tickets" | "special";
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
        
        const userReferralCode = referralData?.referral_code || 
          `${userId.substring(0, 8).toUpperCase()}${Math.floor(Math.random() * 1000)}`;
        
        setReferralCode(userReferralCode);
        setReferralLink(`https://premiads.com/r/${userReferralCode}`);
        
        // Get user's referrals with a proper join
        const { data: allReferrals, error: allReferralsError } = await supabase
          .from('referrals')
          .select(`
            id, 
            status, 
            created_at, 
            rifas_awarded,
            referred_id
          `)
          .eq('referrer_id', userId);
        
        if (allReferralsError) throw allReferralsError;
        
        // If no referrals yet, just return empty array
        if (!allReferrals || allReferrals.length === 0) {
          setReferrals([]);
          setLoading(false);
          return;
        }
        
        // Get referred user profiles separately
        const referredIds = allReferrals.map(ref => ref.referred_id).filter(Boolean);
        
        let profiles: any[] = [];
        let profilesError = null;
        
        if (referredIds.length > 0) {
          const result = await supabase
            .from('profiles')
            .select('id, full_name, email')
            .in('id', referredIds);
            
          profiles = result.data || [];
          profilesError = result.error;
        }
        
        if (profilesError) throw profilesError;
        
        // Create a map for quick lookup
        const profileMap = new Map();
        (profiles || []).forEach(profile => {
          profileMap.set(profile.id, profile);
        });
        
        const mappedReferrals: Referral[] = (allReferrals || []).map(referral => {
          const profile = referral.referred_id ? profileMap.get(referral.referred_id) : null;
          
          return {
            id: referral.id,
            name: profile?.full_name || "Amigo convidado",
            email: profile?.email,
            status: referral.status as Referral['status'],
            date: referral.created_at,
            completedMissions: referral.status === "completed" ? 1 : 0,
            rifasEarned: referral.rifas_awarded || 0
          };
        });
        
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
    sendInvites 
  };
};
