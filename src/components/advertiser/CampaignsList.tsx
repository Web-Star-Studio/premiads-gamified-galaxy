
import { useState } from "react";
import { motion } from "framer-motion";
import { Plus, Edit, Trash, Eye, Search, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useSounds } from "@/hooks/use-sounds";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";
import CampaignForm from "./CampaignForm";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

const CampaignsList = () => {
  const [showCreateForm, setShowCreateForm] = useState(false);
  const { playSound } = useSounds();
  const { toast } = useToast();
  
  const mockCampaigns = [
    {
      id: 1,
      title: "Pesquisa de Satisfação",
      status: "ativa",
      audience: "todos",
      completions: 243,
      reward: "30-50",
      expires: "12/06/2025",
    },
    {
      id: 2,
      title: "Teste de Produto",
      status: "pendente",
      audience: "nível 3+",
      completions: 0,
      reward: "100",
      expires: "30/07/2025",
    },
    {
      id: 3,
      title: "Compartilhar nas Redes",
      status: "ativa",
      audience: "todos",
      completions: 124,
      reward: "20-40",
      expires: "05/06/2025",
    },
    {
      id: 4,
      title: "Desafio Criativo",
      status: "encerrada",
      audience: "convite",
      completions: 87,
      reward: "200",
      expires: "10/04/2025",
    },
    {
      id: 5,
      title: "Tutorial de Produto",
      status: "ativa",
      audience: "novos",
      completions: 56,
      reward: "25-75",
      expires: "20/08/2025",
    },
  ];
  
  const getStatusColor = (status: string) => {
    switch (status) {
      case "ativa":
        return "bg-green-500/20 text-green-500 border-green-500/50";
      case "pendente":
        return "bg-yellow-500/20 text-yellow-500 border-yellow-500/50";
      case "encerrada":
        return "bg-gray-500/20 text-gray-400 border-gray-500/50";
      default:
        return "bg-blue-500/20 text-blue-500 border-blue-500/50";
    }
  };
  
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
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <h2 className="text-xl font-bold font-heading">Gerenciar Campanhas</h2>
            <div className="flex flex-col gap-2 sm:flex-row">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Buscar campanha..."
                  className="w-full pl-9 pr-4 py-2 bg-gray-800/50 rounded-md border border-gray-700 focus:border-neon-cyan focus:outline-none text-sm"
                />
              </div>
              <Button 
                variant="ghost" 
                size="icon"
                className="neon-border bg-gray-800/50 hover:bg-gray-700/50"
              >
                <Filter className="w-4 h-4" />
              </Button>
              <Button 
                onClick={handleCreateNew}
                className="neon-button bg-gradient-to-r from-purple-600/40 to-pink-500/40"
              >
                <Plus className="w-4 h-4 mr-2" />
                Nova Campanha
              </Button>
            </div>
          </div>
          
          <div className="rounded-lg border border-gray-800 overflow-hidden">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nome</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Público</TableHead>
                    <TableHead className="text-right">Completadas</TableHead>
                    <TableHead>Pontos</TableHead>
                    <TableHead>Expira</TableHead>
                    <TableHead className="text-right">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {mockCampaigns.map((campaign) => (
                    <TableRow key={campaign.id}>
                      <TableCell className="font-medium">{campaign.title}</TableCell>
                      <TableCell>
                        <Badge className={`${getStatusColor(campaign.status)}`}>
                          {campaign.status}
                        </Badge>
                      </TableCell>
                      <TableCell>{campaign.audience}</TableCell>
                      <TableCell className="text-right">{campaign.completions}</TableCell>
                      <TableCell>{campaign.reward}</TableCell>
                      <TableCell>{campaign.expires}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="h-8 w-8 text-gray-400 hover:text-white"
                          >
                            <Eye className="w-4 h-4" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="h-8 w-8 text-gray-400 hover:text-neon-cyan"
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="h-8 w-8 text-gray-400 hover:text-red-500"
                            onClick={() => handleDelete(campaign.id)}
                          >
                            <Trash className="w-4 h-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default CampaignsList;
