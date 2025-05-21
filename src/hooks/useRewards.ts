
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

interface UserRewardsCountProps {
  userId?: string | null;
}

export const useRewardsCount = ({ userId }: UserRewardsCountProps) => {
  const [badgesCount, setBadgesCount] = useState(0);
  const [lootBoxesCount, setLootBoxesCount] = useState(0);
  const [unclaimedLootBoxesCount, setUnclaimedLootBoxesCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRewardsCounts = async () => {
      if (!userId) {
        setBadgesCount(0);
        setLootBoxesCount(0);
        setUnclaimedLootBoxesCount(0);
        setLoading(false);
        return;
      }

      setLoading(true);
      try {
        // Get badges count
        const { count: badgesCountResult, error: badgesError } = await supabase
          .from("user_badges")
          .select("*", { count: "exact", head: true })
          .eq("user_id", userId);

        if (badgesError) throw badgesError;
        setBadgesCount(badgesCountResult || 0);

        // Get loot boxes count
        const { count: lootBoxesCountResult, error: lootBoxesError } = await supabase
          .from("loot_box_rewards")
          .select("*", { count: "exact", head: true })
          .eq("user_id", userId);

        if (lootBoxesError) throw lootBoxesError;
        setLootBoxesCount(lootBoxesCountResult || 0);

        // Get unclaimed loot boxes count
        const { count: unclaimedCountResult, error: unclaimedError } = await supabase
          .from("loot_box_rewards")
          .select("*", { count: "exact", head: true })
          .eq("user_id", userId)
          .eq("is_claimed", false);

        if (unclaimedError) throw unclaimedError;
        setUnclaimedLootBoxesCount(unclaimedCountResult || 0);
      } catch (error) {
        console.error("Error fetching rewards counts:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchRewardsCounts();
  }, [userId]);

  return {
    badgesCount,
    lootBoxesCount,
    unclaimedLootBoxesCount,
    loading,
  };
};
