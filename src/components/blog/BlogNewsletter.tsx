
import React, { useState } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Send } from 'lucide-react';
import { motion } from 'framer-motion';
import { useToast } from "@/components/ui/use-toast";

const BlogNewsletter: React.FC = () => {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulação de envio
    setTimeout(() => {
      toast({
        title: "Inscrição confirmada!",
        description: "Você receberá nossas atualizações no email fornecido.",
        variant: "default",
        className: "bg-neon-cyan/90 text-galaxy-dark border-0"
      });
      setEmail('');
      setIsSubmitting(false);
    }, 1500);
  };

  return (
    <Card className="bg-gradient-to-br from-galaxy-deepPurple/50 to-zinc-900/80 border-zinc-800 overflow-hidden relative">
      <div className="absolute right-0 top-0 w-32 h-32 bg-neon-cyan/10 rounded-full blur-3xl"></div>
      <CardContent className="p-6 relative z-10">
        <h3 className="text-xl font-bold mb-2">Newsletter</h3>
        <p className="text-gray-400 text-sm mb-4">
          Receba os melhores conteúdos sobre gamificação e marketing diretamente no seu email.
        </p>
        
        <form onSubmit={handleSubmit} className="space-y-3">
          <Input
            type="email"
            placeholder="Seu melhor email"
            className="bg-zinc-800/50 border-zinc-700"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          
          <motion.div 
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Button 
              type="submit" 
              className="w-full bg-neon-cyan text-galaxy-dark hover:bg-neon-cyan/80"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>Enviando...</>
              ) : (
                <>Inscrever-se <Send size={16} className="ml-2" /></>
              )}
            </Button>
          </motion.div>
          
          <p className="text-xs text-gray-500 mt-2">
            Ao se inscrever, você concorda com nossa Política de Privacidade.
          </p>
        </form>
      </CardContent>
    </Card>
  );
};

export default BlogNewsletter;
