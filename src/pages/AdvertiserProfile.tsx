
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useToast } from "@/hooks/use-toast";
import { useSounds } from "@/hooks/use-sounds";
import { User, Mail, Building, Edit2, Save, AlertTriangle, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { useUser } from "@/context/UserContext";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";

const AdvertiserProfile = () => {
  const { userName, userType } = useUser();
  const { signOut, currentUser } = useAuth(); // Using currentUser instead of user
  const navigate = useNavigate();
  const { toast } = useToast();
  const { playSound } = useSounds();
  
  const [loading, setLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState({
    companyName: "",
    email: "",
    phone: "",
    website: "",
    description: "",
    logo: "",
    emailNotifications: true,
    pushNotifications: true
  });
  
  // Fetch profile data
  useEffect(() => {
    // Redirect if user is not an advertiser
    if (userType !== "anunciante") {
      toast({
        title: "Acesso restrito",
        description: "Você não tem permissão para acessar esta página",
        variant: "destructive",
      });
      navigate("/");
      return;
    }
    
    const fetchProfileData = async () => {
      setLoading(true);
      try {
        if (!currentUser?.id) return; // Using currentUser instead of user
        
        const { data, error } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", currentUser.id) // Using currentUser instead of user
          .single();
        
        if (error) throw error;
        
        if (data) {
          setProfileData({
            companyName: data.full_name || "",
            email: currentUser.email || "", // Using currentUser instead of user
            phone: data.phone || "",
            website: data.website || "",
            description: data.description || "",
            logo: data.avatar_url || "",
            emailNotifications: data.email_notifications !== false,
            pushNotifications: data.push_notifications !== false
          });
        }
      } catch (error: any) {
        console.error("Error fetching profile:", error);
        toast({
          title: "Erro ao carregar perfil",
          description: error.message || "Não foi possível carregar os dados do perfil",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };
    
    fetchProfileData();
  }, [currentUser, userType, navigate, toast]); // Updated dependency array
  
  const handleSaveProfile = async () => {
    setLoading(true);
    try {
      if (!currentUser?.id) return; // Using currentUser instead of user
      
      const { error } = await supabase
        .from("profiles")
        .update({
          full_name: profileData.companyName,
          phone: profileData.phone,
          website: profileData.website,
          description: profileData.description,
          email_notifications: profileData.emailNotifications,
          push_notifications: profileData.pushNotifications
        })
        .eq("id", currentUser.id); // Using currentUser instead of user
      
      if (error) throw error;
      
      setIsEditing(false);
      playSound("chime");
      toast({
        title: "Perfil atualizado",
        description: "Suas informações foram atualizadas com sucesso",
      });
    } catch (error: any) {
      console.error("Error updating profile:", error);
      playSound("error");
      toast({
        title: "Erro ao atualizar perfil",
        description: error.message || "Não foi possível atualizar os dados do perfil",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };
  
  const handleCancel = () => {
    setIsEditing(false);
    playSound("pop");
  };
  
  const handleLogout = async () => {
    await signOut();
  };
  
  return (
    <div className="min-h-screen bg-galaxy-dark pb-20">
      <div className="container px-4 py-8 mx-auto max-w-4xl">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold font-heading text-white">Perfil do Anunciante</h1>
            <p className="text-muted-foreground mt-1">Gerencie suas informações e preferências</p>
          </div>
          
          <div className="flex gap-2">
            <Button variant="ghost" onClick={() => navigate("/anunciante")}>
              Voltar ao Dashboard
            </Button>
            
            <Button variant="destructive" onClick={handleLogout}>
              <X className="w-4 h-4 mr-2" />
              Sair
            </Button>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-1">
            <Card className="bg-galaxy-darkPurple border-galaxy-purple">
              <CardHeader>
                <CardTitle>Informações da Conta</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex flex-col items-center">
                  <div className="w-32 h-32 rounded-full bg-galaxy-purple/30 flex items-center justify-center mb-4">
                    {profileData.logo ? (
                      <img 
                        src={profileData.logo} 
                        alt={profileData.companyName} 
                        className="w-full h-full object-cover rounded-full"
                      />
                    ) : (
                      <Building className="w-16 h-16 text-muted-foreground" />
                    )}
                  </div>
                  
                  <h3 className="text-xl font-semibold">{profileData.companyName}</h3>
                  <p className="text-muted-foreground">{profileData.email}</p>
                </div>
                
                <div className="pt-4 mt-4 border-t border-galaxy-purple/20">
                  <h4 className="font-medium mb-2">Tipo de Conta</h4>
                  <div className="bg-neon-pink/10 text-neon-pink px-3 py-2 rounded text-sm flex items-center justify-center">
                    <Building className="w-4 h-4 mr-2" />
                    Anunciante
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          
          <div className="md:col-span-2">
            <Card className="bg-galaxy-darkPurple border-galaxy-purple">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Detalhes do Perfil</CardTitle>
                {!isEditing ? (
                  <Button onClick={() => setIsEditing(true)} variant="ghost" size="sm">
                    <Edit2 className="w-4 h-4 mr-2" />
                    Editar
                  </Button>
                ) : (
                  <div className="flex gap-2">
                    <Button onClick={handleCancel} variant="outline" size="sm">
                      Cancelar
                    </Button>
                    <Button onClick={handleSaveProfile} size="sm" disabled={loading}>
                      <Save className="w-4 h-4 mr-2" />
                      Salvar
                    </Button>
                  </div>
                )}
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Nome da Empresa</Label>
                      <Input 
                        value={profileData.companyName}
                        onChange={(e) => setProfileData({...profileData, companyName: e.target.value})}
                        disabled={!isEditing || loading}
                        className="bg-galaxy-dark"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label>Email</Label>
                      <Input 
                        value={profileData.email}
                        disabled={true}
                        className="bg-galaxy-dark"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label>Telefone</Label>
                      <Input 
                        value={profileData.phone}
                        onChange={(e) => setProfileData({...profileData, phone: e.target.value})}
                        disabled={!isEditing || loading}
                        className="bg-galaxy-dark"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label>Website</Label>
                      <Input 
                        value={profileData.website}
                        onChange={(e) => setProfileData({...profileData, website: e.target.value})}
                        disabled={!isEditing || loading}
                        className="bg-galaxy-dark"
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label>Descrição da Empresa</Label>
                    <Textarea 
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
                          <Label>Notificações por Email</Label>
                          <p className="text-sm text-muted-foreground">Receber atualizações e relatórios por email</p>
                        </div>
                        <Switch 
                          checked={profileData.emailNotifications}
                          onCheckedChange={(checked) => setProfileData({...profileData, emailNotifications: checked})}
                          disabled={!isEditing || loading}
                        />
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div>
                          <Label>Notificações Push</Label>
                          <p className="text-sm text-muted-foreground">Receber alertas no navegador</p>
                        </div>
                        <Switch 
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
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdvertiserProfile;
