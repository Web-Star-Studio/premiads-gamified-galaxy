
import { useCallback } from "react";
import { useToast } from "@/hooks/use-toast";

export interface CreateUserInput {
  email: string;
  name: string;
  password: string;
  user_type: "admin" | "moderator" | "anunciante" | "participante";
  active?: boolean;
}

export function useAdminCreateUser() {
  const { toast } = useToast();

  const createUser = useCallback(async (input: CreateUserInput) => {
    try {
      const response = await fetch(
        "https://zfryjwaeojccskfiibtq.functions.supabase.co/admin-create-user",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(input),
        }
      );
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "User creation failed");

      toast({
        title: "Usuário criado",
        description: "O novo usuário foi criado com sucesso.",
        variant: "default"
      });
      return { success: true, user_id: data.user_id };
    } catch (error: any) {
      toast({
        title: "Erro ao criar usuário",
        description: error.message,
        variant: "destructive"
      });
      return { success: false, error: error.message };
    }
  }, [toast]);

  return { createUser };
}
