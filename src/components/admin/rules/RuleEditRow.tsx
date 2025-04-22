
import React from "react";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { PenSquare } from "lucide-react";
import { Rule } from "./types";

interface RuleEditRowProps {
  rule: Rule;
  isEditing: boolean;
  onEdit: (ruleId: string) => void;
  onToggle: (ruleId: string) => void;
  onSave: (ruleId: string, value: any) => void;
}

const RuleEditRow = ({
  rule,
  isEditing,
  onEdit,
  onToggle,
  onSave
}: RuleEditRowProps) => {
  const handleSave = (value: any) => {
    onSave(rule.id, value);
  };

  const renderInput = () => {
    if (typeof rule.value === 'number') {
      return (
        <Input
          type="number"
          value={rule.value}
          onChange={(e) => handleSave(parseInt(e.target.value))}
          className="w-24 bg-galaxy-dark border-galaxy-purple/30"
        />
      );
    }
    if (typeof rule.value === 'boolean') {
      return (
        <Switch
          checked={rule.value}
          onCheckedChange={handleSave}
        />
      );
    }
    return (
      <Input
        type="text"
        value={rule.value}
        onChange={(e) => handleSave(e.target.value)}
        className="w-32 lg:w-48 bg-galaxy-dark border-galaxy-purple/30"
      />
    );
  };

  return (
    <div className="p-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
      <div className="space-y-1 flex-1">
        <div className="flex items-center gap-2">
          <h4 className="font-medium">{rule.name}</h4>
          <Badge
            variant="outline"
            className={`ml-2 ${rule.enabled ? 'border-neon-lime text-neon-lime' : 'border-red-500 text-red-500'}`}
          >
            {rule.enabled ? 'Ativo' : 'Inativo'}
          </Badge>
        </div>
        <p className="text-sm text-muted-foreground">{rule.description}</p>
        <p className="text-xs text-muted-foreground">
          Última modificação: {rule.lastModified}
        </p>
      </div>
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2">
          <span className="text-sm">Valor:</span>
          {isEditing ? renderInput() : <span className="font-medium text-neon-cyan">{rule.value}</span>}
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            className="h-8 w-8 p-0 border-galaxy-purple/30"
            onClick={() => onEdit(rule.id)}
          >
            <PenSquare className="h-4 w-4" />
          </Button>
          <Switch
            checked={rule.enabled}
            onCheckedChange={() => onToggle(rule.id)}
            className="data-[state=checked]:bg-neon-lime"
          />
        </div>
      </div>
    </div>
  );
};

export default RuleEditRow;

