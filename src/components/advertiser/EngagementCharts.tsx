
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';

interface EngagementChartsProps {
  showExtended?: boolean;
}

const EngagementCharts = ({ showExtended = false }: EngagementChartsProps) => {
  const engagementData = [
    { name: 'Jan', participacao: 400, conversao: 240 },
    { name: 'Fev', participacao: 300, conversao: 139 },
    { name: 'Mar', participacao: 200, conversao: 980 },
    { name: 'Abr', participacao: 278, conversao: 390 },
    { name: 'Mai', participacao: 189, conversao: 480 },
    { name: 'Jun', participacao: 239, conversao: 380 },
  ];

  const campaignData = [
    { name: 'Campanha A', valor: 4000 },
    { name: 'Campanha B', valor: 3000 },
    { name: 'Campanha C', valor: 2000 },
    { name: 'Campanha D', valor: 2780 },
  ];

  return (
    <div className="space-y-6">
      <Card className="border-gray-800 bg-gray-900/50">
        <CardHeader>
          <CardTitle className="text-white">Engajamento ao Longo do Tempo</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={engagementData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="name" stroke="#9CA3AF" />
              <YAxis stroke="#9CA3AF" />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#1F2937', 
                  border: '1px solid #374151',
                  borderRadius: '8px'
                }}
              />
              <Line type="monotone" dataKey="participacao" stroke="#3B82F6" strokeWidth={2} />
              <Line type="monotone" dataKey="conversao" stroke="#10B981" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {showExtended && (
        <Card className="border-gray-800 bg-gray-900/50">
          <CardHeader>
            <CardTitle className="text-white">Performance por Campanha</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={campaignData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="name" stroke="#9CA3AF" />
                <YAxis stroke="#9CA3AF" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#1F2937', 
                    border: '1px solid #374151',
                    borderRadius: '8px'
                  }}
                />
                <Bar dataKey="valor" fill="#8B5CF6" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default EngagementCharts;
