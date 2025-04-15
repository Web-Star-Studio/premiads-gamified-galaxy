
import { useState } from "react";
import { motion } from "framer-motion";
import { useSounds } from "@/hooks/use-sounds";
import { useToast } from "@/hooks/use-toast";
import CampaignForm from "./CampaignForm";
import CampaignHeader from "./CampaignHeader";
import CampaignTable from "./CampaignTable";
import { mockCampaigns } from "./campaignData";

const CampaignsList = () => {
  const [showCreateForm, setShowCreateForm] = useState(false);
  const { playSound } = useSounds();
  const { toast } = useToast();
  
  const handleDelete = (id: number) => {
    playSound("error");
    toast({
      title: "Campanha removida",
      description: `A campanha #${id} foi removida com sucesso`,
    });
  };
  
  const handleCreateNew = () => {
    setShowCreateForm(true);
    playSound("pop");
  };
  
  const handleFormClose = () => {
    setShowCreateForm(false);
    playSound("pop");
    toast({
      title: "Campanha criada",
      description: "Sua nova campanha foi criada com sucesso!",
    });
  };
  
  return (
    <div className="space-y-6">
      {showCreateForm ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <CampaignForm onClose={handleFormClose} />
        </motion.div>
      ) : (
        <>
          <CampaignHeader onCreateNew={handleCreateNew} />
          <CampaignTable campaigns={mockCampaigns} onDelete={handleDelete} />
        </>
      )}
    </div>
  );
};

export default CampaignsList;
