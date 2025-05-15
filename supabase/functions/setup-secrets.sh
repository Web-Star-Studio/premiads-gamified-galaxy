#!/bin/bash

# Script para configurar segredos no Supabase Edge Functions
# Este script ajuda a configurar as variáveis de ambiente necessárias para as funções Edge

# Cores para melhor visualização
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${YELLOW}Configurando segredos para as funções Edge do Supabase...${NC}"

# Verificar se o CLI do Supabase está instalado
if ! command -v supabase &> /dev/null
then
    echo -e "${RED}O CLI do Supabase não está instalado. Por favor, instale-o primeiro:${NC}"
    echo "npm install -g supabase"
    exit 1
fi

# Verificar se o usuário está logado no Supabase
echo -e "${YELLOW}Verificando login no Supabase...${NC}"
supabase projects list &> /dev/null
if [ $? -ne 0 ]; then
    echo -e "${RED}Você não está logado no Supabase. Por favor, faça login:${NC}"
    echo "supabase login"
    exit 1
fi

echo -e "${GREEN}Login verificado com sucesso!${NC}"

# Solicitar as chaves do Stripe
echo -e "${YELLOW}Por favor, forneça as seguintes informações:${NC}"
echo ""

read -p "Stripe Secret Key (sk_test_...): " STRIPE_SECRET_KEY
read -p "Stripe Webhook Secret (whsec_...): " STRIPE_WEBHOOK_SECRET

# Confirmar os valores
echo ""
echo -e "${YELLOW}Por favor, confirme os valores:${NC}"
echo "STRIPE_SECRET_KEY: ${STRIPE_SECRET_KEY}"
echo "STRIPE_WEBHOOK_SECRET: ${STRIPE_WEBHOOK_SECRET}"
echo ""

read -p "Os valores estão corretos? (s/n): " CONFIRM

if [[ $CONFIRM != "s" && $CONFIRM != "S" ]]; then
    echo -e "${RED}Configuração cancelada.${NC}"
    exit 1
fi

# Configurar os segredos no Supabase
echo -e "${YELLOW}Configurando segredos no Supabase...${NC}"

supabase secrets set STRIPE_SECRET_KEY=$STRIPE_SECRET_KEY
if [ $? -ne 0 ]; then
    echo -e "${RED}Erro ao configurar STRIPE_SECRET_KEY.${NC}"
    exit 1
fi

supabase secrets set STRIPE_WEBHOOK_SECRET=$STRIPE_WEBHOOK_SECRET
if [ $? -ne 0 ]; then
    echo -e "${RED}Erro ao configurar STRIPE_WEBHOOK_SECRET.${NC}"
    exit 1
fi

echo -e "${GREEN}Segredos configurados com sucesso!${NC}"
echo ""
echo -e "${YELLOW}Agora você pode implantar as funções Edge:${NC}"
echo "supabase functions deploy --no-verify-jwt"
echo ""
echo -e "${YELLOW}Ou implantar uma função específica:${NC}"
echo "supabase functions deploy purchase-credits --no-verify-jwt"
echo "supabase functions deploy confirm-payment --no-verify-jwt" 