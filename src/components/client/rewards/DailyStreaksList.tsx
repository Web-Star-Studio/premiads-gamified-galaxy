import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar } from "lucide-react";

const DailyStreaksList = () => {
  const dailyMissions = [
    { title: "Login Diário", tickets_reward: 10 },
    { title: "Compartilhar no Instagram", tickets_reward: 25 },
    { title: "Avaliar Produto", tickets_reward: 30 },
    { title: "Completar Pesquisa", tickets_reward: 20 },
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

          </div>
        ))}
      </CardContent>
    </Card>
  );
};

export default DailyStreaksList;
