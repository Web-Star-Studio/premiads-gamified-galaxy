# Configuração de Segurança para Funções Edge

Este documento descreve as alterações feitas para proteger chaves secretas nas funções Edge do Supabase e os passos necessários para completar a implementação.

## Alterações Realizadas

1. **Criação de Arquivos de Configuração Centralizados**:
   - `supabase/functions/_shared/config.ts`: Gerencia todas as variáveis de ambiente
   - `supabase/functions/_shared/cors.ts`: Centraliza a configuração de CORS

2. **Remoção de Chaves Secretas do Código**:
   - Removidas chaves secretas do Stripe dos arquivos de funções Edge
   - Código atualizado para usar variáveis de ambiente com fallbacks seguros

3. **Documentação e Ferramentas**:
   - `supabase/functions/README.md`: Instruções detalhadas sobre como configurar e implantar
   - `supabase/functions/setup-secrets.sh`: Script para facilitar a configuração de segredos

4. **Configuração de Segurança do Git**:
   - `.gitattributes`: Configuração para filtrar segredos dos arquivos
   - Configuração de filter.secrets para limpar chaves do Stripe

## Passos para Completar a Implementação

### 1. Resolver Problemas de GitHub Push Protection

O GitHub está detectando chaves secretas em commits anteriores. Para resolver isso, você tem duas opções:

**Opção 1: Permitir os Segredos Detectados**
1. Acesse o link fornecido pelo GitHub para permitir o segredo:
   https://github.com/Web-Star-Studio/premiads-gamified-galaxy/security/secret-scanning/unblock-secret/2x9AUCn0ztGtT0uyCX4r8lxNYlJ
2. Marque o segredo como "falso positivo" ou "usado em testes"
3. Depois disso, você poderá enviar os commits

**Opção 2: Ativar Secret Scanning no Repositório**
1. Acesse as configurações do repositório: https://github.com/Web-Star-Studio/premiads-gamified-galaxy/settings/security_analysis
2. Ative a opção "Secret Scanning"
3. Marque os segredos detectados como seguros
4. Depois disso, você poderá enviar os commits

### 2. Configurar Segredos no Ambiente do Supabase

Depois de resolver o problema com o GitHub, você precisa configurar os segredos no ambiente do Supabase:

1. Instale o CLI do Supabase (se ainda não tiver instalado):
   ```bash
   npm install -g supabase
   ```

2. Faça login no Supabase:
   ```bash
   supabase login
   ```

3. Execute o script de configuração de segredos:
   ```bash
   ./supabase/functions/setup-secrets.sh
   ```

4. Siga as instruções do script para configurar:
   - `STRIPE_SECRET_KEY`
   - `STRIPE_WEBHOOK_SECRET`

5. Implante as funções Edge:
   ```bash
   supabase functions deploy --no-verify-jwt
   ```

### 3. Configurar Webhooks do Stripe

Para que as confirmações de pagamento funcionem corretamente, configure o webhook do Stripe:

1. Acesse o Dashboard do Stripe: https://dashboard.stripe.com/webhooks
2. Adicione um novo endpoint de webhook apontando para sua função Edge:
   ```
   https://[seu-projeto].supabase.co/functions/v1/confirm-payment
   ```
3. Adicione os seguintes eventos:
   - `checkout.session.completed`
   - `payment_intent.payment_failed`
4. Copie a chave de assinatura do webhook e configure-a como um segredo:
   ```bash
   supabase secrets set STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret
   ```

## Boas Práticas de Segurança

- **NUNCA** inclua chaves secretas diretamente no código
- Sempre use variáveis de ambiente para armazenar chaves secretas
- Implemente rotação regular de chaves
- Mantenha as permissões do Supabase Service Role restritas ao necessário
- Faça revisões de segurança regulares no código 