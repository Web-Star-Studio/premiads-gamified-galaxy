
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertTriangle, CheckCircle2 } from "lucide-react";
import RuleEditRow from "./RuleEditRow";
import { Rule } from "./types";

interface RuleCategoryPanelProps {
  rules: Rule[];
  editingRule: string | null;
  onEditRule: (ruleId: string) => void;
  onToggleRule: (ruleId: string) => void;
  onSaveRule: (ruleId: string, value: any) => void;
  className?: string; // Added className prop
}

const RuleCategoryPanel = ({
  rules,
  editingRule,
  onEditRule,
  onToggleRule,
  onSaveRule,
  className, // Add to destructuring
}: RuleCategoryPanelProps) => {
  return (
    <div className={`space-y-4 ${className || ''}`}>
      <Card className="bg-galaxy-dark border-galaxy-purple/30">
        <CardContent className="p-0">
          <div className="divide-y divide-galaxy-purple/20">
            {rules.map((rule) => (
              <RuleEditRow
                key={rule.id}
                rule={rule}
                isEditing={editingRule === rule.id}
                onEdit={onEditRule}
                onToggle={onToggleRule}
                onSave={onSaveRule}
              />
            ))}
          </div>
        </CardContent>
      </Card>
      <Card className="bg-galaxy-dark border-galaxy-purple/30">
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
    </div>
  );
};

export default RuleCategoryPanel;
