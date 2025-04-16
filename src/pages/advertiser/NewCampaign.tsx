
import React, { useState } from "react";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import AdvertiserSidebar from "@/components/advertiser/AdvertiserSidebar";
import AdvertiserHeader from "@/components/advertiser/AdvertiserHeader";
import { useMediaQuery } from "@/hooks/use-mobile";
import { Card } from "@/components/ui/card";
import CampaignForm from "@/components/advertiser/CampaignForm";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useUser } from "@/context/UserContext";

const NewCampaign = () => {
  const isMobile = useMediaQuery("(max-width: 768px)");
  const [showForm, setShowForm] = useState(true);
  const navigate = useNavigate();
  const { userName = "Desenvolvedor" } = useUser();
  
  const handleClose = () => {
    navigate('/anunciante/campanhas');
  };
  
  return (
    <SidebarProvider defaultOpen={!isMobile}>
      <div className="flex h-screen w-full bg-galaxy-dark overflow-hidden">
        <AdvertiserSidebar />
        <SidebarInset className="overflow-y-auto pb-20">
          <AdvertiserHeader
            title="Nova Campanha"
            userName={userName}
            description="Crie uma nova campanha publicitária"
          />
          
          <div className="container px-4 py-8 mx-auto">
            <div className="flex items-center mb-6">
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={handleClose}
                className="mr-2 text-muted-foreground"
              >
                <ArrowLeft className="h-5 w-5" />
              </Button>
              <h1 className="text-2xl font-bold">Nova Campanha</h1>
            </div>
            
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              {showForm ? (
                <CampaignForm onClose={handleClose} />
              ) : (
                <Card className="bg-galaxy-darkPurple border-galaxy-purple p-8 text-center">
                  <p className="text-muted-foreground mb-4">
                    Você pode criar uma nova campanha para promover suas marcas e recompensar usuários.
                  </p>
                  <Button onClick={() => setShowForm(true)}>
                    Criar Campanha
                  </Button>
                </Card>
              )}
            </motion.div>
          </div>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
};

export default NewCampaign;
