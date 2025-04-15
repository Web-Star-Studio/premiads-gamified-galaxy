
import { FC } from "react";
import { motion } from "framer-motion";
import { Message } from "./types";

interface MessageListProps {
  messages: Message[];
  isTyping: boolean;
  messagesEndRef: React.RefObject<HTMLDivElement>;
}

const MessageList: FC<MessageListProps> = ({ messages, isTyping, messagesEndRef }) => {
  return (
    <div className="flex-1 overflow-y-auto p-4 fancy-scrollbar">
      <div className="space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.sender === "user" ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`max-w-xs sm:max-w-md p-3 rounded-lg ${
                message.sender === "user"
                  ? "bg-neon-pink/20 border border-neon-pink/30 ml-12"
                  : "bg-galaxy-deepPurple/70 border border-galaxy-purple/30 mr-12"
              }`}
            >
              <p className="text-sm">{message.text}</p>
              <p className="text-xs text-gray-400 mt-1 text-right">
                {message.timestamp.toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit"
                })}
              </p>
            </div>
          </div>
        ))}
        
        {isTyping && (
          <div className="flex justify-start">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="bg-galaxy-deepPurple/70 border border-galaxy-purple/30 p-3 rounded-lg"
            >
              <div className="flex space-x-1">
                <motion.div
                  animate={{ y: [0, -5, 0] }}
                  transition={{ repeat: Infinity, duration: 1 }}
                  className="w-2 h-2 bg-gray-400 rounded-full"
                />
                <motion.div
                  animate={{ y: [0, -5, 0] }}
                  transition={{ repeat: Infinity, duration: 1, delay: 0.2 }}
                  className="w-2 h-2 bg-gray-400 rounded-full"
                />
                <motion.div
                  animate={{ y: [0, -5, 0] }}
                  transition={{ repeat: Infinity, duration: 1, delay: 0.4 }}
                  className="w-2 h-2 bg-gray-400 rounded-full"
                />
              </div>
            </motion.div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>
    </div>
  );
};

export default MessageList;
