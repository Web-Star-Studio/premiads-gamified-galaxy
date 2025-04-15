
import { useState, useEffect, useRef } from "react";
import { useSounds } from "@/hooks/use-sounds";
import { useToast } from "@/hooks/use-toast";
import { Message } from "./types";

export const useChatLogic = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const { playSound } = useSounds();
  const { toast } = useToast();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

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
    const newUserMessage: Message = {
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
      
      const newAgentMessage: Message = {
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

  return {
    isOpen,
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
  };
};
