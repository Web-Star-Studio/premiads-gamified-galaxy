
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
import { 
  ChartContainer, 
  ChartTooltip, 
  ChartTooltipContent 
} from "@/components/ui/chart";

interface EngagementChartsProps {
  showExtended?: boolean;
}

const EngagementCharts = ({ showExtended = false }: EngagementChartsProps) => {
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
  
  // Sample data for heatmap (placeholder data in grid format)
  const activityHeatmap = [
    { hour: "8-10", monday: 25, tuesday: 32, wednesday: 18, thursday: 29, friday: 35, weekend: 12 },
    { hour: "10-12", monday: 42, tuesday: 38, wednesday: 46, thursday: 41, friday: 39, weekend: 21 },
    { hour: "12-14", monday: 33, tuesday: 27, wednesday: 31, thursday: 36, friday: 28, weekend: 15 },
    { hour: "14-16", monday: 51, tuesday: 48, wednesday: 55, thursday: 49, friday: 52, weekend: 23 },
    { hour: "16-18", monday: 65, tuesday: 58, wednesday: 63, thursday: 68, friday: 71, weekend: 38 },
    { hour: "18-20", monday: 49, tuesday: 53, wednesday: 47, thursday: 55, friday: 42, weekend: 56 },
    { hour: "20-22", monday: 38, tuesday: 41, wednesday: 36, thursday: 39, friday: 32, weekend: 47 },
  ];
  
  // Custom tooltip for the heatmap
  const getHeatmapColor = (value: number) => {
    const intensity = Math.min(255, Math.floor((value / 70) * 255));
    return `rgba(155, 135, 245, ${value / 100})`;
  };
  
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="transition-all duration-300 hover:shadow-[0_0_15px_rgba(155,135,245,0.2)]">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Participações Diárias</CardTitle>
            <CardDescription>Evolução de interações nas campanhas</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={participationData}
                  margin={{ top: 5, right: 20, left: 0, bottom: 5 }}
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
        
        <Card className="transition-all duration-300 hover:shadow-[0_0_15px_rgba(155,135,245,0.2)]">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Conversão por Recompensa</CardTitle>
            <CardDescription>Taxa de conclusão por faixa de pontos</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={rewardData}
                  margin={{ top: 5, right: 20, left: 0, bottom: 5 }}
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
      </div>
      
      {showExtended && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          <Card className="transition-all duration-300 hover:shadow-[0_0_15px_rgba(155,135,245,0.2)]">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Heatmap de Atividade</CardTitle>
              <CardDescription>Horários com maior engajamento</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto pb-2">
                <table className="w-full min-w-[768px]">
                  <thead>
                    <tr>
                      <th className="px-2 py-3 text-left text-sm font-medium text-gray-400">Horário</th>
                      <th className="px-2 py-3 text-center text-sm font-medium text-gray-400">Segunda</th>
                      <th className="px-2 py-3 text-center text-sm font-medium text-gray-400">Terça</th>
                      <th className="px-2 py-3 text-center text-sm font-medium text-gray-400">Quarta</th>
                      <th className="px-2 py-3 text-center text-sm font-medium text-gray-400">Quinta</th>
                      <th className="px-2 py-3 text-center text-sm font-medium text-gray-400">Sexta</th>
                      <th className="px-2 py-3 text-center text-sm font-medium text-gray-400">Fim de Semana</th>
                    </tr>
                  </thead>
                  <tbody>
                    {activityHeatmap.map((row, index) => (
                      <tr key={index}>
                        <td className="px-2 py-2 text-sm font-medium">{row.hour}</td>
                        <td className="px-1 py-1">
                          <div 
                            className="h-full w-full px-2 py-4 rounded text-center text-xs font-medium"
                            style={{ 
                              backgroundColor: getHeatmapColor(row.monday),
                              transition: "all 0.3s ease"
                            }}
                          >
                            {row.monday}
                          </div>
                        </td>
                        <td className="px-1 py-1">
                          <div 
                            className="h-full w-full px-2 py-4 rounded text-center text-xs font-medium"
                            style={{ 
                              backgroundColor: getHeatmapColor(row.tuesday),
                              transition: "all 0.3s ease"
                            }}
                          >
                            {row.tuesday}
                          </div>
                        </td>
                        <td className="px-1 py-1">
                          <div 
                            className="h-full w-full px-2 py-4 rounded text-center text-xs font-medium"
                            style={{ 
                              backgroundColor: getHeatmapColor(row.wednesday),
                              transition: "all 0.3s ease"
                            }}
                          >
                            {row.wednesday}
                          </div>
                        </td>
                        <td className="px-1 py-1">
                          <div 
                            className="h-full w-full px-2 py-4 rounded text-center text-xs font-medium"
                            style={{ 
                              backgroundColor: getHeatmapColor(row.thursday),
                              transition: "all 0.3s ease"
                            }}
                          >
                            {row.thursday}
                          </div>
                        </td>
                        <td className="px-1 py-1">
                          <div 
                            className="h-full w-full px-2 py-4 rounded text-center text-xs font-medium"
                            style={{ 
                              backgroundColor: getHeatmapColor(row.friday),
                              transition: "all 0.3s ease"
                            }}
                          >
                            {row.friday}
                          </div>
                        </td>
                        <td className="px-1 py-1">
                          <div 
                            className="h-full w-full px-2 py-4 rounded text-center text-xs font-medium"
                            style={{ 
                              backgroundColor: getHeatmapColor(row.weekend),
                              transition: "all 0.3s ease"
                            }}
                          >
                            {row.weekend}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="transition-all duration-300 hover:shadow-[0_0_15px_rgba(155,135,245,0.2)]">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Teste A/B: Recompensas</CardTitle>
                <CardDescription>Comparação: pontos fixos vs. aleatórios</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div className="p-4 border border-gray-700 rounded-lg text-center">
                    <h4 className="text-sm font-medium text-neon-cyan mb-1">Pontos Fixos</h4>
                    <p className="text-2xl font-bold">76%</p>
                    <p className="text-xs text-gray-400">Conversão média</p>
                  </div>
                  
                  <div className="p-4 border border-neon-pink/30 rounded-lg text-center bg-neon-pink/5">
                    <h4 className="text-sm font-medium text-neon-pink mb-1">Pontos Aleatórios</h4>
                    <p className="text-2xl font-bold">89%</p>
                    <p className="text-xs text-gray-400">Conversão média</p>
                  </div>
                </div>
                
                <div className="space-y-3 mt-4">
                  <div className="flex justify-between text-xs">
                    <span className="text-gray-400">Engajamento</span>
                    <span className="text-neon-pink">+34%</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-gray-400">Conclusões</span>
                    <span className="text-neon-pink">+17%</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-gray-400">Retorno</span>
                    <span className="text-neon-pink">+23%</span>
                  </div>
                </div>
                
                <div className="mt-4 p-3 bg-gray-800/50 rounded-md">
                  <p className="text-xs">
                    <span className="text-neon-pink font-medium">Recomendação:</span>
                    {" "}Continue utilizando pontos aleatórios para suas campanhas, pois proporcionam melhor engajamento e satisfação.
                  </p>
                </div>
              </CardContent>
            </Card>
            
            <Card className="transition-all duration-300 hover:shadow-[0_0_15px_rgba(155,135,245,0.2)]">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Previsão de Participação</CardTitle>
                <CardDescription>Baseada nos dados históricos</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-center p-6">
                  <div className="relative w-48 h-48">
                    <svg className="w-full h-full" viewBox="0 0 100 100">
                      <circle
                        cx="50"
                        cy="50"
                        r="45"
                        fill="none"
                        stroke="#1E1E30"
                        strokeWidth="10"
                      />
                      <circle
                        cx="50"
                        cy="50"
                        r="45"
                        fill="none"
                        stroke="#9b87f5"
                        strokeWidth="10"
                        strokeDasharray="283"
                        strokeDashoffset="70"
                        transform="rotate(-90 50 50)"
                        className={animate ? "transition-all duration-1500 ease-out" : ""}
                      />
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <span className="text-3xl font-bold">75%</span>
                      <span className="text-xs text-gray-400">Próximo mês</span>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-3 mt-2">
                  <div className="flex justify-between text-xs">
                    <span className="text-gray-400">Participantes Estimados</span>
                    <span className="text-neon-cyan">1,240</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-gray-400">Média Diária</span>
                    <span className="text-neon-cyan">41</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-gray-400">Pico Esperado</span>
                    <span className="text-neon-cyan">21/05 (76 participantes)</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default EngagementCharts;
