
import { useState } from "react";
import { motion } from "framer-motion";
import { useToast } from "@/hooks/use-toast";
import { useSounds } from "@/hooks/use-sounds";
import { Button } from "@/components/ui/button";
import { Gift, PackageOpen } from "lucide-react";

interface LootBoxesProps {
  count: number;
}

const REWARDS = [
  { id: 1, name: "50 Pontos Extras", type: "common", color: "text-blue-400" },
  { id: 2, name: "100 Pontos Extras", type: "uncommon", color: "text-green-400" },
  { id: 3, name: "Badge Exclusivo", type: "rare", color: "text-purple-400" },
  { id: 4, name: "Tema de Dashboard", type: "epic", color: "text-yellow-400" },
  { id: 5, name: "Booster de XP (24h)", type: "legendary", color: "text-red-400" },
];

const LootBoxes = ({ count }: LootBoxesProps) => {
  const { toast } = useToast();
  const { playSound } = useSounds();
  const [boxes, setBoxes] = useState(count);
  const [isOpening, setIsOpening] = useState(false);
  
  const openLootBox = () => {
    if (boxes <= 0) {
      toast({
        title: "Sem caixas disponíveis",
        description: "Complete missões para ganhar mais caixas",
      });
      return;
    }
    
    setIsOpening(true);
    playSound("pop");
    
    // Simulate reward opening animation
    setTimeout(() => {
      const randomReward = REWARDS[Math.floor(Math.random() * REWARDS.length)];
      
      playSound("reward");
      toast({
        title: `Recompensa ${randomReward.type.toUpperCase()}!`,
        description: `Você ganhou: ${randomReward.name}`,
      });
      
      setBoxes(prev => prev - 1);
      setIsOpening(false);
    }, 1500);
  };

  return (
    <motion.div
      className="glass-panel p-6"
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold font-heading">Loot Boxes</h2>
        <Gift className="w-5 h-5 text-neon-lime" />
      </div>
      
      <div className="text-center py-4">
        <motion.div 
          className="relative w-24 h-24 mx-auto"
          animate={isOpening ? {
            rotateY: [0, 360],
            scale: [1, 1.2, 1],
          } : {}}
          transition={{ duration: 1.5, ease: "easeInOut" }}
        >
          <PackageOpen className="w-full h-full text-neon-pink" />
          <motion.div 
            className="absolute -top-2 -right-2 w-8 h-8 flex items-center justify-center bg-neon-cyan rounded-full text-galaxy-dark font-bold"
            animate={boxes === 0 ? {} : { scale: [1, 1.2, 1] }}
            transition={{ repeat: Infinity, repeatType: "loop" as const, duration: 2 }}
          >
            {boxes}
          </motion.div>
        </motion.div>
        
        <h3 className="font-medium mt-4 mb-2">
          {boxes > 0 ? `${boxes} caixas disponíveis` : "Nenhuma caixa disponível"}
        </h3>
        
        <p className="text-sm text-gray-400 mb-4">
          Abra suas caixas para ganhar recompensas aleatórias!
        </p>
        
        <Button 
          onClick={openLootBox} 
          disabled={boxes === 0 || isOpening}
          className="neon-button w-full"
        >
          {isOpening ? "Abrindo..." : "Abrir Caixa"}
        </Button>
      </div>
    </motion.div>
  );
};

export default LootBoxes;
