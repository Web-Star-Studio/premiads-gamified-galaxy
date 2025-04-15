
import React from "react";
import { motion } from "framer-motion";
import { Message } from "./types";

interface ChatBubbleProps {
  message: Message;
}

const ChatBubble = ({ message }: ChatBubbleProps) => {
  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
      className={`flex ${message.sender === "user" ? "justify-end" : "justify-start"} mb-4`}
    >
      <div className={`max-w-[80%] ${
        message.sender === "user" 
          ? "bg-neon-pink/20 rounded-t-lg rounded-bl-lg" 
          : "bg-galaxy-purple/30 rounded-t-lg rounded-br-lg"
      } p-3 relative`}>
        <p className="text-sm">{message.text}</p>
        <span className="text-xs text-gray-400 block mt-1 text-right">
          {formatTime(message.timestamp)}
        </span>
      </div>
    </motion.div>
  );
};

export default ChatBubble;
