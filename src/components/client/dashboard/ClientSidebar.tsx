
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, Zap, User, Gift, UserPlus, Wallet, HelpCircle, LogOut } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { 
  Sidebar, 
  SidebarHeader, 
  SidebarBody, 
  SidebarMenu,
  SidebarMenuItem, 
  SidebarMenuGroup, 
  SidebarFooter
} from '@/components/ui/sidebar';

interface ClientSidebarProps {
  userName?: string;
}

const ClientSidebar: React.FC<ClientSidebarProps> = ({ userName = 'Visitante' }) => {
  const location = useLocation();
  const { signOut } = useAuth();
  
  const isActive = (path: string) => {
    // Account for both exact matches and nested routes
    return location.pathname === path || location.pathname.startsWith(`${path}/`);
  };

  const handleLogout = async () => {
    await signOut();
  };
  
  return (
    <Sidebar>
      <SidebarHeader>
        <div className="flex items-center gap-2 p-2">
          <div className="w-9 h-9 rounded-full bg-galaxy-blue flex items-center justify-center overflow-hidden">
            {userName.charAt(0).toUpperCase()}
          </div>
          <div className="flex flex-col">
            <span className="font-medium text-sm text-white">{userName || 'Visitante'}</span>
            <span className="text-xs text-gray-400">Participante</span>
          </div>
        </div>
      </SidebarHeader>
      
      <SidebarBody>
        <SidebarMenu>
          <SidebarMenuGroup title="Principal">
            <SidebarMenuItem 
              active={isActive('/cliente')}
              icon={Home}
              title="Dashboard"
              href="/cliente"
              component={Link}
            />
            <SidebarMenuItem 
              active={isActive('/cliente/missoes')}
              icon={Zap}
              title="Missões"
              href="/cliente/missoes"
              component={Link}
            />
            <SidebarMenuItem 
              active={isActive('/cliente/perfil')}
              icon={User}
              title="Perfil"
              href="/cliente/perfil"
              component={Link}
            />
            <SidebarMenuItem 
              active={isActive('/cliente/sorteios')}
              icon={Gift}
              title="Sorteios"
              href="/cliente/sorteios"
              component={Link}
            />
          </SidebarMenuGroup>
          
          <SidebarMenuGroup title="Outros">
            <SidebarMenuItem 
              active={isActive('/cliente/indicacoes')}
              icon={UserPlus}
              title="Indicações"
              href="/cliente/indicacoes"
              component={Link}
            />
            <SidebarMenuItem 
              active={isActive('/cliente/cashback')}
              icon={Wallet}
              title="Cashback"
              href="/cliente/cashback"
              component={Link}
            />
            <SidebarMenuItem 
              active={isActive('/cliente/suporte')}
              icon={HelpCircle}
              title="Suporte"
              href="/cliente/suporte"
              component={Link}
            />
          </SidebarMenuGroup>
        </SidebarMenu>
      </SidebarBody>
      
      <SidebarFooter>
        <button 
          onClick={handleLogout}
          className="flex items-center gap-2 w-full px-3 py-2 rounded-md text-red-400 hover:bg-red-500/10 transition-colors"
        >
          <LogOut size={18} />
          <span>Sair</span>
        </button>
      </SidebarFooter>
    </Sidebar>
  );
};

export default ClientSidebar;
