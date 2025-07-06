import { useState, useEffect, useCallback } from "react";
import { useUser } from "@/context/UserContext";
import { supabase } from "@/integrations/supabase/client";
import { useSounds } from "@/hooks/use-sounds";
import { useToast } from "@/hooks/use-toast";
import { getUserProfile, updateUserProfile } from '@/lib/services/profile'

export const useProfileData = () => {
  const { userName, setUserName } = useUser();
  const { playSound } = useSounds();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [rifas, setRifas] = useState(0);
  const [cashback, setCashback] = useState(0);
  const [streak, setStreak] = useState(0);
  const [isProfileCompleted, setIsProfileCompleted] = useState(false);
  const [profileData, setProfileData] = useState<any>(null);
  const [authError, setAuthError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        
        if (sessionError || !session) {
          setRifas(0);
          setCashback(0);
          setStreak(0);
          setIsProfileCompleted(false);
          setLoading(false);
          return;
        }
        
        const userId = session.user.id;
        
        if (!userId) {
          setRifas(0);
          setCashback(0);
          setStreak(0);
          setIsProfileCompleted(false);
          setLoading(false);
          return;
        }
        
        const profileRecord = await getUserProfile({ userId })
        setProfileData(profileRecord)
        setRifas(profileRecord.rifas)
        setCashback(profileRecord.cashback_balance)
        setIsProfileCompleted(profileRecord.profile_completed)
        if (profileRecord.full_name && !userName) setUserName(profileRecord.full_name)
        
        setStreak(0);
        localStorage.setItem("lastActivity", Date.now().toString());
      } catch (error: any) {
        console.error("Error fetching user data:", error);
        setRifas(0);
        setCashback(0);
        setStreak(0);
        setIsProfileCompleted(false);
      } finally {
        setLoading(false);
        playSound("chime");
        
        const lastActivity = localStorage.getItem("lastActivity");
        if (lastActivity && Date.now() - parseInt(lastActivity) > 86400000) {
          toast({
            title: "Streak em risco!",
            description: "Você está há mais de 24h sem atividade. Complete uma missão hoje!",
          });
        }
      }
    };

    fetchUserData();
  }, [userName, setUserName, playSound, toast]);

  // Atualizar perfil do usuário
  const updateProfile = useCallback(async (updates: Partial<{ full_name: string; rifas: number; cashback_balance: number; profile_completed: boolean }>) => {
    try {
      const { data: { session } } = await supabase.auth.getSession()
      const userId = session?.user.id
      if (!userId) throw new Error('Usuário não autenticado')
      const updated = await updateUserProfile({ userId, updates })
      setProfileData(updated)
      if (updated.full_name) setUserName(updated.full_name)
      toast({ title: 'Perfil atualizado com sucesso' })
      playSound('success')
      return updated
    } catch (error: any) {
      console.error('Erro ao atualizar perfil:', error)
      toast({ title: 'Erro ao atualizar perfil', description: error.message, variant: 'destructive' })
      throw error
    }
  }, [playSound, toast, setUserName]);

  return {
    loading,
    points: rifas,
    credits: cashback,
    rifas,
    cashback,
    streak,
    isProfileCompleted,
    profileData,
    authError,
    updateProfile
  };
};
