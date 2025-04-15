
import { FC, RefObject } from "react";
import { Send } from "lucide-react";
import { Input } from "@/components/ui/input";

interface ChatInputProps {
  message: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSend: () => void;
  onKeyPress: (e: React.KeyboardEvent) => void;
  inputRef: RefObject<HTMLInputElement>;
  placeholder?: string;
}

const ChatInput: FC<ChatInputProps> = ({ 
  message, 
  onChange, 
  onSend, 
  onKeyPress, 
  inputRef,
  placeholder = "Digite sua mensagem..."
}) => {
  const isDisabled = !message.trim();
  
  return (
    <div className="border-t border-galaxy-purple/30 p-4 bg-galaxy-darkPurple/30">
      <div className="flex gap-2">
        <Input
          ref={inputRef}
          className="flex-1 bg-galaxy-deepPurple/70 border-galaxy-purple/30 focus-visible:ring-neon-cyan/50"
          placeholder={placeholder}
          value={message}
          onChange={onChange}
          onKeyDown={onKeyPress}
          aria-label="Mensagem de chat"
        />
        <button
          onClick={onSend}
          disabled={isDisabled}
          aria-label="Enviar mensagem"
          className={`p-2 rounded-full transition-colors ${
            isDisabled
              ? "bg-gray-700 text-gray-400 cursor-not-allowed"
              : "bg-neon-cyan text-galaxy-dark hover:bg-neon-cyan/80"
          }`}
        >
          <Send size={18} />
        </button>
      </div>
    </div>
  );
};

export default ChatInput;
