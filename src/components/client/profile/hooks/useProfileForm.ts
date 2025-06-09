import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useToast } from "@/hooks/use-toast";
import { useSounds } from "@/hooks/use-sounds";
import { supabase } from "@/integrations/supabase/client";
import { profileFormSchema, ProfileFormValues } from "../types/profileTypes";

// Change from 10 tickets to 2 rifas as specified in requirements
const RIFAS_PER_PROFILE_COMPLETION = 2;
const TEMP_PROFILE_DATA_KEY = "temp_profile_data";

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
      instagramUrl: '',
      tiktokUrl: '',
      youtubeUrl: '',
      twitterUrl: '',
    },
  });

  // Save form data to temporary storage when it changes
  useEffect(() => {
    const subscription = form.watch((data) => {
      if (Object.values(data).some(val => val !== undefined && val !== "" && 
          (Array.isArray(val) ? val.length > 0 : true))) {
        // Use IndexedDB to store temp data
        const saveToIndexedDB = async () => {
          try {
            const db = await openDB();
            const tx = db.transaction('tempProfileData', 'readwrite');
            const store = tx.objectStore('tempProfileData');
            // Store data with a fixed key
            await store.put(data, 'profileData');
          } catch (error) {
            console.error('Error saving to IndexedDB:', error);
          }
        };
        
        saveToIndexedDB();
      }
    });
    
    return () => subscription.unsubscribe();
  }, [form]);

  // Fetch existing profile data when component mounts
  useEffect(() => {
    const fetchProfileData = async () => {
      setLoading(true);
      try {
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        
        if (sessionError || !session) {
          console.log("No authenticated session - using test mode");
          setLoading(false);
          return;
        }
        
        const userId = session.user.id;
        
        // Fetch profile data
        const { data: profileData, error } = await supabase
          .from('profiles')
          .select('profile_data, profile_completed')
          .eq('id', userId)
          .single();
        
        if (error) {
          console.error("Error fetching profile data:", error);
          throw error;
        }
        
        if (profileData) {
          // If user has profile data, populate the form
          if (profileData.profile_data) {
            form.reset(profileData.profile_data as ProfileFormValues);
          } else {
            // Try to load data from IndexedDB if no profile data exists
            try {
              const db = await openDB();
              const tx = db.transaction('tempProfileData', 'readonly');
              const store = tx.objectStore('tempProfileData');
              const tempData = await store.get('profileData');
              
              if (tempData) {
                form.reset(tempData as ProfileFormValues);
              }
            } catch (error) {
              console.error('Error loading from IndexedDB:', error);
            }
          }
          
          // Check if user has already completed the profile before
          setHasCompletedBefore(profileData.profile_completed || false);
        } else {
          // Try to load from IndexedDB even if no profile exists
          try {
            const db = await openDB();
            const tx = db.transaction('tempProfileData', 'readonly');
            const store = tx.objectStore('tempProfileData');
            const tempData = await store.get('profileData');
            
            if (tempData) {
              form.reset(tempData as ProfileFormValues);
            }
          } catch (error) {
            console.error('Error loading from IndexedDB:', error);
          }
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

  // Check if form is fully completed
  const isFormFullyCompleted = (): boolean => {
    const values = form.getValues();
    return !!(
      values.ageRange &&
      values.location &&
      values.profession &&
      values.maritalStatus &&
      values.gender &&
      values.interests?.length > 0 &&
      values.serviceUsageFrequency &&
      values.transportationType &&
      values.digitalPlatforms?.length > 0 &&
      values.householdSize &&
      values.educationLevel &&
      values.sustainabilityInterest
    );
  };

  // Helper function to open IndexedDB
  const openDB = async () => {
    return new Promise<IDBDatabase>((resolve, reject) => {
      const request = indexedDB.open('profileFormDB', 1);
      
      request.onerror = () => reject(request.error);
      
      request.onsuccess = () => resolve(request.result);
      
      request.onupgradeneeded = (event) => {
        const db = request.result;
        if (!db.objectStoreNames.contains('tempProfileData')) {
          db.createObjectStore('tempProfileData');
        }
      };
    });
  };

  // Helper function to clear temp data
  const clearTempData = async () => {
    try {
      const db = await openDB();
      const tx = db.transaction('tempProfileData', 'readwrite');
      const store = tx.objectStore('tempProfileData');
      await store.delete('profileData');
    } catch (error) {
      console.error('Error clearing IndexedDB:', error);
    }
  };

  const onSubmit = async (data: ProfileFormValues) => {
    setLoading(true);
    try {
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      
      if (sessionError || !session) {
        toast({
          title: "Autenticação necessária",
          description: "Você precisa estar logado para atualizar seu perfil.",
          variant: "destructive",
        });
        setLoading(false);
        return;
      }
      
      const userId = session.user.id;
      
      // Check if all required fields are filled
      const isCompleted = isFormFullyCompleted();
      
      // Update profile data
      const { error } = await supabase
        .from('profiles')
        .update({
          profile_data: data,
          profile_completed: isCompleted, // Only mark as completed if all fields are filled
          updated_at: new Date().toISOString()
        })
        .eq('id', userId);
      
      if (error) throw error;
      
      // Award rifas only if:
      // 1. User has not completed profile before
      // 2. All fields are fully completed
      if (!hasCompletedBefore && isCompleted) {
        // First, fetch current rifas
        const { data: currentProfile, error: fetchError } = await supabase
          .from('profiles')
          .select('rifas')
          .eq('id', userId)
          .single();
        
        if (fetchError) throw fetchError;
        
        // Then update with incremented value
        const newRifas = (currentProfile?.rifas || 0) + RIFAS_PER_PROFILE_COMPLETION;
        
        const { error: rifasError } = await supabase
          .from('profiles')
          .update({
            rifas: newRifas
          })
          .eq('id', userId);
        
        if (rifasError) throw rifasError;
        
        setPointsAwarded(true);
        playSound("chime");
        
        // Clear temporary data after successful completion
        if (isCompleted) {
          await clearTempData();
        }
      }
      
      toast({
        title: "Perfil atualizado",
        description: (!hasCompletedBefore && isCompleted)
          ? `Seu perfil foi atualizado e você ganhou ${RIFAS_PER_PROFILE_COMPLETION} rifas!` 
          : "Seu perfil foi atualizado com sucesso!",
      });
      
      // Update state to reflect that profile has been completed
      if (isCompleted) {
        setHasCompletedBefore(true);
      }
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
    loading,
    pointsAwarded,
    hasCompletedBefore,
    onSubmit,
    setPointsAwarded
  };
}
