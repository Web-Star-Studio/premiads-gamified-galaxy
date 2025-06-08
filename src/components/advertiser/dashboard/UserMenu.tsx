
import React from "react";
import { User, Info, Settings, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from "@/components/ui/dropdown-menu";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { getMoneyValue } from "@/utils/formatCurrency";
import { useUserCredits } from "@/hooks/useUserCredits";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";

const UserMenu = () => {
  const { availableCredits: rifas, loading } = useUserCredits();
  
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-8 w-8 rounded-full">
          <Avatar className="h-8 w-8">
            <AvatarImage src="/placeholder-user.jpg" alt="@username" />
            <AvatarFallback>U</AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-80 bg-galaxy-darkPurple border-galaxy-purple/50" align="end" forceMount>
        <div className="flex flex-col space-y-4 p-4">
          <div className="flex items-center space-x-2">
            <Avatar className="h-10 w-10">
              <AvatarImage src="/placeholder-user.jpg" alt="@username" />
              <AvatarFallback>U</AvatarFallback>
            </Avatar>
            <div>
              <p className="text-sm font-medium leading-none text-white">João Silva</p>
              <p className="text-xs leading-none text-muted-foreground">joao@exemplo.com</p>
            </div>
          </div>
          
          <Separator className="bg-galaxy-purple/30" />
          
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm text-white">Rifas Disponíveis</span>
              <span className="text-sm font-semibold text-neon-cyan">
                {loading ? (
                  <div className="w-4 h-4 border-2 border-t-transparent border-white rounded-full animate-spin"></div>
                ) : (
                  rifas
                )}
              </span>
            </div>
            <p className="text-sm text-muted-foreground">Rifas disponíveis</p>
            <div className="space-y-1 text-xs text-gray-400">
              <p>100 rifas = R$5,00</p>
              <p>Rifas usadas para campanhas e promoções</p>
            </div>
          </div>
        </div>
        
        <DropdownMenuSeparator className="bg-galaxy-purple/30" />
        
        <DropdownMenuItem className="text-white hover:bg-galaxy-purple/20">
          <User className="mr-2 h-4 w-4" />
          <span>Perfil</span>
        </DropdownMenuItem>
        <DropdownMenuItem className="text-white hover:bg-galaxy-purple/20">
          <Settings className="mr-2 h-4 w-4" />
          <span>Configurações</span>
        </DropdownMenuItem>
        
        <DropdownMenuSeparator className="bg-galaxy-purple/30" />
        
        <DropdownMenuItem className="text-red-400 hover:bg-red-400/20">
          <LogOut className="mr-2 h-4 w-4" />
          <span>Sair</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default UserMenu;
