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

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true)
      setError(null)
      try {
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) throw new Error('Usuário não autenticado')

        // Step 1: Fetch advertiser's missions
        const { data: advertiserMissions, error: missionsError } = await supabase
          .from('missions')
          .select('id')
          .eq('created_by', user.id)
        if (missionsError) throw missionsError
        const advertiserMissionIds = advertiserMissions.map(m => m.id)

        if (advertiserMissionIds.length === 0) {
            setAudienceData({ totalUsers: 0, ageDistribution: [], genderDistribution: [], locationDistribution: [] })
            setIsLoading(false)
            return
        }

        // Step 2: Fetch submissions for those missions
        const { data: submissions, error: submissionsError } = await supabase
            .from('mission_submissions')
            .select('user_id')
            .in('mission_id', advertiserMissionIds)
            .eq('status', 'aprovado')
        if(submissionsError) throw submissionsError
        const userIds = [...new Set(submissions.map(s => s.user_id).filter(Boolean))] as string[]

        if (userIds.length === 0) {
            setAudienceData({ totalUsers: 0, ageDistribution: [], genderDistribution: [], locationDistribution: [] })
            setIsLoading(false)
            return
        }
        
        // Step 3: Fetch profiles for those users
        const { data: profiles, error: profilesError } = await supabase
          .from('profiles')
          .select('profile_data')
          .in('id', userIds)
        if (profilesError) throw profilesError
        
        const ageDist: Record<string, number> = {}
        const genderDist: Record<string, number> = {}
        const locationDist: Record<string, number> = {}

        profiles.forEach(p => {
            if (p.profile_data && typeof p.profile_data === 'object') {
                const pd = p.profile_data as any;
                if(pd.ageRange) ageDist[pd.ageRange] = (ageDist[pd.ageRange] || 0) + 1;
                if(pd.gender) genderDist[pd.gender] = (genderDist[pd.gender] || 0) + 1;
                if(pd.location) locationDist[pd.location] = (locationDist[pd.location] || 0) + 1;
            }
        })
        
        setAudienceData({
          ageDistribution: Object.entries(ageDist).map(([name, value]) => ({ name, value })),
          genderDistribution: Object.entries(genderDist).map(([name, value]) => ({ name, value })),
          locationDistribution: Object.entries(locationDist).map(([name, value]) => ({ name, value })).sort((a,b) => b.value - a.value).slice(0,10),
          totalUsers: userIds.length,
        });

      } catch (err) {
        setError(err instanceof Error ? err.message : 'Erro ao carregar dados')
        console.error('Error fetching audience data:', err)
      } finally {
        setIsLoading(false)
      }
    }

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
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
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
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
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
                  <BarChart data={audienceData.locationDistribution} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                    <XAxis type="number" stroke="#9CA3AF" />
                    <YAxis 
                      dataKey="name" 
                      type="category" 
                      stroke="#9CA3AF"
                      fontSize={10}
                      width={80}
                      interval={0}
                    />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: '#1F2937', 
                        border: '1px solid #374151',
                        borderRadius: '8px'
                      }}
                      labelStyle={{ color: '#F9FAFB' }}
                    />
                    <Bar dataKey="value" fill="#06B6D4" name="Usuários" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

export default DynamicAudienceChart 