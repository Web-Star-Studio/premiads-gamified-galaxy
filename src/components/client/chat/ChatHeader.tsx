
import { FC, memo, useCallback } from "react";
import { X } from "lucide-react";
import { SheetHeader, SheetTitle } from "@/components/ui/sheet";

interface ChatHeaderProps {
  onClose: () => void;
  title?: string;
}

/**
 * Header component for chat interface
 * Displays title and close button
 */
const ChatHeader: FC<ChatHeaderProps> = ({ 
  onClose, 
  title = "Atendimento" 
}) => {
  const handleCloseChat = useCallback(() => {
    onClose();
  }, [onClose]);

  return (
    <SheetHeader className="border-b border-galaxy-purple/30 p-4">
      <div className="flex items-center justify-between">
        <SheetTitle className="text-lg font-heading">{title}</SheetTitle>
        <button
          onClick={handleCloseChat}
          className="rounded-full h-8 w-8 flex items-center justify-center hover:bg-galaxy-deepPurple/50 text-gray-400 hover:text-white transition-colors"
          aria-label="Fechar chat"
        >
          <X size={18} />
        </button>
      </div>
    </SheetHeader>
  );
};

export default memo(ChatHeader);
