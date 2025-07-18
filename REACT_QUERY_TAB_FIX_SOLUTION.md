# Solução para Problema de Invalidação de Queries ao Mudar de Aba

## Problema Identificado

Ao mudar de aba no navegador, o React Query estava invalidando queries mas não conseguia completar as requisições, resultando em:
- Loading infinito
- Nenhuma requisição aparecendo na aba Network
- Estado inconsistente após criar campanhas
- Problema afetando todo o sistema, não apenas campanhas

## Solução Implementada

### 1. **Hook de Gerenciamento de Foco da Janela** (`useWindowFocusManager`)
- Controla quando a janela ganha/perde foco
- Previne refetch automático muito frequente (mínimo 5 segundos entre refetches)
- Cancela requisições pendentes ao perder foco
- Usa AbortController para cancelamento seguro

### 2. **Hook de Query Segura** (`useSafeQuery`)
- Adiciona timeout de 30 segundos por padrão
- Cancela requisições anteriores automaticamente
- Não faz retry em caso de timeout ou abort
- Fornece estado de timeout para melhor UX

### 3. **Hook de Queries Otimizadas para Campanhas** (`useOptimizedCampaignQueries`)
- Gerencia refresh de dados de forma centralizada
- Previne refreshes muito frequentes (mínimo 2 segundos)
- Invalida queries em paralelo para melhor performance
- Fornece funções para reset de cache e prefetch

### 4. **Error Boundary para Queries** (`QueryErrorBoundary`)
- Captura erros de queries não tratados
- Fornece UI amigável para recuperação
- Permite recarregar página ou voltar

### 5. **Configuração Global do React Query**
- `refetchOnWindowFocus: false` - Desabilitado por padrão
- `staleTime: 5 minutos` - Dados considerados frescos por 5 minutos
- `gcTime: 10 minutos` - Cache mantido por 10 minutos

## Como Funciona

1. **Ao mudar de aba:**
   - `useWindowFocusManager` detecta a mudança
   - Cancela qualquer requisição em andamento
   - Previne refetch automático

2. **Ao voltar para a aba:**
   - Verifica tempo desde último foco (mínimo 5 segundos)
   - Se habilitado, executa refetch com delay de 1 segundo
   - Usa AbortController para cancelamento seguro

3. **Durante criação de campanhas:**
   - Usa `safeInvalidateQueries` para invalidação segura
   - Timeout de 20 segundos para prevenir travamento
   - Refresh otimizado apenas de queries ativas

## Benefícios

1. **Performance:** Menos requisições desnecessárias
2. **Estabilidade:** Sem loading infinito ou travamentos
3. **UX:** Feedback claro em caso de timeout
4. **Manutenibilidade:** Código centralizado e reutilizável

## Uso

```typescript
// Em componentes que precisam de controle fino
const { safeInvalidateQueries } = useWindowFocusManager();

// Para queries com timeout
const { data, isLoading, isTimeout } = useSafeQuery({
  queryKey: ['my-data'],
  queryFn: fetchData,
  timeout: 15000, // 15 segundos
  debugLabel: 'MyData'
});

// Para refresh otimizado de campanhas
const { refreshCampaignData } = useOptimizedCampaignQueries();
await refreshCampaignData(true); // force refresh
```

## Próximos Passos

1. Aplicar mesma solução para outros módulos (clientes, admin, etc.)
2. Adicionar métricas de performance
3. Implementar cache persistente opcionalmente
4. Adicionar testes automatizados 