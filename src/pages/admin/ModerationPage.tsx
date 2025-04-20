
import { useMemo, useState } from "react";
import { useMediaQuery } from "@/hooks/use-mobile";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import AdminSidebar from "@/components/admin/AdminSidebar";
import DashboardHeader from "@/components/admin/DashboardHeader";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Search, Filter } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useActiveUserSession } from "@/hooks/useActiveUserSession";
import SubmissionsList from "@/components/advertiser/moderation/SubmissionsList";

const ModerationPage = () => {
  const isMobile = useMediaQuery("(max-width: 768px)");
  const { isAdmin } = useActiveUserSession();
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  
  return (
    <SidebarProvider defaultOpen={!isMobile}>
      <div className="flex h-screen w-full bg-galaxy-dark overflow-hidden">
        <AdminSidebar />
        <SidebarInset className="overflow-y-auto pb-20 fancy-scrollbar">
          <div className="container px-4 py-6 sm:py-8 mx-auto max-w-7xl">
            <DashboardHeader 
              title="Moderação de Conteúdo" 
              subtitle="Aprovar ou rejeitar submissões de usuários" 
            />
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="mt-6 sm:mt-8"
            >
              <Card className="bg-galaxy-deepPurple border-galaxy-purple/30">
                <CardHeader className="pb-3">
                  <CardTitle className="text-xl font-heading text-white">Moderação de Submissões</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-col md:flex-row gap-4 items-center justify-between mb-6">
                    <div className="relative flex-grow md:w-64">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 w-4 h-4" />
                      <Input 
                        placeholder="Buscar submissão..." 
                        className="pl-9 bg-gray-800/50 border-gray-700"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                      />
                    </div>
                    
                    <Select 
                      defaultValue="all" 
                      onValueChange={(value) => setFilterStatus(value)}
                    >
                      <SelectTrigger className="w-36 bg-gray-800/50 border-gray-700">
                        <div className="flex items-center gap-2">
                          <Filter className="w-4 h-4" />
                          <SelectValue placeholder="Status" />
                        </div>
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Todos</SelectItem>
                        <SelectItem value="pending">Pendentes</SelectItem>
                        <SelectItem value="approved">Aprovados</SelectItem>
                        <SelectItem value="rejected">Rejeitados</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <Tabs defaultValue="pending" className="w-full">
                    <TabsList className="grid grid-cols-3 mb-6">
                      <TabsTrigger value="pending" className="gap-2">
                        Pendentes
                      </TabsTrigger>
                      <TabsTrigger value="approved" className="gap-2">
                        Aprovados
                      </TabsTrigger>
                      <TabsTrigger value="rejected" className="gap-2">
                        Rejeitados
                      </TabsTrigger>
                    </TabsList>
                    
                    <TabsContent value="pending">
                      <SubmissionsList 
                        filterStatus={filterStatus} 
                        searchQuery={searchQuery}
                        tabValue="pending"
                        isAdminView={true}
                      />
                    </TabsContent>
                    
                    <TabsContent value="approved">
                      <SubmissionsList 
                        filterStatus={filterStatus} 
                        searchQuery={searchQuery}
                        tabValue="approved"
                        isAdminView={true}
                      />
                    </TabsContent>
                    
                    <TabsContent value="rejected">
                      <SubmissionsList 
                        filterStatus={filterStatus} 
                        searchQuery={searchQuery}
                        tabValue="rejected"
                        isAdminView={true}
                      />
                    </TabsContent>
                  </Tabs>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
};

export default ModerationPage;
