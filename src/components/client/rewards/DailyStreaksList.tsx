import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar } from "lucide-react";

const DailyStreaksList = () => {
  const dailyMissions = [
    { title: "Login Diário", tickets_reward: 10, streak_multiplier: 1.2 },
    { title: "Compartilhar no Instagram", tickets_reward: 25, streak_multiplier: 1.5 },
    { title: "Avaliar Produto", tickets_reward: 30, streak_multiplier: 1.3 },
    { title: "Completar Pesquisa", tickets_reward: 20, streak_multiplier: 1.4 },
  ];

  return (
    <Card className="glass-panel">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calendar className="h-5 w-5 text-neon-cyan" />
          Missões Diárias
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {dailyMissions.map((mission, index) => (
          <div key={index} className="p-3 bg-galaxy-deepPurple/40 rounded-lg border border-galaxy-purple/20">
            <div className="flex justify-between items-center">
              <h4 className="font-medium">{mission.title}</h4>
              <Badge className="bg-neon-cyan/20 text-neon-cyan">
                {mission.tickets_reward} pts
              </Badge>
            </div>
            <p className="text-sm text-gray-400 mt-1">
              Multiplier de sequência: {mission.streak_multiplier}x
            </p>
          </div>
        ))}
      </CardContent>
    </Card>
  );
};

export default DailyStreaksList;
