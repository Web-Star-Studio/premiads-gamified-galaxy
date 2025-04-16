
import { AlertCircle } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

interface SubmissionsEmptyStateProps {
  tabValue: 'pending' | 'approved' | 'rejected';
}

const SubmissionsEmptyState = ({ tabValue }: SubmissionsEmptyStateProps) => {
  return (
    <Card className="min-h-[300px]">
      <CardContent className="pt-6">
        <div className="flex flex-col items-center justify-center h-60 text-center">
          <AlertCircle className="w-12 h-12 text-gray-500 mb-4" />
          <h3 className="text-xl font-medium mb-2">Nenhuma submissão encontrada</h3>
          <p className="text-gray-400 max-w-md">
            {tabValue === 'pending' 
              ? "Não há submissões pendentes de aprovação no momento."
              : tabValue === 'approved'
                ? "Você ainda não aprovou nenhuma submissão."
                : "Você ainda não rejeitou nenhuma submissão."
            }
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default SubmissionsEmptyState;
