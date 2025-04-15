
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useToast } from "@/hooks/use-toast";
import { useSounds } from "@/hooks/use-sounds";
import { supabase } from "@/integrations/supabase/client";
import { profileFormSchema, ProfileFormValues } from "../types/profileTypes";
import { POINTS_PER_PROFILE_COMPLETION } from "../constants/formOptions";

export function useProfileForm() {
  const { toast } = useToast();
  const { playSound } = useSounds();
  const [loading, setLoading] = useState(false);
  const [pointsAwarded, setPointsAwarded] = useState(false);
  const [hasCompletedBefore, setHasCompletedBefore] = useState(false);
  
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

  // Fetch existing profile data when component mounts
  useEffect(() => {
    const fetchProfileData = async () => {
      setLoading(true);
      try {
        const { data: { session } } = await supabase.auth.getSession();
        
        if (session) {
          const userId = session.user.id;
          
          // Fetch profile data
          const { data: profileData, error } = await supabase
            .from('profiles')
            .select('profile_data, profile_completed')
            .eq('id', userId)
            .single();
          
          if (error) throw error;
          
          if (profileData) {
            // If user has profile data, populate the form
            if (profileData.profile_data) {
              form.reset(profileData.profile_data as ProfileFormValues);
            }
            
            // Check if user has already completed the profile before
            setHasCompletedBefore(profileData.profile_completed || false);
          }
        } else {
          // Handle test mode - simulate profile data
          console.log("No authenticated session - using test mode");
        }
      } catch (error) {
        console.error("Error fetching profile data:", error);
        toast({
          title: "Erro ao carregar perfil",
          description: "Não foi possível carregar os dados do seu perfil. Tente novamente mais tarde.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };
    
    fetchProfileData();
  }, [form, toast]);

  const onSubmit = async (data: ProfileFormValues) => {
    setLoading(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (session) {
        const userId = session.user.id;
        
        // Update profile data
        const { error } = await supabase
          .from('profiles')
          .update({
            profile_data: data,
            profile_completed: true,
          })
          .eq('id', userId);
        
        if (error) throw error;
        
        // Award points if user hasn't completed the profile before
        if (!hasCompletedBefore) {
          // First, fetch current points
          const { data: currentProfile, error: fetchError } = await supabase
            .from('profiles')
            .select('points')
            .eq('id', userId)
            .single();
          
          if (fetchError) throw fetchError;
          
          // Then update with incremented value
          const newPoints = (currentProfile?.points || 0) + POINTS_PER_PROFILE_COMPLETION;
          
          const { error: pointsError } = await supabase
            .from('profiles')
            .update({
              points: newPoints
            })
            .eq('id', userId);
          
          if (pointsError) throw pointsError;
          
          setPointsAwarded(true);
          playSound("chime");
        }
        
        toast({
          title: "Perfil atualizado",
          description: !hasCompletedBefore 
            ? `Seu perfil foi atualizado e você ganhou ${POINTS_PER_PROFILE_COMPLETION} pontos!` 
            : "Seu perfil foi atualizado com sucesso!",
        });
        
        // Update state to reflect that profile has been completed
        setHasCompletedBefore(true);
      } else {
        // Handle test mode
        console.log("Form submitted in test mode:", data);
        toast({
          title: "Perfil atualizado (modo de teste)",
          description: "Seu perfil foi atualizado com sucesso!",
        });
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      toast({
        title: "Erro ao atualizar perfil",
        description: "Não foi possível salvar os dados do seu perfil. Tente novamente mais tarde.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return {
    form,
    loading,
    pointsAwarded,
    hasCompletedBefore,
    onSubmit,
    setPointsAwarded
  };
}
