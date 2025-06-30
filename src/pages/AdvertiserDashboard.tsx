import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { useDashboardStats } from "@/hooks/useDashboardStats";
import { useAdvertiserMissions } from "@/hooks/useAdvertiserMissions";
import { useAdvertiserCampaigns } from "@/hooks/useAdvertiserCampaigns";
import { useAdvertiserSubmissions } from "@/hooks/useAdvertiserSubmissions";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

const AdvertiserDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [pendingSubmissions, setPendingSubmissions] = useState(0);
  const [totalMissions, setTotalMissions] = useState(0);
  const [totalCampaigns, setTotalCampaigns] = useState(0);
  const [totalCredits, setTotalCredits] = useState(0);
  const [loading, setLoading] = useState(true);

  const {
    totalMissions: missionsCount,
    totalCredits: creditsCount,
    loading: statsLoading,
    error: statsError,
  } = useDashboardStats();

  const {
    totalCampaigns: campaignsCount,
    loading: campaignsLoading,
    error: campaignsError,
  } = useAdvertiserCampaigns();

  const {
    submissions,
    loading: submissionsLoading,
    error: submissionsError,
  } = useAdvertiserSubmissions();

  const { missions, loading: missionsLoading, error: missionsError } =
    useAdvertiserMissions();

  useEffect(() => {
    if (!user) {
      toast({
        title: "Não autenticado",
        description: "Você precisa estar autenticado para acessar esta página.",
        variant: "destructive",
      });
      navigate("/login");
    }
  }, [user, navigate, toast]);

  useEffect(() => {
    if (!statsLoading && !campaignsLoading && !submissionsLoading && !missionsLoading) {
      setLoading(false);
    }

    if (statsError || campaignsError || submissionsError || missionsError) {
      toast({
        title: "Erro ao carregar dados",
        description:
          statsError?.message ||
          campaignsError?.message ||
          submissionsError?.message ||
          missionsError?.message ||
          "Ocorreu um erro ao carregar os dados do painel.",
        variant: "destructive",
      });
    }
  }, [
    statsLoading,
    campaignsLoading,
    submissionsLoading,
    missionsLoading,
    statsError,
    campaignsError,
    submissionsError,
    missionsError,
    toast,
  ]);

  useEffect(() => {
    if (missionsCount !== undefined) {
      setTotalMissions(missionsCount);
    }
    if (creditsCount !== undefined) {
      setTotalCredits(creditsCount);
    }
    if (campaignsCount !== undefined) {
      setTotalCampaigns(campaignsCount);
    }
  }, [missionsCount, creditsCount, campaignsCount]);

  useEffect(() => {
    if (submissions) {
      handleSubmissionsData(submissions);
    }
  }, [submissions]);

  const handleSubmissionsData = (data: any) => {
    if (Array.isArray(data)) {
      setPendingSubmissions(data.length); // Convert array to count
    } else if (typeof data === 'number') {
      setPendingSubmissions(data);
    } else {
      setPendingSubmissions(0);
    }
  };

  if (loading) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-galaxy-dark">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <div className="w-16 h-16 mx-auto mb-4 border-4 border-t-neon-cyan border-galaxy-purple rounded-full animate-spin"></div>
          <h2 className="text-xl font-heading neon-text-cyan">
            Carregando painel...
          </h2>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-8"
      >
        <h1 className="text-3xl font-bold text-white mb-2">
          Painel do Anunciante
        </h1>
        <p className="text-gray-400">
          Visão geral das suas campanhas e atividades.
        </p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <Card className="bg-galaxy-darkPurple border-galaxy-purple/20 shadow-glow">
            <CardHeader>
              <CardTitle className="text-white">Créditos</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-neon-lime">
                {totalCredits}
              </div>
              <p className="text-sm text-gray-400 mt-1">
                Créditos disponíveis para suas campanhas.
              </p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <Card className="bg-galaxy-darkPurple border-galaxy-purple/20 shadow-glow">
            <CardHeader>
              <CardTitle className="text-white">Campanhas Ativas</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-neon-pink">
                {totalCampaigns}
              </div>
              <p className="text-sm text-gray-400 mt-1">
                Campanhas em andamento.
              </p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Card className="bg-galaxy-darkPurple border-galaxy-purple/20 shadow-glow">
            <CardHeader>
              <CardTitle className="text-white">Missões Criadas</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-neon-cyan">
                {totalMissions}
              </div>
              <p className="text-sm text-gray-400 mt-1">
                Total de missões criadas.
              </p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <Card className="bg-galaxy-darkPurple border-galaxy-purple/20 shadow-glow">
            <CardHeader>
              <CardTitle className="text-white">
                Submissões Pendentes
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-yellow-500">
                {pendingSubmissions}
              </div>
              <p className="text-sm text-gray-400 mt-1">
                Submissões aguardando aprovação.
              </p>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
        className="mt-8"
      >
        <Card className="bg-galaxy-darkPurple border-galaxy-purple/20 shadow-glow">
          <CardHeader>
            <CardTitle className="text-white">Ações Rápidas</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Button asChild variant="secondary" className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500">
              <Link to="/anunciante/campanhas" className="flex items-center justify-between w-full">
                Gerenciar Campanhas
                <ArrowRight className="w-4 h-4" />
              </Link>
            </Button>
            <Button asChild variant="secondary" className="bg-gradient-to-r from-green-600 to-teal-500 hover:from-green-500 hover:to-teal-400">
              <Link to="/anunciante/missoes" className="flex items-center justify-between w-full">
                Gerenciar Missões
                <ArrowRight className="w-4 h-4" />
              </Link>
            </Button>
            <Button asChild variant="secondary" className="bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-400 hover:to-rose-400">
              <Link to="/anunciante/creditos" className="flex items-center justify-between w-full">
                Adicionar Créditos
                <ArrowRight className="w-4 h-4" />
              </Link>
            </Button>
            <Button asChild variant="secondary" className="bg-gradient-to-r from-orange-500 to-yellow-500 hover:from-orange-400 hover:to-yellow-400">
              <Link to="/anunciante/moderacao" className="flex items-center justify-between w-full">
                Moderação de Conteúdo
                <ArrowRight className="w-4 h-4" />
              </Link>
            </Button>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default AdvertiserDashboard;
