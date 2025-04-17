
import React from 'react';
import { Badge } from "@/components/ui/badge";
import { Shield } from "lucide-react";

const UsersContent: React.FC = () => {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-2">Visão Geral do Gerenciamento de Usuários</h3>
        <p>
          O módulo de gerenciamento de usuários permite criar, editar, desativar e gerenciar todos os usuários da plataforma.
          O sistema usa um modelo de permissões baseado em papéis.
        </p>
      </div>
      
      <div>
        <h3 className="text-lg font-semibold mb-2">Tipos de Usuários</h3>
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Badge className="bg-neon-pink text-white">Admin</Badge>
            <span>Acesso total à plataforma e configurações do sistema</span>
          </div>
          <div className="flex items-center gap-2">
            <Badge className="bg-neon-cyan text-galaxy-dark">Moderador</Badge>
            <span>Pode moderar conteúdo e gerenciar certos aspectos do sistema</span>
          </div>
          <div className="flex items-center gap-2">
            <Badge className="bg-neon-lime/80 text-galaxy-dark">Anunciante</Badge>
            <span>Pode criar e gerenciar campanhas publicitárias</span>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="outline">Participante</Badge>
            <span>Usuário final que interage com as campanhas e participa de sorteios</span>
          </div>
        </div>
      </div>
      
      <div>
        <h3 className="text-lg font-semibold mb-2">Operações Principais</h3>
        <div className="grid gap-4 grid-cols-1 sm:grid-cols-2">
          <div className="p-3 bg-galaxy-deepPurple/20 rounded-lg border border-galaxy-purple/30">
            <h4 className="font-medium mb-1">Criação de Usuários</h4>
            <p className="text-sm text-muted-foreground">
              Administradores podem criar novos usuários, definir seus papéis e configurar suas permissões iniciais.
            </p>
          </div>
          
          <div className="p-3 bg-galaxy-deepPurple/20 rounded-lg border border-galaxy-purple/30">
            <h4 className="font-medium mb-1">Edição de Usuários</h4>
            <p className="text-sm text-muted-foreground">
              Modificar perfis de usuários existentes, alterar papéis ou ajustar permissões.
            </p>
          </div>
          
          <div className="p-3 bg-galaxy-deepPurple/20 rounded-lg border border-galaxy-purple/30">
            <h4 className="font-medium mb-1">Desativação/Reativação</h4>
            <p className="text-sm text-muted-foreground">
              Desativar temporariamente ou reativar contas de usuário sem excluí-las permanentemente.
            </p>
          </div>
          
          <div className="p-3 bg-galaxy-deepPurple/20 rounded-lg border border-galaxy-purple/30">
            <h4 className="font-medium mb-1">Exclusão de Usuários</h4>
            <p className="text-sm text-muted-foreground">
              Excluir permanentemente um usuário e todos os seus dados associados (requer confirmação em múltiplas etapas).
            </p>
          </div>
        </div>
      </div>
      
      <div className="bg-red-500/10 p-4 rounded-lg border border-red-500/30">
        <h4 className="font-medium flex items-center gap-2 text-red-400">
          <Shield size={16} />
          Importante
        </h4>
        <p className="text-sm mt-1">
          A exclusão de usuários é irreversível e pode afetar a integridade dos dados do sistema. Recomenda-se 
          desativar contas em vez de excluí-las permanentemente sempre que possível.
        </p>
      </div>
    </div>
  );
};

export default UsersContent;
