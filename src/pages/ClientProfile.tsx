
import { useState } from "react";
import { motion } from "framer-motion";
import { User, Mail, Phone, MapPin, Bell, Lock, ArrowLeft, ChevronRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useUser } from "@/context/UserContext";
import { useToast } from "@/hooks/use-toast";
import { useSounds } from "@/hooks/use-sounds";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ClientDashboardHeader from "@/components/client/ClientDashboardHeader";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";

// Form schemas for validation
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
  const { userName, setUserName } = useUser();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { playSound } = useSounds();
  const [loading, setLoading] = useState(false);

  // Initialize form with current user data
  const personalInfoForm = useForm<z.infer<typeof personalInfoSchema>>({
    resolver: zodResolver(personalInfoSchema),
    defaultValues: {
      fullName: userName,
      email: "usuario@example.com", // Placeholder
      phone: "",
      location: "",
    },
  });

  const preferencesForm = useForm<z.infer<typeof preferenceSchema>>({
    resolver: zodResolver(preferenceSchema),
    defaultValues: {
      emailNotifications: true,
      pushNotifications: true,
      marketingEmails: false,
      newMissionAlerts: true,
    },
  });

  const handlePersonalInfoSubmit = (values: z.infer<typeof personalInfoSchema>) => {
    setLoading(true);
    // Simulate API call with timeout
    setTimeout(() => {
      setLoading(false);
      setUserName(values.fullName);
      toast({
        title: "Perfil atualizado",
        description: "Suas informações pessoais foram atualizadas com sucesso!",
      });
      playSound("chime");
    }, 800);
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
            <TabsList className="grid w-full grid-cols-3 bg-galaxy-deepPurple/50 border border-galaxy-purple/20">
              <TabsTrigger value="personal">Informações Pessoais</TabsTrigger>
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
                            className="pl-10"
                            {...personalInfoForm.register("email")}
                          />
                        </div>
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
                          />
                        </div>
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
                          />
                        </div>
                      </div>
                    </div>
                    
                    <Button className="w-full neon-button">
                      Atualizar Senha
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
