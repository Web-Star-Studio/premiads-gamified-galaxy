import React from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts'
import { Skeleton } from "@/components/ui/skeleton"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertCircle } from "lucide-react"
import { useAdvertiserCampaignsData, CampaignAnalyticsData } from '@/hooks/advertiser/useAdvertiserCampaignsData'

function DynamicCampaignChart() {
  const { data: campaignData, isLoading, error } = useAdvertiserCampaignsData()

  const COLORS = ['#8B5CF6', '#06B6D4', '#10B981', '#F59E0B', '#EF4444']

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          {error}
        </AlertDescription>
      </Alert>
    )
  }
  
  const chartData = campaignData.length > 0 ? campaignData : [{ name: 'Nenhuma campanha encontrada', submissions: 0, approved: 0, approvalRate: 0, id: '1', pending: 0, rejected: 0, status: 'no-data'}]

  return (
    <div className="space-y-6">
      <Card className="bg-galaxy-darkPurple border-galaxy-purple/30">
        <CardHeader className="px-6">
          <CardTitle>Desempenho de Campanhas</CardTitle>
          <CardDescription>Comparativo entre suas campanhas ativas</CardDescription>
        </CardHeader>
        <CardContent className="px-6 pb-6">
          {isLoading ? (
            <div className="h-96 flex items-center justify-center">
              <Skeleton className="w-full h-full" />
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Gráfico de barras - Submissions */}
              <div className="h-96">
                <h3 className="text-sm font-medium mb-4 text-gray-300">Participações por Campanha</h3>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                    <XAxis 
                      dataKey="name" 
                      stroke="#9CA3AF"
                      fontSize={12}
                      angle={-45}
                      textAnchor="end"
                      height={100}
                    />
                    <YAxis stroke="#9CA3AF" />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: '#1F2937', 
                        border: '1px solid #374151',
                        borderRadius: '8px'
                      }}
                      labelStyle={{ color: '#F9FAFB' }}
                    />
                    <Bar dataKey="submissions" fill="#8B5CF6" name="Total de Participações" />
                    <Bar dataKey="approved" fill="#10B981" name="Aprovadas" />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              {/* Gráfico de pizza - Taxa de aprovação */}
              <div className="h-96">
                <h3 className="text-sm font-medium mb-4 text-gray-300">Taxa de Aprovação</h3>
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={chartData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, approvalRate }) => `${name}: ${approvalRate}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="approvalRate"
                    >
                      {chartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: '#1F2937', 
                        border: '1px solid #374151',
                        borderRadius: '8px'
                      }}
                      labelStyle={{ color: '#F9FAFB' }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Tabela resumo */}
      <Card className="bg-galaxy-darkPurple border-galaxy-purple/30">
        <CardHeader className="px-6">
          <CardTitle>Resumo das Campanhas</CardTitle>
        </CardHeader>
        <CardContent className="px-6 pb-6">
          {isLoading ? (
            <Skeleton className="w-full h-32" />
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-700">
                    <th className="text-left p-2 text-gray-300">Campanha</th>
                    <th className="text-right p-2 text-gray-300">Participações</th>
                    <th className="text-right p-2 text-gray-300">Aprovadas</th>
                    <th className="text-right p-2 text-gray-300">Taxa</th>
                  </tr>
                </thead>
                <tbody>
                  {chartData.map((campaign, index) => (
                    <tr key={index} className="border-b border-gray-800">
                      <td className="p-2 text-white">{campaign.name}</td>
                      <td className="p-2 text-right text-gray-300">{campaign.submissions}</td>
                      <td className="p-2 text-right text-green-400">{campaign.approved}</td>
                      <td className="p-2 text-right text-blue-400">{campaign.approvalRate}%</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

export default DynamicCampaignChart 