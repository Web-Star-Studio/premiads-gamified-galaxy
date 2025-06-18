import { useUserCredits } from '@/hooks/useUserCredits';
import { Loader2 } from 'lucide-react';
import { useEffect } from 'react';

interface CreditsDisplayProps {
  showTotal?: boolean;
  showLabel?: boolean;
  className?: string;
}

/**
 * Componente reutilizável para mostrar os créditos do usuário
 */
export function CreditsDisplay({ 
  showTotal = false, 
  showLabel = true,
  className = '' 
}: CreditsDisplayProps) {
  const { availableCredits, totalCredits, isLoading, refreshCredits } = useUserCredits();
  
  const displayValue = showTotal ? totalCredits : availableCredits;
  
  // Auto-refresh on mount to ensure latest data
  useEffect(() => {
    refreshCredits();
  }, []);
  
  return (
    <div className={`flex items-center gap-1 ${className}`}>
      {isLoading ? (
        <Loader2 className="h-3.5 w-3.5 animate-spin text-muted-foreground" />
      ) : (
        <>
          <span className="font-medium tabular-nums">{displayValue.toLocaleString()}</span>
          {showLabel && <span className="text-sm text-muted-foreground">rifas</span>}
        </>
      )}
    </div>
  );
} 