import { BrowserRouter } from "react-router-dom";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { UserProvider } from "@/context/UserContext";
import { AuthProvider } from "@/hooks/useAuth";
import { HelmetProvider } from "react-helmet-async";
import { CreditsProvider } from "./credits-provider";
import { getQueryClient } from "@/lib/query-client";

// Get the optimized query client
const queryClient = getQueryClient();

export const AppProviders = ({ children }: { children: React.ReactNode }) => (
    <HelmetProvider>
      <BrowserRouter>
        <QueryClientProvider client={queryClient}>
          <AuthProvider>
            <CreditsProvider>
              <UserProvider>
                {children}
                <Toaster />
              </UserProvider>
            </CreditsProvider>
          </AuthProvider>
        </QueryClientProvider>
      </BrowserRouter>
    </HelmetProvider>
  );
