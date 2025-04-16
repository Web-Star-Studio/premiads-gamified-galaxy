
import { FC } from "react";
import { Button } from "@/components/ui/button";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";

interface UserTypeSelectorProps {
  userType: "participante" | "anunciante";
  changeUserType: (type: "participante" | "anunciante") => void;
  setIsOverlayOpen: (open: boolean) => void;
}

const UserTypeSelector: FC<UserTypeSelectorProps> = ({ 
  userType, 
  changeUserType,
  setIsOverlayOpen 
}) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="outline" 
          size="sm" 
          className="bg-galaxy-deepPurple/70 border-neon-cyan/30 flex items-center justify-center"
        >
          {userType === "participante" ? "Participante" : "Anunciante"} 
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="bg-galaxy-deepPurple/90 backdrop-blur-md border-neon-cyan/50">
        <DropdownMenuItem 
          onClick={() => changeUserType("participante")}
          className={`cursor-pointer ${userType === "participante" ? "neon-text-cyan" : ""}`}
        >
          Participante
        </DropdownMenuItem>
        <DropdownMenuItem 
          onClick={() => changeUserType("anunciante")}
          className={`cursor-pointer ${userType === "anunciante" ? "neon-text-cyan" : ""}`}
        >
          Anunciante
        </DropdownMenuItem>
        <DropdownMenuItem 
          onClick={() => setIsOverlayOpen(true)}
          className="cursor-pointer text-neon-pink"
        >
          Alterar Perfil
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default UserTypeSelector;
