#!/bin/bash

# Script para verificar a presença de segredos em arquivos de código
# Este script ajuda a identificar possíveis chaves secretas expostas

# Cores para melhor visualização
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${YELLOW}Verificando arquivos para possíveis segredos expostos...${NC}"

# Diretórios para verificar
DIRECTORIES=("supabase/functions")

# Padrões de segredos a procurar
PATTERNS=(
  "sk_test_[a-zA-Z0-9]+"      # Stripe Secret Key
  "sk_live_[a-zA-Z0-9]+"      # Stripe Live Secret Key
  "whsec_[a-zA-Z0-9]+"        # Stripe Webhook Secret
  "rk_test_[a-zA-Z0-9]+"      # Stripe Restricted Key
  "rk_live_[a-zA-Z0-9]+"      # Stripe Live Restricted Key
)

# Contadores
SECRETS_FOUND=0
FILES_CHECKED=0

# Percorre os diretórios
for dir in "${DIRECTORIES[@]}"; do
  echo -e "${YELLOW}Verificando diretório: ${dir}${NC}"
  
  # Encontra todos os arquivos .ts, .js, .json, etc.
  FILES=$(find "$dir" -type f -name "*.ts" -o -name "*.js" -o -name "*.json" -o -name "*.md" | grep -v "node_modules")
  
  for file in $FILES; do
    ((FILES_CHECKED++))
    
    # Procura por padrões de segredos
    for pattern in "${PATTERNS[@]}"; do
      MATCHES=$(grep -E "$pattern" "$file" | grep -v "<[A-Z_]+>" | wc -l)
      
      if [ "$MATCHES" -gt 0 ]; then
        echo -e "${RED}Segredo encontrado em: ${file}${NC}"
        echo -e "  Padrão: ${pattern}"
        echo -e "  Linhas encontradas: ${MATCHES}"
        grep -n -E "$pattern" "$file" | grep -v "<[A-Z_]+>"
        echo ""
        ((SECRETS_FOUND++))
      fi
    done
  done
done

# Resumo
echo -e "${YELLOW}Resumo da verificação:${NC}"
echo -e "Arquivos verificados: ${FILES_CHECKED}"

if [ "$SECRETS_FOUND" -eq 0 ]; then
  echo -e "${GREEN}Nenhum segredo encontrado! 🎉${NC}"
else
  echo -e "${RED}Segredos encontrados: ${SECRETS_FOUND}${NC}"
  echo -e "${YELLOW}Por favor, remova estes segredos e substitua por variáveis de ambiente.${NC}"
  echo -e "Exemplo: getEnv('STRIPE_SECRET_KEY') em vez de hardcoding."
fi

# Verifica se o git filter para segredos está configurado
if git config --get filter.secrets.clean > /dev/null; then
  echo -e "${GREEN}Filtro git para segredos está configurado.${NC}"
else
  echo -e "${YELLOW}Filtro git para segredos não está configurado. Configurando agora...${NC}"
  git config --local filter.secrets.clean "sed -e 's/sk_test_[a-zA-Z0-9]*/<STRIPE_SECRET_KEY>/g' -e 's/whsec_[a-zA-Z0-9]*/<STRIPE_WEBHOOK_SECRET>/g'"
  echo -e "${GREEN}Filtro git configurado com sucesso!${NC}"
fi 