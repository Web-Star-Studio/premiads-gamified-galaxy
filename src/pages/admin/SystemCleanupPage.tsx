
import React, { useState } from 'react';
import { motion } from "framer-motion";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import AdminSidebar from "@/components/admin/AdminSidebar";
import DashboardHeader from "@/components/admin/DashboardHeader";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Shield, Database, RefreshCw, AlertTriangle } from "lucide-react";
import { useAdminAuth } from "@/hooks/admin";
import { useToast } from "@/hooks/use-toast";
import { useSounds } from "@/hooks/use-sounds";
import { supabase } from "@/integrations/supabase/client";
import { useMediaQuery } from "@/hooks/use-mobile";

const SystemCleanupPage = () => {
  const { isAdmin, loading: authLoading } = useAdminAuth();
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const { playSound } = useSounds();
  const isMobile = useMediaQuery("(max-width: 768px)");

  const handleCleanup = async () => {
    if (!confirm("ATENÇÃO: Esta ação removerá todos os dados de teste e não pode ser desfeita. Continuar?")) {
      return;
    }
    
    try {
      setLoading(true);
      playSound("pop");
      
      const { data, error } = await supabase.functions.invoke('cleanup-database');
      
      if (error) throw error;
      
      toast({
        title: "Limpeza concluída",
        description: `Banco de dados limpo com sucesso. ${data.removedUsers || 0} usuários de teste removidos.`,
      });
      
      playSound("success");
    } catch (error) {
      console.error("Error cleaning up database:", error);
      toast({
        title: "Erro na limpeza",
        description: error.message || "Não foi possível limpar o banco de dados",
        variant: "destructive",
      });
      playSound("error");
    } finally {
      setLoading(false);
    }
  };

  if (authLoading) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <RefreshCw className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="flex h-screen w-full flex-col items-center justify-center">
        <Shield className="h-16 w-16 text-destructive mb-4" />
        <h1 className="text-2xl font-bold">Acesso Restrito</h1>
        <p className="mt-2 text-muted-foreground">Esta página é apenas para administradores.</p>
      </div>
    );
  }

  return (
    <SidebarProvider defaultOpen={!isMobile}>
      <div className="flex h-screen w-full bg-galaxy-dark overflow-hidden">
        <AdminSidebar />
        <SidebarInset className="overflow-y-auto pb-20 fancy-scrollbar">
          <div className="container px-4 py-6 sm:py-8 mx-auto max-w-7xl">
            <DashboardHeader 
              title="Preparação para Produção" 
              subtitle="Limpeza e preparação do sistema para lançamento oficial" 
            />
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="mt-6 sm:mt-8 grid gap-6"
            >
              <Card className="bg-galaxy-deepPurple/20 border-galaxy-purple/30">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Database className="h-5 w-5" />
                    Limpeza do Banco de Dados
                  </CardTitle>
                  <CardDescription>
                    Remove todos os dados de teste, incluindo missões, submissões e usuários não-admin.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="rounded-lg border border-amber-500/20 bg-amber-500/10 p-4 mb-4">
                    <div className="flex items-start">
                      <AlertTriangle className="h-5 w-5 text-amber-500 mr-3 mt-0.5" />
                      <div>
                        <h4 className="text-sm font-medium text-amber-500">Atenção</h4>
                        <p className="text-sm mt-1 text-muted-foreground">
                          Esta ação removerá permanentemente todos os dados de teste da plataforma.
                          Usuários administradores serão mantidos, mas todos os outros usuários e dados serão removidos.
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button 
                    variant="destructive" 
                    onClick={handleCleanup}
                    disabled={loading}
                    className="gap-2"
                  >
                    {loading ? (
                      <>
                        <RefreshCw className="h-4 w-4 animate-spin" />
                        Processando...
                      </>
                    ) : (
                      <>
                        <Database className="h-4 w-4" />
                        Limpar Banco de Dados
                      </>
                    )}
                  </Button>
                </CardFooter>
              </Card>
            </motion.div>
          </div>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
};

export default SystemCleanupPage;
