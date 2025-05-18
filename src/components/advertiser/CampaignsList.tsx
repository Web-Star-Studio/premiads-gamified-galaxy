
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useSounds } from "@/hooks/use-sounds";
import { useToast } from "@/hooks/use-toast";
import CampaignForm from "./CampaignForm";
import CampaignHeader from "./CampaignHeader";
import CampaignTable from "./CampaignTable";
import { useAdvertiserCampaigns } from '@/hooks/useAdvertiserCampaigns';
import type { Mission } from '@/hooks/useMissionsTypes';

interface CampaignsListProps {
  initialFilter?: string | null;
}

const CampaignsList = ({ initialFilter = null }: CampaignsListProps) => {
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingCampaign, setEditingCampaign] = useState<Mission | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState<string | null>(initialFilter);
  const { playSound } = useSounds();
  const { toast } = useToast();
  const { campaigns: fetchedCampaigns, loading, refreshCampaigns } = useAdvertiserCampaigns();
  // Ensure type matches expected Mission[] for downstream components
  const campaigns = fetchedCampaigns as unknown as Mission[];
  
  // Set initial filter when prop changes
  useEffect(() => {
    setFilterStatus(initialFilter);
  }, [initialFilter]);
  
  // Filter missions based on search term and status filter
  const filteredCampaigns = campaigns.filter(m => {
    const matchesSearch = m.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus ? m.status === filterStatus : true;
    return matchesSearch && matchesStatus;
  });

  const handleDelete = (id: string) => { // Changed parameter type from number to string
    // Refresh list after delete
    refreshCampaigns();
    playSound("error");
    toast({
      title: "Campanha removida",
      description: `A campanha #${id} foi removida com sucesso`,
    });
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
    toast({
      title: "Missão gerenciada",
      description: editingCampaign ? "Missão atualizada com sucesso!" : "Nova missão criada com sucesso!",
    });
    // Refresh list to reflect changes
    refreshCampaigns();
  };
  
  const handleEdit = (campaign: Mission) => {
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
      {loading && <div>Carregando campanhas…</div>}
      {showCreateForm ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <CampaignForm 
            onClose={handleFormClose} 
            editCampaign={editingCampaign as any}
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
