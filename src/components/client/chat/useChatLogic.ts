
import { useState, useEffect, useRef } from "react";
import { useSounds } from "@/hooks/use-sounds";
import { useToast } from "@/hooks/use-toast";
import { Message } from "./types";

export interface UseChatLogicReturn {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  message: string;
  messages: Message[];
  isTyping: boolean;
  messagesEndRef: React.RefObject<HTMLDivElement>;
  inputRef: React.RefObject<HTMLInputElement>;
  setMessage: (message: string) => void;
  toggleChat: () => void;
  handleSendMessage: () => void;
  handleKeyPress: (e: React.KeyboardEvent) => void;
  closeChat: () => void;
}

export const useChatLogic = (): UseChatLogicReturn => {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const { playSound } = useSounds();
  const { toast } = useToast();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Mensagem inicial de saudação
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

  // Rolagem automática para o final das mensagens
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  // Foco no input quando o chat é aberto
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

    // Adiciona mensagem do usuário
    const newUserMessage: Message = {
      id: Date.now(),
      text: message,
      sender: "user",
      timestamp: new Date(),
    };
    
    setMessages((prev) => [...prev, newUserMessage]);
    setMessage("");
    playSound("pop");

    // Simula digitação do agente
    setIsTyping(true);
    
    // Simula resposta do agente após um atraso
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
