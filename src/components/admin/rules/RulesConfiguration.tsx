import React, { useState, useEffect, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { ruleCategories } from "./rulesData";
import RulesTabs from "./RulesTabs";
import { Rules, RulesByCategory } from "./types";
import { useToast } from "@/hooks/use-toast";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getRules, updateRule } from "@/lib/api/rules";
import LoadingSpinner from "@/components/LoadingSpinner";

const RulesConfiguration = () => {
  const [search, setSearch] = useState("");
  const [isFiltered, setIsFiltered] = useState(false);
  const [category, setCategory] = useState(ruleCategories[0].id);
  const [editingRule, setEditingRule] = useState<string | null>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: rules, isLoading, isError, error } = useQuery({
    queryKey: ["rules"],
    queryFn: getRules,
  });

  const { mutate: saveRuleMutation, isLoading: isSaving } = useMutation({
    mutationFn: updateRule,
    onSuccess: () => {
      toast({
        title: "Regra salva com sucesso!",
      });
      queryClient.invalidateQueries({ queryKey: ["rules"] });
      setEditingRule(null);
    },
    onError: (error: any) => {
      toast({
        title: "Erro ao salvar regra!",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleToggleFilter = () => {
    setIsFiltered(!isFiltered);
  };

  const handleEditRule = useCallback((ruleId: string) => {
    setEditingRule(ruleId);
  }, []);

  const handleToggleRule = useCallback((ruleId: string) => {
    if (!rules) return;

    const ruleToUpdate = Object.values(rules)
      .flat()
      .find((rule) => rule.id === ruleId);

    if (!ruleToUpdate) {
      console.error("Rule not found:", ruleId);
      return;
    }

    saveRuleMutation({ ...ruleToUpdate, active: !ruleToUpdate.active });
  }, [rules, saveRuleMutation]);

  const handleSaveRule = useCallback((ruleId: string, value: any) => {
    if (!rules) return;

    const ruleToUpdate = Object.values(rules)
      .flat()
      .find((rule) => rule.id === ruleId);

    if (!ruleToUpdate) {
      console.error("Rule not found:", ruleId);
      return;
    }

    saveRuleMutation({ ...ruleToUpdate, value });
  }, [rules, saveRuleMutation]);

  useEffect(() => {
    if (rules && Object.keys(rules).length > 0 && !category) {
      setCategory(Object.keys(rules)[0]);
    }
  }, [rules, category]);

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (isError) {
    return <p>Error: {error.message}</p>;
  }

  if (!rules) {
    return <p>No rules found.</p>;
  }

  const rulesByCategory = Object.entries(rules).reduce((acc: RulesByCategory, [category, rules]) => {
    acc[category] = rules;
    return acc;
  }, {});

  const filteredRules: RulesByCategory = Object.entries(rulesByCategory).reduce((acc: RulesByCategory, [category, rules]) => {
    const filtered = rules.filter(rule =>
      rule.label.toLowerCase().includes(search.toLowerCase()) ||
      rule.description.toLowerCase().includes(search.toLowerCase())
    );
    if (filtered.length > 0) {
      acc[category] = filtered;
    }
    return acc;
  }, {});

  return (
    <div>
      <Card className="bg-galaxy-dark border-galaxy-purple/30">
        <CardHeader>
          <CardTitle className="text-lg">Configuração de Regras</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4">
          <div className="grid grid-cols-[1fr_110px] gap-4">
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="search">Pesquisar Regra</Label>
              <Input
                id="search"
                placeholder="Pesquisar por nome ou descrição..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <Button variant="outline" className="h-fit" onClick={handleToggleFilter}>
              {isFiltered ? "Remover Filtro" : "Filtrar"}
            </Button>
          </div>
          <div className="flex items-center space-x-2">
            <Switch id="active" defaultChecked />
            <Label htmlFor="active">Mostrar apenas regras ativas</Label>
          </div>
        </CardContent>
      </Card>
      <div className="mt-4">
        {/* Ajuste: Removido prop className inválido na chamada <RulesTabs /> */}
        <RulesTabs
          rules={isFiltered ? filteredRules : rulesByCategory}
          currentCategory={category}
          setCurrentCategory={setCategory}
          editingRule={editingRule}
          onEditRule={handleEditRule}
          onToggleRule={handleToggleRule}
          onSaveRule={handleSaveRule}
        />
      </div>
    </div>
  );
};

export default RulesConfiguration;
