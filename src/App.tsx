
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import ClientDashboard from "./pages/ClientDashboard";
import AdvertiserDashboard from "./pages/AdvertiserDashboard";
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
              <Route path="/cliente" element={<ClientDashboard />} />
              <Route path="/anunciante" element={<AdvertiserDashboard />} />
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
