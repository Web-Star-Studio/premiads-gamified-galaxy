# Implementação de Validação de Cupons de Cashback

## Visão Geral

Esta funcionalidade permite que anunciantes validem cupons de cashback apresentados pelos clientes, marcando-os como utilizados para evitar uso duplo. O sistema oferece uma interface completa no painel do anunciante para validação em tempo real.

## Arquitetura da Solução

### 1. Função de Banco de Dados

**Arquivo**: `supabase/migrations/20241201000002_create_coupon_validation_function.sql`

```sql
CREATE OR REPLACE FUNCTION validate_cashback_coupon(
  p_sha_code TEXT,
  p_advertiser_id UUID
)
RETURNS TABLE (
  success BOOLEAN,
  message TEXT,
  token_data JSONB
)
```

**Validações realizadas**:
- ✅ Verifica se o cupom existe
- ✅ Confirma se não está expirado
- ✅ Verifica se não foi usado anteriormente
- ✅ Confirma que está ativo
- ✅ Valida se o anunciante possui permissão (própria campanha)
- ✅ Atualiza status para "usado" se válido

### 2. API de Validação

**Arquivo**: `src/hooks/cashback/cashbackApi.ts`

```typescript
export const validateCashbackCoupon = async (shaCode: string): Promise<{
  success: boolean;
  message: string;
  tokenData?: any;
}>
```

**Funcionalidades**:
- Validação de autenticação
- Chamada para função do banco via RPC
- Tratamento de erros robusto
- Retorno estruturado de resultados

### 3. Interface do Anunciante

**Arquivo**: `src/pages/advertiser/CouponValidationPage.tsx`

**Características**:
- ✅ Input com validação de formato SHA (7 letras + 3 dígitos)
- ✅ Botão de validação com loading state
- ✅ Exibição de resultados com feedback visual
- ✅ Detalhes do cupom quando válido
- ✅ Instruções de uso
- ✅ Interface responsiva
- ✅ Tema consistente com o sistema

## Fluxo de Validação

### 1. Entrada do Anunciante
```
Cliente apresenta código → Anunciante digita → Clica "Validar"
```

### 2. Validação no Frontend
```
Formato correto? → Autenticado? → Chama API
```

### 3. Processamento no Backend
```
Cupom existe? → Não expirado? → Não usado? → Ativo? → Permissão? → Marca como usado
```

### 4. Resposta ao Anunciante
```
Sucesso: Aplicar desconto → Erro: Mostrar motivo
```

## Integração com Menu

### Arquivo: `src/components/advertiser/AdvertiserSidebar.tsx`

```typescript
{
  title: "Validação de Cupom",
  url: "/anunciante/validacao-cupom",
  icon: CheckSquare,
}
```

### Arquivo: `src/routes/AdvertiserRoutes.tsx`

```typescript
<Route path="validacao-cupom" element={
  <RouteGuard>
    <Suspense fallback={<RouteLoadingSpinner />}>
      <CouponValidationPage />
    </Suspense>
  </RouteGuard>
} />
```

## Casos de Uso

### ✅ Validação Bem-Sucedida
```
Input: ABCDEFG025
Output: Sucesso - Cupom validado, aplicar 25% desconto
```

### ❌ Cupom Não Encontrado
```
Input: INVALID123
Output: Erro - Cupom não encontrado. Verifique o código.
```

### ❌ Cupom Já Usado
```
Input: USEDCUP123
Output: Erro - Cupom já foi utilizado anteriormente.
```

### ❌ Cupom Expirado
```
Input: EXPIRED025
Output: Erro - Cupom expirado. Este cupom não pode mais ser usado.
```

### ❌ Sem Permissão
```
Input: OTHERAD050
Output: Erro - Você não tem permissão para validar este cupom.
```

## Segurança

### 1. Autenticação
- Verifica se o usuário está logado
- Valida se é um anunciante

### 2. Autorização
- Apenas anunciantes da campanha podem validar cupons
- RLS (Row Level Security) aplicado

### 3. Validação de Dados
- Formato SHA rigorosamente validado
- Sanitização de inputs
- Prevenção de ataques de injeção

### 4. Auditoria
- Logs de validação no console
- Timestamp de atualização no banco
- Histórico de status preservado

## Estados do Cupom

### `ativo`
- Cupom criado e pronto para uso
- Pode ser validado e usado

### `usado`
- Cupom foi validado por um anunciante
- Não pode ser usado novamente

### `expirado`
- Cupom passou da data de validade
- Não pode ser usado

## Interface de Usuário

### Componentes Principais

1. **Campo de Input**
   - Formato automático em maiúsculas
   - Limite de 10 caracteres
   - Placeholder explicativo

2. **Botão de Validação**
   - Loading state durante processamento
   - Desabilitado quando input vazio
   - Feedback visual imediato

3. **Área de Resultados**
   - Alert colorido por tipo (sucesso/erro)
   - Card com detalhes do cupom
   - Botão para nova validação

4. **Instruções**
   - Passo a passo de uso
   - Alertas importantes
   - Formato esperado

### Responsividade
- Layout adaptável mobile/desktop
- Sidebar colapsável em mobile
- Botões otimizados para touch

## Testes

### Para testar a funcionalidade:

1. **Aplicar migrações**:
   ```bash
   supabase migration apply 20241201000002_create_coupon_validation_function
   ```

2. **Criar cupom de teste**:
   - Resgatar cashback em `/cliente/cashback`
   - Anotar código SHA gerado

3. **Testar validação**:
   - Acessar `/anunciante/validacao-cupom`
   - Inserir código e validar
   - Verificar mudança de status

4. **Testar casos de erro**:
   - Código inválido
   - Cupom já usado
   - Cupom de outro anunciante

## Futuras Melhorias

### 1. Histórico de Validações
- Lista de cupons validados
- Filtros por data/status
- Exportação de relatórios

### 2. Validação em Lote
- Upload de lista de códigos
- Validação múltipla
- Resultados em CSV

### 3. Notificações
- Alert para cliente quando cupom usado
- Email de confirmação
- Push notifications

### 4. Analytics
- Métricas de uso de cupons
- Taxa de conversão
- Análise por campanha

## Monitoramento

### Logs Importantes
```javascript
console.log('Validating coupon:', shaCode)
console.error('Error validating coupon:', error)
```

### Métricas Sugeridas
- Taxa de validação bem-sucedida
- Tempo médio de validação
- Tentativas de cupons inválidos
- Uso por anunciante

## Troubleshooting

### Problema: Função não encontrada
**Solução**: Aplicar migração do banco

### Problema: Permissão negada
**Solução**: Verificar RLS e grants

### Problema: Cupom não encontrado
**Solução**: Verificar se foi gerado corretamente

### Problema: Erro de TypeScript
**Solução**: Regenerar tipos após migração

## Conclusão

A funcionalidade de validação de cupons está completamente implementada e pronta para uso. Ela fornece:

- ✅ Interface intuitiva para anunciantes
- ✅ Validação robusta de segurança
- ✅ Feedback claro e imediato
- ✅ Integração perfeita com o sistema existente
- ✅ Prevenção de uso duplo de cupons
- ✅ Compatibilidade com fluxo de cashback atual

A implementação segue as melhores práticas de desenvolvimento e mantém a consistência com o design system da aplicação. 