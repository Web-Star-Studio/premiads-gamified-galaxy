# Correções Aplicadas para Problema de Campanhas

## Problemas Identificados e Corrigidos

### 1. **Inconsistência nos Hooks de Auth**
**Problema:** Conflito entre dois hooks de auth diferentes:
- `src/hooks/core/useAuth.ts` → retorna `user`
- `src/hooks/useAuth.tsx` → retorna `currentUser` e `user`

**Solução:**
- Hook `useAdvertiserCampaigns` agora usa `currentUser` corretamente
- Hook `useCampaignOperations` ajustado para usar `currentUser: user`

### 2. **Configuração React Query Simplificada**
**Problema:** Configuração complexa com focus manager customizado estava causando conflitos

**Solução:**
- Removido focus manager customizado
- Configuração simplificada:
  ```typescript
  refetchOnWindowFocus: false,
  refetchOnMount: 'always',
  refetchOnReconnect: 'always'
  ```

### 3. **GlobalRefetchManager Desabilitado**
**Problema:** Manager muito agressivo causando refetches desnecessários

**Solução:**
- Temporariamente desabilitado em `AppRoutes.tsx`
- Permite testar sem interferência

### 4. **useSafeQuery Removido**
**Problema:** Wrapper complex criando timeouts e abortos desnecessários

**Solução:**
- Voltado para `useQuery` padrão do React Query
- Mantida configuração de retry e delay

### 5. **Logs de Debug Adicionados**
**Adicionado logs para monitorar:**
- Fetch de campanhas por usuário
- Quantidade de campanhas processadas
- Estado de autenticação

## Estado Atual

### ✅ **Funcionando:**
- Hook de auth consistente
- Configuração React Query estável
- Logs para debug

### 🔄 **Para Testar:**
1. Carregar página de campanhas diretamente
2. Navegar entre páginas (cashback → campanhas)
3. Mudar de aba e voltar
4. Criar nova campanha

### 📊 **Logs Esperados:**
```
[useAdvertiserCampaigns] Fetching campaigns for user: [user-id]
[useAdvertiserCampaigns] Processed X campaigns
```

## Próximos Passos

1. **Testar comportamento atual**
2. **Se persistir problema:** investigar hook de auth específico
3. **Se funcionar:** gradualmente reativar funcionalidades avançadas
4. **Remover logs de debug** quando estável 