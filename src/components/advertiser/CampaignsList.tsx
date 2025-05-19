
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useSounds } from "@/hooks/use-sounds";
import { useToast } from "@/hooks/use-toast";
import CampaignForm from "./CampaignForm";
import CampaignHeader from "./CampaignHeader";
import CampaignTable from "./CampaignTable";
import { useAdvertiserCampaigns } from '@/hooks/useAdvertiserCampaigns';
import { supabase } from "@/integrations/supabase/client";

interface CampaignsListProps {
  initialFilter?: string | null;
}

const CampaignsList = ({ initialFilter = null }: CampaignsListProps) => {
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingCampaign, setEditingCampaign] = useState<any | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState<string | null>(initialFilter);
  const { playSound } = useSounds();
  const { toast } = useToast();
  const { campaigns, loading, refreshCampaigns } = useAdvertiserCampaigns();
  
  // Set initial filter when prop changes
  useEffect(() => {
    setFilterStatus(initialFilter);
  }, [initialFilter]);
  
  // Filter campaigns based on search term and status filter
  const filteredCampaigns = campaigns.filter(campaign => {
    const matchesSearch = campaign.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus ? campaign.status === filterStatus : true;
    return matchesSearch && matchesStatus;
  });

  const handleDelete = async (id: string) => {
    try {
      // Delete campaign from database
      const { error } = await supabase
        .from('missions')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      
      // Refresh list after delete
      refreshCampaigns();
      playSound("error");
      toast({
        title: "Campanha removida",
        description: `A campanha foi removida com sucesso`,
      });
    } catch (error: any) {
      console.error("Erro ao remover campanha:", error);
      toast({
        title: "Erro ao remover campanha",
        description: error.message,
        variant: "destructive"
      });
    }
  };
  
  const handleCreateNew = () => {
    setShowCreateForm(true);
    setEditingCampaign(null);
    playSound("pop");
  };
  
  const handleFormClose = () => {
    setShowCreateForm(false);
    setEditingCampaign(null);
    playSound("pop");
    
    // Refresh list to reflect changes
    refreshCampaigns();
  };
  
  const handleEdit = (campaign: any) => {
    setEditingCampaign(campaign);
    setShowCreateForm(true);
    playSound("pop");
  };
  
  const handleSearchChange = (term: string) => {
    setSearchTerm(term);
  };
  
  const handleFilterChange = (status: string | null) => {
    setFilterStatus(status);
  };
  
  return (
    <div className="space-y-6">
      {loading ? (
        <div className="py-8 text-center text-gray-400">
          <p>Carregando campanhas...</p>
        </div>
      ) : showCreateForm ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <CampaignForm 
            onClose={handleFormClose} 
            editCampaign={editingCampaign}
          />
        </motion.div>
      ) : (
        <>
          <CampaignHeader 
            onCreateNew={handleCreateNew} 
            onSearchChange={handleSearchChange}
            onFilterChange={handleFilterChange}
          />
          <CampaignTable 
            campaigns={filteredCampaigns} 
            onDelete={handleDelete}
            onEdit={handleEdit}
          />
        </>
      )}
    </div>
  );
};

export default CampaignsList;
