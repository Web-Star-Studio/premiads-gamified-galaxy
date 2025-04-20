
import { FC } from "react";
import { Button } from "@/components/ui/button";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { UserType } from "@/types/auth";
import { useToast } from "@/hooks/use-toast";
import { useSounds } from "@/hooks/use-sounds";

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
  const { toast } = useToast();
  const { playSound } = useSounds();
  
  const openWhatsApp = () => {
    const phoneNumber = "5581985595912";
    const message = encodeURIComponent("Olá, gostaria de saber mais sobre o PremiAds!");
    window.open(`https://wa.me/${phoneNumber}?text=${message}`, "_blank");
  };

  const handleChangeUserType = async (type: UserType) => {
    try {
      playSound("pop");
      changeUserType(type);
      toast({
        title: "Tipo de usuário alterado",
        description: `Seu perfil foi alterado para ${type === "participante" ? "Participante" : type === "anunciante" ? "Anunciante" : "Admin"}`,
      });
    } catch (error) {
      console.error("Erro ao alterar tipo de usuário:", error);
      toast({
        title: "Erro",
        description: "Não foi possível alterar o tipo de usuário",
        variant: "destructive",
      });
    }
  };
  
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="outline" 
          size="sm" 
          className="bg-galaxy-deepPurple/70 border-neon-cyan/30 flex items-center justify-center"
        >
          {userType === "participante" ? "Participante" : userType === "anunciante" ? "Anunciante" : "Admin"} 
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="bg-galaxy-deepPurple/90 backdrop-blur-md border-neon-cyan/50">
        <DropdownMenuItem 
          onClick={() => handleChangeUserType("participante")}
          className={`cursor-pointer ${userType === "participante" ? "neon-text-cyan" : ""}`}
        >
          Participante
        </DropdownMenuItem>
        <DropdownMenuItem 
          onClick={() => handleChangeUserType("anunciante")}
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
