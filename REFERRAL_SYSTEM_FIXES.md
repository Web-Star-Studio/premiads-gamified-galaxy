# Sistema de Referências - Correções Implementadas

## Problema Original
O sistema de referências não estava funcionando corretamente:
- Códigos não validavam durante cadastro
- Indicações não eram registradas automaticamente
- Painel `/cliente/indicacoes` não exibia dados
- Recompensas não eram processadas

## Estrutura de Tabelas Corrigida

### Tabelas Ativas (Novo Sistema)
- **`referencias`**: Códigos únicos por participante
- **`indicacoes`**: Histórico de indicações (status: pendente/completo)
- **`recompensas_indicacao`**: Recompensas por marcos de indicações

### Tabela Descontinuada
- **`referrals`**: Sistema antigo (vazia, não utilizada)

## Correções Implementadas

### 1. Função SQL Criada
```sql
CREATE OR REPLACE FUNCTION validate_referral_code_direct(input_code text)
RETURNS TABLE (participante_id uuid, full_name text, active boolean)
LANGUAGE plpgsql
AS $$
BEGIN
    RETURN QUERY
    SELECT 
        r.participante_id,
        p.full_name,
        r.ativo as active
    FROM referencias r
    JOIN profiles p ON r.participante_id = p.id
    WHERE r.codigo = input_code AND r.ativo = true;
END;
$$;
```

### 2. Hook useAuth.ts
**Correções:**
- Removida dependência de função MCP inexistente
- Implementada validação direta via SQL
- Registro automático na tabela `indicacoes` durante cadastro
- Bônus de 50 rifas para novos usuários com código

**Fluxo:**
1. Valida código via `validate_referral_code_direct`
2. Cria usuário com `auth.signUp`
3. Registra indicação na tabela `indicacoes`
4. Concede 50 rifas de bônus

### 3. Hook useReferrals.ts
**Funções Corrigidas:**
- `validateReferralCodeMCP`: Consulta direta com JOIN
- `fetchReferralStats`: Estatísticas das tabelas corretas
- `fetchReferrals`: Lista indicações com dados dos usuários

**Queries Implementadas:**
```sql
-- Validação de código
SELECT r.participante_id, p.full_name, r.ativo 
FROM referencias r 
JOIN profiles p ON r.participante_id = p.id 
WHERE r.codigo = $1 AND r.ativo = true

-- Estatísticas de referências
SELECT COUNT(*) as total_referrals 
FROM indicacoes 
WHERE referenciador_id = $1

-- Lista de indicações
SELECT i.*, p.full_name, p.email, p.created_at as user_created_at 
FROM indicacoes i 
JOIN profiles p ON i.indicado_id = p.id 
WHERE i.referenciador_id = $1 
ORDER BY i.created_at DESC
```

### 4. Edge Function - Moderação
**Adicionado ao `moderate-mission-submission`:**
- Processamento automático quando primeira missão é aprovada
- Atualiza status de `pendente` para `completo`
- Recompensa 200 rifas para referenciador

```typescript
// Processa referência quando primeira missão é aprovada
if (action === 'approved') {
  const { data: firstMission } = await supabase
    .from('mission_submissions')
    .select('id')
    .eq('user_id', submission.user_id)
    .eq('status', 'approved')
    .limit(1)

  if (!firstMission?.length) {
    // Atualiza indicação para completa
    await supabase
      .from('indicacoes')
      .update({ status: 'completo', data_completada: new Date() })
      .eq('indicado_id', submission.user_id)
      .eq('status', 'pendente')
    
    // Recompensa referenciador
    // ... lógica de rifas
  }
}
```

## Estado Final

### ✅ Funcionalidades Corrigidas
1. **Validação de código**: Funciona durante cadastro
2. **Registro automático**: Indicações salvas na tabela correta
3. **Painel de indicações**: Exibe dados corretos em `/cliente/indicacoes`
4. **Recompensas**: Processadas automaticamente quando primeira missão é aprovada
5. **Contadores**: Atualizados dinamicamente

### 🔄 Fluxo Completo
1. Usuário cadastra com código → Valida via SQL
2. Indicação registrada como "pendente"
3. Novo usuário recebe 50 rifas
4. Primeira missão aprovada → Status vira "completo"
5. Referenciador recebe 200 rifas
6. Dados aparecem no painel de indicações

### 📊 Métricas Rastreadas
- Total de indicações por usuário
- Status das indicações (pendente/completo)
- Datas de cadastro e completamento
- Recompensas distribuídas

## Observações Técnicas
- Correções encapsuladas sem afetar outras funcionalidades
- Mantida compatibilidade com estrutura existente
- Sistema robusto com validações e tratamento de erros
- Performance otimizada com consultas diretas ao banco 