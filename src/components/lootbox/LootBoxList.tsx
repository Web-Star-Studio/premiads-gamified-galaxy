
import { useState } from "react";
import { Gift, Calendar } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useSounds } from "@/hooks/use-sounds";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface LootBox {
  id: string;
  reward_type: string;
  reward_amount: number;
  awarded_at: string;
  is_claimed?: boolean;
}

interface LootBoxListProps {
  lootBoxes: LootBox[];
}

const LootBoxList: React.FC<LootBoxListProps> = ({ lootBoxes }) => {
  const [claimingId, setClaimingId] = useState<string | null>(null);
  const { playSound } = useSounds();
  const { toast } = useToast();

  const handleClaimReward = async (lootBoxId: string, amount: number) => {
    setClaimingId(lootBoxId);
    
    try {
      // Fixed: Use existing function instead of non-existent 'claim_loot_box_reward'
      const { data, error } = await supabase
        .rpc('add_points_to_user', { 
          p_user_id: (await supabase.auth.getUser()).data.user?.id,
          p_points_to_add: amount 
        });
        
      if (error) throw error;
      
      playSound("reward");
      toast({
        title: "Recompensa Recebida!",
        description: `Você ganhou ${amount} pontos!`,
      });
      
    } catch (err: any) {
      console.error("Error claiming reward:", err);
      toast({
        title: "Erro ao receber recompensa",
        description: err.message || "Ocorreu um erro ao receber sua recompensa",
        variant: "destructive",
      });
    } finally {
      setClaimingId(null);
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {lootBoxes.map((lootBox) => (
        <Card key={lootBox.id} className="border-galaxy-purple/30 bg-galaxy-deepPurple/20">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="relative h-16 w-16 flex-shrink-0 rounded-full bg-galaxy-purple/20 flex items-center justify-center">
                <Gift className="h-8 w-8 text-neon-cyan" />
              </div>
              
              <div className="flex-1 min-w-0">
                <h3 className="text-lg font-medium text-white truncate">
                  Loot Box
                </h3>
                <p className="text-sm text-gray-400 mt-1">
                  Recompensa: {lootBox.reward_amount} pontos
                </p>
                
                <div className="flex items-center gap-2 mt-2 text-xs text-gray-500">
                  <Calendar className="h-3 w-3" />
                  <span>
                    {new Date(lootBox.awarded_at).toLocaleDateString('pt-BR')}
                  </span>
                </div>

                {!lootBox.is_claimed && (
                  <Button
                    onClick={() => handleClaimReward(lootBox.id, lootBox.reward_amount)}
                    disabled={claimingId === lootBox.id}
                    className="mt-3 w-full"
                    size="sm"
                  >
                    {claimingId === lootBox.id ? "Processando..." : "Reivindicar"}
                  </Button>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default LootBoxList;
