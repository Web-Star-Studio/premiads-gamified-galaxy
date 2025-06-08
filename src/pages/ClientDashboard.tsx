
import React from 'react';
import { motion } from 'framer-motion';
import DashboardStats from '@/components/client/dashboard/DashboardStats';
import PointsSection from '@/components/client/dashboard/PointsSection';
import MissionsSection from '@/components/client/dashboard/MissionsSection';
import SidePanel from '@/components/client/dashboard/SidePanel';
import { useClientDashboard } from '@/hooks/useClientDashboard';
import { useNavigate } from 'react-router-dom';
import LoadingSpinner from '@/components/LoadingSpinner';

const ClientDashboard = () => {
  const navigate = useNavigate();
  const {
    userName,
    points,
    credits,
    loading,
    showOnboarding,
    setShowOnboarding,
    handleExtendSession,
    handleSessionTimeout,
    authError,
    isProfileCompleted,
    profileData
  } = useClientDashboard(navigate);

  if (loading) {
    return <LoadingSpinner />;
  }

  if (authError) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h2 className="text-xl font-bold text-red-500 mb-2">Erro de Autenticação</h2>
          <p className="text-gray-400">{authError}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-galaxy-darkPurple via-galaxy-deepPurple to-galaxy-darkPurple">
      <div className="container mx-auto px-4 py-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-2 mb-6"
        >
          <h1 className="text-2xl font-bold text-white">
            Olá, {userName || 'Participante'}! 👋
          </h1>
          <p className="text-gray-400">
            Bem-vindo ao seu painel de controle
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Points Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="lg:col-span-1"
          >
            <PointsSection totalPoints={points} />
          </motion.div>

          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Dashboard Stats */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <DashboardStats
                tickets={points || 0}
                points={points || 0}
                referrals={0}
                level="Iniciante"
                ticketsTrend={5}
                pointsTrend={12}
                averagePointsPerDay={15}
              />
            </motion.div>

            {/* Missions Section */}
            <MissionsSection />
          </div>

          {/* Side Panel */}
          <SidePanel />
        </div>
      </div>
    </div>
  );
};

export default ClientDashboard;
