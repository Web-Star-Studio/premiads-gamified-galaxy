
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Award, RefreshCw } from "lucide-react";
import { retroactivelyAwardBadges } from "@/scripts/retroactivelyAwardBadges";
import { useToast } from "@/hooks/use-toast";
import { useSounds } from "@/hooks/use-sounds";

/**
 * Button component for administrators to retroactively award badges
 * to users who completed missions that should have resulted in badges
 */
const RetroactiveBadgeButton = () => {
  const [isProcessing, setIsProcessing] = useState(false);
  const { toast } = useToast();
  const { playSound } = useSounds();

  const handleAwardBadges = async () => {
    setIsProcessing(true);
    
    try {
      const result = await retroactivelyAwardBadges();
      
      if (result.success) {
        playSound("success");
        toast({
          title: "Badges Processadas",
          description: "Todas as submissões aprovadas foram processadas e as badges foram atribuídas com sucesso.",
        });
      } else {
        playSound("error");
        toast({
          title: "Erro ao Processar Badges",
          description: result.error || "Ocorreu um erro ao processar as badges.",
          variant: "destructive",
        });
      }
    } catch (error: any) {
      console.error("Error in RetroactiveBadgeButton:", error);
      playSound("error");
      toast({
        title: "Erro ao Processar Badges",
        description: error.message || "Ocorreu um erro ao processar as badges.",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <Button
      onClick={handleAwardBadges}
      disabled={isProcessing}
      className="gap-2"
      variant="outline"
    >
      {isProcessing ? (
        <RefreshCw className="h-4 w-4 animate-spin" />
      ) : (
        <Award className="h-4 w-4" />
      )}
      Processar Badges Retroativas
    </Button>
  );
};

export default RetroactiveBadgeButton;
