
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { UserType } from "@/types/auth";

export const useUserProfileOperations = (userId: string | null, userName: string, userType: UserType) => {
  const { toast } = useToast();

  const saveUserPreferences = async () => {
    if (!userId) return;

    try {
      const { error } = await supabase
        .from("profiles")
        .update({
          full_name: userName,
          user_type: userType,
          updated_at: new Date().toISOString(),
          profile_completed: true,
        })
        .eq("id", userId);

      if (error) {
        toast({
          title: "Erro",
          description: "Não foi possível salvar suas preferências.",
          variant: "destructive",
        });
        throw error;
      }

      toast({
        title: "Sucesso",
        description: "Suas preferências foram salvas com sucesso.",
      });
    } catch (error) {
      throw error;
    }
  };

  return { saveUserPreferences };
};
