
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import ClientDashboard from "./pages/ClientDashboard";
import ClientProfile from "./pages/ClientProfile";
import ClientMissions from "./pages/ClientMissions";
import ClientReferrals from "./pages/ClientReferrals";
import ClientRaffles from "./pages/ClientRaffles";
import Authentication from "./pages/Authentication";
import AdvertiserDashboard from "./pages/AdvertiserDashboard";
import AdminPanel from "./pages/AdminPanel";
import { UserProvider } from "./context/UserContext";

const queryClient = new QueryClient();

const App = () => {
  return (
    <BrowserRouter>
      <QueryClientProvider client={queryClient}>
        <UserProvider>
          <TooltipProvider>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/auth" element={<Authentication />} />
              <Route path="/cliente" element={<ClientDashboard />} />
              <Route path="/cliente/missoes" element={<ClientMissions />} />
              <Route path="/cliente/indicacoes" element={<ClientReferrals />} />
              <Route path="/cliente/sorteios" element={<ClientRaffles />} />
              <Route path="/cliente/perfil" element={<ClientProfile />} />
              <Route path="/anunciante" element={<AdvertiserDashboard />} />
              <Route path="/admin" element={<AdminPanel />} />
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
            <Toaster />
            <Sonner />
          </TooltipProvider>
        </UserProvider>
      </QueryClientProvider>
    </BrowserRouter>
  );
};

export default App;
