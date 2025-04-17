
import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { AdminSidebar } from '@/components/admin';
import { DashboardHeader } from '@/components/admin';
import { 
  DocNavigation, 
  DocContentTabs, 
  DocHeader 
} from '@/components/admin/documentation';
import { SidebarProvider } from '@/components/ui/sidebar/sidebar-provider';

const DocumentationPage = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeSection, setActiveSection] = useState("overview");
  
  useEffect(() => {
    console.log("DocumentationPage rendered with activeSection:", activeSection);
  }, [activeSection]);
  
  return (
    <SidebarProvider>
      <div className="flex min-h-screen bg-zinc-950/90">
        <AdminSidebar />
        
        <div className="flex-1 flex flex-col">
          <DashboardHeader 
            title="Documentação" 
            subtitle="Base de conhecimento técnico" 
          />
          
          <div className="p-6">
            <Card className="border-zinc-800 bg-zinc-950/50 backdrop-blur-sm">
              <CardHeader className="border-b border-zinc-800 pb-4">
                <DocHeader 
                  searchQuery={searchQuery} 
                  setSearchQuery={setSearchQuery} 
                />
              </CardHeader>
              
              <CardContent className="p-0">
                <div className="flex flex-col md:flex-row min-h-[600px]">
                  <aside className="w-full md:w-64 border-r border-zinc-800 shrink-0">
                    <DocNavigation 
                      activeSection={activeSection} 
                      setActiveSection={setActiveSection} 
                    />
                  </aside>
                  
                  <div className="flex-1">
                    <DocContentTabs activeSection={activeSection} />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default DocumentationPage;
