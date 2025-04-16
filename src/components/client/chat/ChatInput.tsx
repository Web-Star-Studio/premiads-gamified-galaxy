
import { FC, RefObject, ChangeEvent } from "react";
import { Send } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ChatInputProps {
  message: string;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  onSend: () => void;
  onKeyPress: (e: React.KeyboardEvent) => void;
  inputRef: RefObject<HTMLInputElement>;
}

const ChatInput: FC<ChatInputProps> = ({
  message,
  onChange,
  onSend,
  onKeyPress,
  inputRef,
}) => {
  return (
    <div className="p-4 border-t border-galaxy-purple/30 bg-gradient-to-r from-galaxy-purple/10 to-galaxy-blue/10">
      <div className="flex gap-2">
        <input
          ref={inputRef}
          type="text"
          value={message}
          onChange={onChange}
          onKeyDown={onKeyPress}
          placeholder="Digite sua mensagem..."
          className="flex-1 bg-white/10 border border-white/20 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-neon-cyan text-white placeholder:text-gray-400"
        />
        <Button 
          onClick={onSend} 
          disabled={!message.trim()} 
          variant="default" 
          size="icon"
          className="rounded-full bg-neon-cyan text-galaxy-dark"
        >
          <Send className="h-5 w-5" />
        </Button>
      </div>
    </div>
  );
};

export default ChatInput;
