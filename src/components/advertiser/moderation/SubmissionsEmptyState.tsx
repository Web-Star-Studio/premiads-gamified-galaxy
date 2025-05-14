import { Card, CardContent } from "@/components/ui/card";
import { Box, SearchX } from "lucide-react";

export interface SubmissionsEmptyStateProps {
  activeTab: string;
}

const SubmissionsEmptyState = ({ activeTab }: SubmissionsEmptyStateProps) => {
  const getMessage = () => {
    switch (activeTab) {
      case 'pendentes':
        return "Nenhuma submissão pendente encontrada.";
      case 'aprovadas':
        return "Nenhuma submissão aprovada encontrada.";
      case 'rejeitadas':
        return "Nenhuma submissão rejeitada encontrada.";
      case 'segunda_instancia':
        return "Nenhuma submissão em segunda instância encontrada.";
      default:
        return "Nenhuma submissão encontrada.";
    }
  };

  return (
    <Card className="border-galaxy-purple bg-galaxy-darkPurple">
      <CardContent className="p-12 flex flex-col items-center justify-center text-center">
        <SearchX className="h-12 w-12 text-muted-foreground mb-4" />
        <h3 className="text-xl font-medium mb-2">{getMessage()}</h3>
        <p className="text-muted-foreground max-w-md">
          {activeTab === 'pendentes' 
            ? "As submissões de usuários aparecerão aqui quando forem enviadas."
            : "As submissões processadas aparecerão aqui à medida que forem moderadas."}
        </p>
      </CardContent>
    </Card>
  );
};

export default SubmissionsEmptyState;
