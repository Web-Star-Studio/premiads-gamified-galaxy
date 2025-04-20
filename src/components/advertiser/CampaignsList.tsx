
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useSounds } from "@/hooks/use-sounds";
import { useToast } from "@/hooks/use-toast";
import CampaignForm from "./CampaignForm";
import CampaignHeader from "./CampaignHeader";
import CampaignTable from "./CampaignTable";
import { mockCampaigns, Campaign } from "./campaignData";
import { supabase } from "@/integrations/supabase/client";

interface CampaignsListProps {
  initialFilter?: string | null;
}

const CampaignsList = ({ initialFilter = null }: CampaignsListProps) => {
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [editingCampaign, setEditingCampaign] = useState<Campaign | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState<string | null>(initialFilter);
  const [loading, setLoading] = useState(true);
  const { playSound } = useSounds();
  const { toast } = useToast();
  
  // Fetch real campaigns when component mounts
  useEffect(() => {
    const fetchCampaigns = async () => {
      try {
        setLoading(true);
        
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) {
          setCampaigns(mockCampaigns);
          return;
        }
        
        // Ideally, this would fetch actual campaigns from the database
        // For now, let's use mock data but log to show this would be a real fetch
        console.log("Would fetch campaigns for user:", session.user.id);
        
        // Set mock campaigns after a delay to simulate API call
        setTimeout(() => {
          setCampaigns(mockCampaigns);
          setLoading(false);
        }, 1000);
        
      } catch (error) {
        console.error("Error fetching campaigns:", error);
        setCampaigns(mockCampaigns);
      } finally {
        setLoading(false);
      }
    };
    
    fetchCampaigns();
  }, []);
  
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

  const handleDelete = (id: number) => {
    setCampaigns(prev => prev.filter(campaign => campaign.id !== id));
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
    
    // Add logic here to add the campaign data to the campaigns list
    if (editingCampaign) {
      // Update existing campaign logic would go here
    } else {
      // Add new campaign logic would go here
      // For now we'll just add a mock campaign with a new ID
      const newId = Math.max(...campaigns.map(c => c.id)) + 1;
      const newCampaign: Campaign = {
        id: newId,
        title: `Nova Missão #${newId}`,
        status: "pendente",
        audience: "todos",
        completions: 0,
        reward: "50-100",
        expires: "30/08/2025",
      };
      setCampaigns(prev => [...prev, newCampaign]);
    }
  };
  
  const handleEdit = (campaign: Campaign) => {
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
      {showCreateForm ? (
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
          {loading ? (
            <div className="flex justify-center items-center py-20">
              <div className="w-12 h-12 border-4 border-neon-cyan border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : (
            <CampaignTable 
              campaigns={filteredCampaigns} 
              onDelete={handleDelete}
              onEdit={handleEdit}
            />
          )}
        </>
      )}
    </div>
  );
};

export default CampaignsList;
