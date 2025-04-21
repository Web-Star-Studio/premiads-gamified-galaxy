
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "@/context/AuthContext";
import { Toaster } from "@/components/ui/toaster";
import { ThemeProvider } from "@/components/theme-provider";
import AuthPage from "@/pages/AuthPage";
import AdminDashboardPage from "@/pages/admin/AdminDashboardPage";
import UserManagementPage from "@/pages/admin/UserManagementPage";
import AdvertiserDashboard from "@/pages/AdvertiserDashboard";
import ClientDashboard from "@/pages/ClientDashboard";
import AuthGuard from "@/components/auth/AuthGuard";
import "./App.css";

function App() {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <Router>
        <AuthProvider>
          <Routes>
            {/* Public routes */}
            <Route path="/auth" element={<AuthPage />} />
            
            {/* Admin routes */}
            <Route path="/admin" element={
              <AuthGuard allowedRoles={["admin"]}>
                <AdminDashboardPage />
              </AuthGuard>
            } />
            <Route path="/admin/users" element={
              <AuthGuard allowedRoles={["admin"]}>
                <UserManagementPage />
              </AuthGuard>
            } />
            
            {/* Employee routes */}
            <Route path="/employee" element={
              <AuthGuard allowedRoles={["employee", "admin"]}>
                <AdvertiserDashboard />
              </AuthGuard>
            } />
            
            {/* Client routes */}
            <Route path="/client" element={
              <AuthGuard allowedRoles={["client", "employee", "admin"]}>
                <ClientDashboard />
              </AuthGuard>
            } />
            
            {/* Redirect root to appropriate dashboard based on role or to auth */}
            <Route path="/" element={<Navigate to="/auth" replace />} />
            
            {/* Catch-all redirect */}
            <Route path="*" element={<Navigate to="/auth" replace />} />
          </Routes>
          <Toaster />
        </AuthProvider>
      </Router>
    </ThemeProvider>
  );
}

export default App;
