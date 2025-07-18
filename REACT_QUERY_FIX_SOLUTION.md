# Solução: Problema de Invalidação de Dados ao Mudar de Aba

## Problema Identificado

Ao mudar de aba do navegador, os dados dos componentes estavam sendo invalidados e nenhuma requisição era feita para buscá-los novamente. Isso causava a exibição de telas de "Carregando campanhas..." sem que os dados fossem recarregados.

## Causas Principais

1. **Múltiplas instâncias do QueryClient**: A aplicação estava usando tanto `AppProviders` quanto `OptimizedProviders`, cada um criando sua própria instância do QueryClient, causando desconexão no gerenciamento de cache.

2. **Configurações conflitantes de `refetchOnWindowFocus`**: 
   - Configuração global estava como `false`
   - Alguns hooks sobrescreviam com `true`
   - Isso criava comportamento inconsistente

3. **Hook sem React Query**: O `useAdvertiserCampaigns` estava usando `useState` e `useEffect` diretamente ao invés de React Query, perdendo todos os benefícios de cache e sincronização.

4. **Wrapper customizado no Supabase client**: O fetch customizado poderia estar interferindo nas requisições.

## Soluções Implementadas

### 1. Unificação do QueryClient
- Modificado `OptimizedProviders.tsx` para usar a mesma instância compartilhada do QueryClient via `getQueryClient()`
- Removida a criação de nova instância local

### 2. Padronização de refetchOnWindowFocus
- Removido `refetchOnWindowFocus: true` de todos os hooks que sobrescreviam a configuração global
- Adicionado `refetchOnReconnect: false` na configuração global para evitar refetch desnecessário

### 3. Refatoração do useAdvertiserCampaigns
- Migrado de `useState`/`useEffect` para `useQuery` do React Query
- Mantida a subscrição realtime do Supabase integrada com React Query
- Benefícios:
  - Cache automático dos dados
  - Sincronização adequada entre abas
  - Evita múltiplas requisições desnecessárias

### 4. Remoção do fetch wrapper
- Removido o wrapper customizado do Supabase client que adicionava logs
- Mantido apenas o header customizado necessário

## Resultado

Com essas mudanças:
- Os dados permanecem em cache ao mudar de aba
- Não há invalidação desnecessária
- As requisições são feitas apenas quando realmente necessário
- O comportamento é consistente em toda a aplicação

## Configuração Final do QueryClient

```typescript
{
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000,          // 5 minutos
      gcTime: 10 * 60 * 1000,            // 10 minutos
      retry: 3,
      refetchOnWindowFocus: false,        // Desabilitado globalmente
      refetchOnMount: true,
      refetchOnReconnect: false,          // Desabilitado
    },
    mutations: {
      retry: 1,
    },
  },
}
``` 