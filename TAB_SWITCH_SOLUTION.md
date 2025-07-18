# Solução Completa para Problema de Mudança de Aba

## O Problema

Quando o usuário mudava de aba no navegador e voltava, as queries do React Query:
1. Mostravam estado de loading infinito
2. Não faziam requisições (nada aparecia na aba Network)
3. Só funcionavam após um hard refresh (F5)
4. Problema afetava todas as páginas do sistema

## Causa Raiz

O React Query estava com `refetchOnWindowFocus: false` mas as queries ainda eram marcadas como "stale" quando a janela perdia foco. Ao voltar, as queries ficavam em um estado inconsistente onde precisavam ser refetchadas mas não eram devido à configuração.

## Solução Implementada

### 1. **Configuração Inteligente do React Query** (`src/lib/query-client.ts`)

```typescript
// Gerenciamento customizado de foco
function setupFocusHandling() {
  let lastFocusTime = Date.now()
  let isHandlingFocus = false
  
  focusManager.setEventListener((handleFocus) => {
    // Previne refetch muito frequente (mínimo 3 segundos)
    // Usa visibilitychange como evento principal
    // Adiciona delay de 100ms para estabilizar
  })
}

// Configurações otimizadas
queries: {
  staleTime: 5 * 60 * 1000, // 5 minutos
  refetchOnWindowFocus: (query) => query.state.dataUpdateCount > 0,
  refetchOnMount: (query) => query.state.dataUpdateCount > 0,
  refetchOnReconnect: 'always',
  networkMode: 'online'
}
```

### 2. **Hook de Debug** (`src/hooks/core/useQueryDebugger.ts`)

Monitora o estado das queries em tempo real:
- Total de queries no cache
- Status de cada query (fetching, stale, error)
- Eventos de visibilidade e foco

### 3. **Gerenciador Global de Refetch** (`src/hooks/core/useGlobalRefetchManager.ts`)

Força refetch quando necessário:
- Detecta quando a aba volta a ficar visível
- Identifica queries que precisam ser refetchadas
- Executa refetch em lote com delay de estabilização
- Monitora mudanças de rota

### 4. **Hook Seguro para Queries** (`src/hooks/core/useSafeQuery.ts`)

Melhorias aplicadas:
- Não aborta requisições válidas
- Gerencia AbortController corretamente
- Timeout configurável (60s para campanhas)
- Não faz retry em erros de abort

### 5. **Hook Otimizado para Campanhas** (`src/hooks/advertiser/useOptimizedCampaignQueries.ts`)

- Previne refreshes muito frequentes
- Invalida queries em paralelo
- Fornece controle fino sobre cache

## Como Funciona Agora

1. **Usuário muda de aba:**
   - focusManager detecta mudança via `visibilitychange`
   - Não cancela requisições ativas
   - Marca tempo da última mudança

2. **Usuário volta para a aba:**
   - Verifica se passou tempo mínimo (3 segundos)
   - GlobalRefetchManager identifica queries stale/sem dados
   - Executa refetch apenas das queries necessárias
   - Aguarda 500ms para estabilizar antes do refetch

3. **Mudança de rota:**
   - GlobalRefetchManager detecta mudança
   - Verifica queries stale após 100ms
   - Força refetch se necessário

## Benefícios

1. **Sem loading infinito** - Queries sempre completam ou fazem timeout
2. **Refetch inteligente** - Apenas quando realmente necessário
3. **Performance otimizada** - Sem requisições desnecessárias
4. **Debug facilitado** - Logs detalhados do estado das queries
5. **Experiência consistente** - Funciona em todas as páginas

## Monitoramento

Com o debug ativado, você verá logs como:
```
[RefetchManager] Tab became visible, checking queries...
[RefetchManager] Found 3 queries that need refetch
[RefetchManager] Refetching: ['advertiser-campaigns', 'user-id']
```

## Próximos Passos

1. Monitorar logs em produção
2. Ajustar timeouts conforme necessário
3. Considerar cache persistente para dados críticos
4. Adicionar métricas de performance 