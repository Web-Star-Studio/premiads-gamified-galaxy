
import { FC } from "react";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ChatHeaderProps {
  onClose: () => void;
}

const ChatHeader: FC<ChatHeaderProps> = ({
  onClose
}) => {
  return (
    <div className="p-4 border-b border-galaxy-purple/30 bg-gradient-to-r from-galaxy-purple/20 to-galaxy-blue/20">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-neon-lime animate-pulse"></div>
          <h3 className="font-heading text-lg">Suporte</h3>
        </div>
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={onClose} 
          className="h-8 w-8 rounded-full hover:bg-white/10"
        >
          <X className="h-4 w-4" />
        </Button>
      </div>
      <p className="text-sm text-gray-400 mt-1">
        Tempo estimado de resposta: 5 minutos
      </p>
    </div>
  );
};

export default ChatHeader;
