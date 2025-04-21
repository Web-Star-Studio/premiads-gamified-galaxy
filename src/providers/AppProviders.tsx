
import { BrowserRouter } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { UserProvider } from "@/context/UserContext";
import { AuthProvider } from "@/hooks/useAuth";

// Create a client with more robust error handling
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
      staleTime: 1000 * 60 * 5, // 5 minutes
    },
  },
});

export const AppProviders = ({ children }: { children: React.ReactNode }) => {
  return (
    <BrowserRouter>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          {/* UserProvider is now inside AuthProvider to avoid auth context conflicts */}
          <UserProvider>
            {children}
            <Toaster />
          </UserProvider>
        </AuthProvider>
      </QueryClientProvider>
    </BrowserRouter>
  );
};
