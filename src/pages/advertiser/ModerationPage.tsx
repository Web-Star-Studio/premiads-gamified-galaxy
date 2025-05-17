
import { useUser } from "@/context/UserContext";
import { useMediaQuery } from "@/hooks/use-mobile";
import { useState } from 'react'
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import AdvertiserSidebar from "@/components/advertiser/AdvertiserSidebar";
import AdvertiserHeader from "@/components/advertiser/AdvertiserHeader";
import ModerationContent from "@/components/advertiser/moderation/ModerationContent";
import ModerationTest from "@/components/advertiser/moderation/ModerationTest";

const ModerationPage = () => {
  const isMobile = useMediaQuery("(max-width: 768px)");
  const { userName } = useUser();
  // Controls refresh of submissions for moderation panel
  const [refreshKey, setRefreshKey] = useState(0)

  return (
    <SidebarProvider defaultOpen={!isMobile}>
      <div className="flex h-screen w-full bg-galaxy-dark overflow-hidden">
        <AdvertiserSidebar />
        <SidebarInset className="overflow-y-auto pb-20">
          <AdvertiserHeader 
            title="Moderação de Conteúdo" 
            userName={userName}
          />
          
          <div className="container px-4 py-8 mx-auto">
            <div className="mb-8">
              {/* Test submission creation and diagnostics */}
              <ModerationTest onRefresh={() => setRefreshKey(k => k + 1)} />
            </div>
            
            {/* Real moderation panel that consumes the same refreshKey */}
            <ModerationContent refreshKey={refreshKey} />
          </div>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
};

export default ModerationPage;
