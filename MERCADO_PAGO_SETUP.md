# Configuração Mercado Pago - Produção

## 1. Variáveis de Ambiente Necessárias

Configure as seguintes variáveis no Supabase Dashboard -> Project Settings -> Edge Functions:

```bash
# Token de acesso do Mercado Pago (Produção)
MERCADO_PAGO_ACCESS_TOKEN=APP_USR-seu-access-token-de-producao

# URL do webhook para notificações (opcional)
MERCADO_PAGO_WEBHOOK_URL=https://zfryjwaeojccskfiibtq.supabase.co/functions/v1/mercado-pago-webhook
```

## 2. Como Obter o Access Token

1. Acesse: https://www.mercadopago.com.br/developers/panel
2. Selecione sua aplicação ou crie uma nova
3. Vá em "Credenciais"
4. Copie o "Access Token" de **PRODUÇÃO** (não sandbox)
5. Configure no Supabase usando:

```bash
npx supabase secrets set MERCADO_PAGO_ACCESS_TOKEN=APP_USR-seu-token --project-ref zfryjwaeojccskfiibtq
```

## 3. Assinatura Secreta (Webhook Security) 🔐

### **O que é a Assinatura Secreta?**
A assinatura secreta (`56c7253affef2126e4d938c022093b839534df6b8f72cf806a5df5e80dad54c`) é uma chave de segurança que o Mercado Pago usa para:

- ✅ **Verificar autenticidade** dos webhooks 
- ✅ **Prevenir ataques** de webhooks falsos
- ✅ **Garantir integridade** dos dados

### **Como funciona?**
1. Mercado Pago **assina** cada webhook com essa chave
2. Envia a assinatura no header `x-signature`
3. Sua aplicação **verifica** se é autêntica antes de processar

### **Configuração:**

```bash
# Para ambiente de teste (use a assinatura que aparece na sua tela)
supabase secrets set MERCADO_PAGO_WEBHOOK_SECRET_TEST=56c7253affef2126e4d938c022093b839534df6b8f72cf806a5df5e80dad54c --project-ref zfryjwaeojccskfiibtq

# Para produção (quando ativar, vai ter uma assinatura diferente)
supabase secrets set MERCADO_PAGO_WEBHOOK_SECRET_PROD=sua-assinatura-de-producao --project-ref zfryjwaeojccskfiibtq
```

## 4. Configuração das Edge Functions 

✅ **Funções deployadas para produção:**

- `purchase-credits`: Atualizada com integração real do Mercado Pago
- `mercado-pago-webhook`: Nova função para confirmação automática

## 4. Configuração no Dashboard Mercado Pago

### 4.1 Configurar Webhook (OBRIGATÓRIO)

1. No painel do Mercado Pago, vá em **Webhooks**
2. Crie um novo webhook com:
   - **URL**: `https://zfryjwaeojccskfiibtq.supabase.co/functions/v1/mercado-pago-webhook`
   - **Eventos**: Selecione apenas `payment` 
   - **Versão da API**: v1

### 4.2 Configurar Aplicação

1. Vá em **Suas integrações** > **Detalhes da aplicação**
2. Configure as **URLs de redirecionamento** se necessário
3. Anote o **App ID** para referência

## 5. Deploy e Teste da Integração

### 5.1 Configurar variáveis de ambiente

```bash
# Configure o token de produção (OBRIGATÓRIO)
supabase secrets set MERCADO_PAGO_ACCESS_TOKEN=APP_USR-seu-token-de-producao --project-ref zfryjwaeojccskfiibtq

# Configure a assinatura secreta para teste (OPCIONAL mas RECOMENDADO)
supabase secrets set MERCADO_PAGO_WEBHOOK_SECRET_TEST=56c7253affef2126e4d938c022093b839534df6b8f72cf806a5df5e80dad54c --project-ref zfryjwaeojccskfiibtq

# Configure a assinatura secreta para produção (quando ativar produção)
supabase secrets set MERCADO_PAGO_WEBHOOK_SECRET_PROD=sua-assinatura-de-producao --project-ref zfryjwaeojccskfiibtq
```

### 5.2 Teste completo

1. Acesse sua aplicação em produção
2. Vá para `/anunciante/creditos`
3. Selecione um método de pagamento do Mercado Pago
4. Complete uma compra de teste
5. Verifique se as rifas foram creditadas automaticamente

## 6. Diferenças por Ambiente

### 🔧 Desenvolvimento (sem MERCADO_PAGO_ACCESS_TOKEN)
- ✅ Usa sistema mock integrado
- ✅ Redireciona para página de simulação
- ✅ Não consome APIs reais

### 🚀 Produção (com MERCADO_PAGO_ACCESS_TOKEN)
- ✅ Integração real com API do Mercado Pago
- ✅ Confirmação automática via webhook
- ✅ Suporte completo a PIX, Cartão de Crédito e Boleto
- ✅ URLs de retorno configuradas
- ✅ Metadata completa para rastreamento

## 7. Logs e Monitoramento

- **Edge Functions**: Supabase Dashboard → Project → Edge Functions → Logs
- **Mercado Pago**: Mercado Pago Dashboard → Webhooks → Logs
- **Atividade**: Mercado Pago Dashboard → Atividade da conta 