
import React from 'react';
import { HelpCircle } from "lucide-react";

const RulesContent: React.FC = () => {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-2">Motor de Regras</h3>
        <p>
          O sistema utiliza um motor de regras configurável para definir lógicas de negócio que controlam 
          diversos aspectos da plataforma, desde a elegibilidade para participação em sorteios até regras de moderação.
        </p>
      </div>
      
      <div>
        <h3 className="text-lg font-semibold mb-2">Tipos de Regras</h3>
        <div className="grid gap-4 grid-cols-1 sm:grid-cols-2">
          <div className="p-3 bg-galaxy-deepPurple/20 rounded-lg border border-galaxy-purple/30">
            <h4 className="font-medium mb-1">Regras de Participação</h4>
            <p className="text-sm text-muted-foreground">
              Definem quem pode participar de sorteios, missões ou outras atividades da plataforma.
            </p>
          </div>
          
          <div className="p-3 bg-galaxy-deepPurple/20 rounded-lg border border-galaxy-purple/30">
            <h4 className="font-medium mb-1">Regras de Conteúdo</h4>
            <p className="text-sm text-muted-foreground">
              Controlam o que pode ser publicado, incluindo filtros para conteúdo impróprio e restrições.
            </p>
          </div>
          
          <div className="p-3 bg-galaxy-deepPurple/20 rounded-lg border border-galaxy-purple/30">
            <h4 className="font-medium mb-1">Regras de Premiação</h4>
            <p className="text-sm text-muted-foreground">
              Definem como os prêmios são distribuídos, incluindo probabilidades e requisitos.
            </p>
          </div>
          
          <div className="p-3 bg-galaxy-deepPurple/20 rounded-lg border border-galaxy-purple/30">
            <h4 className="font-medium mb-1">Regras de Negócios</h4>
            <p className="text-sm text-muted-foreground">
              Controlam processos internos, como aprovação de campanhas e processamento de pagamentos.
            </p>
          </div>
        </div>
      </div>
      
      <div>
        <h3 className="text-lg font-semibold mb-2">Estrutura de Regras</h3>
        <p>
          As regras são definidas usando um formato condicional (SE-ENTÃO-SENÃO) e podem ser combinadas usando 
          operadores lógicos para criar regras complexas baseadas em múltiplos critérios.
        </p>
        <div className="mt-4 p-4 bg-galaxy-deepPurple/20 rounded-lg border border-galaxy-purple/30 font-mono text-sm overflow-x-auto">
          <pre>{`{
  "id": "rule_eligibility_001",
  "name": "Participação em Sorteio Premium",
  "conditions": [
    { "field": "user.status", "operator": "equals", "value": "active" },
    { "field": "user.points", "operator": "greaterThan", "value": 1000 },
    { "field": "user.age", "operator": "greaterThanOrEqual", "value": 18 }
  ],
  "conditionLogic": "AND",
  "actions": [
    { "type": "setEligible", "value": true },
    { "type": "addBonus", "value": 50 }
  ]
}`}</pre>
        </div>
      </div>
      
      <div className="bg-yellow-500/10 p-4 rounded-lg border border-yellow-500/30">
        <h4 className="font-medium flex items-center gap-2">
          <HelpCircle size={16} />
          Importante
        </h4>
        <p className="text-sm mt-1">
          Alterações nas regras podem ter efeitos amplos no comportamento do sistema. Sempre teste novas regras 
          em um ambiente de homologação antes de aplicá-las ao ambiente de produção.
        </p>
      </div>
    </div>
  );
};

export default RulesContent;
