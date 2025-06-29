import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, Zap, User, Gift, UserPlus, Wallet, HelpCircle, LogOut, Award, Bell, PiggyBank } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useUserCredits } from '@/hooks/useUserCredits';
import { safeLogoutWithFallback } from '@/utils/auth';
import { 
  Sidebar, 
  SidebarHeader, 
  SidebarContent, 
  SidebarMenu,
  SidebarMenuItem, 
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
  SidebarMenuButton,
  SidebarFooter
} from '@/components/ui/sidebar';

interface ClientSidebarProps {
  userName?: string;
}

const ClientSidebar: React.FC<ClientSidebarProps> = ({ userName = 'Visitante' }) => {
  const location = useLocation();
  const { signOut } = useAuth();
  const { availableCredits: rifas, availableCashback: cashback, isLoading } = useUserCredits();
  
  const isActive = (path: string) => {
    // Handle exact match for root client path
    if (path === '/cliente') {
      return location.pathname === '/cliente';
    }
    // For other paths, check exact match or nested routes
    return location.pathname === path || location.pathname.startsWith(`${path}/`);
  };

  const handleLogout = async () => {
    await safeLogoutWithFallback(signOut);
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
        <div className="mt-4 mb-2 px-2 py-3 rounded-lg bg-galaxy-deepPurple/40 flex flex-col gap-2">
          <div className="flex items-center gap-2">
            <Wallet className="w-4 h-4 text-neon-cyan" />
            <span className="text-xs text-gray-300">Rifas</span>
            <span className="ml-auto text-sm font-semibold text-neon-cyan">{isLoading ? '...' : rifas}</span>
          </div>
          <div className="flex items-center gap-2">
            <PiggyBank className="w-4 h-4 text-green-400" />
            <span className="text-xs text-gray-300">Cashback</span>
            <span className="ml-auto text-sm font-semibold text-green-400">{isLoading ? '...' : formatCurrency(cashback)}</span>
          </div>
        </div>
      </SidebarHeader>
      
      <SidebarContent>
        <SidebarMenu>
          <SidebarGroup>
            <SidebarGroupLabel>Principal</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenuItem>
                <SidebarMenuButton 
                  isActive={isActive('/cliente')}
                  asChild
                >
                  <Link to="/cliente">
                    <Home />
                    <span>Dashboard</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              
              <SidebarMenuItem>
                <SidebarMenuButton 
                  isActive={isActive('/cliente/missoes')}
                  asChild
                >
                  <Link to="/cliente/missoes">
                    <Zap />
                    <span>Missões</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              
              <SidebarMenuItem>
                <SidebarMenuButton 
                  isActive={isActive('/cliente/recompensas')}
                  asChild
                >
                  <Link to="/cliente/recompensas">
                    <Award />
                    <span>Recompensas</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              
              <SidebarMenuItem>
                <SidebarMenuButton 
                  isActive={isActive('/cliente/sorteios')}
                  asChild
                >
                  <Link to="/cliente/sorteios">
                    <Gift />
                    <span>Sorteios</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              
              <SidebarMenuItem>
                <SidebarMenuButton 
                  isActive={isActive('/cliente/perfil')}
                  asChild
                >
                  <Link to="/cliente/perfil">
                    <User />
                    <span>Perfil</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              
              <SidebarMenuItem>
                <SidebarMenuButton 
                  isActive={isActive('/cliente/notificacoes')}
                  asChild
                >
                  <Link to="/cliente/notificacoes">
                    <Bell />
                    <span>Notificações</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarGroupContent>
          </SidebarGroup>
          
          <SidebarGroup>
            <SidebarGroupLabel>Outros</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenuItem>
                <SidebarMenuButton 
                  isActive={isActive('/cliente/indicacoes')}
                  asChild
                >
                  <Link to="/cliente/indicacoes">
                    <UserPlus />
                    <span>Indicações</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              
              <SidebarMenuItem>
                <SidebarMenuButton 
                  isActive={isActive('/cliente/cashback')}
                  asChild
                >
                  <Link to="/cliente/cashback">
                    <Wallet />
                    <span>Cashback</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              
              <SidebarMenuItem>
                <SidebarMenuButton 
                  isActive={isActive('/cliente/suporte')}
                  asChild
                >
                  <Link to="/cliente/suporte">
                    <HelpCircle />
                    <span>Suporte</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarMenu>
      </SidebarContent>
      
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

function formatCurrency(value: number): string {
  return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
}

export default ClientSidebar;
