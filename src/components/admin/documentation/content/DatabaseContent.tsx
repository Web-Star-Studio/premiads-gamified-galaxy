
import React from 'react';

const DatabaseContent: React.FC = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-2">Estrutura do Banco de Dados</h3>
        <p>
          O sistema utiliza um banco de dados relacional PostgreSQL para armazenar dados estruturados,
          com índices otimizados para consultas frequentes e relacionamentos entre entidades.
        </p>
      </div>
      
      <div>
        <h3 className="text-lg font-semibold mb-2">Tabelas Principais</h3>
        <div className="mt-4 p-4 bg-galaxy-deepPurple/20 rounded-lg border border-galaxy-purple/30 font-mono text-sm overflow-x-auto">
          <pre>{`
-- Usuários
users (
  id UUID PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  name VARCHAR(255) NOT NULL,
  role VARCHAR(50) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
)

-- Campanhas
campaigns (
  id UUID PRIMARY KEY,
  advertiser_id UUID REFERENCES users(id),
  title VARCHAR(255) NOT NULL,
  description TEXT,
  status VARCHAR(50) NOT NULL,
  start_date TIMESTAMP WITH TIME ZONE,
  end_date TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
)

-- Sorteios
raffles (
  id UUID PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  start_date TIMESTAMP WITH TIME ZONE NOT NULL,
  end_date TIMESTAMP WITH TIME ZONE NOT NULL,
  status VARCHAR(50) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
)
`}</pre>
        </div>
      </div>
      
      <div>
        <h3 className="text-lg font-semibold mb-2">Backup e Recuperação</h3>
        <p>
          Backups completos do banco de dados são realizados diariamente, com backups incrementais a cada 6 horas.
          Todos os backups são criptografados e armazenados em localização segura com redundância geográfica.
        </p>
        <p className="mt-2">
          O sistema pode ser restaurado a partir de qualquer ponto de backup nos últimos 30 dias,
          permitindo recuperação granular em caso de problemas.
        </p>
      </div>
      
      <div>
        <h3 className="text-lg font-semibold mb-2">Políticas de Retenção de Dados</h3>
        <p>
          Dados pessoais dos usuários são mantidos enquanto as contas estiverem ativas. Após inatividade
          prolongada ou solicitação de exclusão, os dados são anonimizados ou excluídos de acordo com
          políticas de privacidade e regulamentações aplicáveis.
        </p>
        <p className="mt-2">
          Dados de transações e auditoria são armazenados por períodos mais longos para fins de
          conformidade e análises históricas.
        </p>
      </div>
    </div>
  );

export default DatabaseContent;
