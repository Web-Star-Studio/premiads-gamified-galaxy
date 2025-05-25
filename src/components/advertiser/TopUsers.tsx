import { motion } from "framer-motion";
import { Trophy, Medal, Award } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const TopUsers = () => {
  const topUsers = [
    { name: "Gabriel Santos", missions: 32, points: 2840 },
    { name: "Ana Oliveira", missions: 28, points: 2520 },
    { name: "Lucas Mendes", missions: 25, points: 2380 },
    { name: "Juliana Silva", missions: 23, points: 2160 },
    { name: "Pedro Costa", missions: 21, points: 1980 },
  ];
  
  const getIcon = (index: number) => {
    switch (index) {
      case 0:
        return <Trophy className="w-5 h-5 text-yellow-400" />;
      case 1:
        return <Medal className="w-5 h-5 text-gray-300" />;
      case 2:
        return <Award className="w-5 h-5 text-amber-700" />;
      default:
        return null;
    }
  };
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
    >
      <Card className="h-full transition-all duration-300 hover:shadow-[0_0_15px_rgba(255,0,200,0.2)]">
        <CardHeader className="p-5 pb-3">
          <CardTitle className="flex items-center gap-2 text-lg font-bold">
            <Trophy className="w-5 h-5 text-yellow-400" />
            Top Usuários
          </CardTitle>
        </CardHeader>
        <CardContent className="p-5 pt-1">
          <div className="space-y-3">
            {topUsers.map((user, index) => (
              <motion.div
                key={user.name}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 * index }}
                className="flex items-center justify-between p-3 rounded-lg border border-galaxy-purple/20 hover:border-neon-pink/30 hover:bg-galaxy-deepPurple/50 transition-all duration-200"
              >
                <div className="flex items-center gap-3">
                  <div className="flex items-center justify-center w-8 h-8 rounded-full bg-galaxy-deepPurple/50 text-sm font-bold">
                    {getIcon(index) || <span className="text-gray-400">{index + 1}</span>}
                  </div>
                  <div>
                    <p className="text-sm font-medium">{user.name}</p>
                    <p className="text-xs text-gray-400">{user.missions} missões</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold text-neon-pink">{user.points.toLocaleString()}</p>
                  <p className="text-xs text-gray-400">pontos</p>
                </div>
              </motion.div>
            ))}
          </div>
          
          <div className="mt-5 pt-3 border-t border-gray-800">
            <p className="text-xs text-center text-gray-500">
              Ranking atualizado com base nos pontos acumulados nos últimos 30 dias
            </p>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default TopUsers;
