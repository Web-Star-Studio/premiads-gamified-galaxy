
import { RefObject } from "react";
import ChatBubble from "./ChatBubble";
import TypingIndicator from "./TypingIndicator";
import { Message } from "./types";

interface MessageListProps {
  messages: Message[];
  isTyping: boolean;
  messagesEndRef: RefObject<HTMLDivElement>;
}

const MessageList = ({ messages, isTyping, messagesEndRef }: MessageListProps) => (
    <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-galaxy-dark/80">
      {messages.map((message) => (
        <ChatBubble key={message.id} message={message} />
      ))}
      
      {isTyping && <TypingIndicator />}
      
      <div ref={messagesEndRef} />
    </div>
  );

export default MessageList;
