
import React from "react";
import { motion } from "framer-motion";
import { MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import ChatHeader from "./chat/ChatHeader";
import MessageList from "./chat/MessageList";
import ChatInput from "./chat/ChatInput";
import { useChatLogic } from "./chat/useChatLogic";

const LiveChat = () => {
  const {
    isOpen,
    setIsOpen,  // Add setIsOpen here
    message,
    messages,
    isTyping,
    messagesEndRef,
    inputRef,
    setMessage,
    toggleChat,
    handleSendMessage,
    handleKeyPress,
    closeChat,
  } = useChatLogic();

  return (
    <>
      {!isOpen && (
        <Button
          onClick={toggleChat}
          className="fixed bottom-24 right-6 w-12 h-12 rounded-full bg-neon-pink text-white shadow-glow z-50"
          size="icon"
        >
          <MessageCircle className="h-6 w-6" />
        </Button>
      )}

      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetContent className="w-full sm:max-w-md p-0 border-l border-galaxy-purple/30 shadow-glow">
          <div className="flex flex-col h-full">
            <ChatHeader onClose={closeChat} />
            
            <MessageList 
              messages={messages} 
              isTyping={isTyping} 
              messagesEndRef={messagesEndRef}
            />

            <ChatInput 
              message={message}
              onChange={(e) => setMessage(e.target.value)}
              onSend={handleSendMessage}
              onKeyPress={handleKeyPress}
              inputRef={inputRef}
            />
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
};

export default LiveChat;
