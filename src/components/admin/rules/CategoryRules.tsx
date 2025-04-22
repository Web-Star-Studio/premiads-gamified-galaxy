
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import RuleCard from './RuleCard';
import ImportantConsiderations from './ImportantConsiderations';
import { Rule } from './types';

interface CategoryRulesProps {
  rules: Rule[];
  editingRule: string | null;
  onToggleRule: (ruleId: string) => void;
  onEditRule: (ruleId: string) => void;
  onSaveRule: (ruleId: string, value: any) => void;
}

const CategoryRules = ({
  rules,
  editingRule,
  onToggleRule,
  onEditRule,
  onSaveRule
}: CategoryRulesProps) => {
  return (
    <div className="space-y-4">
      <Card className="bg-galaxy-dark border-galaxy-purple/30">
        <CardContent className="p-0">
          <div className="divide-y divide-galaxy-purple/20">
            {rules.map(rule => (
              <RuleCard
                key={rule.id}
                rule={rule}
                onToggle={onToggleRule}
                onEdit={onEditRule}
                onSave={onSaveRule}
                isEditing={editingRule === rule.id}
              />
            ))}
          </div>
        </CardContent>
      </Card>
      <ImportantConsiderations />
    </div>
  );
};

export default CategoryRules;
