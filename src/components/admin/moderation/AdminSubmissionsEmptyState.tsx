import { CheckCircle2, Shield } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

/**
 * Estado vazio para quando não há submissões em segunda instância
 */
function AdminSubmissionsEmptyState() {
  return (
    <Card className="border-galaxy-purple/30">
      <CardContent className="flex flex-col items-center justify-center py-12 text-center">
        <div className="p-4 bg-green-950/30 rounded-full mb-4">
          <CheckCircle2 className="h-12 w-12 text-green-400" />
        </div>
        <h3 className="mt-4 text-xl font-semibold text-white">Nenhuma submissão pendente</h3>
        <p className="mt-2 text-muted-foreground max-w-md">
          Não há submissões em segunda instância aguardando moderação administrativa no momento.
        </p>
        <div className="mt-4 p-3 bg-blue-950/30 border border-blue-500/30 rounded-md">
          <div className="flex items-center gap-2 text-blue-300 text-sm">
            <Shield className="h-4 w-4" />
            <span>Todas as submissões foram processadas ou estão em outras etapas do fluxo.</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default AdminSubmissionsEmptyState; 