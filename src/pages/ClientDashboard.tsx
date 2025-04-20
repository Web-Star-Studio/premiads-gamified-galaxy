
import { useNavigate } from "react-router-dom";
import { useClientDashboard } from "@/hooks/useClientDashboard";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import ClientSidebar from "@/components/client/dashboard/ClientSidebar";
import ClientHeader from "@/components/client/ClientHeader";
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
import ProfileCompletionBanner from "@/components/client/dashboard/ProfileCompletionBanner";
import { useMediaQuery } from "@/hooks/use-mobile";
import { useEffect, useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";

const ClientDashboard = () => {
  const navigate = useNavigate();
  const isMobile = useMediaQuery("(max-width: 768px)");
  const { toast } = useToast();
  const [errorState, setErrorState] = useState<string | null>(null);
  const [errorRetry, setErrorRetry] = useState(0);
  
  const {
    userName,
    points,
    streak,
    loading,
    showOnboarding,
    setShowOnboarding,
    handleExtendSession,
    handleSessionTimeout,
    authError,
    isProfileCompleted,
    profileData
  } = useClientDashboard(navigate);

  useEffect(() => {
    // For debugging purposes, log the loading state
    console.log("ClientDashboard loading state:", loading);
    
    // Check for authentication errors
    if (authError) {
      setErrorState(authError);
      toast({
        title: "Erro de autenticação",
        description: authError,
        variant: "destructive",
      });
    }
  }, [authError, loading, toast]);

  // Handle retry logic when error occurs
  const handleRetry = () => {
    setErrorRetry(prev => prev + 1);
    setErrorState(null);
    window.location.reload();
  };

  // If we encounter an error, show a more user-friendly error state
  if (errorState) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-galaxy-dark p-4">
        <div className="text-center space-y-4 max-w-md">
          <h2 className="text-2xl font-bold text-red-400">Oops! Encontramos um problema</h2>
          <p className="text-gray-300">{errorState}</p>
          <Button 
            onClick={handleRetry}
            className="px-4 py-2 bg-neon-cyan text-galaxy-dark rounded-md hover:bg-neon-cyan/80 transition-colors"
          >
            <RefreshCw className="w-4 h-4 mr-2" /> Tentar novamente
          </Button>
        </div>
      </div>
    );
  }

  if (loading) {
    return <LoadingState />;
  }

  return (
    <SidebarProvider defaultOpen={!isMobile}>
      <div className="flex h-screen w-full bg-galaxy-dark overflow-hidden">
        <ClientSidebar userName={userName} />
        <SidebarInset className="overflow-y-auto pb-20">
          <ClientHeader />
          
          <div className="container px-4 py-8 mx-auto">
            {/* Profile Completion Banner - Only show if profile is not completed */}
            {!isProfileCompleted && <ProfileCompletionBanner />}
            
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
              <ProfilePreview profileData={profileData} />
              
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
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
};

export default ClientDashboard;
