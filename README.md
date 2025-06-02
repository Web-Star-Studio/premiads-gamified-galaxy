# Welcome to your Lovable project

## Project info

**URL**: https://lovable.dev/projects/43f95959-1845-4560-ad90-db39c1e71b35

## How can I edit this code?

There are several ways of editing your application.

**Use Lovable**

Simply visit the [Lovable Project](https://lovable.dev/projects/43f95959-1845-4560-ad90-db39c1e71b35) and start prompting.

Changes made via Lovable will be committed automatically to this repo.

**Use your preferred IDE**

If you want to work locally using your own IDE, you can clone this repo and push changes. Pushed changes will also be reflected in Lovable.

The only requirement is having Node.js & npm installed - [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)

Follow these steps:

```sh
# Step 1: Clone the repository using the project's Git URL.
git clone <YOUR_GIT_URL>

# Step 2: Navigate to the project directory.
cd <YOUR_PROJECT_NAME>

# Step 3: Install the necessary dependencies.
npm i

# Step 4: Start the development server with auto-reloading and an instant preview.
npm run dev
```

**Edit a file directly in GitHub**

- Navigate to the desired file(s).
- Click the "Edit" button (pencil icon) at the top right of the file view.
- Make your changes and commit the changes.

**Use GitHub Codespaces**

- Navigate to the main page of your repository.
- Click on the "Code" button (green button) near the top right.
- Select the "Codespaces" tab.
- Click on "New codespace" to launch a new Codespace environment.
- Edit files directly within the Codespace and commit and push your changes once you're done.

## What technologies are used for this project?

This project is built with:

- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS

## How can I deploy this project?

Simply open [Lovable](https://lovable.dev/projects/43f95959-1845-4560-ad90-db39c1e71b35) and click on Share -> Publish.

## Can I connect a custom domain to my Lovable project?

Yes, you can!

To connect a domain, navigate to Project > Settings > Domains and click Connect Domain.

Read more here: [Setting up a custom domain](https://docs.lovable.dev/tips-tricks/custom-domain#step-by-step-guide)

# PremiAds Gamified Galaxy

Sistema gamificado de marketing e engajamento para o PremiAds.

## Recursos

- Sistema de missões gamificadas
- Programa de referência e fidelidade
- Dashboard de analytics para anunciantes
- Sistema de níveis e conquistas
- Marketplace de rifas
- **Sistema de Cashback Inteligente**

## Sistema de Cashback

### Funcionalidades Implementadas

#### 1. Controles de Criação de Campanha
- **Máximo de Participantes**: Controle slider para limitar quantos usuários podem participar da campanha (10-10.000)
- **Máximo de Cashbacks**: Controle slider para limitar quantos cashbacks podem ser resgatados por campanha (1-100)
- **Valor do Cashback**: Valor fixo de **R$ 5,00** por rifa (não configurável pelo anunciante)

#### 2. Lógica de Atribuição
- **Proporção**: 1 rifa = R$ 5,00 de cashback (valor fixo)
- **Limite por missão**: Cada missão tem um limite máximo de cashbacks disponíveis
- **Limite por usuário**: Cada usuário pode resgatar apenas 1 cashback por missão completada

#### 3. Banco de Dados
Novos campos adicionados à tabela `missions`:
- `max_participants`: INTEGER DEFAULT 100
- `max_cashback_redemptions`: INTEGER DEFAULT 20  
- `cashback_amount_per_raffle`: NUMERIC(10,2) DEFAULT 5.00 (valor fixo)

#### 4. Edge Function
Função `cashback-manager` implementada para:
- Verificar disponibilidade de cashbacks
- Validar elegibilidade do usuário
- Calcular valor baseado na fórmula: `pontos × R$ 5,00`
- Gerar código único de resgate
- Criar registro na tabela `cashback_redemptions`

#### 5. Interface do Usuário
- Cards informativos sobre o sistema
- Controles intuitivos com sliders e inputs numéricos
- Validação em tempo real dos limites
- Feedback visual com cores diferenciadas
- **Valor fixo de R$ 5,00** por rifa claramente informado

### Como Usar

1. **Criar Campanha**: Na página de criação de campanhas, configure:
   - Pontos da missão (que se tornam rifas)
   - Máximo de participantes
   - Máximo de cashbacks disponíveis
   - Valor automático: R$ 5,00 por rifa

2. **Processamento Automático**: Quando um usuário completa uma missão:
   - O sistema verifica automaticamente a elegibilidade
   - Calcula o valor do cashback: pontos × R$ 5,00
   - Cria um código de resgate único
   - Registra na tabela de cashbacks

### Configuração de Interesses

Sistema atualizado com todos os interesses do painel do participante:
- Esportes, Comida, Lazer, Moda, Beleza
- Educação, Jogos, Restaurantes, Eventos
- Turismo, Tecnologia, Saúde, Finanças, Arte e Cultura

## Tecnologias

- React + TypeScript + Vite
- Tailwind CSS + Shadcn/UI  
- Supabase (Database + Edge Functions)
- Framer Motion
- React Router
- React Query
