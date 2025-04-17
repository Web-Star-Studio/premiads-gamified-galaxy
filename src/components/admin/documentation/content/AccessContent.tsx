
import React from 'react';
import { Shield } from "lucide-react";

const AccessContent: React.FC = () => {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-2">Sistema de Permissões</h3>
        <p>
          O controle de acesso é baseado em um modelo RBAC (Role-Based Access Control) com permissões granulares
          que podem ser atribuídas a papéis específicos.
        </p>
      </div>
      
      <div>
        <h3 className="text-lg font-semibold mb-2">Matriz de Permissões</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full border-collapse text-sm">
            <thead>
              <tr className="bg-galaxy-deepPurple/30">
                <th className="border border-galaxy-purple/30 px-4 py-2 text-left">Recurso</th>
                <th className="border border-galaxy-purple/30 px-4 py-2 text-center">Admin</th>
                <th className="border border-galaxy-purple/30 px-4 py-2 text-center">Moderador</th>
                <th className="border border-galaxy-purple/30 px-4 py-2 text-center">Anunciante</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="border border-galaxy-purple/30 px-4 py-2">Dashboard Administrativo</td>
                <td className="border border-galaxy-purple/30 px-4 py-2 text-center">✓</td>
                <td className="border border-galaxy-purple/30 px-4 py-2 text-center">✓ (limitado)</td>
                <td className="border border-galaxy-purple/30 px-4 py-2 text-center">✕</td>
              </tr>
              <tr>
                <td className="border border-galaxy-purple/30 px-4 py-2">Gerenciamento de Usuários</td>
                <td className="border border-galaxy-purple/30 px-4 py-2 text-center">✓</td>
                <td className="border border-galaxy-purple/30 px-4 py-2 text-center">✕</td>
                <td className="border border-galaxy-purple/30 px-4 py-2 text-center">✕</td>
              </tr>
              <tr>
                <td className="border border-galaxy-purple/30 px-4 py-2">Moderação de Conteúdo</td>
                <td className="border border-galaxy-purple/30 px-4 py-2 text-center">✓</td>
                <td className="border border-galaxy-purple/30 px-4 py-2 text-center">✓</td>
                <td className="border border-galaxy-purple/30 px-4 py-2 text-center">✕</td>
              </tr>
              <tr>
                <td className="border border-galaxy-purple/30 px-4 py-2">Gestão de Campanhas</td>
                <td className="border border-galaxy-purple/30 px-4 py-2 text-center">✓</td>
                <td className="border border-galaxy-purple/30 px-4 py-2 text-center">✓ (visualizar)</td>
                <td className="border border-galaxy-purple/30 px-4 py-2 text-center">✓ (próprias)</td>
              </tr>
              <tr>
                <td className="border border-galaxy-purple/30 px-4 py-2">Configurações do Sistema</td>
                <td className="border border-galaxy-purple/30 px-4 py-2 text-center">✓</td>
                <td className="border border-galaxy-purple/30 px-4 py-2 text-center">✕</td>
                <td className="border border-galaxy-purple/30 px-4 py-2 text-center">✕</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      
      <div>
        <h3 className="text-lg font-semibold mb-2">Registro de Auditoria</h3>
        <p>
          Todas as ações de administradores e moderadores são registradas em um log de auditoria para 
          garantir conformidade e rastreabilidade. Os logs incluem o usuário, ação realizada, timestamp e endereço IP.
        </p>
      </div>
      
      <div className="bg-neon-cyan/10 p-4 rounded-lg border border-neon-cyan/30">
        <h4 className="font-medium flex items-center gap-2">
          <Shield size={16} />
          Prática Recomendada
        </h4>
        <p className="text-sm mt-1">
          Aplique o princípio do privilégio mínimo: atribua apenas as permissões que um usuário precisa para 
          realizar suas funções específicas, evitando acesso desnecessário a recursos sensíveis.
        </p>
      </div>
    </div>
  );
};

export default AccessContent;
