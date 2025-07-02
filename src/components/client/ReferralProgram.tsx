import { Users, Share2, Copy } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { useSounds } from "@/hooks/use-sounds";
import { useReferrals } from "@/hooks/useReferrals";

const ReferralProgram = () => {
  const { toast } = useToast();
  const { playSound } = useSounds();
  const { referralCode, stats, loading } = useReferrals();
  
  const handleCopyCode = () => {
    navigator.clipboard.writeText(referralCode);
    playSound("pop");
    toast({
      title: "Código copiado!",
      description: "Código de referência copiado para a área de transferência.",
    });
  };

  const handleShare = () => {
    const shareText = `Junte-se a mim no PremiAds e ganhe pontos para trocar por prêmios incríveis! Use meu código: ${referralCode}`;
    const shareUrl = `${window.location.origin}/auth?ref=${referralCode}`;
    
    if (navigator.share) {
      navigator.share({
        title: 'PremiAds - Programa de Referência',
        text: shareText,
        url: shareUrl
      });
    } else {
      navigator.clipboard.writeText(`${shareText}\n${shareUrl}`);
      playSound("pop");
      toast({
        title: "Link copiado!",
        description: "Link de convite copiado para a área de transferência.",
      });
    }
  };

  if (loading) {
    return (
      <motion.div
        className="glass-panel p-6"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
      >
        <div className="flex items-center justify-center h-48">
          <div className="w-8 h-8 border-4 border-t-neon-cyan border-galaxy-purple rounded-full animate-spin"></div>
        </div>
      </motion.div>
    );
  }

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
        Convide seus amigos para o PremiAds e ganhe 200 pontos por cada amigo que se cadastrar e completar sua primeira missão.
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
          value={referralCode || "Carregando..."}
          readOnly
          className="bg-galaxy-deepPurple font-medium border-galaxy-purple/30 text-center"
        />
      </div>
      
      <div className="flex gap-2 mb-4">
        <Button 
          className="w-full bg-neon-cyan text-galaxy-dark hover:bg-neon-cyan/80"
          onClick={handleShare}
        >
          <Share2 className="w-4 h-4 mr-2" />
          Compartilhar
        </Button>
      </div>
      
      <div className="pt-4 border-t border-galaxy-purple/30">
        <div className="text-sm text-gray-400 mb-3">Estatísticas</div>
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-galaxy-deepPurple/40 p-3 rounded border border-galaxy-purple/20">
            <div className="text-xs text-gray-400">Convites enviados</div>
            <div className="text-xl font-semibold text-neon-cyan">{stats.totalConvites}</div>
          </div>
          <div className="bg-galaxy-deepPurple/40 p-3 rounded border border-galaxy-purple/20">
            <div className="text-xs text-gray-400">Registros completos</div>
            <div className="text-xl font-semibold text-neon-green">{stats.registrados}</div>
          </div>
          <div className="bg-galaxy-deepPurple/40 p-3 rounded border border-galaxy-purple/20">
            <div className="text-xs text-gray-400">Pendentes</div>
            <div className="text-xl font-semibold text-yellow-400">{stats.pendentes}</div>
          </div>
          <div className="bg-galaxy-deepPurple/40 p-3 rounded border border-galaxy-purple/20">
            <div className="text-xs text-gray-400">Pontos ganhos</div>
            <div className="text-xl font-semibold text-neon-pink">{stats.pontosGanhos}</div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default ReferralProgram;
