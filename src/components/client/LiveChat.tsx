
import { MessageSquare, X } from "lucide-react";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useSounds } from "@/hooks/use-sounds";

const LiveChat = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<{ text: string; isUser: boolean }[]>([
    { text: "Olá! Como posso ajudar você hoje?", isUser: false },
  ]);
  const [newMessage, setNewMessage] = useState("");
  const { playSound } = useSounds();

  const toggleChat = () => {
    setIsOpen(!isOpen);
    if (!isOpen) {
      playSound("pop");
    }
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    // Add user message
    setMessages([...messages, { text: newMessage, isUser: true }]);
    setNewMessage("");
    playSound("pop");

    // Simulate response after delay
    setTimeout(() => {
      setMessages(prev => [
        ...prev,
        { 
          text: "Obrigado por sua mensagem! Um de nossos atendentes responderá em breve.", 
          isUser: false 
        }
      ]);
      playSound("chime");
    }, 1000);
  };

  return (
    <div className="fixed bottom-6 right-24 z-50">
      <Button
        variant="outline"
        size="icon"
        className="w-12 h-12 rounded-full bg-galaxy-purple text-white border-neon-pink shadow-glow"
        onClick={toggleChat}
      >
        <MessageSquare className="h-6 w-6" />
      </Button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            className="absolute bottom-16 right-0 glass-panel rounded-lg w-80 overflow-hidden shadow-glow"
          >
            <div className="p-3 bg-galaxy-deepPurple/50 border-b border-galaxy-purple/30 flex items-center justify-between">
              <h3 className="text-md font-heading">Chat ao vivo</h3>
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-6 w-6" 
                onClick={toggleChat}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
            
            <div className="h-72 overflow-y-auto p-3 flex flex-col space-y-2 bg-galaxy-dark/20">
              {messages.map((msg, index) => (
                <div
                  key={index}
                  className={`p-2 rounded-lg max-w-[80%] ${
                    msg.isUser
                      ? "bg-neon-pink/20 ml-auto"
                      : "bg-galaxy-deepPurple/40 mr-auto"
                  }`}
                >
                  <p className="text-sm">{msg.text}</p>
                </div>
              ))}
            </div>
            
            <form onSubmit={handleSendMessage} className="p-3 border-t border-galaxy-purple/30 flex">
              <Input
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Digite sua mensagem..."
                className="bg-galaxy-deepPurple/30 border-galaxy-purple/30 text-sm"
              />
              <Button type="submit" className="ml-2 bg-neon-cyan text-galaxy-dark">
                Enviar
              </Button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default LiveChat;
