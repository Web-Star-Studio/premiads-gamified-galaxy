
import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { AlertTriangle, CheckCircle2 } from "lucide-react";

interface ImportantConsiderationsProps {
  className?: string;
}

const ImportantConsiderations: React.FC<ImportantConsiderationsProps> = ({ className }) => {
  return (
    <Card className={`bg-galaxy-dark border-galaxy-purple/30 ${className || ''}`}>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg flex items-center">
          <AlertTriangle className="h-4 w-4 mr-2 text-amber-500" />
          Considerações Importantes
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground">
          Alterações nas regras desta categoria podem afetar diretamente a experiência do usuário e o equilíbrio do sistema.
          É recomendado testar as mudanças em um ambiente controlado antes de aplicá-las ao sistema de produção.
        </p>
        <div className="flex items-center gap-2 mt-4">
          <CheckCircle2 className="h-4 w-4 text-neon-lime" />
          <p className="text-sm">Alterações são aplicadas em tempo real para todos os usuários</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default ImportantConsiderations;
