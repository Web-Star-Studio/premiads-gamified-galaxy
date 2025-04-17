
import React from 'react';
import { Shield } from "lucide-react";

const RafflesContent: React.FC = () => {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-2">Sistema de Sorteios</h3>
        <p>
          O módulo de gestão de sorteios permite criar, configurar e gerenciar diferentes tipos de sorteios
          na plataforma, desde sorteios simples até mecânicas complexas de premiação.
        </p>
      </div>
      
      <div>
        <h3 className="text-lg font-semibold mb-2">Tipos de Sorteios</h3>
        <div className="grid gap-4 grid-cols-1 sm:grid-cols-2">
          <div className="p-3 bg-galaxy-deepPurple/20 rounded-lg border border-galaxy-purple/30">
            <h4 className="font-medium mb-1">Sorteio Padrão</h4>
            <p className="text-sm text-muted-foreground">
              Sorteio tradicional onde os usuários adquirem bilhetes para concorrer a prêmios específicos.
            </p>
          </div>
          
          <div className="p-3 bg-galaxy-deepPurple/20 rounded-lg border border-galaxy-purple/30">
            <h4 className="font-medium mb-1">Sorteio Instantâneo</h4>
            <p className="text-sm text-muted-foreground">
              Usuários descobrem imediatamente se ganharam ao participar, similar a uma raspadinha digital.
            </p>
          </div>
          
          <div className="p-3 bg-galaxy-deepPurple/20 rounded-lg border border-galaxy-purple/30">
            <h4 className="font-medium mb-1">Sorteio de Missões</h4>
            <p className="text-sm text-muted-foreground">
              Prêmios são sorteados entre usuários que completaram determinadas missões ou desafios.
            </p>
          </div>
          
          <div className="p-3 bg-galaxy-deepPurple/20 rounded-lg border border-galaxy-purple/30">
            <h4 className="font-medium mb-1">Sorteio de Fidelidade</h4>
            <p className="text-sm text-muted-foreground">
              Premiação exclusiva para usuários que mantêm um determinado nível de atividade contínua.
            </p>
          </div>
        </div>
      </div>
      
      <div>
        <h3 className="text-lg font-semibold mb-2">Configuração de Sorteios</h3>
        <p>
          Ao criar um novo sorteio, os administradores podem configurar diversos parâmetros, incluindo:
        </p>
        <ul className="list-disc pl-5 space-y-1 mt-2">
          <li>Datas de início e término do sorteio</li>
          <li>Prêmios disponíveis e suas quantidades</li>
          <li>Regras de elegibilidade para participação</li>
          <li>Método de sorteio e algoritmo utilizado</li>
          <li>Mecânicas de aquisição de bilhetes</li>
          <li>Recursos visuais e branding do sorteio</li>
        </ul>
      </div>
      
      <div>
        <h3 className="text-lg font-semibold mb-2">Realização do Sorteio</h3>
        <p>
          O sistema utiliza um gerador de números aleatórios criptograficamente seguro para garantir a
          imparcialidade dos sorteios. Todos os sorteios são automaticamente auditados, com registros
          detalhados de cada etapa do processo.
        </p>
      </div>
      
      <div className="bg-red-500/10 p-4 rounded-lg border border-red-500/30">
        <h4 className="font-medium flex items-center gap-2 text-red-400">
          <Shield size={16} />
          Importante
        </h4>
        <p className="text-sm mt-1">
          A integridade do processo de sorteio é fundamental para a credibilidade da plataforma.
          Qualquer modificação no algoritmo de sorteio deve ser cuidadosamente documentada e auditada.
        </p>
      </div>
    </div>
  );
};

export default RafflesContent;
