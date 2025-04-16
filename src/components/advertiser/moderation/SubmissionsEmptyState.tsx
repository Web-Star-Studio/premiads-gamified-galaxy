
import { AlertCircle } from "lucide-react";

interface SubmissionsEmptyStateProps {
  tabValue: 'pending' | 'approved' | 'rejected';
}

const SubmissionsEmptyState = ({ tabValue }: SubmissionsEmptyStateProps) => {
  return (
    <div className="flex flex-col items-center justify-center h-64 text-center">
      <AlertCircle className="w-12 h-12 text-gray-500 mb-4" />
      <h3 className="text-xl font-medium mb-2">Nenhuma submissão encontrada</h3>
      <p className="text-gray-400 max-w-md">
        {tabValue === 'pending' 
          ? "Não há submissões pendentes de aprovação no momento. Verifique novamente mais tarde ou crie novas missões para engajar seus usuários."
          : tabValue === 'approved'
            ? "Nenhuma submissão foi aprovada ainda. Quando você aprovar submissões, elas aparecerão aqui."
            : "Nenhuma submissão foi rejeitada ainda. Quando você rejeitar submissões, elas aparecerão aqui."
        }
      </p>
    </div>
  );
};

export default SubmissionsEmptyState;
