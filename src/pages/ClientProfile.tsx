import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { User, Mail, Phone, MapPin, Bell, Lock, ArrowLeft, ChevronRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useUser } from "@/context/UserContext";
import { useUserProfile } from "@/hooks/useUserProfile";
import { useToast } from "@/hooks/use-toast";
import { useSounds } from "@/hooks/use-sounds";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ClientDashboardHeader from "@/components/client/ClientDashboardHeader";
import ProfileForm from "@/components/client/profile/ProfileForm";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { supabase } from "@/integrations/supabase/client";

// Form schemas for validation - removed social media fields from personal info
const personalInfoSchema = z.object({
  fullName: z.string().min(3, { message: "Nome deve ter pelo menos 3 caracteres" }),
  email: z.string().email({ message: "Email inválido" }),
  phone: z.string().optional(),
  location: z.string().optional(),
});

const preferenceSchema = z.object({
  emailNotifications: z.boolean().default(true),
  pushNotifications: z.boolean().default(true),
  marketingEmails: z.boolean().default(false),
  newMissionAlerts: z.boolean().default(true),
});

const ClientProfile = () => {
  const { userName } = useUserProfile();
  const { setUserName } = useUser(); // Manter para compatibilidade com localStorage
  const navigate = useNavigate();
  const { toast } = useToast();
  const { playSound } = useSounds();
  const [loading, setLoading] = useState(false);
  const [userEmail, setUserEmail] = useState("");
  const [fetchError, setFetchError] = useState("");

  // Initialize form with current user data
  const personalInfoForm = useForm<z.infer<typeof personalInfoSchema>>({
    resolver: zodResolver(personalInfoSchema),
    defaultValues: {
      fullName: userName,
      email: "",
      phone: "",
      location: "",
    },
  });

  // Fetch user data from Supabase when component mounts
  useEffect(() => {
    const fetchUserData = async () => {
      setFetchError("");
      try {
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        if (sessionError || !session) {
          console.log("No authenticated session");
          return;
        }

        const userId = session.user.id;
        const userEmail = session.user.email || "";
        setUserEmail(userEmail);
        
        // Set email value immediately from session
        personalInfoForm.setValue("email", userEmail);

        // Fetch profile data - don't query for location column since it doesn't exist
        const { data: profileData, error } = await supabase
          .from('profiles')
          .select('profile_data, full_name, phone')
          .eq('id', userId)
          .single();
        
        if (error) {
          console.error("Error fetching profile data:", error);
          setFetchError(`Erro ao carregar dados: ${error.message}`);
          return;
        }
        
        if (profileData) {
          // Set form values from database
          personalInfoForm.setValue("fullName", profileData.full_name || userName);
          personalInfoForm.setValue("phone", profileData.phone || "");
          
          // Try to get location from profile_data if it exists there
          if (profileData.profile_data && typeof profileData.profile_data === 'object') {
            const profileDataObj = profileData.profile_data as Record<string, any>;
            
            // Try multiple possible paths for location data
            let locationValue = "";
            if (profileDataObj.location) {
              locationValue = profileDataObj.location;
            } else if (profileDataObj.personalInfo?.location) {
              locationValue = profileDataObj.personalInfo.location;
            }
            
            personalInfoForm.setValue("location", locationValue);
          }
          
          // Update user name in context if needed
          if (profileData.full_name && profileData.full_name !== userName) {
            setUserName(profileData.full_name);
          }
        }
      } catch (error: any) {
        console.error("Error fetching user data:", error);
        setFetchError(`Erro ao carregar dados: ${error.message || "Erro desconhecido"}`);
      }
    };

    fetchUserData();
  }, [personalInfoForm, setUserName, userName]);

  const preferencesForm = useForm<z.infer<typeof preferenceSchema>>({
    resolver: zodResolver(preferenceSchema),
    defaultValues: {
      emailNotifications: true,
      pushNotifications: true,
      marketingEmails: false,
      newMissionAlerts: true,
    },
  });

  const handlePersonalInfoSubmit = async (values: z.infer<typeof personalInfoSchema>) => {
    setLoading(true);
    try {
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      if (sessionError || !session) throw new Error('Sessão não encontrada');

      const userId = session.user.id;

      // Fetch current profile data to preserve profile_data structure
      const { data: currentProfile, error: fetchError } = await supabase
        .from('profiles')
        .select('profile_data')
        .eq('id', userId)
        .single();
      
      if (fetchError) throw fetchError;
      
      // Update profile_data with the new location value
      const updatedProfileData = {
        ...((currentProfile?.profile_data as Record<string, any>) || {}),
        personalInfo: {
          ...((currentProfile?.profile_data as Record<string, any>)?.personalInfo || {}),
          location: values.location,
        },
        location: values.location, // Store in both places for compatibility
      };

      // Update profile with the fields we know exist
      const { error } = await supabase
        .from('profiles')
        .update({
          full_name: values.fullName,
          phone: values.phone,
          profile_data: updatedProfileData,
          updated_at: new Date().toISOString()
        })
        .eq('id', userId);

      if (error) throw error;

      setUserName(values.fullName);
      toast({ title: 'Perfil atualizado', description: 'Informações salvas com sucesso!' });
      playSound('chime');
    } catch (err: any) {
      console.error(err);
      toast({ title: 'Erro ao salvar', description: err.message, variant: 'destructive' });
      playSound('error');
    } finally {
      setLoading(false);
    }
  };

  const handlePreferencesSubmit = (values: z.infer<typeof preferenceSchema>) => {
    setLoading(true);
    // Simulate API call with timeout
    setTimeout(() => {
      setLoading(false);
      toast({
        title: "Preferências atualizadas",
        description: "Suas preferências de notificação foram atualizadas com sucesso!",
      });
      playSound("chime");
    }, 800);
  };

  // Add these additional state variables and handlers for the security tab
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  
  const handleUpdatePassword = async () => {
    // Reset errors
    setPasswordError("");
    
    // Validate inputs
    if (!currentPassword) {
      setPasswordError("Senha atual é obrigatória");
      return;
    }
    
    if (!newPassword) {
      setPasswordError("Nova senha é obrigatória");
      return;
    }
    
    if (newPassword.length < 6) {
      setPasswordError("A nova senha deve ter pelo menos 6 caracteres");
      return;
    }
    
    if (newPassword !== confirmNewPassword) {
      setPasswordError("As senhas não coincidem");
      return;
    }
    
    setLoading(true);
    
    try {
      // First verify the current password
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email: userEmail, // Use the actual user email
        password: currentPassword
      });
      
      if (signInError) {
        setPasswordError("Senha atual incorreta");
        return;
      }
      
      // Update the password
      const { error: updateError } = await supabase.auth.updateUser({
        password: newPassword
      });
      
      if (updateError) throw updateError;
      
      // Clear form
      setCurrentPassword("");
      setNewPassword("");
      setConfirmNewPassword("");
      
      toast({
        title: "Senha atualizada",
        description: "Sua senha foi atualizada com sucesso",
      });
      
      playSound("chime");
    } catch (error: any) {
      toast({
        title: "Erro ao atualizar senha",
        description: error.message || "Ocorreu um erro inesperado",
        variant: "destructive",
      });
      
      playSound("error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-galaxy-dark pb-20">
      <div className="container px-4 py-8 mx-auto">
        <ClientDashboardHeader
          title="Gerenciar Perfil"
          description="Atualize suas informações pessoais e preferências"
          userName={userName}
          showBackButton={true}
          backTo="/cliente"
        />

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-8"
        >
          <Tabs defaultValue="personal" className="w-full">
            <TabsList className="grid w-full grid-cols-4 bg-galaxy-deepPurple/50 border border-galaxy-purple/20">
              <TabsTrigger value="personal">Informações Pessoais</TabsTrigger>
              <TabsTrigger value="profile_form">Perfil Completo</TabsTrigger>
              <TabsTrigger value="preferences">Preferências</TabsTrigger>
              <TabsTrigger value="security">Segurança</TabsTrigger>
            </TabsList>
            
            <TabsContent value="personal" className="mt-6">
              <Card className="bg-galaxy-deepPurple/30 border-galaxy-purple/30">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <User className="w-5 h-5 text-neon-cyan" />
                    <span>Informações Pessoais</span>
                  </CardTitle>
                  <CardDescription>
                    Atualize suas informações de perfil para personalizar sua experiência
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {fetchError && (
                    <div className="mb-4 p-3 rounded-md bg-red-500/20 border border-red-500/30 text-sm text-white">
                      {fetchError}
                    </div>
                  )}
                  <form onSubmit={personalInfoForm.handleSubmit(handlePersonalInfoSubmit)} className="space-y-6">
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="fullName">Nome Completo</Label>
                        <div className="relative">
                          <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                          <Input
                            id="fullName"
                            placeholder="Seu nome completo"
                            className="pl-10"
                            {...personalInfoForm.register("fullName")}
                          />
                        </div>
                        {personalInfoForm.formState.errors.fullName && (
                          <p className="text-sm text-destructive">{personalInfoForm.formState.errors.fullName.message}</p>
                        )}
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <div className="relative">
                          <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                          <Input
                            id="email"
                            placeholder="Seu endereço de email"
                            className="pl-10 bg-galaxy-deepPurple/80 text-gray-300"
                            disabled
                            {...personalInfoForm.register("email")}
                          />
                        </div>
                        <p className="text-xs text-gray-400">O email é gerenciado pela sua conta e não pode ser alterado aqui.</p>
                        {personalInfoForm.formState.errors.email && (
                          <p className="text-sm text-destructive">{personalInfoForm.formState.errors.email.message}</p>
                        )}
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="phone">Telefone (opcional)</Label>
                        <div className="relative">
                          <Phone className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                          <Input
                            id="phone"
                            placeholder="Seu número de telefone"
                            className="pl-10"
                            {...personalInfoForm.register("phone")}
                          />
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="location">Localização (opcional)</Label>
                        <div className="relative">
                          <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                          <Input
                            id="location"
                            placeholder="Sua cidade/estado"
                            className="pl-10"
                            {...personalInfoForm.register("location")}
                          />
                        </div>
                      </div>
                    </div>
                    
                    <Button type="submit" className="w-full neon-button" disabled={loading}>
                      {loading ? "Salvando..." : "Salvar Alterações"}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="profile_form" className="mt-6">
              <ProfileForm />
            </TabsContent>
            
            <TabsContent value="preferences" className="mt-6">
              <Card className="bg-galaxy-deepPurple/30 border-galaxy-purple/30">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Bell className="w-5 h-5 text-neon-pink" />
                    <span>Preferências de Notificação</span>
                  </CardTitle>
                  <CardDescription>
                    Controle como e quando você deseja receber notificações
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={preferencesForm.handleSubmit(handlePreferencesSubmit)} className="space-y-6">
                    {/* Note: Simplified form without form context for clarity */}
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-medium">Notificações por Email</h4>
                          <p className="text-sm text-gray-400">Receba atualizações no seu email</p>
                        </div>
                        <input 
                          type="checkbox" 
                          className="toggle toggle-primary" 
                          {...preferencesForm.register("emailNotifications")}
                        />
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-medium">Notificações Push</h4>
                          <p className="text-sm text-gray-400">Notificações em tempo real no seu dispositivo</p>
                        </div>
                        <input 
                          type="checkbox" 
                          className="toggle toggle-primary" 
                          {...preferencesForm.register("pushNotifications")}
                        />
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-medium">Emails de Marketing</h4>
                          <p className="text-sm text-gray-400">Receba ofertas especiais e novidades</p>
                        </div>
                        <input 
                          type="checkbox" 
                          className="toggle toggle-primary" 
                          {...preferencesForm.register("marketingEmails")}
                        />
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-medium">Alertas de Novas Missões</h4>
                          <p className="text-sm text-gray-400">Seja notificado sobre novas missões disponíveis</p>
                        </div>
                        <input 
                          type="checkbox" 
                          className="toggle toggle-primary" 
                          {...preferencesForm.register("newMissionAlerts")}
                        />
                      </div>
                    </div>
                    
                    <Button type="submit" className="w-full neon-button" disabled={loading}>
                      {loading ? "Salvando..." : "Salvar Preferências"}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="security" className="mt-6">
              <Card className="bg-galaxy-deepPurple/30 border-galaxy-purple/30">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Lock className="w-5 h-5 text-neon-lime" />
                    <span>Segurança</span>
                  </CardTitle>
                  <CardDescription>
                    Gerencie as configurações de segurança da sua conta
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="current-password">Senha Atual</Label>
                        <div className="relative">
                          <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                          <Input
                            id="current-password"
                            type="password"
                            placeholder="Sua senha atual"
                            className="pl-10"
                            value={currentPassword}
                            onChange={(e) => {
                              setCurrentPassword(e.target.value);
                              setPasswordError("");
                            }}
                          />
                        </div>
                      </div>
                    
                      <div className="space-y-2">
                        <Label htmlFor="new-password">Nova Senha</Label>
                        <div className="relative">
                          <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                          <Input
                            id="new-password"
                            type="password"
                            placeholder="Sua nova senha"
                            className="pl-10"
                            value={newPassword}
                            onChange={(e) => {
                              setNewPassword(e.target.value);
                              setPasswordError("");
                            }}
                          />
                        </div>
                        {newPassword && newPassword.length < 6 && (
                          <p className="text-red-400 text-xs">A senha deve ter pelo menos 6 caracteres</p>
                        )}
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="confirm-password">Confirmar Nova Senha</Label>
                        <div className="relative">
                          <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                          <Input
                            id="confirm-password"
                            type="password"
                            placeholder="Confirme sua nova senha"
                            className="pl-10"
                            value={confirmNewPassword}
                            onChange={(e) => {
                              setConfirmNewPassword(e.target.value);
                              setPasswordError("");
                            }}
                          />
                        </div>
                        {confirmNewPassword && newPassword !== confirmNewPassword && (
                          <p className="text-red-400 text-xs">As senhas não coincidem</p>
                        )}
                      </div>
                      
                      {passwordError && (
                        <div className="p-3 rounded-md bg-red-500/20 border border-red-500/30 text-sm text-white">
                          {passwordError}
                        </div>
                      )}
                    </div>
                    
                    <Button 
                      className="w-full neon-button"
                      disabled={loading || !currentPassword || !newPassword || !confirmNewPassword}
                      onClick={handleUpdatePassword}
                    >
                      {loading ? "Atualizando..." : "Atualizar Senha"}
                    </Button>
                    
                    <div className="pt-4 border-t border-galaxy-purple/20">
                      <h4 className="font-medium mb-4">Opções Adicionais de Segurança</h4>
                      
                      <Button variant="outline" className="w-full justify-between mb-3 border-galaxy-purple/30 hover:bg-galaxy-deepPurple/50">
                        <span>Ativar Autenticação de Dois Fatores</span>
                        <ChevronRight className="w-4 h-4" />
                      </Button>
                      
                      <Button variant="outline" className="w-full justify-between border-galaxy-purple/30 hover:bg-galaxy-deepPurple/50 text-destructive hover:text-destructive">
                        <span>Desativar Conta</span>
                        <ChevronRight className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </motion.div>
      </div>
    </div>
  );
};

export default ClientProfile;
