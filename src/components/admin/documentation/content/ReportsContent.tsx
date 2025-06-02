
import React from 'react';
import { Button } from "@/components/ui/button";
import { Download, Printer, BarChart4 } from "lucide-react";

const ReportsContent: React.FC = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-2">Sistema de Relatórios</h3>
        <p>
          O módulo de relatórios permite gerar análises detalhadas sobre diversos aspectos da plataforma,
          incluindo desempenho de campanhas, comportamento dos usuários e métricas financeiras.
        </p>
      </div>
      
      <div>
        <h3 className="text-lg font-semibold mb-2">Relatórios Disponíveis</h3>
        <div className="grid gap-4 grid-cols-1 sm:grid-cols-2">
          <div className="p-3 bg-galaxy-deepPurple/20 rounded-lg border border-galaxy-purple/30">
            <h4 className="font-medium mb-1">Relatório de Desempenho de Campanhas</h4>
            <p className="text-sm text-muted-foreground">
              Análise completa do desempenho de campanhas publicitárias, incluindo visualizações, cliques e conversões.
            </p>
          </div>
          
          <div className="p-3 bg-galaxy-deepPurple/20 rounded-lg border border-galaxy-purple/30">
            <h4 className="font-medium mb-1">Relatório de Engajamento de Usuários</h4>
            <p className="text-sm text-muted-foreground">
              Dados sobre como os usuários estão interagindo com a plataforma, incluindo tempo de sessão e ações realizadas.
            </p>
          </div>
          
          <div className="p-3 bg-galaxy-deepPurple/20 rounded-lg border border-galaxy-purple/30">
            <h4 className="font-medium mb-1">Relatório Financeiro</h4>
            <p className="text-sm text-muted-foreground">
              Visão geral das transações financeiras, receitas de anunciantes e pagamentos de prêmios.
            </p>
          </div>
          
          <div className="p-3 bg-galaxy-deepPurple/20 rounded-lg border border-galaxy-purple/30">
            <h4 className="font-medium mb-1">Relatório de Sorteios</h4>
            <p className="text-sm text-muted-foreground">
              Dados sobre participação em sorteios, número de bilhetes gerados e prêmios distribuídos.
            </p>
          </div>
        </div>
      </div>
      
      <div>
        <h3 className="text-lg font-semibold mb-2">Exportação de Dados</h3>
        <p>
          Os relatórios podem ser exportados em vários formatos, incluindo PDF, Excel e CSV,
          para análise posterior ou compartilhamento com stakeholders.
        </p>
        <div className="mt-4 flex flex-wrap gap-2">
          <Button variant="outline" size="sm" className="gap-2">
            <Download size={14} />
            Exportar PDF
          </Button>
          <Button variant="outline" size="sm" className="gap-2">
            <Download size={14} />
            Exportar Excel
          </Button>
          <Button variant="outline" size="sm" className="gap-2">
            <Download size={14} />
            Exportar CSV
          </Button>
          <Button variant="outline" size="sm" className="gap-2">
            <Printer size={14} />
            Imprimir
          </Button>
        </div>
      </div>
      
      <div>
        <h3 className="text-lg font-semibold mb-2">Relatórios Agendados</h3>
        <p>
          Administradores podem configurar relatórios para serem gerados e enviados automaticamente
          em intervalos predefinidos, como diariamente, semanalmente ou mensalmente.
        </p>
      </div>
      
      <div className="bg-neon-cyan/10 p-4 rounded-lg border border-neon-cyan/30">
        <h4 className="font-medium flex items-center gap-2">
          <BarChart4 size={16} />
          Dica de Uso
        </h4>
        <p className="text-sm mt-1">
          Utilize filtros avançados para refinar os dados exibidos nos relatórios. Os relatórios podem
          ser filtrados por data, tipo de campanha, segmento de usuário e muitos outros critérios.
        </p>
      </div>
    </div>
  );

export default ReportsContent;
