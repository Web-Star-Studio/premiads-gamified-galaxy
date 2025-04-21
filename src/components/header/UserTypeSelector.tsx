
import { FC } from "react";
import { Button } from "@/components/ui/button";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { UserType } from "@/types/auth";

interface UserTypeSelectorProps {
  userType: UserType;
  changeUserType: (type: UserType) => void;
  setIsOverlayOpen: (open: boolean) => void;
}

const UserTypeSelector: FC<UserTypeSelectorProps> = ({ 
  userType, 
  changeUserType,
  setIsOverlayOpen 
}) => {
  const openWhatsApp = () => {
    const phoneNumber = "5581985595912";
    const message = encodeURIComponent("Olá, gostaria de saber mais sobre o PremiAds!");
    window.open(`https://wa.me/${phoneNumber}?text=${message}`, "_blank");
  };
  
  // Only show participante and anunciante options in the dropdown
  const showAdminOption = userType === "admin" || userType === "moderator";
  
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="outline" 
          size="sm" 
          className="bg-galaxy-deepPurple/70 border-neon-cyan/30 flex items-center justify-center"
        >
          {userType === "participante" ? "Participante" : 
           userType === "anunciante" ? "Anunciante" : 
           userType === "admin" ? "Admin" : "Moderador"} 
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
        {showAdminOption && (
          <DropdownMenuItem 
            onClick={() => changeUserType(userType)}
            className={`cursor-pointer neon-text-cyan`}
          >
            {userType === "admin" ? "Admin" : "Moderador"}
          </DropdownMenuItem>
        )}
        <DropdownMenuItem 
          onClick={() => setIsOverlayOpen(true)}
          className="cursor-pointer text-neon-pink"
        >
          Alterar Perfil
        </DropdownMenuItem>
        <DropdownMenuItem 
          onClick={openWhatsApp}
          className="cursor-pointer text-white hover:text-neon-cyan"
        >
          Fale Conosco
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default UserTypeSelector;
