
import { Button } from "@/components/ui/button";

interface UserTypeSelectorProps {
  userType: "participante" | "anunciante";
  changeUserType: (type: "participante" | "anunciante") => void;
  setIsOverlayOpen: (isOpen: boolean) => void;
}

const UserTypeSelector = ({ userType, changeUserType, setIsOverlayOpen }: UserTypeSelectorProps) => {
  return (
    <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg p-0.5 flex">
      <button
        className={`px-3 py-1.5 text-sm rounded-md transition-colors ${
          userType === "participante"
            ? "bg-white/10 text-white"
            : "text-gray-400 hover:text-white"
        }`}
        onClick={() => {
          if (userType !== "participante") {
            changeUserType("participante");
            setIsOverlayOpen(true);
          }
        }}
      >
        Participante
      </button>
      <button
        className={`px-3 py-1.5 text-sm rounded-md transition-colors ${
          userType === "anunciante"
            ? "bg-white/10 text-white"
            : "text-gray-400 hover:text-white"
        }`}
        onClick={() => {
          if (userType !== "anunciante") {
            changeUserType("anunciante");
            setIsOverlayOpen(true);
          }
        }}
      >
        Anunciante
      </button>
    </div>
  );
};

export default UserTypeSelector;
