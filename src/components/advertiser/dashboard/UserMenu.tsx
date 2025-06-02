
import { User, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { getMoneyValue } from "@/utils/formatCurrency";

interface UserMenuProps {
  credits: number;
  onProfileClick: () => void;
  onLogout: () => void;
}

const UserMenu = ({ credits, onProfileClick, onLogout }: UserMenuProps) => (
    <div className="flex items-center gap-4">
      <div className="text-right hidden md:block">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="flex items-center">
                <p className="text-sm text-muted-foreground">Créditos disponíveis</p>
                <Info className="h-3 w-3 text-muted-foreground ml-1 cursor-help" />
              </div>
            </TooltipTrigger>
            <TooltipContent className="bg-galaxy-darkPurple border-galaxy-purple p-3">
              <div className="space-y-1">
                <p className="text-sm font-medium">Valor estimado: {getMoneyValue(credits)}</p>
                <p className="text-xs text-gray-400">10 créditos = R$1,00</p>
                <p className="text-xs text-gray-400">Créditos usados para campanhas e promoções</p>
              </div>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
        <div className="flex items-center gap-1">
          <p className="text-xl font-bold text-neon-pink">{credits.toLocaleString()}</p>
          <span className="text-xs text-gray-400">• ~{getMoneyValue(credits)}</span>
        </div>
      </div>
      
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-10 w-10 rounded-full p-0 border border-gray-700">
            <User className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={onProfileClick}>
            Perfil
          </DropdownMenuItem>
          <DropdownMenuItem onClick={onLogout}>
            Sair
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );

export default UserMenu;
