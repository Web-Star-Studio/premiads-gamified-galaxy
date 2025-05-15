# Funções Edge do Supabase

Este diretório contém as funções Edge do Supabase para processar pagamentos e outras operações.

## Configuração de Variáveis de Ambiente

### Método 1: Usando o CLI do Supabase

Para configurar as variáveis de ambiente necessárias usando o CLI do Supabase:

```bash
# Instalar o CLI do Supabase (se ainda não tiver instalado)
npm install -g supabase

# Fazer login no Supabase
supabase login

# Configurar as variáveis de ambiente para o projeto
supabase secrets set STRIPE_SECRET_KEY="sua_chave_secreta_do_stripe"
supabase secrets set STRIPE_WEBHOOK_SECRET="sua_chave_secreta_de_webhook"
```

### Método 2: Usando o Dashboard do Supabase

Se tiver problemas com o CLI, você pode configurar as variáveis de ambiente manualmente no Dashboard do Supabase:

1. Acesse o [Dashboard do Supabase](https://app.supabase.io)
2. Selecione seu projeto
3. Vá para "Settings" > "API"
4. Role para baixo até "Environment Variables"
5. Adicione as seguintes variáveis:
   - `STRIPE_SECRET_KEY`: sua chave secreta do Stripe
   - `STRIPE_WEBHOOK_SECRET`: sua chave secreta de webhook do Stripe

### Variáveis de Ambiente Necessárias

- **Supabase**: Estas são configuradas automaticamente pelo Supabase
  - `SUPABASE_URL`
  - `SUPABASE_SERVICE_ROLE_KEY`
  - `SUPABASE_ANON_KEY`

- **Stripe**:
  - `STRIPE_SECRET_KEY`: Chave secreta da API do Stripe
  - `STRIPE_WEBHOOK_SECRET`: Chave secreta para validar webhooks do Stripe

## Estrutura de Arquivos

- `_shared/`: Contém código compartilhado entre as funções
  - `config.ts`: Configuração centralizada para acesso seguro às variáveis de ambiente
  - `cors.ts`: Configuração de CORS para as funções Edge

- `purchase-credits/`: Função para processar a compra de créditos
- `confirm-payment/`: Função para confirmar pagamentos (via webhook ou manualmente)

## Desenvolvimento Local

Para desenvolver localmente:

```bash
# Iniciar o emulador do Supabase
supabase start

# Executar as funções localmente
supabase functions serve --no-verify-jwt
```

## Implantação

Para implantar as funções:

```bash
# Implantar todas as funções
supabase functions deploy --no-verify-jwt

# Implantar uma função específica
supabase functions deploy purchase-credits --no-verify-jwt
```

## Segurança

- **NUNCA** inclua chaves secretas diretamente no código
- Sempre use variáveis de ambiente para armazenar chaves secretas
- Use o sistema de segredos do Supabase para gerenciar as variáveis de ambiente 