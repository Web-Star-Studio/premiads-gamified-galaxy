# PremiAds Gamified Galaxy - Documentação Completa

## 📋 Visão Geral da Plataforma

**PremiAds** é uma plataforma inovadora de marketing digital que combina publicidade interativa com mecânicas de gamificação, conectando anunciantes a participantes através de missões recompensadas. A plataforma oferece uma experiência única onde usuários ganham recompensas reais por completar tarefas de engajamento digital.

### 🎯 Proposta de Valor
- **Para Anunciantes**: Alcance direcionado com engajamento autêntico
- **Para Participantes**: Recompensas reais por atividades digitais simples
- **Para Administradores**: Controle completo sobre campanhas e moderação

---

## 🏗️ Arquitetura e Tecnologias

### Frontend Stack
- **React 18.3.1** - Biblioteca principal para interface
- **TypeScript** - Tipagem estática para maior confiabilidade
- **Vite** - Build tool e dev server otimizado
- **Tailwind CSS** - Framework CSS utilitário
- **Shadcn/UI** - Componentes de interface modernos
- **Framer Motion** - Animações fluidas e interativas
- **React Router** - Roteamento client-side
- **React Query** - Gerenciamento de estado servidor

### Backend e Infraestrutura
- **Supabase** - Backend-as-a-Service completo
  - PostgreSQL Database
  - Authentication & Authorization
  - Real-time subscriptions
  - Edge Functions
  - Storage
- **Stripe** - Processamento de pagamentos
- **Edge Functions** - Processamento serverless

### Bibliotecas Especializadas
- **Zustand** - Gerenciamento de estado global
- **React Hook Form + Zod** - Formulários e validação
- **Recharts** - Visualizações e gráficos
- **Lucide React** - Ícones modernos
- **Canvas Confetti** - Efeitos visuais de gamificação

---

## 👥 Tipos de Usuários e Permissões

### 1. **Participantes** (`participante`)
- Completam missões e recebem recompensas
- Participam de rifas e sorteios
- Gerenciam perfil e histórico de atividades
- Resgatam cashback e prêmios

### 2. **Anunciantes** (`anunciante`)
- Criam e gerenciam campanhas publicitárias
- Definem missões e recompensas
- Acompanham métricas de engajamento
- Compram créditos para campanhas

### 3. **Administradores** (`admin`)
- Controle total sobre a plataforma
- Gerenciamento de usuários e permissões
- Moderação de conteúdo
- Configuração de rifas e sorteios
- Análise de dados globais

### 4. **Moderadores** (`moderator`)
- Aprovação/rejeição de submissões
- Moderação de conteúdo
- Suporte aos usuários

---

## 🎮 Sistema de Gamificação

### Mecânicas Principais

#### 1. **Sistema de Missões**
- **Tipos de Missão**:
  - `engagement` - Curtidas, comentários, compartilhamentos
  - `content` - Criação de conteúdo (fotos, vídeos)
  - `survey` - Pesquisas e questionários
  - `referral` - Programa de indicações
  - `daily` - Tarefas diárias
  - `participation` - Participação em eventos

#### 2. **Sistema de Recompensas**
- **Pontos/Rifas**: Moeda principal para participação em sorteios
- **Cashback**: Valor em dinheiro real (R$ 5,00 por rifa)
- **Badges**: Conquistas especiais
- **Loot Boxes**: Recompensas surpresa
- **Streaks**: Bônus por consistência

#### 3. **Sistema de Níveis**
- Progressão baseada em atividade
- Desbloqueio de recursos especiais
- Status social na plataforma

---

## 💰 Sistema Financeiro

### Cashback Inteligente
- **Valor fixo**: R$ 5,00 por rifa
- **Limites configuráveis**: 
  - Máximo de participantes por campanha (10-10.000)
  - Máximo de cashbacks por campanha (1-100)
- **Validação automática**: Sistema de elegibilidade
- **Códigos únicos**: SHA para rastreamento

### Sistema de Créditos
- **Compra de créditos**: Anunciantes adquirem créditos via Stripe
- **Pacotes disponíveis**: Diferentes valores com bônus
- **Pagamento seguro**: Integração completa com Stripe
- **Histórico detalhado**: Todas as transações registradas

### Rifas e Sorteios
- **Prêmios diversos**: iPhone, PlayStation, viagens, etc.
- **Participação com rifas**: Obtidas através de missões
- **Sorteios automáticos**: Edge Functions para processamento
- **Transparência total**: Histórico público de ganhadores

---

## 🔧 Funcionalidades Principais

### Para Participantes

#### Dashboard Pessoal
- Visão geral de pontos e recompensas
- Missões disponíveis e em progresso
- Histórico de atividades
- Status de cashback

#### Sistema de Missões
- **Descoberta**: Missões baseadas em interesses
- **Submissão**: Upload de provas (fotos, vídeos, textos)
- **Acompanhamento**: Status em tempo real
- **Recompensas**: Recebimento automático

#### Marketplace de Rifas
- **Rifas ativas**: Visualização de sorteios disponíveis
- **Participação**: Uso de pontos para comprar números
- **Histórico**: Participações anteriores
- **Ganhadores**: Transparência nos resultados

#### Programa de Cashback
- **Saldo disponível**: Visualização em tempo real
- **Resgate**: Conversão de pontos em dinheiro
- **Códigos únicos**: Para validação de cashback
- **Histórico**: Todas as transações

### Para Anunciantes

#### Criação de Campanhas
- **Informações básicas**: Título, descrição, público-alvo
- **Configuração de missões**: Tipos, requisitos, recompensas
- **Segmentação**: Idade, gênero, região, interesses
- **Orçamento**: Definição de custos e limites

#### Gerenciamento
- **Dashboard**: Métricas de performance
- **Moderação**: Aprovação de submissões
- **Análise**: Relatórios detalhados
- **Otimização**: Ajustes em tempo real

#### Sistema de Créditos
- **Compra**: Diferentes pacotes disponíveis
- **Consumo**: Transparência no uso
- **Histórico**: Todas as transações
- **Alertas**: Notificações de saldo baixo

### Para Administradores

#### Gerenciamento de Usuários
- **Listagem completa**: Todos os usuários da plataforma
- **Controle de acesso**: Ativação/desativação de contas
- **Alteração de roles**: Mudança de permissões
- **Criação de usuários**: Novos acessos administrativos

#### Moderação de Conteúdo
- **Fila de aprovação**: Submissões pendentes
- **Ferramentas de moderação**: Aprovação/rejeição
- **Histórico**: Log de todas as ações
- **Escalação**: Sistema de segunda instância

#### Gestão de Rifas
- **Criação**: Novos sorteios e prêmios
- **Configuração**: Datas, valores, regras
- **Sorteios**: Execução automática
- **Ganhadores**: Gestão de prêmios

#### Analytics Avançados
- **Métricas globais**: Performance da plataforma
- **Relatórios**: Dados detalhados por período
- **Insights**: Análise de comportamento
- **Exportação**: Dados para análise externa

---

## 🗄️ Estrutura do Banco de Dados

### Tabelas Principais

#### `profiles`
- Perfis de usuários
- Informações pessoais e configurações
- Saldos de pontos e cashback
- Tipos de usuário e permissões

#### `missions`
- Campanhas e missões criadas
- Configurações de recompensas
- Segmentação de público
- Status e datas

#### `mission_submissions`
- Submissões dos participantes
- Provas enviadas (URLs, textos)
- Status de aprovação
- Histórico de moderação

#### `mission_rewards`
- Recompensas distribuídas
- Pontos e cashback concedidos
- Relação com submissões
- Timestamps de distribuição

#### `lotteries`
- Rifas e sorteios
- Configurações de prêmios
- Datas e status
- Números disponíveis

#### `lottery_participants`
- Participações em rifas
- Números escolhidos
- Pontos utilizados
- Histórico de participações

#### `cashback_campaigns`
- Campanhas de cashback
- Percentuais e limites
- Datas de validade
- Status de ativação

#### `cashback_redemptions`
- Resgates de cashback
- Códigos únicos
- Valores e status
- Histórico de transações

#### `user_badges`
- Badges conquistados
- Tipos e categorias
- Datas de conquista
- Imagens e metadados

#### `loot_box_rewards`
- Recompensas de loot boxes
- Tipos de prêmios
- Raridade e valores
- Histórico de aberturas

---

## 🔌 API e Edge Functions

### Edge Functions Principais

#### `moderate-mission-submission`
- Processamento de submissões
- Validação automática
- Distribuição de recompensas
- Notificações em tempo real

#### `check-raffle-deadlines`
- Verificação de prazos
- Sorteios automáticos
- Notificação de ganhadores
- Atualização de status

#### `purchase-credits`
- Processamento de pagamentos
- Integração com Stripe
- Validação de transações
- Atualização de saldos

#### `referral-system`
- Sistema de indicações
- Códigos únicos
- Recompensas por indicação
- Rastreamento de conversões

#### `admin-lottery-operations`
- Operações administrativas
- Criação e gestão de rifas
- Sorteios manuais
- Relatórios detalhados

### APIs Externas

#### Stripe
- Processamento de pagamentos
- Webhooks para confirmação
- Gestão de assinaturas
- Relatórios financeiros

#### Supabase Realtime
- Atualizações em tempo real
- Notificações push
- Sincronização de dados
- Colaboração em tempo real

---

## 🎨 Design System

### Paleta de Cores
- **Primary**: `#4400b9` (Roxo galáctico)
- **Secondary**: `#fe690d` (Laranja energético)
- **Background**: `#0a0a0a` (Preto espacial)
- **Surface**: `#1a1a2e` (Roxo escuro)

### Componentes Reutilizáveis
- **Atoms**: Botões, inputs, labels
- **Molecules**: Cards, forms, navigation
- **Organisms**: Headers, sidebars, dashboards
- **Templates**: Layouts de página

### Animações
- **Micro-interações**: Hover, click, focus
- **Transições**: Navegação suave
- **Efeitos especiais**: Confetti, particles
- **Loading states**: Skeletons, spinners

---

## 📊 Métricas e Analytics

### KPIs Principais
- **Engajamento**: Taxa de completude de missões
- **Retenção**: Usuários ativos mensais
- **Conversão**: Participantes para anunciantes
- **Satisfação**: NPS e feedback

### Dashboards
- **Participantes**: Progresso pessoal e recompensas
- **Anunciantes**: Performance de campanhas
- **Administradores**: Métricas globais da plataforma

### Relatórios
- **Financeiros**: Receitas e custos
- **Operacionais**: Atividade da plataforma
- **Marketing**: Efetividade das campanhas

---

## 🔐 Segurança e Conformidade

### Autenticação
- **Supabase Auth**: Sistema robusto de autenticação
- **RLS (Row Level Security)**: Controle de acesso granular
- **JWT Tokens**: Autenticação stateless
- **Refresh Tokens**: Renovação automática

### Proteção de Dados
- **LGPD Compliance**: Conformidade com lei brasileira
- **Criptografia**: Dados sensíveis protegidos
- **Audit Logs**: Rastreamento de ações
- **Backup**: Recuperação de dados

### Moderação
- **Filtros automáticos**: Detecção de conteúdo inadequado
- **Moderação humana**: Revisão manual quando necessário
- **Relatórios**: Sistema de denúncias
- **Banimentos**: Controle de usuários problemáticos

---

## 🚀 Fluxos de Negócio

### Fluxo do Participante
1. **Cadastro**: Criação de conta e perfil
2. **Descoberta**: Exploração de missões disponíveis
3. **Participação**: Submissão de provas
4. **Recompensa**: Recebimento de pontos/cashback
5. **Utilização**: Participação em rifas ou resgate

### Fluxo do Anunciante
1. **Registro**: Criação de conta empresarial
2. **Créditos**: Compra de créditos para campanhas
3. **Criação**: Desenvolvimento de campanhas
4. **Lançamento**: Publicação e ativação
5. **Moderação**: Aprovação de submissões
6. **Análise**: Acompanhamento de resultados

### Fluxo Administrativo
1. **Supervisão**: Monitoramento geral da plataforma
2. **Moderação**: Revisão de conteúdo e usuários
3. **Configuração**: Ajustes de sistema e rifas
4. **Relatórios**: Análise de performance
5. **Otimização**: Melhorias baseadas em dados

---

## 🎯 Diferenciais Competitivos

### Inovação
- **Gamificação real**: Recompensas tangíveis
- **Transparência**: Blockchain-like transparency
- **Personalização**: IA para recomendações
- **Tempo real**: Atualizações instantâneas

### Experiência do Usuário
- **Interface intuitiva**: Design centrado no usuário
- **Mobile-first**: Otimizado para dispositivos móveis
- **Acessibilidade**: Inclusivo para todos os usuários
- **Performance**: Carregamento rápido e responsivo

### Tecnologia
- **Arquitetura moderna**: Stack tecnológico atual
- **Escalabilidade**: Preparado para crescimento
- **Confiabilidade**: 99.9% de uptime
- **Segurança**: Padrões enterprise

---

## 📈 Roadmap e Futuro

### Próximas Funcionalidades
- **IA Personalizada**: Recomendações inteligentes
- **Blockchain**: Tokens NFT para conquistas
- **Realidade Aumentada**: Missões imersivas
- **Integração Social**: Compartilhamento nativo

### Expansão
- **Mercados internacionais**: Localização para outros países
- **Parcerias**: Integração com grandes marcas
- **API Pública**: Ecossistema de desenvolvedores
- **White Label**: Soluções para empresas

---

## 🎉 Conclusão

A **PremiAds Gamified Galaxy** representa uma evolução natural do marketing digital, combinando tecnologia de ponta com psicologia comportamental para criar uma experiência única e envolvente. A plataforma não apenas conecta anunciantes e participantes, mas cria um ecossistema sustentável onde todos os stakeholders se beneficiam.

Com sua arquitetura robusta, design centrado no usuário e foco em resultados reais, a PremiAds está posicionada para revolucionar o mercado de publicidade digital no Brasil e além.

---

*Documentação criada com base na análise completa do código-fonte da plataforma PremiAds Gamified Galaxy.* 