import { AlertCircle, CheckCircle2, XCircle, RotateCcw } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

interface SubmissionsEmptyStateProps {
  activeTab: string;
}

const SubmissionsEmptyState = ({ activeTab }: SubmissionsEmptyStateProps) => {
  // Define content based on active tab
  const getContent = () => {
    switch (activeTab) {
      case 'pendentes':
        return {
          icon: <AlertCircle className="w-12 h-12 text-gray-400" />,
          title: "Nenhuma submissão pendente",
          description: "Não há submissões aguardando sua revisão no momento."
        };
      case 'aprovadas':
        return {
          icon: <CheckCircle2 className="w-12 h-12 text-gray-400" />,
          title: "Nenhuma submissão aprovada",
          description: "Você ainda não aprovou nenhuma submissão."
        };
      case 'rejeitadas':
        return {
          icon: <XCircle className="w-12 h-12 text-gray-400" />,
          title: "Nenhuma submissão rejeitada",
          description: "Você ainda não rejeitou nenhuma submissão definitivamente."
        };
      case 'segunda_instancia':
        return {
          icon: <RotateCcw className="w-12 h-12 text-gray-400" />,
          title: "Nenhuma submissão em segunda instância",
          description: "Não há submissões aguardando revisão de segunda instância pelo administrador."
        };
      case 'retornadas':
        return {
          icon: <RotateCcw className="w-12 h-12 text-yellow-400" />,
          title: "Nenhuma submissão retornada",
          description: "Não há submissões retornadas pelo administrador para sua decisão final."
        };
      default:
        return {
          icon: <AlertCircle className="w-12 h-12 text-gray-400" />,
          title: "Nenhuma submissão encontrada",
          description: "Não há submissões para exibir nesta categoria."
        };
    }
  };
  
  const content = getContent();
  
  return (
    <Card className="border-galaxy-purple/30">
      <CardContent className="flex flex-col items-center justify-center py-12 text-center">
        {content.icon}
        <h3 className="mt-4 text-xl font-semibold">{content.title}</h3>
        <p className="mt-2 text-muted-foreground max-w-md">
          {content.description}
        </p>
      </CardContent>
    </Card>
  );
};

export default SubmissionsEmptyState;
