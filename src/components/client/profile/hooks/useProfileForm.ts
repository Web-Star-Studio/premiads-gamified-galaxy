import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useToast } from "@/hooks/use-toast";
import { useSounds } from "@/hooks/use-sounds";
import { supabase } from "@/integrations/supabase/client";
import { profileFormSchema, ProfileFormValues } from "../types/profileTypes";
import { useProfile } from "@/hooks/user/useProfile";
import { POINTS_PER_PROFILE_COMPLETION } from "../constants/formOptions";

export function useProfileForm() {
  const { toast } = useToast();
  const { playSound } = useSounds();
  const [loading, setLoading] = useState(false);
  const [pointsAwarded, setPointsAwarded] = useState(false);
  const { profile, loading: profileLoading } = useProfile();
  
  // Create form
  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      ageRange: undefined,
      location: "",
      profession: "",
      maritalStatus: undefined,
      gender: undefined,
      interests: [],
      serviceUsageFrequency: undefined,
      transportationType: undefined,
      digitalPlatforms: [],
      householdSize: undefined,
      educationLevel: undefined,
      sustainabilityInterest: undefined,
    },
  });

  // Load profile data
  useEffect(() => {
    if (profile && !profileLoading) {
      form.reset(profile.profile_data as ProfileFormValues);
    }
  }, [profile, profileLoading, form]);

  const onSubmit = async (data: ProfileFormValues) => {
    setLoading(true);
    try {
      const { data: sessionData } = await supabase.auth.getSession();
      
      if (!sessionData.session) {
        throw new Error("Usuário não autenticado");
      }
      
      const userId = sessionData.session.user.id;
      
      // Update user type and profile completion status
      const { error } = await supabase.rpc('update_user_type', {
        user_id: userId,
        new_type: 'participante',
        mark_completed: true
      });
      
      if (error) throw error;
      
      // Award points if profile wasn't completed before
      if (!profile?.profile_completed) {
        const { error: pointsError } = await supabase.rpc('update_user_credits', {
          user_id: userId,
          new_credits: POINTS_PER_PROFILE_COMPLETION
        });
        
        if (pointsError) throw pointsError;
        
        setPointsAwarded(true);
        playSound("chime");
      }
      
      toast({
        title: "Perfil atualizado",
        description: !profile?.profile_completed 
          ? `Seu perfil foi atualizado e você ganhou ${POINTS_PER_PROFILE_COMPLETION} pontos!` 
          : "Seu perfil foi atualizado com sucesso!",
      });
      
    } catch (error: any) {
      console.error("Error updating profile:", error);
      toast({
        title: "Erro ao atualizar perfil",
        description: error.message || "Não foi possível salvar os dados do seu perfil. Tente novamente mais tarde.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return {
    form,
    loading: loading || profileLoading,
    pointsAwarded,
    hasCompletedBefore: profile?.profile_completed || false,
    onSubmit,
    setPointsAwarded
  };
}
