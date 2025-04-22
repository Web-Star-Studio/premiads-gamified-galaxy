
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Save, FileText, RefreshCw } from 'lucide-react';
import { useSounds } from '@/hooks/use-sounds';
import { toast } from "@/hooks/use-toast";
import LoadingParticles from './LoadingParticles';
import { ruleCategories } from "./rules/rulesData";
import RulesTabs from "./rules/RulesTabs";

// Define a base structure for initialRules based on the categories
const initialRules = Object.fromEntries(
  ruleCategories.map(category => [
    category.id, 
    [] // Empty array for each category, will be populated with actual data
  ])
);

const RulesConfiguration: React.FC = () => {
  const [rules, setRules] = useState(initialRules);
  const [currentCategory, setCurrentCategory] = useState('points');
  const [editingRule, setEditingRule] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const { playSound } = useSounds();

  // Simulate loading
  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1200);
    return () => clearTimeout(timer);
  }, []);

  const handleToggleRule = (category: string, ruleId: string) => {
    setRules(prevRules => {
      const updatedRules = { ...prevRules };
      const ruleIndex = updatedRules[category].findIndex(rule => rule.id === ruleId);
      if (ruleIndex !== -1) {
        updatedRules[category][ruleIndex].enabled = !updatedRules[category][ruleIndex].enabled;
      }
      return updatedRules;
    });

    playSound('pop');

    toast({
      title: "Regra atualizada",
      description: `Status da regra alterado com sucesso.`,
    });
  };

  const handleEditRule = (category: string, ruleId: string) => {
    setEditingRule(ruleId);
    // In a real app, you might populate a form with the rule's values
  };

  const handleSaveRule = (category: string, ruleId: string, newValue: any) => {
    setSaving(true);

    setTimeout(() => {
      setRules(prevRules => {
        const updatedRules = { ...prevRules };
        const ruleIndex = updatedRules[category].findIndex(rule => rule.id === ruleId);

        if (ruleIndex !== -1) {
          updatedRules[category][ruleIndex].value = newValue;
          updatedRules[category][ruleIndex].lastModified = new Date().toISOString().split('T')[0];
        }

        return updatedRules;
      });

      setEditingRule(null);
      setSaving(false);
      playSound('reward');

      toast({
        title: "Alterações salvas",
        description: `As configurações de regras foram atualizadas com sucesso.`,
      });
    }, 1000);
  };

  const handleSaveAllRules = () => {
    setSaving(true);
    setTimeout(() => {
      setSaving(false);
      playSound('reward');
      toast({
        title: "Configurações salvas",
        description: `Todas as configurações de regras foram atualizadas e aplicadas ao sistema.`,
      });
    }, 1500);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <div className="grid grid-cols-1 gap-6">
        <Card className="bg-galaxy-deepPurple border-galaxy-purple/30">
          <CardHeader className="pb-3">
            <div className="flex justify-between items-center">
              <div>
                <CardTitle className="text-xl font-heading text-white flex items-center">
                  <FileText className="h-5 w-5 mr-2 text-neon-lime" />
                  Configuração de Regras
                </CardTitle>
                <CardDescription>
                  Defina parâmetros para missões, recompensas, sorteios e sistema de pontos.
                </CardDescription>
              </div>
              <Button 
                variant="default" 
                size="sm" 
                className="bg-neon-lime text-galaxy-dark hover:bg-neon-lime/80"
                onClick={handleSaveAllRules}
                disabled={saving}
              >
                <Save className={`h-4 w-4 mr-2 ${saving ? 'animate-spin' : ''}`} />
                Salvar Alterações
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex justify-center items-center h-60 relative">
                <LoadingParticles />
                <div className="w-12 h-12 border-4 border-t-neon-pink border-galaxy-purple rounded-full animate-spin"></div>
              </div>
            ) : (
              <RulesTabs
                rules={rules}
                currentCategory={currentCategory}
                setCurrentCategory={setCurrentCategory}
                editingRule={editingRule}
                onEditRule={handleEditRule}
                onToggleRule={handleToggleRule}
                onSaveRule={handleSaveRule}
              />
            )}
          </CardContent>
          <CardFooter className="border-t border-galaxy-purple/30 mt-4 pt-4 flex justify-between">
            <Button variant="outline" className="border-galaxy-purple/30">
              <RefreshCw className="h-4 w-4 mr-2" />
              Restaurar Padrões
            </Button>
            <Button 
              onClick={handleSaveAllRules}
              disabled={saving}
              className="bg-neon-lime text-galaxy-dark hover:bg-neon-lime/80"
            >
              <Save className={`h-4 w-4 mr-2 ${saving ? 'animate-spin' : ''}`} />
              Aplicar Configurações
            </Button>
          </CardFooter>
        </Card>
      </div>
    </motion.div>
  );
};

export default RulesConfiguration;
