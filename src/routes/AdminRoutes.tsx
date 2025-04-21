
import React from "react";
import { Route, Routes } from "react-router-dom";
import { useAdminAuth } from "@/hooks/admin";
import AdminPanel from "@/pages/AdminPanel";
import UserManagementPage from "@/pages/admin/UserManagementPage";
import LotteryManagementPage from "@/pages/admin/LotteryManagementPage"; 
import DocumentationPage from "@/pages/admin/DocumentationPage";
import ModerationPage from "@/pages/admin/ModerationPage";
import MonitoringPage from "@/pages/admin/MonitoringPage";
import SettingsPage from "@/pages/admin/SettingsPage";
import ReportsPage from "@/pages/admin/ReportsPage";
import NotificationsPage from "@/pages/admin/NotificationsPage";
import AccessControlPage from "@/pages/admin/AccessControlPage";
import RulesPage from "@/pages/admin/RulesPage";
import SystemCleanupPage from "@/pages/admin/SystemCleanupPage";
import { RouteLoadingSpinner } from "@/components/routing/RouteLoadingSpinner";

const AdminRoutes = () => {
  const { loading, isAdmin } = useAdminAuth();

  if (loading) {
    return <RouteLoadingSpinner />;
  }

  return (
    <Routes>
      <Route path="/" element={<AdminPanel />} />
      <Route path="/users" element={<UserManagementPage />} />
      <Route path="/lottery" element={<LotteryManagementPage />} />
      <Route path="/documentation" element={<DocumentationPage />} />
      <Route path="/moderation" element={<ModerationPage />} />
      <Route path="/monitoring" element={<MonitoringPage />} />
      <Route path="/settings" element={<SettingsPage />} />
      <Route path="/reports" element={<ReportsPage />} />
      <Route path="/notifications" element={<NotificationsPage />} />
      <Route path="/access" element={<AccessControlPage />} />
      <Route path="/rules" element={<RulesPage />} />
      <Route path="/cleanup" element={<SystemCleanupPage />} />
    </Routes>
  );
};

export default AdminRoutes;
