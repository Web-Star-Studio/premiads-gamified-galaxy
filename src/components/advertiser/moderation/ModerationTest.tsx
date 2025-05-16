import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { missionService } from '@/services/supabase';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertTriangle } from 'lucide-react';

/**
 * Test component to help diagnose and test the moderation system
 * This is a development-only component that should be removed in production
 */

// Props to notify parent to refresh the moderation panel
interface ModerationTestProps {
  onRefresh?: () => void
}

const ModerationTest = ({ onRefresh }: ModerationTestProps) => {
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isCreatingTest, setIsCreatingTest] = useState(false);

  // Função para verificar status dos estados
  const checkStatusValues = async () => {
    try {
      // Verificar todos os status únicos usados na tabela
      const { data: statusValues, error: statusError } = await supabase
        .from('mission_submissions')
        .select('status')
        .not('status', 'is', null);
        
      if (statusError) throw statusError;
      
      // Extrair valores únicos
      const uniqueStatuses = [...new Set(statusValues?.map(item => item.status))];
      
      return uniqueStatuses;
    } catch (error) {
      console.error("Erro ao verificar status:", error);
      return [];
    }
  };

  // Função principal que busca as submissões
  const checkSubmissions = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Get current user
      const { data: sessionData } = await supabase.auth.getSession();
      const userId = sessionData?.session?.user?.id;
      
      if (!userId) {
        throw new Error("Usuário não autenticado");
      }
      
      // Verificar status existentes
      const statusValues = await checkStatusValues();
      
      // Check for any missions created by this user
      const { data: missions, error: missionsError } = await supabase
        .from('missions')
        .select('id, title')
        .eq('advertiser_id', userId);
        
      if (missionsError) throw missionsError;
      
      // Get any submissions for these missions
      const missionIds = missions?.map(m => m.id) || [];
      
      if (missionIds.length > 0) {
        const { data: submissions, error: subError } = await supabase
          .from('mission_submissions')
          .select('*, missions(title)')
          .in('mission_id', missionIds);
          
        if (subError) throw subError;
        
        setResult({
          yourMissions: missions || [],
          submissions: submissions || [],
          submissionSample: [],
          statusValues
        });
      } else {
        // Se não houver missões, não tente buscar submissões
        setResult({
          yourMissions: [],
          submissions: [],
          submissionSample: [],
          statusValues
        });
      }
      
      // Buscar uma amostra geral de submissões, apenas se houver dados
      try {
        const { data: allSubmissions, error: allSubError } = await supabase
          .from('mission_submissions')
          .select('id, status, updated_at, submitted_at')
          .limit(10);
          
        if (allSubError) throw allSubError;
        
        if (result) {
          setResult(prev => ({
            ...prev,
            submissionSample: allSubmissions || []
          }));
        }
      } catch (sampleError) {
        console.log('Erro ao buscar amostra geral, ignorando:', sampleError);
        // Não falhe completamente se apenas esta parte der erro
      }
      
    } catch (error: any) {
      console.error('Test error:', error);
      setError(error.message || 'Unknown error');
    } finally {
      setIsLoading(false);
    }
  };

  // Função para criar uma submissão de teste
  const createTestSubmission = async () => {
    setIsCreatingTest(true);
    
    try {
      // Get current user
      const { data: sessionData } = await supabase.auth.getSession();
      const userId = sessionData?.session?.user?.id;
      
      if (!userId) {
        throw new Error("Usuário não autenticado");
      }
      
      // Buscar uma missão criada pelo usuário
      const { data: missions } = await supabase
        .from('missions')
        .select('id, title')
        .eq('advertiser_id', userId)
        .limit(1);
      
      if (!missions || missions.length === 0) {
        throw new Error("Nenhuma missão encontrada. Crie uma missão primeiro.");
      }
      
      const missionId = missions[0].id;
      
      // Criar um usuário de teste se necessário
      const testUserId = userId; // Usar o próprio anunciante como submissor para teste
      
      // Criar a submissão
      const { data, error } = await supabase
        .from('mission_submissions')
        .insert({
          mission_id: missionId,
          user_id: testUserId,
          status: 'pending',
          submission_data: {
            content: 'Esta é uma submissão de teste para diagnóstico',
            timestamp: new Date().toISOString()
          },
          submitted_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
        .select();
      
      if (error) throw error;
      
      // Atualizar resultados e notificar painel de moderação
      checkSubmissions();
      onRefresh?.();
    } catch (error: any) {
      setError(error.message || 'Erro ao criar submissão de teste');
    } finally {
      setIsCreatingTest(false);
    }
  };

  return (
    <Card className="border-galaxy-purple bg-galaxy-darkPurple">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Diagnóstico do Sistema de Moderação</CardTitle>
          <div className="flex gap-2">
            <Button 
              onClick={checkSubmissions} 
              disabled={isLoading}
              variant="outline"
              size="sm"
            >
              {isLoading ? 'Verificando...' : 'Verificar Submissões'}
            </Button>
            <Button
              onClick={createTestSubmission}
              disabled={isCreatingTest}
              size="sm"
            >
              {isCreatingTest ? 'Criando...' : 'Criar Submissão de Teste'}
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {error && (
          <div className="p-4 bg-red-900/30 border border-red-600 rounded-md">
            <p className="text-red-400 flex items-center gap-2">
              <AlertTriangle className="h-5 w-5" />
              {error}
            </p>
          </div>
        )}
        
        {result?.statusValues && (
          <div className="p-4 bg-blue-900/20 border border-blue-600/50 rounded-md">
            <h3 className="text-lg font-medium mb-2">Status de Submissão Disponíveis</h3>
            <div className="flex flex-wrap gap-2">
              {result.statusValues.map((status: string, index: number) => (
                <div 
                  key={index} 
                  className="px-3 py-1.5 rounded-full bg-blue-800/30 text-white text-sm"
                >
                  {status}
                </div>
              ))}
            </div>
          </div>
        )}
        
        {result && (
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-medium mb-2">Suas Missões</h3>
              {result.yourMissions.length === 0 ? (
                <p className="text-sm text-gray-400">Nenhuma missão encontrada</p>
              ) : (
                <ul className="list-disc list-inside">
                  {result.yourMissions.map((mission: any) => (
                    <li key={mission.id} className="text-sm">{mission.title}</li>
                  ))}
                </ul>
              )}
            </div>
            
            <div>
              <h3 className="text-lg font-medium mb-2">Submissões de Suas Missões</h3>
              {result.submissions.length === 0 ? (
                <p className="text-sm text-gray-400">Nenhuma submissão encontrada</p>
              ) : (
                <ul className="list-disc list-inside">
                  {result.submissions.map((sub: any) => (
                    <li key={sub.id} className="text-sm">
                      ID: {sub.id} | Missão: {sub.missions?.title} | Status: {sub.status}
                    </li>
                  ))}
                </ul>
              )}
            </div>
            
            <div>
              <h3 className="text-lg font-medium mb-2">Amostra de Submissões (10)</h3>
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-700">
                    <th className="text-left p-2">ID</th>
                    <th className="text-left p-2">Status</th>
                    <th className="text-left p-2">Updated At</th>
                    <th className="text-left p-2">Submitted At</th>
                  </tr>
                </thead>
                <tbody>
                  {result.submissionSample.map((sub: any) => (
                    <tr key={sub.id} className="border-b border-gray-800">
                      <td className="p-2">{sub.id.substring(0, 8)}...</td>
                      <td className="p-2">{sub.status}</td>
                      <td className="p-2">{new Date(sub.updated_at).toLocaleString()}</td>
                      <td className="p-2">{sub.submitted_at ? new Date(sub.submitted_at).toLocaleString() : 'N/A'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ModerationTest; 