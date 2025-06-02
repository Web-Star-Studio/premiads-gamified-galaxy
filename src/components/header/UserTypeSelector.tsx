
import { FC } from "react";
import { Button } from "@/components/ui/button";
import { 
  Users, 
  Megaphone
} from "lucide-react";
import { UserType } from "@/types/auth";

interface UserTypeSelectorProps {
  userType: UserType;
  changeUserType: (type: UserType) => void;
  setIsOverlayOpen: (open: boolean) => void;
}

const UserTypeSelector: FC<UserTypeSelectorProps> = ({
  userType,
  changeUserType,
  setIsOverlayOpen,
}) => {
  const handleTypeChange = (type: UserType) => {
    changeUserType(type);
    setIsOverlayOpen(false);
  };

  const getActiveStyle = (type: UserType) => userType === type
      ? "border-2 border-neon-cyan bg-galaxy-purple/40"
      : "hover:bg-galaxy-purple/20";

  return (
    <div className="flex items-center space-x-1">
      <Button
        variant="ghost"
        size="sm"
        className={`px-3 ${getActiveStyle("participante")}`}
        onClick={() => handleTypeChange("participante")}
      >
        <Users size={16} className="mr-2" />
        <span className="hidden sm:inline">Participante</span>
      </Button>
      <Button
        variant="ghost"
        size="sm"
        className={`px-3 ${getActiveStyle("anunciante")}`}
        onClick={() => handleTypeChange("anunciante")}
      >
        <Megaphone size={16} className="mr-2" />
        <span className="hidden sm:inline">Anunciante</span>
      </Button>
    </div>
  );
};

export default UserTypeSelector;

