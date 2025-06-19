import { useUserCredits } from '@/hooks/useUserCredits';
import { useAuth } from '@/hooks/useAuth';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useState, useEffect } from 'react';

export function CreditsDebug() {
  const { user } = useAuth();
  const { userCredits, loading, error } = useUserCredits();
  const [lastUpdate, setLastUpdate] = useState(new Date());

  useEffect(() => {
    setLastUpdate(new Date());
  }, [userCredits]);

  // Verificação de segurança para evitar renderização de valores inválidos
  if (!user) return null;
  
  return (
    <Card className="bg-red-900/20 border-red-500/30">
      <CardHeader>
        <CardTitle className="text-red-400 text-sm">🔧 Debug - Sincronização</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2 text-xs">
        <div className="flex justify-between">
          <span>User ID:</span>
          <span className="font-mono">{user?.id?.substring(0, 8) || 'N/A'}...</span>
        </div>
        <div className="flex justify-between">
          <span>Rifas atuais:</span>
          <Badge variant="outline">{userCredits ?? 0}</Badge>
        </div>
        <div className="flex justify-between">
          <span>Status:</span>
          <Badge variant={loading ? "secondary" : error ? "destructive" : "default"}>
            {loading ? "Carregando" : error ? "Erro" : "OK"}
          </Badge>
        </div>
        <div className="flex justify-between">
          <span>Última atualização:</span>
          <span>{lastUpdate?.toLocaleTimeString?.() || 'N/A'}</span>
        </div>
        {error && (
          <div className="text-red-400 text-xs">
            Erro: {error?.message || 'Erro desconhecido'}
          </div>
        )}
      </CardContent>
    </Card>
  );
} 