
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

  // Fetch user's referrals and generate referral code if needed
  useEffect(() => {
    const fetchReferrals = async () => {
      setLoading(true);
      try {
        const session = await supabase.auth.getSession();
        const userId = session.data.session?.user.id;
        
        if (!userId) {
          throw new Error("Usuário não autenticado");
        }
        
        // Generate or get user's referral code
        const { data: referralData, error: referralError } = await supabase
          .from("referrals")
          .select("referral_code")
          .eq("referrer_id", userId)
          .limit(1);
        
        if (referralError) throw referralError;
        
        let userReferralCode = "";
        
        if (referralData && referralData.length > 0) {
          userReferralCode = referralData[0].referral_code;
        } else {
          // Generate new referral code
          userReferralCode = `${userId.substring(0, 8).toUpperCase()}${Math.floor(Math.random() * 1000)}`;
          
          // Save new referral code
          const { error: insertError } = await supabase
            .from("referrals")
            .insert({
              referrer_id: userId,
              referral_code: userReferralCode,
            });
          
          if (insertError) throw insertError;
        }
        
        setReferralCode(userReferralCode);
        // In a real app, this would be the actual website URL
        setReferralLink(`https://premiads.com/r/${userReferralCode}`);
        
        // Get user's referrals with proper error handling for join queries
        const { data: allReferrals, error: allReferralsError } = await supabase
          .from("referrals")
          .select(`
            id,
            referral_code,
            status,
            created_at,
            completed_at,
            referred_id
          `)
          .eq("referrer_id", userId);
        
        if (allReferralsError) throw allReferralsError;
        
        // Get profile names for referred users in a separate query
        const referredIds = allReferrals
          ?.filter(ref => ref.referred_id)
          .map(ref => ref.referred_id) || [];
          
        let profilesMap: Record<string, string> = {};
        
        if (referredIds.length > 0) {
          const { data: profilesData } = await supabase
            .from("profiles")
            .select("id, full_name")
            .in("id", referredIds);
            
          if (profilesData) {
            profilesMap = profilesData.reduce((acc, profile) => {
              if (profile.id) {
                acc[profile.id] = profile.full_name || "Usuário";
              }
              return acc;
            }, {} as Record<string, string>);
          }
        }
        
        // Transform data for UI
        const mappedReferrals: Referral[] = (allReferrals || []).map(referral => ({
          id: referral.id,
          name: referral.referred_id 
            ? profilesMap[referral.referred_id] || "Amigo convidado"
            : "Amigo convidado",
          status: referral.status === "completed" 
            ? "completed" 
            : referral.referred_id 
              ? "registered" 
              : "pending",
          date: referral.created_at,
          completedMissions: referral.status === "completed" ? 1 : 0,
          pointsEarned: referral.status === "completed" ? 200 : 0,
        }));
        
        setReferrals(mappedReferrals);
        playSound("chime");
      } catch (error: any) {
        console.error("Error fetching referrals:", error);
        toast({
          title: "Erro ao carregar referências",
          description: error.message || "Ocorreu um erro ao buscar suas referências",
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
