
import React from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { ruleCategories } from "./rulesData";
import RuleCategoryPanel from "./RuleCategoryPanel";
import { RulesByCategory } from "./types";

interface RulesTabsProps {
  rules: RulesByCategory;
  currentCategory: string;
  setCurrentCategory: (category: string) => void;
  editingRule: string | null;
  onEditRule: (category: string, ruleId: string) => void;
  onToggleRule: (category: string, ruleId: string) => void;
  onSaveRule: (category: string, ruleId: string, value: any) => void;
}

const RulesTabs = ({
  rules,
  currentCategory,
  setCurrentCategory,
  editingRule,
  onEditRule,
  onToggleRule,
  onSaveRule,
}: RulesTabsProps) => {
  return (
    <Tabs defaultValue={currentCategory} onValueChange={setCurrentCategory}>
      <TabsList className="grid grid-cols-2 md:grid-cols-4 mb-6">
        {ruleCategories.map(category => {
          const Icon = category.icon;
          return (
            <TabsTrigger
              key={category.id}
              value={category.id}
              className="data-[state=active]:text-neon-cyan"
            >
              <span className="flex items-center">
                {typeof Icon === "function"
                  ? <Icon className="mr-2 h-4 w-4" />
                  : null}
                {category.label}
              </span>
            </TabsTrigger>
          );
        })}
      </TabsList>
      {Object.keys(rules).map(category => (
        <TabsContent key={category} value={category}>
          <RuleCategoryPanel
            rules={rules[category]}
            editingRule={editingRule}
            onToggleRule={(ruleId) => onToggleRule(category, ruleId)}
            onEditRule={(ruleId) => onEditRule(category, ruleId)}
            onSaveRule={(ruleId, value) => onSaveRule(category, ruleId, value)}
          />
        </TabsContent>
      ))}
    </Tabs>
  );
};

export default RulesTabs;

