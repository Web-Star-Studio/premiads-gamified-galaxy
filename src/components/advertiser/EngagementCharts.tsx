import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle, 
  CardDescription 
} from "@/components/ui/card";
import { 
  LineChart, 
  Line, 
  BarChart, 
  Bar, 
  XAxis,
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Legend 
} from "recharts";

const EngagementCharts = () => {
  const [animate, setAnimate] = useState(false);
  
  useEffect(() => {
    const timer = setTimeout(() => {
      setAnimate(true);
    }, 500);
    
    return () => clearTimeout(timer);
  }, []);
  
  // Sample data for the line chart (participation over time)
  const participationData = [
    { date: "01/04", participants: 42, completions: 35 },
    { date: "02/04", participants: 53, completions: 41 },
    { date: "03/04", participants: 59, completions: 45 },
    { date: "04/04", participants: 67, completions: 52 },
    { date: "05/04", participants: 86, completions: 63 },
    { date: "06/04", participants: 72, completions: 58 },
    { date: "07/04", participants: 69, completions: 51 },
    { date: "08/04", participants: 88, completions: 72 },
    { date: "09/04", participants: 92, completions: 76 },
    { date: "10/04", participants: 102, completions: 83 },
    { date: "11/04", participants: 110, completions: 91 },
    { date: "12/04", participants: 96, completions: 82 },
    { date: "13/04", participants: 108, completions: 89 },
    { date: "14/04", participants: 115, completions: 94 },
  ];
  
  // Sample data for the reward efficiency chart
  const rewardData = [
    { range: "10-20", conversion: 68 },
    { range: "21-50", conversion: 82 },
    { range: "51-100", conversion: 91 },
    { range: "101-150", conversion: 86 },
    { range: "151+", conversion: 76 },
  ];
  
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="transition-all duration-300 hover:shadow-[0_0_15px_rgba(155,135,245,0.2)]">
            <CardHeader className="p-5 pb-3">
              <CardTitle className="text-lg font-bold">Participações Diárias</CardTitle>
              <CardDescription>Evolução de interações nas campanhas</CardDescription>
            </CardHeader>
            <CardContent className="p-5 pt-1">
              <div className="h-[250px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={participationData}
                    margin={{ top: 10, right: 10, left: -15, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="#2A2A3C" />
                    <XAxis dataKey="date" stroke="#6E6E8A" fontSize={12} />
                    <YAxis stroke="#6E6E8A" fontSize={12} />
                    <Tooltip
                      contentStyle={{ 
                        backgroundColor: "#1A1A2E", 
                        borderColor: "#333355",
                        borderRadius: "0.375rem"
                      }}
                    />
                    <Line
                      type="monotone"
                      dataKey="participants"
                      name="Participantes"
                      stroke="#9b87f5"
                      strokeWidth={3}
                      dot={{ r: 2, fill: "#9b87f5" }}
                      animationDuration={animate ? 1500 : 0}
                      animationBegin={animate ? 300 : 0}
                    />
                    <Line
                      type="monotone"
                      dataKey="completions"
                      name="Concluídas"
                      stroke="#00FFE7"
                      strokeWidth={3}
                      dot={{ r: 2, fill: "#00FFE7" }}
                      animationDuration={animate ? 1500 : 0}
                      animationBegin={animate ? 600 : 0}
                    />
                    <Legend 
                      verticalAlign="bottom" 
                      height={36}
                      wrapperStyle={{ paddingTop: "10px" }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="transition-all duration-300 hover:shadow-[0_0_15px_rgba(155,135,245,0.2)]">
            <CardHeader className="p-5 pb-3">
              <CardTitle className="text-lg font-bold">Conversão por Recompensa</CardTitle>
              <CardDescription>Taxa de conclusão por faixa de tickets</CardDescription>
            </CardHeader>
            <CardContent className="p-5 pt-1">
              <div className="h-[250px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={rewardData}
                    margin={{ top: 10, right: 10, left: -15, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="#2A2A3C" />
                    <XAxis dataKey="range" stroke="#6E6E8A" fontSize={12} />
                    <YAxis stroke="#6E6E8A" fontSize={12} />
                    <Tooltip
                      contentStyle={{ 
                        backgroundColor: "#1A1A2E", 
                        borderColor: "#333355",
                        borderRadius: "0.375rem"
                      }}
                    />
                    <Bar 
                      dataKey="conversion" 
                      name="Taxa de Conversão (%)" 
                      fill="#FF00C8"
                      radius={[4, 4, 0, 0]}
                      animationDuration={animate ? 1500 : 0}
                      animationBegin={animate ? 300 : 0}
                    />
                    <Legend 
                      verticalAlign="bottom" 
                      height={36}
                      wrapperStyle={{ paddingTop: "10px" }}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default EngagementCharts;
