import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts'
import { supabase } from '@/integrations/supabase/client'
import { Skeleton } from "@/components/ui/skeleton"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertCircle } from "lucide-react"

interface AudienceData {
  ageDistribution: Array<{ name: string; value: number }>
  genderDistribution: Array<{ name: string; value: number }>
  locationDistribution: Array<{ name: string; value: number }>
  totalUsers: number
}

function DynamicAudienceChart() {
  const [audienceData, setAudienceData] = useState<AudienceData>({
    ageDistribution: [],
    genderDistribution: [],
    locationDistribution: [],
    totalUsers: 0
  })
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const COLORS = ['#8B5CF6', '#06B6D4', '#10B981', '#F59E0B', '#EF4444', '#8B5A2B', '#EC4899']

  const fetchData = async () => {
    setIsLoading(true)
    setError(null)

    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('Usuário não autenticado')

      // Buscar usuários únicos que participaram das missions do anunciante
      const { data: participants, error: participantsError } = await supabase
        .from('mission_submissions')
        .select(`
          user_id,
          profiles!inner(
            profile_data,
            full_name
          ),
          missions!inner(created_by)
        `)
        .eq('missions.created_by', user.id)
        .eq('status', 'aprovado')

      if (participantsError) throw participantsError

      // Extrair usuários únicos
      const uniqueUsers = new Map()
      participants?.forEach(participant => {
        if (!uniqueUsers.has(participant.user_id)) {
          uniqueUsers.set(participant.user_id, participant.profiles)
        }
      })

      const ageDistribution: Record<string, number> = {}
      const genderDistribution: Record<string, number> = {}
      const locationDistribution: Record<string, number> = {}

      Array.from(uniqueUsers.values()).forEach((profile: any) => {
        if (profile?.profile_data) {
          const profileData = profile.profile_data as any

          // Faixa etária
          if (profileData.ageRange) {
            const ageKey = profileData.ageRange
            ageDistribution[ageKey] = (ageDistribution[ageKey] || 0) + 1
          }

          // Gênero
          if (profileData.gender) {
            const genderKey = profileData.gender
            genderDistribution[genderKey] = (genderDistribution[genderKey] || 0) + 1
          }

          // Localização
          if (profileData.location) {
            const locationKey = profileData.location
            locationDistribution[locationKey] = (locationDistribution[locationKey] || 0) + 1
          }
        }
      })

      // Converter para formato de arrays para os gráficos
      const ageData = Object.entries(ageDistribution).map(([name, value]) => ({ name, value }))
      const genderData = Object.entries(genderDistribution).map(([name, value]) => ({ name, value }))
      const locationData = Object.entries(locationDistribution)
        .map(([name, value]) => ({ name, value }))
        .sort((a, b) => b.value - a.value)
        .slice(0, 10) // Top 10 localizações

      setAudienceData({
        ageDistribution: ageData,
        genderDistribution: genderData,
        locationDistribution: locationData,
        totalUsers: uniqueUsers.size
      })

      // Se não há dados reais, mostrar dados de exemplo
      if (uniqueUsers.size === 0) {
        setAudienceData({
          ageDistribution: [{ name: 'Sem dados', value: 0 }],
          genderDistribution: [{ name: 'Sem dados', value: 0 }],
          locationDistribution: [{ name: 'Sem dados', value: 0 }],
          totalUsers: 0
        })
      }

    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao carregar dados')
      console.error('Error fetching audience data:', err)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

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

  return (
    <div className="space-y-6">
      <Card className="bg-galaxy-darkPurple border-galaxy-purple/30">
        <CardHeader className="px-6">
          <CardTitle>Análise de Audiência</CardTitle>
          <CardDescription>
            Perfil dos usuários que participam das suas campanhas ({audienceData.totalUsers} usuários únicos)
          </CardDescription>
        </CardHeader>
        <CardContent className="px-6 pb-6">
          {isLoading ? (
            <div className="h-96 flex items-center justify-center">
              <Skeleton className="w-full h-full" />
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
              {/* Distribuição por Faixa Etária */}
              <div className="h-80">
                <h3 className="text-sm font-medium mb-4 text-gray-300">Faixa Etária</h3>
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={audienceData.ageDistribution}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, value, percent }) => `${name}: ${value} (${(percent * 100).toFixed(0)}%)`}
                      outerRadius={60}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {audienceData.ageDistribution.map((entry, index) => (
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

              {/* Distribuição por Gênero */}
              <div className="h-80">
                <h3 className="text-sm font-medium mb-4 text-gray-300">Gênero</h3>
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={audienceData.genderDistribution}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, value, percent }) => `${name}: ${value} (${(percent * 100).toFixed(0)}%)`}
                      outerRadius={60}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {audienceData.genderDistribution.map((entry, index) => (
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

              {/* Top Localizações */}
              <div className="h-80 lg:col-span-2 xl:col-span-1">
                <h3 className="text-sm font-medium mb-4 text-gray-300">Top Localizações</h3>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={audienceData.locationDistribution} layout="horizontal">
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                    <XAxis type="number" stroke="#9CA3AF" />
                    <YAxis 
                      dataKey="name" 
                      type="category" 
                      stroke="#9CA3AF"
                      fontSize={10}
                      width={80}
                    />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: '#1F2937', 
                        border: '1px solid #374151',
                        borderRadius: '8px'
                      }}
                      labelStyle={{ color: '#F9FAFB' }}
                    />
                    <Bar dataKey="value" fill="#06B6D4" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Resumo detalhado */}
      <Card className="bg-galaxy-darkPurple border-galaxy-purple/30">
        <CardHeader className="px-6">
          <CardTitle>Resumo da Audiência</CardTitle>
        </CardHeader>
        <CardContent className="px-6 pb-6">
          {isLoading ? (
            <Skeleton className="w-full h-32" />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Resumo Faixa Etária */}
              <div>
                <h4 className="text-sm font-medium mb-3 text-gray-300">Faixa Etária</h4>
                <div className="space-y-2">
                  {audienceData.ageDistribution.map((item, index) => (
                    <div key={index} className="flex justify-between items-center">
                      <span className="text-sm text-gray-400">{item.name}</span>
                      <span className="text-sm text-white">{item.value} usuários</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Resumo Gênero */}
              <div>
                <h4 className="text-sm font-medium mb-3 text-gray-300">Gênero</h4>
                <div className="space-y-2">
                  {audienceData.genderDistribution.map((item, index) => (
                    <div key={index} className="flex justify-between items-center">
                      <span className="text-sm text-gray-400">{item.name}</span>
                      <span className="text-sm text-white">{item.value} usuários</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Resumo Localização */}
              <div>
                <h4 className="text-sm font-medium mb-3 text-gray-300">Top 5 Localizações</h4>
                <div className="space-y-2">
                  {audienceData.locationDistribution.slice(0, 5).map((item, index) => (
                    <div key={index} className="flex justify-between items-center">
                      <span className="text-sm text-gray-400">{item.name}</span>
                      <span className="text-sm text-white">{item.value} usuários</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

export default DynamicAudienceChart 