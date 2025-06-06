
import { useQuery, QueryKey } from '@tanstack/react-query'
import { supabase } from '@/integrations/supabase/client'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { ListOrderedIcon, TrophyIcon } from 'lucide-react'

async function getAuthenticatedUserId(): Promise<string | undefined> {
  const { data: { user } } = await supabase.auth.getUser()
  return user?.id
}

interface MissionData {
  id: string
  title: string
}

// Atualizado para refletir as novas colunas do banco
interface FetchedReward {
  id: string
  rewarded_at: string
  rifas_earned: number
  cashback_earned: number
  missions: MissionData | null
}

export interface ProcessedReward extends Omit<FetchedReward, 'missions'> {
  missionTitle: string | null;
}

async function fetchRecentRewardsQueryFn(userId: string | undefined): Promise<FetchedReward[]> {
  if (!userId) {
    return []
  }

  const { data, error } = await supabase
    .from('mission_rewards')
    .select('id, rewarded_at, rifas_earned, cashback_earned, missions (id, title)')
    .eq('user_id', userId)
    .order('rewarded_at', { ascending: false })
    .limit(5)

  if (error) {
    console.error('Error fetching recent rewards:', error.message)
    throw new Error(`Failed to fetch recent rewards: ${error.message}`)
  }
  return (data as unknown as FetchedReward[]) || [];
}

export function RecentRewardsSection() {
  const { data: userId, isLoading: isLoadingUserId } = useQuery<string | undefined, Error, string | undefined, QueryKey>({
    queryKey: ['authenticatedUserId'], 
    queryFn: getAuthenticatedUserId,
  });

  const { 
    data: fetchedRewards, 
    isLoading: isLoadingRewards,
    error: rewardsError,
    refetch 
  } = useQuery<FetchedReward[], Error, FetchedReward[], QueryKey>({
    queryKey: ['recentRewards', userId], 
    queryFn: () => fetchRecentRewardsQueryFn(userId),
    enabled: !!userId, 
  });

  const isLoading = isLoadingUserId || isLoadingRewards;

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <TrophyIcon className="w-5 h-5 mr-2 text-yellow-400" />
            Recompensas Recentes
          </CardTitle>
        </CardHeader>
        <CardContent><p>Carregando suas últimas recompensas...</p></CardContent>
      </Card>
    );
  }

  if (rewardsError) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <TrophyIcon className="w-5 h-5 mr-2 text-yellow-400" />
            Recompensas Recentes
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Alert variant="destructive">
            <AlertTitle>Erro ao carregar recompensas</AlertTitle>
            <AlertDescription>
              {rewardsError.message || 'Não foi possível buscar suas recompensas recentes.'}
              <button onClick={() => refetch()} className="ml-2 underline">Tentar novamente</button>
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    );
  }
  
  const rewardsToDisplay: ProcessedReward[] = Array.isArray(fetchedRewards) ? fetchedRewards.map(r => ({
    ...r,
    missionTitle: r.missions?.title || 'Missão desconhecida'
  })) : [];

  if (rewardsToDisplay.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <TrophyIcon className="w-5 h-5 mr-2 text-yellow-400" />
            Recompensas Recentes
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center text-gray-400 py-4">
            <ListOrderedIcon className="w-12 h-12 mx-auto mb-2" />
            <p>Nenhuma recompensa recente encontrada.</p>
            <p className="text-sm">Complete missões para ganhar rifas!</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="col-span-1 md:col-span-2 lg:col-span-1">
      <CardHeader>
        <CardTitle className="flex items-center">
          <TrophyIcon className="w-6 h-6 mr-2 text-yellow-400" />
          Recompensas Recentes
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[250px]">
          <ul className="space-y-3">
            {rewardsToDisplay.map((reward) => (
              <li key={reward.id} className="flex justify-between items-center p-3 bg-slate-800 rounded-md hover:bg-slate-700 transition-colors">
                <div>
                  <p className="font-semibold text-white truncate">
                    {reward.missionTitle}
                  </p>
                  <p className="text-xs text-gray-400">
                    {new Date(reward.rewarded_at).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' })}
                  </p>
                </div>
                <div className="text-right">
                  <span className="font-bold text-lg text-green-400">+{reward.rifas_earned} rifas</span>
                  {reward.cashback_earned > 0 && (
                     <span className="block text-xs text-sky-400">+R$ {reward.cashback_earned.toFixed(2)} cashback</span>
                  )}
                </div>
              </li>
            ))}
          </ul>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}

export default RecentRewardsSection;
