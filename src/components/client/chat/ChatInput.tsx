
import { FC } from "react";
import { Send } from "lucide-react";
import { Input } from "@/components/ui/input";

interface ChatInputProps {
  message: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSend: () => void;
  onKeyPress: (e: React.KeyboardEvent) => void;
  inputRef: React.RefObject<HTMLInputElement>;
}

const ChatInput: FC<ChatInputProps> = ({ 
  message, 
  onChange, 
  onSend, 
  onKeyPress, 
  inputRef 
}) => {
  return (
    <div className="border-t border-galaxy-purple/30 p-4 bg-galaxy-darkPurple/30">
      <div className="flex gap-2">
        <Input
          ref={inputRef}
          className="flex-1 bg-galaxy-deepPurple/70 border-galaxy-purple/30"
          placeholder="Digite sua mensagem..."
          value={message}
          onChange={onChange}
          onKeyDown={onKeyPress}
        />
        <button
          onClick={onSend}
          disabled={!message.trim()}
          className={`p-2 rounded-full ${
            message.trim()
              ? "bg-neon-cyan text-galaxy-dark hover:bg-neon-cyan/80"
              : "bg-gray-700 text-gray-400 cursor-not-allowed"
          }`}
        >
          <Send size={18} />
        </button>
      </div>
    </div>
  );
};

export default ChatInput;
