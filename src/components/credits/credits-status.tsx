import { useUserCredits } from '@/hooks/useUserCredits';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Loader2, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';

/**
 * Componente que exibe um status detalhado dos créditos do usuário
 */
export function CreditsStatus() {
  const {
    totalCredits,
    availableCredits,
    usedCredits,
    isLoading,
    refreshCredits,
  } = useUserCredits();

  // Calcula a porcentagem de créditos usados
  const percentageUsed = totalCredits > 0 
    ? Math.round((usedCredits / totalCredits) * 100)
    : 0;
  
  // Determina a cor da barra de progresso com base na porcentagem
  const getProgressColor = () => {
    if (percentageUsed >= 90) return 'bg-destructive';
    if (percentageUsed >= 75) return 'bg-warning';
    return 'bg-primary';
  };

  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle>Status de Rifas</CardTitle>
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => refreshCredits()}
            disabled={isLoading}
          >
            {isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <RefreshCw className="h-4 w-4" />
            )}
          </Button>
        </div>
        <CardDescription>
          Gerenciamento das suas rifas disponíveis
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex justify-between">
            <span className="text-sm text-muted-foreground">Disponíveis</span>
            <span className="font-medium">{availableCredits}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm text-muted-foreground">Utilizados</span>
            <span className="font-medium">{usedCredits}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm text-muted-foreground">Total adquirido</span>
            <span className="font-medium">{totalCredits}</span>
          </div>
          
          <div className="space-y-1.5">
            <div className="flex justify-between text-xs">
              <span>Utilização</span>
              <span>{percentageUsed}%</span>
            </div>
            <Progress 
              value={percentageUsed} 
              max={100} 
              className={getProgressColor()} 
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
} 