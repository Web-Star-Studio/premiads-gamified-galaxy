
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

const ClientDashboard = () => {
  const navigate = useNavigate();
  const isMobile = useMediaQuery("(max-width: 768px)");
  const {
    userName,
    points,
    streak,
    loading,
    showOnboarding,
    setShowOnboarding,
    handleExtendSession,
    handleSessionTimeout,
    authError
  } = useClientDashboard(navigate);

  if (loading) {
    return <LoadingState />;
  }

  return (
    <SidebarProvider defaultOpen={!isMobile}>
      <div className="flex h-screen w-full bg-galaxy-dark overflow-hidden">
        <ClientSidebar />
        <SidebarInset className="overflow-y-auto pb-20">
          <ClientHeader />
          
          <div className="container px-4 py-8 mx-auto">
            {/* Profile Completion Banner */}
            <ProfileCompletionBanner />
            
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
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
};

export default ClientDashboard;
