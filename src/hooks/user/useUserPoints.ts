
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

export const useUserPoints = (initialPoints: number = 0) => {
  const [points, setPoints] = useState(initialPoints);
  const [credits, setCredits] = useState(0);
  const [streak, setStreak] = useState(0);
  const { toast } = useToast();

  const checkInactivity = () => {
    const lastActivity = localStorage.getItem("lastActivity");
    if (lastActivity && Date.now() - parseInt(lastActivity) > 86400000) {
      toast({
        title: "Streak em risco!",
        description: "Você está há mais de 24h sem atividade. Complete uma missão hoje!",
      });
    }
  };

  return {
    points,
    setPoints,
    credits,
    setCredits,
    streak,
    setStreak,
    checkInactivity
  };
};
