
import { FC } from "react";
import { Message } from "./types";
import { cn } from "@/lib/utils";

interface ChatBubbleProps {
  message: Message;
}

const ChatBubble: FC<ChatBubbleProps> = ({ message }) => {
  const isAgent = message.sender === "agent";

  return (
    <div
      className={cn(
        "flex w-max max-w-[80%] flex-col gap-1 rounded-lg px-3 py-2 text-sm",
        isAgent
          ? "ml-0 mr-auto bg-galaxy-deepPurple/70"
          : "ml-auto mr-0 bg-galaxy-purple"
      )}
    >
      <div className="text-white">{message.content}</div>
      <div className="ml-auto text-xs text-white/50">
        {new Date(message.timestamp).toLocaleTimeString([], { 
          hour: '2-digit', 
          minute: '2-digit' 
        })}
      </div>
    </div>
  );
};

export default ChatBubble;
