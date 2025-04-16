
import { useState, useRef, useCallback, useEffect } from "react";
import { Message } from "./types";
import { useSounds } from "@/hooks/use-sounds";

export const useChatLogic = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      content: "Olá! Como posso ajudar você hoje?",
      sender: "agent",
      timestamp: new Date().toISOString()
    }
  ]);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const { playSound } = useSounds();

  // Auto-scroll to bottom when messages update
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Focus input when chat is opened
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
    }
  }, [isOpen]);

  const toggleChat = useCallback(() => {
    setIsOpen(prev => !prev);
    playSound("pop");
  }, [playSound]);

  const closeChat = useCallback(() => {
    setIsOpen(false);
    playSound("pop");
  }, [playSound]);

  const handleSendMessage = useCallback(() => {
    if (!message.trim()) return;

    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      content: message,
      sender: "user",
      timestamp: new Date().toISOString()
    };

    setMessages(prev => [...prev, userMessage]);
    setMessage("");
    playSound("pop");

    // Simulate typing indicator
    setIsTyping(true);

    // Simulate response after a delay
    setTimeout(() => {
      const responses = [
        "Obrigado pelo seu contato! Um agente entrará em contato em breve.",
        "Entendi sua dúvida. Vamos resolver isso rapidamente.",
        "Vou verificar essa informação e retorno para você.",
        "Claro, posso ajudar com isso. Poderia fornecer mais detalhes?",
        "Essa é uma ótima pergunta. Deixe-me consultar e volto com a resposta.",
      ];

      const randomResponse = responses[Math.floor(Math.random() * responses.length)];
      
      const agentMessage: Message = {
        id: Date.now().toString(),
        content: randomResponse,
        sender: "agent",
        timestamp: new Date().toISOString()
      };

      setMessages(prev => [...prev, agentMessage]);
      setIsTyping(false);
      playSound("chime");
    }, 1500);
  }, [message, playSound]);

  const handleKeyPress = useCallback((e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSendMessage();
    }
  }, [handleSendMessage]);

  return {
    isOpen,
    setIsOpen,
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
