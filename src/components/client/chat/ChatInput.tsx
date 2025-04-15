
import React, { useRef } from "react";
import { Button } from "@/components/ui/button";
import { Send, Paperclip, Smile } from "lucide-react";

interface ChatInputProps {
  message: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSend: () => void;
  onKeyPress: (e: React.KeyboardEvent) => void;
  inputRef: React.RefObject<HTMLInputElement>;
}

const ChatInput = ({ message, onChange, onSend, onKeyPress, inputRef }: ChatInputProps) => {
  return (
    <div className="p-4 border-t border-galaxy-purple/30">
      <div className="flex items-center gap-2">
        <div className="flex-1 relative">
          <input
            ref={inputRef}
            type="text"
            value={message}
            onChange={onChange}
            onKeyPress={onKeyPress}
            placeholder="Digite sua mensagem..."
            className="w-full px-4 py-2 bg-galaxy-purple/20 rounded-full text-white text-sm border border-galaxy-purple/30 focus:outline-none focus:border-neon-pink pr-20"
          />
          <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex space-x-1">
            <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-400 hover:text-white">
              <Paperclip className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-400 hover:text-white">
              <Smile className="h-4 w-4" />
            </Button>
          </div>
        </div>
        <Button 
          onClick={onSend} 
          size="icon" 
          className="h-10 w-10 rounded-full bg-neon-pink hover:bg-neon-pink/80"
        >
          <Send className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

export default ChatInput;
