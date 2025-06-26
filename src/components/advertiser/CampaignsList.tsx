import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useSounds } from "@/hooks/use-sounds";
import { useToast } from "@/hooks/use-toast";
import CampaignForm from "./CampaignForm";
import CampaignHeader from "./CampaignHeader";
import CampaignTable from "./CampaignTable";
import { useAdvertiserCampaigns } from '@/hooks/useAdvertiserCampaigns';
import { supabase } from "@/integrations/supabase/client";
import { useQueryClient } from "@tanstack/react-query";
import { useLocation } from "react-router-dom";
import { useCampaignFormReset } from "@/hooks/advertiser/usePendingSubmissions";

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
  const queryClient = useQueryClient();
  const location = useLocation();
  
  // Hook personalizado para detectar redirecionamentos de criação de campanha
  const { shouldResetForm, clearResetFlag, isRedirectFromCampaignCreation } = useCampaignFormReset();
  
  // Escutar redirecionamentos de criação de campanha para resetar o formulário
  useEffect(() => {
    if (shouldResetForm && isRedirectFromCampaignCreation) {
      console.log('🔄 CampaignsList detectou que precisa resetar formulário após criação de campanha');
      
      // Resetar estado do formulário para mostrar a lista
      setShowCreateForm(false);
      setEditingCampaign(null);
      
      // Mostrar toast de confirmação
      toast({
        title: "✅ Campanha criada com sucesso!",
        description: "Sua campanha foi criada e você foi redirecionado para a página de campanhas.",
        duration: 4000,
      });
      
      playSound('success');
      
      // Refresh da lista de campanhas
      refreshCampaigns();
      queryClient.invalidateQueries({ queryKey: ['advertiser-campaigns'] });
      
      // Limpar a flag de reset
      clearResetFlag();
      
      console.log('✅ CampaignsList: Formulário resetado e dados atualizados');
    }
  }, [shouldResetForm, isRedirectFromCampaignCreation, clearResetFlag, toast, playSound, refreshCampaigns, queryClient]);
  
  // Escutar redirecionamentos de criação de campanha para resetar o formulário (FALLBACK)
  useEffect(() => {
    const state = location.state as any;
    if (state?.fromCampaignCreation && state?.campaignCreated) {
      console.log('🔄 CampaignsList detectou redirecionamento de criação de campanha via location.state (fallback)');
      
      // Resetar estado do formulário para mostrar a lista
      setShowCreateForm(false);
      setEditingCampaign(null);
      
      // Refresh da lista de campanhas
      refreshCampaigns();
      queryClient.invalidateQueries({ queryKey: ['advertiser-campaigns'] });
      
      console.log('✅ CampaignsList resetado com sucesso (fallback)');
      
      // Limpar o estado para evitar reexecução
      window.history.replaceState({}, document.title);
    }
  }, [location.state, refreshCampaigns, queryClient]);
  
  // Escutar evento personalizado de criação de campanha
  useEffect(() => {
    const handleCampaignCreated = (event: CustomEvent) => {
      console.log('🎉 CampaignsList recebeu evento campaignCreated:', event.detail);
      
      if (event.detail?.success && event.detail?.isNewCampaign) {
        console.log('🔄 Resetando formulário devido ao evento campaignCreated...');
        
        // Resetar estado do formulário para mostrar a lista
        setShowCreateForm(false);
        setEditingCampaign(null);
        
        // Refresh da lista de campanhas
        refreshCampaigns();
        queryClient.invalidateQueries({ queryKey: ['advertiser-campaigns'] });
        
        console.log('✅ Formulário resetado devido ao evento campaignCreated');
      }
    };
    
    // Adicionar listener para o evento personalizado
    window.addEventListener('campaignCreated', handleCampaignCreated as EventListener);
    
    // Cleanup listener quando o componente for desmontado
    return () => {
      window.removeEventListener('campaignCreated', handleCampaignCreated as EventListener);
    };
  }, [refreshCampaigns, queryClient]);
  
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
      queryClient.invalidateQueries({ queryKey: ['advertiser-campaigns'] });
      
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
    queryClient.invalidateQueries({ queryKey: ['advertiser-campaigns'] });
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
