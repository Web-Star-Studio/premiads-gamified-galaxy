
import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageCircle, Send, X, Paperclip, Smile, ChevronDown, User, Bot } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { useSounds } from "@/hooks/use-sounds";
import { useToast } from "@/hooks/use-toast";

const LiveChat = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const { playSound } = useSounds();
  const { toast } = useToast();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  interface Message {
    id: number;
    text: string;
    sender: "user" | "agent";
    timestamp: Date;
  }

  // Initial greeting message
  useEffect(() => {
    if (messages.length === 0 && isOpen) {
      setIsTyping(true);
      setTimeout(() => {
        setMessages([
          {
            id: 1,
            text: "Olá! Como posso ajudar você hoje?",
            sender: "agent",
            timestamp: new Date(),
          },
        ]);
        setIsTyping(false);
      }, 1500);
    }
  }, [isOpen, messages.length]);

  // Auto scroll to bottom of messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  // Focus input when chat opens
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 300);
    }
  }, [isOpen]);

  const toggleChat = () => {
    setIsOpen(!isOpen);
    playSound("pop");
  };

  const handleSendMessage = () => {
    if (message.trim() === "") return;

    // Add user message
    const newUserMessage = {
      id: Date.now(),
      text: message,
      sender: "user",
      timestamp: new Date(),
    };
    
    setMessages((prev) => [...prev, newUserMessage]);
    setMessage("");
    playSound("pop");

    // Simulate agent typing
    setIsTyping(true);
    
    // Simulate agent response after a delay
    setTimeout(() => {
      const responses = [
        "Entendi! Vou verificar isso para você.",
        "Obrigado por explicar. Posso ajudar com mais alguma coisa?",
        "Essa é uma ótima pergunta. Deixe-me consultar mais informações.",
        "Estamos trabalhando para resolver esse problema o mais rápido possível.",
        "Suas missões estão indo muito bem! Continue assim para ganhar mais pontos.",
      ];
      
      const randomResponse = responses[Math.floor(Math.random() * responses.length)];
      
      const newAgentMessage = {
        id: Date.now() + 1,
        text: randomResponse,
        sender: "agent",
        timestamp: new Date(),
      };
      
      setMessages((prev) => [...prev, newAgentMessage]);
      setIsTyping(false);
      playSound("chime");
    }, 2000);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSendMessage();
    }
  };

  const closeChat = () => {
    setIsOpen(false);
    playSound("pop");
    
    if (messages.length > 1) {
      toast({
        title: "Chat encerrado",
        description: "Histórico de conversa disponível em seu perfil",
      });
    }
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

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
            {/* Chat header */}
            <div className="p-4 border-b border-galaxy-purple/30 bg-galaxy-purple/20">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <Bot className="w-8 h-8 text-neon-pink" />
                    <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-galaxy-dark"></span>
                  </div>
                  <div>
                    <h3 className="font-heading text-white">Suporte PremiAds</h3>
                    <p className="text-xs text-gray-400">Online agora</p>
                  </div>
                </div>
                <Button variant="ghost" size="icon" onClick={closeChat}>
                  <X className="h-5 w-5" />
                </Button>
              </div>
            </div>

            {/* Chat messages */}
            <motion.div 
              className="flex-1 p-4 overflow-y-auto fancy-scrollbar"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.2 }}
            >
              <AnimatePresence>
                {messages.map((msg) => (
                  <motion.div
                    key={msg.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.2 }}
                    className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"} mb-4`}
                  >
                    <div className={`max-w-[80%] ${
                      msg.sender === "user" 
                        ? "bg-neon-pink/20 rounded-t-lg rounded-bl-lg" 
                        : "bg-galaxy-purple/30 rounded-t-lg rounded-br-lg"
                    } p-3 relative`}>
                      <p className="text-sm">{msg.text}</p>
                      <span className="text-xs text-gray-400 block mt-1 text-right">
                        {formatTime(msg.timestamp)}
                      </span>
                    </div>
                  </motion.div>
                ))}

                {isTyping && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex justify-start mb-4"
                  >
                    <div className="bg-galaxy-purple/30 rounded-t-lg rounded-br-lg p-3">
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: "0ms" }}></div>
                        <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: "150ms" }}></div>
                        <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: "300ms" }}></div>
                      </div>
                    </div>
                  </motion.div>
                )}
                <div ref={messagesEndRef} />
              </AnimatePresence>
            </motion.div>

            {/* Chat input */}
            <div className="p-4 border-t border-galaxy-purple/30">
              <div className="flex items-center gap-2">
                <div className="flex-1 relative">
                  <input
                    ref={inputRef}
                    type="text"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    onKeyPress={handleKeyPress}
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
                  onClick={handleSendMessage} 
                  size="icon" 
                  className="h-10 w-10 rounded-full bg-neon-pink hover:bg-neon-pink/80"
                >
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
};

export default LiveChat;
