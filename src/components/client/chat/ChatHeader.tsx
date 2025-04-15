
import { FC } from "react";
import { X } from "lucide-react";
import { SheetHeader, SheetTitle } from "@/components/ui/sheet";

interface ChatHeaderProps {
  onClose: () => void;
  title?: string;
}

const ChatHeader: FC<ChatHeaderProps> = ({ 
  onClose, 
  title = "Atendimento" 
}) => {
  return (
    <SheetHeader className="border-b border-galaxy-purple/30 p-4">
      <div className="flex items-center justify-between">
        <SheetTitle className="text-lg font-heading">{title}</SheetTitle>
        <button
          onClick={onClose}
          className="rounded-full h-8 w-8 flex items-center justify-center hover:bg-galaxy-deepPurple/50 text-gray-400 hover:text-white transition-colors"
          aria-label="Fechar chat"
        >
          <X size={18} />
        </button>
      </div>
    </SheetHeader>
  );
};

export default ChatHeader;
