
import React from 'react';
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";

const OverviewContent: React.FC = () => {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-2">Sobre o PremiAds</h3>
        <p>
          O PremiAds é uma plataforma de marketing digital que combina anúncios com mecânicas de gamificação e sorteios. 
          O sistema conecta três tipos principais de usuários: administradores, anunciantes e participantes.
        </p>
      </div>
      
      <div>
        <h3 className="text-lg font-semibold mb-2">Arquitetura do Sistema</h3>
        <p>
          A plataforma é construída com uma arquitetura moderna baseada em React no frontend e uma API RESTful no backend. 
          Os dados são armazenados em um banco de dados relacional com camadas de cache para otimização de desempenho.
        </p>
        <div className="mt-4 p-4 bg-galaxy-deepPurple/20 rounded-lg border border-galaxy-purple/30">
          <h4 className="font-medium mb-2">Componentes Principais:</h4>
          <ul className="list-disc pl-5 space-y-1">
            <li>Interface de administração (Painel Admin)</li>
            <li>Portal de anunciantes</li>
            <li>Aplicação para participantes</li>
            <li>Serviço de autenticação e controle de acesso</li>
            <li>Sistema de sorteios e premiações</li>
            <li>Motor de análise de dados</li>
            <li>API de integração</li>
          </ul>
        </div>
      </div>
      
      <div>
        <h3 className="text-lg font-semibold mb-2">Fluxo de Dados</h3>
        <p>
          O sistema processa informações de campanhas publicitárias, interações de usuários, 
          análises de engajamento e sorteios, utilizando filas de processamento para operações assíncronas.
        </p>
      </div>
      
      <div className="p-4 bg-neon-cyan/10 rounded-lg border border-neon-cyan/30">
        <h3 className="text-lg font-semibold mb-2">Versão Atual</h3>
        <div className="flex justify-between items-center">
          <div>
            <p className="text-sm">Versão: <span className="font-mono">1.5.2</span></p>
            <p className="text-sm">Data da atualização: <span className="font-mono">17/04/2025</span></p>
          </div>
          <Button variant="outline" size="sm" className="gap-2">
            <Download size={14} />
            Changelog
          </Button>
        </div>
      </div>
    </div>
  );
};

export default OverviewContent;
