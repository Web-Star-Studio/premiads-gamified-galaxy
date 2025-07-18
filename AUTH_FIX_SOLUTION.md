# Solução: Erro de Autenticação no useAdvertiserCampaigns

## Problema Identificado

O hook `useAdvertiserCampaigns` estava retornando o erro "Usuário não autenticado" e não conseguia buscar as campanhas cadastradas.

## Causa Raiz

O problema estava na importação incorreta do hook de autenticação:
- **Usado incorretamente**: `import { useAuth } from "@/hooks/core/useAuth"`
- **Correto**: `import { useAuth } from "@/hooks/useAuth"`

A aplicação possui dois hooks `useAuth` diferentes:
1. `@/hooks/core/useAuth` - Hook baseado em Zustand store
2. `@/hooks/useAuth` - Hook baseado em Context API (usado pela aplicação)

## Diferenças entre os hooks

### Hook incorreto (`core/useAuth`):
```typescript
// Retorna:
{
  user: User | null,
  isAuthenticated: boolean,
  isLoading: boolean,
  // ...
}
```

### Hook correto (`useAuth`):
```typescript
// Retorna:
{
  currentUser: User | null,  // Note: currentUser, não user!
  user: User | null,
  isAuthenticated: boolean,
  isLoading: boolean,
  // ...
}
```

## Solução Implementada

1. **Corrigida a importação** para usar o hook correto
2. **Atualizado o código** para usar `currentUser` ao invés de `user`
3. **Adicionada proteção** para não executar a query quando não há usuário autenticado
4. **Melhorada a condição `enabled`** para aguardar o carregamento da autenticação

## Resultado

Com essas correções:
- O hook aguarda a autenticação ser carregada antes de tentar buscar campanhas
- Usa o contexto de autenticação correto compartilhado pela aplicação
- As campanhas são carregadas corretamente quando o usuário está autenticado

## Verificação

Para confirmar que está funcionando:
1. Faça login como anunciante
2. Navegue para a página de campanhas
3. As campanhas cadastradas devem aparecer
4. Não deve haver erros de "Usuário não autenticado" no console 