import { useUserCredits } from '@/hooks/useUserCredits';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Wallet, RefreshCw, AlertCircle } from 'lucide-react';
import { useState } from 'react';

/**
 * Componente que exibe um status detalhado dos créditos do usuário
 */
export function CreditsStatus() {
  const { userCredits, loading, error, refreshCredits } = useUserCredits();
  const [refreshing, setRefreshing] = useState(false);

  const handleManualRefresh = async () => {
    setRefreshing(true);
    try {
      await refreshCredits();
    } catch (error) {
      console.error('Erro ao atualizar créditos:', error);
    } finally {
      setRefreshing(false);
    }
  };

  return (
    <Card className="bg-gradient-to-br from-galaxy-dark via-galaxy-purple/20 to-galaxy-deepPurple/30 border-galaxy-purple/30">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-white flex items-center gap-2">
            <Wallet className="h-5 w-5 text-neon-cyan" />
            Status das Rifas
          </CardTitle>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleManualRefresh}
            disabled={refreshing || loading}
            className="text-neon-cyan hover:bg-galaxy-purple/20"
          >
            <RefreshCw className={`h-4 w-4 ${refreshing || loading ? 'animate-spin' : ''}`} />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-400">Rifas Disponíveis</span>
            <div className="flex items-center gap-2">
              {loading ? (
                <Badge variant="secondary" className="animate-pulse">
                  Carregando...
                </Badge>
              ) : error ? (
                <Badge variant="destructive" className="flex items-center gap-1">
                  <AlertCircle className="h-3 w-3" />
                  Erro
                </Badge>
              ) : (
                <Badge variant="default" className="bg-neon-cyan/20 text-neon-cyan border-neon-cyan/30">
                  {userCredits.toLocaleString()} rifas
                </Badge>
              )}
            </div>
          </div>
          
          {error && (
            <div className="text-xs text-red-400 bg-red-900/20 p-2 rounded border border-red-500/30">
              <div className="flex items-center gap-1 mb-1">
                <AlertCircle className="h-3 w-3" />
                <span className="font-medium">Erro de conexão</span>
              </div>
              <p className="text-red-300">
                {error.message || 'Erro ao carregar dados. Verifique sua conexão.'}
              </p>
            </div>
          )}

          <div className="text-xs text-gray-500 space-y-1">
            <div className="flex justify-between">
              <span>Valor por rifa:</span>
              <span className="text-green-400">R$ 5,00</span>
            </div>
            <div className="flex justify-between">
              <span>Valor total disponível:</span>
              <span className="text-green-400">R$ {(userCredits * 5).toLocaleString()}</span>
            </div>
          </div>
        </div>

        <div className="pt-3 border-t border-gray-700">
          <div className="text-xs text-gray-500 space-y-1">
            <p>💡 As rifas são atualizadas automaticamente em tempo real</p>
            <p>🔄 Sincronização via WebSocket ativa</p>
            <p>💰 Compre mais rifas para criar campanhas maiores</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
} 