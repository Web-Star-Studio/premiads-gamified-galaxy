import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Trophy } from "lucide-react";

const TopUsers = () => {
  const topUsers = [
    { name: "João Silva", missions: 15, tickets_reward: 1500 },
    { name: "Maria Santos", missions: 12, tickets_reward: 1200 },
    { name: "Pedro Costa", missions: 10, tickets_reward: 1000 },
    { name: "Ana Oliveira", missions: 8, tickets_reward: 800 },
    { name: "Carlos Lima", missions: 7, tickets_reward: 700 },
  ];

  return (
    <Card className="border-gray-800 bg-gray-900/50">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-white">
          <Trophy className="h-5 w-5 text-yellow-400" />
          Top Usuários
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {topUsers.map((user, index) => (
            <div key={user.name} className="flex items-center justify-between p-3 bg-gray-800/50 rounded-lg">
              <div className="flex items-center gap-3">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                  index === 0 ? 'bg-yellow-500 text-yellow-900' :
                  index === 1 ? 'bg-gray-400 text-gray-900' :
                  index === 2 ? 'bg-orange-600 text-orange-100' :
                  'bg-gray-600 text-white'
                }`}>
                  {index + 1}
                </div>
                <div>
                  <p className="font-medium text-white">{user.name}</p>
                  <p className="text-sm text-gray-400">{user.missions} missões</p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-semibold text-blue-400">{user.tickets_reward}</p>
                <p className="text-xs text-gray-400">pontos</p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default TopUsers;
