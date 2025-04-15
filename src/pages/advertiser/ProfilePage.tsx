
import React, { useState, useEffect } from "react";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import AdvertiserSidebar from "@/components/advertiser/AdvertiserSidebar";
import AdvertiserHeader from "@/components/advertiser/AdvertiserHeader";
import { useMediaQuery } from "@/hooks/use-mobile";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";
import { useToast } from "@/hooks/use-toast";
import { useSounds } from "@/hooks/use-sounds";
import { Building, Save, Edit2, User, Mail, Phone, Globe, X } from "lucide-react";
import { useUser } from "@/context/UserContext";

const ProfilePage = () => {
  const isMobile = useMediaQuery("(max-width: 768px)");
  const navigate = useNavigate();
  const { toast } = useToast();
  const { playSound } = useSounds();
  const { userName } = useUser();
  
  const [loading, setLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState({
    companyName: userName || "Empresa Demo",
    email: "demo@premiads.com",
    phone: "(11) 99999-9999",
    website: "www.minhaempresa.com.br",
    description: "Empresa especializada em produtos inovadores para o mercado brasileiro.",
    logo: "",
    emailNotifications: true,
    pushNotifications: true
  });
  
  // Simula carregamento de dados
  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
      try {
        playSound("chime");
      } catch (error) {
        console.log("Sound playback failed silently", error);
      }
    }, 1000);
    
    return () => clearTimeout(timer);
  }, [playSound]);
  
  const handleSaveProfile = () => {
    setLoading(true);
    
    // Simulação de salvamento
    setTimeout(() => {
      setLoading(false);
      setIsEditing(false);
      playSound("chime");
      toast({
        title: "Perfil atualizado",
        description: "Suas informações foram atualizadas com sucesso",
      });
    }, 1000);
  };
  
  const handleCancel = () => {
    setIsEditing(false);
    playSound("pop");
  };
  
  const userInitial = profileData.companyName.charAt(0) || "E";
  
  return (
    <SidebarProvider defaultOpen={!isMobile}>
      <div className="flex h-screen w-full bg-galaxy-dark overflow-hidden">
        <AdvertiserSidebar />
        <SidebarInset className="overflow-y-auto pb-20">
          <AdvertiserHeader />
          
          <div className="container px-4 pt-20 py-8 mx-auto">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
              <div>
                <h1 className="text-2xl font-bold mb-2">Perfil da Empresa</h1>
                <p className="text-muted-foreground">Gerencie suas informações e preferências</p>
              </div>
              
              <div className="mt-4 md:mt-0">
                {!isEditing ? (
                  <Button onClick={() => setIsEditing(true)} className="flex items-center gap-2">
                    <Edit2 className="h-4 w-4" />
                    Editar Perfil
                  </Button>
                ) : (
                  <div className="flex gap-2">
                    <Button variant="outline" onClick={handleCancel}>
                      Cancelar
                    </Button>
                    <Button onClick={handleSaveProfile} disabled={loading}>
                      <Save className="h-4 w-4 mr-2" />
                      Salvar
                    </Button>
                  </div>
                )}
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Informações básicas */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="md:col-span-1"
              >
                <Card className="bg-galaxy-darkPurple border-galaxy-purple">
                  <CardHeader>
                    <CardTitle>Informações da Conta</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex flex-col items-center">
                      <div className="w-32 h-32 rounded-full bg-galaxy-purple/30 flex items-center justify-center mb-4">
                        {profileData.logo ? (
                          <AvatarImage 
                            src={profileData.logo} 
                            alt={profileData.companyName} 
                          />
                        ) : (
                          <AvatarFallback className="w-full h-full text-4xl">
                            {userInitial}
                          </AvatarFallback>
                        )}
                      </div>
                      
                      <h3 className="text-xl font-semibold">{profileData.companyName}</h3>
                      <p className="text-muted-foreground">{profileData.email}</p>
                    </div>
                    
                    <div className="pt-4 mt-4 border-t border-galaxy-purple/20">
                      <h4 className="font-medium mb-2">Tipo de Conta</h4>
                      <Badge variant="outline" className="bg-neon-pink/10 text-neon-pink w-full justify-center py-2">
                        <Building className="w-4 h-4 mr-2" />
                        Anunciante Premium
                      </Badge>
                    </div>
                    
                    <div className="pt-4 mt-4 border-t border-galaxy-purple/20">
                      <Button variant="ghost" className="w-full text-muted-foreground hover:text-white" onClick={() => navigate("/")}>
                        <X className="w-4 h-4 mr-2" />
                        Sair da conta
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
              
              {/* Detalhes do perfil */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.1 }}
                className="md:col-span-2"
              >
                <Card className="bg-galaxy-darkPurple border-galaxy-purple">
                  <CardHeader>
                    <CardTitle>Detalhes do Perfil</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="companyName" className="flex items-center gap-2">
                            <Building className="h-4 w-4" />
                            Nome da Empresa
                          </Label>
                          <Input 
                            id="companyName"
                            value={profileData.companyName}
                            onChange={(e) => setProfileData({...profileData, companyName: e.target.value})}
                            disabled={!isEditing || loading}
                            className="bg-galaxy-dark"
                          />
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="email" className="flex items-center gap-2">
                            <Mail className="h-4 w-4" />
                            Email
                          </Label>
                          <Input 
                            id="email"
                            value={profileData.email}
                            onChange={(e) => setProfileData({...profileData, email: e.target.value})}
                            disabled={!isEditing || loading}
                            className="bg-galaxy-dark"
                          />
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="phone" className="flex items-center gap-2">
                            <Phone className="h-4 w-4" />
                            Telefone
                          </Label>
                          <Input 
                            id="phone"
                            value={profileData.phone}
                            onChange={(e) => setProfileData({...profileData, phone: e.target.value})}
                            disabled={!isEditing || loading}
                            className="bg-galaxy-dark"
                          />
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="website" className="flex items-center gap-2">
                            <Globe className="h-4 w-4" />
                            Website
                          </Label>
                          <Input 
                            id="website"
                            value={profileData.website}
                            onChange={(e) => setProfileData({...profileData, website: e.target.value})}
                            disabled={!isEditing || loading}
                            className="bg-galaxy-dark"
                          />
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="description">Descrição da Empresa</Label>
                        <Textarea 
                          id="description"
                          value={profileData.description}
                          onChange={(e) => setProfileData({...profileData, description: e.target.value})}
                          disabled={!isEditing || loading}
                          className="bg-galaxy-dark min-h-[100px]"
                        />
                      </div>
                      
                      <div className="pt-4 border-t border-galaxy-purple/20">
                        <h4 className="font-medium mb-4">Preferências de Notificação</h4>
                        
                        <div className="space-y-4">
                          <div className="flex items-center justify-between">
                            <div>
                              <Label htmlFor="emailNotif">Notificações por Email</Label>
                              <p className="text-sm text-muted-foreground">Receber atualizações e relatórios por email</p>
                            </div>
                            <Switch 
                              id="emailNotif"
                              checked={profileData.emailNotifications}
                              onCheckedChange={(checked) => setProfileData({...profileData, emailNotifications: checked})}
                              disabled={!isEditing || loading}
                            />
                          </div>
                          
                          <div className="flex items-center justify-between">
                            <div>
                              <Label htmlFor="pushNotif">Notificações Push</Label>
                              <p className="text-sm text-muted-foreground">Receber alertas no navegador</p>
                            </div>
                            <Switch 
                              id="pushNotif"
                              checked={profileData.pushNotifications}
                              onCheckedChange={(checked) => setProfileData({...profileData, pushNotifications: checked})}
                              disabled={!isEditing || loading}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </div>
          </div>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
};

export default ProfilePage;
