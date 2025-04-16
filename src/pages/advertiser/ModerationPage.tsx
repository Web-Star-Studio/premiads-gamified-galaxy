
import { useSidebar } from "@/hooks/use-sidebar";
import { useMediaQuery } from "@/hooks/use-mobile";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import AdvertiserSidebar from "@/components/advertiser/AdvertiserSidebar";
import AdvertiserHeader from "@/components/advertiser/AdvertiserHeader";
import ModerationContent from "@/components/advertiser/moderation/ModerationContent";

const ModerationPage = () => {
  const isMobile = useMediaQuery("(max-width: 768px)");

  return (
    <SidebarProvider defaultOpen={!isMobile}>
      <div className="flex h-screen w-full bg-galaxy-dark overflow-hidden">
        <AdvertiserSidebar />
        <SidebarInset className="overflow-y-auto pb-20">
          <AdvertiserHeader title="Moderação de Conteúdo" />
          
          <div className="container px-4 py-8 mx-auto">
            <ModerationContent />
          </div>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
};

export default ModerationPage;
