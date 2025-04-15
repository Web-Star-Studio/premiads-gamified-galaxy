
import { useNavigate } from "react-router-dom";
import { useClientDashboard } from "@/hooks/useClientDashboard";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import LoadingState from "@/components/client/dashboard/LoadingState";
import PointsSection from "@/components/client/dashboard/PointsSection";
import MissionsSection from "@/components/client/dashboard/MissionsSection";
import SidePanel from "@/components/client/dashboard/SidePanel";
import SupportTools from "@/components/client/SupportTools";
import OnboardingModal from "@/components/client/OnboardingModal";
import SessionTimeoutWarning from "@/components/client/SessionTimeoutWarning";
import ProfilePreview from "@/components/client/profile/ProfilePreview";
import BrandsPreview from "@/components/client/brand/BrandsPreview";
import CashbackPreview from "@/components/client/cashback/CashbackPreview";
import { Button } from "@/components/ui/button";
import { FileText, Users, Gift, LogOut } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

const ClientDashboard = () => {
  const {
    userName,
    points,
    streak,
    loading,
    showOnboarding,
    setShowOnboarding,
    handleExtendSession,
    handleSessionTimeout
  } = useClientDashboard();
  const { signOut } = useAuth();
  const navigate = useNavigate();

  if (loading) {
    return <LoadingState />;
  }

  return (
    <div className="min-h-screen bg-galaxy-dark pb-20">
      <div className="container px-4 py-8 mx-auto">
        <div className="flex justify-between items-center">
          <DashboardHeader userName={userName} streak={streak} />
          <Button 
            variant="ghost" 
            className="gap-2 text-gray-400 hover:text-white"
            onClick={signOut}
          >
            <LogOut className="w-4 h-4" />
            Sair
          </Button>
        </div>
        
        <div className="flex flex-wrap gap-4 mt-4 mb-6">
          <Button 
            variant="outline" 
            className="gap-2 border-galaxy-purple/30 hover:bg-galaxy-deepPurple/50"
            onClick={() => navigate('/cliente/missoes')}
          >
            <FileText className="w-4 h-4 text-neon-pink" />
            Missões
          </Button>
          
          <Button 
            variant="outline" 
            className="gap-2 border-galaxy-purple/30 hover:bg-galaxy-deepPurple/50"
            onClick={() => navigate('/cliente/indicacoes')}
          >
            <Users className="w-4 h-4 text-neon-cyan" />
            Indicações
          </Button>
          
          <Button 
            variant="outline" 
            className="gap-2 border-galaxy-purple/30 hover:bg-galaxy-deepPurple/50"
            onClick={() => navigate('/cliente/sorteios')}
          >
            <Gift className="w-4 h-4 text-neon-lime" />
            Sorteios
          </Button>
        </div>
        
        <div className="grid grid-cols-1 gap-6 mt-8 md:grid-cols-2 lg:grid-cols-3">
          {/* Points & Tickets Section */}
          <PointsSection totalPoints={points} />
          
          {/* Missions Sections */}
          <MissionsSection />
          
          {/* Daily Challenge & Sorte do Dia */}
          <SidePanel />
        </div>
        
        <div className="grid grid-cols-1 gap-6 mt-6 md:grid-cols-3">
          {/* Profile Preview */}
          <ProfilePreview />
          
          {/* Cashback Preview */}
          <CashbackPreview />
          
          {/* Brands Preview */}
          <BrandsPreview />
        </div>
      </div>
      
      {/* Support tools */}
      <SupportTools />
      
      {/* Onboarding modal */}
      <OnboardingModal 
        isOpen={showOnboarding} 
        onClose={() => setShowOnboarding(false)} 
      />
      
      {/* Session timeout warning */}
      <SessionTimeoutWarning 
        timeoutDuration={5 * 60 * 1000} // 5 minutes for demo (normally 30 minutes)
        warningTime={1 * 60 * 1000} // 1 minute warning for demo
        onExtend={handleExtendSession}
        onTimeout={handleSessionTimeout}
      />
    </div>
  );
};

export default ClientDashboard;
