
import { User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

interface UserMenuProps {
  credits: number;
  onProfileClick: () => void;
  onLogout: () => void;
}

const UserMenu = ({ credits, onProfileClick, onLogout }: UserMenuProps) => {
  return (
    <div className="flex items-center gap-4">
      <div className="text-right hidden md:block">
        <p className="text-sm text-muted-foreground">Créditos disponíveis</p>
        <p className="text-xl font-bold text-neon-pink">{credits.toLocaleString()}</p>
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
};

export default UserMenu;
