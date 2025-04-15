
import React from "react";
import { Button } from "@/components/ui/button";
import { X, Bot } from "lucide-react";

interface ChatHeaderProps {
  onClose: () => void;
}

const ChatHeader = ({ onClose }: ChatHeaderProps) => {
  return (
    <div className="p-4 border-b border-galaxy-purple/30 bg-galaxy-purple/20">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="relative">
            <Bot className="w-8 h-8 text-neon-pink" />
            <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-galaxy-dark"></span>
          </div>
          <div>
            <h3 className="font-heading text-white">Suporte PremiAds</h3>
            <p className="text-xs text-gray-400">Online agora</p>
          </div>
        </div>
        <Button variant="ghost" size="icon" onClick={onClose}>
          <X className="h-5 w-5" />
        </Button>
      </div>
    </div>
  );
};

export default ChatHeader;
