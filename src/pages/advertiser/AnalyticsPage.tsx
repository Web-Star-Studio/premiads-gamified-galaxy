
import React from "react";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import AdvertiserSidebar from "@/components/advertiser/AdvertiserSidebar";

const AnalyticsPage = () => {
  return (
    <SidebarProvider defaultOpen={true}>
      <div className="flex h-screen w-full bg-galaxy-dark overflow-hidden">
        <AdvertiserSidebar />
        <SidebarInset className="overflow-y-auto pb-20">
          <div className="container px-4 py-8 mx-auto">
            <h1 className="text-2xl font-bold mb-6">Análises</h1>
            <p>Visualize estatísticas e desempenho das suas campanhas.</p>
            {/* Analytics content will be added here */}
          </div>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
};

export default AnalyticsPage;
