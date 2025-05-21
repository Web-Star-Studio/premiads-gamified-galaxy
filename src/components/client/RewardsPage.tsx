
import React, { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Award, Gift, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useBadges } from "@/hooks/cliente/useBadges";
import { BadgeList } from "@/components/badges/BadgeList";
import { LootBoxList } from "@/components/lootbox/LootBoxList";
import { useLootBoxRewards } from "@/lib/submissions/useLootBoxRewards";
import { useUserCredits } from "@/hooks/useUserCredits";

export const RewardsPage = () => {
  const [activeTab, setActiveTab] = useState("badges");
  const [userId, setUserId] = useState<string | null>(null);
  const { toast } = useToast();
  const { refreshCredits } = useUserCredits();
  
  const { badges, loading: badgesLoading } = useBadges(userId);
  const { 
    lootBoxes, 
    loading: lootBoxesLoading, 
    refreshLootBoxes,
    markLootBoxAsClaimed 
  } = useLootBoxRewards(userId);

  // Get current user
  useEffect(() => {
    const fetchUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user?.id) {
        setUserId(session.user.id);
      }
    };
    
    fetchUser();
  }, []);

  const handleLootBoxClaimed = (rewardId: string) => {
    markLootBoxAsClaimed(rewardId);
    // Refresh user credits to show updated balance
    refreshCredits();
  };

  return (
    <Card className="border-neon-cyan/30 shadow-[0_0_20px_rgba(0,255,231,0.1)]">
      <CardHeader className="pb-3">
        <CardTitle>Minhas Recompensas</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="w-full">
            <TabsTrigger value="badges" className="flex-1 gap-2">
              <Award className="w-4 h-4" />
              Badges
            </TabsTrigger>
            <TabsTrigger value="lootboxes" className="flex-1 gap-2">
              <Gift className="w-4 h-4" />
              Loot Boxes
            </TabsTrigger>
          </TabsList>
          
          <div className="mt-4">
            <TabsContent value="badges" className="m-0">
              {badgesLoading ? (
                <div className="flex items-center justify-center p-8">
                  <Loader2 className="w-8 h-8 text-muted animate-spin" />
                </div>
              ) : (
                <BadgeList badges={badges} />
              )}
            </TabsContent>
            
            <TabsContent value="lootboxes" className="m-0">
              {lootBoxesLoading ? (
                <div className="flex items-center justify-center p-8">
                  <Loader2 className="w-8 h-8 text-muted animate-spin" />
                </div>
              ) : (
                <LootBoxList 
                  lootBoxes={lootBoxes} 
                  onLootBoxClaimed={handleLootBoxClaimed}
                  refreshData={refreshLootBoxes}
                />
              )}
            </TabsContent>
          </div>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default RewardsPage;
