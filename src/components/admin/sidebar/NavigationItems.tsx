
import React from "react";
import { NavigationItem } from "./NavigationItem";
import { 
  Home, Users, Ticket, FileText, Shield, BarChart, Settings, Bell, 
  Eye, Book, Scale, Database
} from "lucide-react";

export const NavigationItems = () => {
  return (
    <div className="space-y-1">
      <NavigationItem to="/admin" icon={<Home className="h-5 w-5" />} label="Dashboard" />
      <NavigationItem to="/admin/users" icon={<Users className="h-5 w-5" />} label="Usuários" />
      <NavigationItem to="/admin/lottery" icon={<Ticket className="h-5 w-5" />} label="Sorteios" />
      <NavigationItem to="/admin/moderation" icon={<Eye className="h-5 w-5" />} label="Moderação" />
      <NavigationItem to="/admin/rules" icon={<Scale className="h-5 w-5" />} label="Regras" />
      <NavigationItem to="/admin/reports" icon={<BarChart className="h-5 w-5" />} label="Relatórios" />
      <NavigationItem to="/admin/monitoring" icon={<Shield className="h-5 w-5" />} label="Monitoramento" />
      <NavigationItem to="/admin/notifications" icon={<Bell className="h-5 w-5" />} label="Notificações" />
      <NavigationItem to="/admin/access" icon={<Shield className="h-5 w-5" />} label="Controle de Acesso" />
      <NavigationItem to="/admin/documentation" icon={<Book className="h-5 w-5" />} label="Documentação" />
      <NavigationItem to="/admin/settings" icon={<Settings className="h-5 w-5" />} label="Configurações" />
      <NavigationItem to="/admin/cleanup" icon={<Database className="h-5 w-5" />} label="Limpeza" />
    </div>
  );
};
