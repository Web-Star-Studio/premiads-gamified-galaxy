
import { Users, Share2, Copy } from "lucide-react";
import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { useSounds } from "@/hooks/use-sounds";

const ReferralProgram = () => {
  const { toast } = useToast();
  const { playSound } = useSounds();
  const [referralCode] = useState("PREMIUMUSER2025");
  
  const handleCopyCode = () => {
    navigator.clipboard.writeText(referralCode);
    playSound("pop");
    toast({
      title: "Código copiado!",
      description: "Código de referência copiado para a área de transferência.",
    });
  };

  return (
    <motion.div
      className="glass-panel p-6"
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold font-heading">Programa de Referência</h2>
        <Users className="w-5 h-5 text-neon-pink" />
      </div>
      
      <p className="text-sm text-gray-400 mb-4">
        Convide seus amigos para o PremiAds e ganhe 200 tickets por cada amigo que se cadastrar e completar sua primeira missão.
      </p>
      
      <div className="bg-galaxy-deepPurple/50 rounded-lg p-4 mb-4 border border-galaxy-purple/30">
        <div className="flex items-center justify-between mb-2">
          <div className="text-sm text-gray-400">Seu código de referência</div>
          <Button
            variant="ghost"
            size="sm"
            className="h-8 text-neon-cyan hover:text-neon-cyan/80"
            onClick={handleCopyCode}
          >
            <Copy className="w-4 h-4 mr-1" />
            Copiar
          </Button>
        </div>
        <Input
          value={referralCode}
          readOnly
          className="bg-galaxy-deepPurple font-medium border-galaxy-purple/30 text-center"
        />
      </div>
      
      <div className="flex gap-2">
        <Button className="w-full bg-neon-cyan text-galaxy-dark hover:bg-neon-cyan/80">
          <Share2 className="w-4 h-4 mr-2" />
          Compartilhar
        </Button>
      </div>
      
      <div className="mt-4 pt-4 border-t border-galaxy-purple/30">
        <div className="text-sm text-gray-400 mb-2">Estatísticas</div>
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-galaxy-deepPurple/40 p-3 rounded border border-galaxy-purple/20">
            <div className="text-xs text-gray-400">Convites enviados</div>
            <div className="text-xl font-semibold">7</div>
          </div>
          <div className="bg-galaxy-deepPurple/40 p-3 rounded border border-galaxy-purple/20">
            <div className="text-xs text-gray-400">Registros completos</div>
            <div className="text-xl font-semibold">3</div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default ReferralProgram;
