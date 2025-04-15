
import React from "react";
import { motion } from "framer-motion";
import { AnimatePresence } from "framer-motion";
import ChatBubble from "./ChatBubble";
import TypingIndicator from "./TypingIndicator";
import { Message } from "./types";

interface MessageListProps {
  messages: Message[];
  isTyping: boolean;
  messagesEndRef: React.RefObject<HTMLDivElement>;
}

const MessageList = ({ messages, isTyping, messagesEndRef }: MessageListProps) => {
  return (
    <motion.div 
      className="flex-1 p-4 overflow-y-auto fancy-scrollbar"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.2 }}
    >
      <AnimatePresence>
        {messages.map((msg) => (
          <ChatBubble key={msg.id} message={msg} />
        ))}

        {isTyping && <TypingIndicator />}
        <div ref={messagesEndRef} />
      </AnimatePresence>
    </motion.div>
  );
};

export default MessageList;
