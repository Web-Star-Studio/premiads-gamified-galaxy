# Supabase Audit Context - PremiAds Gamified Galaxy

## 1. Contexto do App

### Principais Funcionalidades e Fluxos

**PremiAds Gamified Galaxy** é uma plataforma gamificada de marketing que conecta anunciantes com usuários através de missões e recompensas. O app possui três tipos principais de usuários com diferentes permissões:

#### **Tipos de Usuário (user_type)**
- `admin` - Administradores com acesso total ao sistema
- `anunciante` - Empresas que criam campanhas e missões 
- `participante` ou `cliente` - Usuários finais que participam das missões

#### **Fluxos Principais**

1. **Sistema de Autenticação e Perfis**
   - Registro/login com Supabase Auth
   - Perfis de usuário com diferentes tipos e permissões
   - Sistema de RLS (Row Level Security) baseado em roles

2. **Sistema de Missões (Core Business)**
   - Anunciantes criam missões/campanhas
   - Usuários submetem provas (fotos, formulários, vídeos)
   - Sistema de moderação em duas instâncias (anunciante → admin)
   - Recompensas automáticas após aprovação

3. **Sistema de Gamificação**
   - **Rifas/Pontos**: Moeda principal do sistema
   - **Badges**: Conquistas por completar missões
   - **Loot Boxes**: Recompensas aleatórias extras
   - **Cashback**: Sistema monetário paralelo
   - **Streaks**: Bônus por sequências de atividades

4. **Sistema de Sorteios/Rifas**
   - Criação de sorteios pelos admins
   - Participação com rifas ganhas
   - Sistema automatizado de sorteio

5. **Sistema de Compras**
   - Compra de créditos/rifas via Stripe/MercadoPago
   - Webhooks para confirmação de pagamento
   - Sistema de pacotes de créditos

6. **Painel Administrativo**
   - Gestão de usuários e moderação
   - Criação e gestão de sorteios
   - Monitoramento do sistema

### Tabelas Críticas (Frequência de Uso Alta)

#### **Core Tables (Extremamente Críticas)**
- `profiles` - Dados dos usuários, tipos, rifas, cashback
- `missions` - Campanhas/missões criadas por anunciantes
- `mission_submissions` - Submissões dos usuários
- `mission_rewards` - Recompensas processadas
- `mission_validation_logs` - Histórico de moderação

#### **Gamification Tables (Muito Críticas)**
- `user_badges` - Badges conquistados
- `lotteries` / `raffles` - Sorteios ativos
- `lottery_participants` / `raffle_numbers` - Participações
- `lottery_winners` - Ganhadores dos sorteios

#### **Payment Tables (Críticas)**
- `rifa_purchases` / `credit_purchases` - Compras de créditos
- `rifa_packages` / `credit_packages` - Pacotes disponíveis
- `stripe_customers` - Dados de pagamento

#### **Business Intelligence Tables (Críticas)**
- `cashback_campaigns` - Campanhas de cashback
- `cashback_redemptions` - Resgates realizados
- `transactions` - Log de transações
- `participations` - Participações em campanhas

## 2. Código Relevante

### Arquivos com Chamadas Supabase (supabase.from)

#### **Hooks e Serviços Core**
```
src/hooks/core/useMissions.ts - Query missões disponíveis
src/hooks/core/useAuth.ts - Autenticação e perfil
src/hooks/core/useClientStats.ts - Estatísticas do usuário
src/services/api/supabaseService.ts - Serviços centralizados
```

#### **Hooks de Admin**
```
src/hooks/admin/useUsers.tsx - Gestão de usuários (get_all_users RPC)
src/hooks/admin/useUserOperations.tsx - Operações administrativas
src/hooks/admin/useAdminAuth.tsx - Autenticação admin
```

#### **Hooks de Anunciante**
```
src/hooks/advertiser/useCampaignOperations.ts - Criação de campanhas (create_campaign_atomic RPC)
src/pages/advertiser/ - Dashboard e gestão de campanhas
```

#### **Sistema de Recompensas**
```
src/pages/client/RewardsPage.tsx - Visualização de recompensas
src/components/client/dashboard/RecentRewardsSection.tsx - Recompensas recentes
src/lib/submissions/useLootBoxRewards.ts - Gestão de loot boxes
```

#### **Sistema de Cashback**
```
src/hooks/cashback/cashbackApi.ts - redeem_cashback RPC
src/features/anunciante-cashbacks/ - Gestão de cashback
```

#### **Sistema de Sorteios**
```
src/services/raffles.ts - participate_in_raffle RPC
src/hooks/use-raffles.hook.ts - Participação em sorteios
```

### Chamadas RPC (supabase.rpc)

#### **Moderação e Aprovação**
```
approve_submission_first_instance
reject_submission_to_second_instance  
approve_submission_second_instance
reject_submission_second_instance
admin_reject_submission
admin_return_submission_to_advertiser
```

#### **Processamento de Recompensas**
```
process_mission_rewards - Processa badges, pontos, loot boxes
process_mission_rewards_simplified - Versão simplificada
reward_participant_for_submission - Recompensa participante
retroactively_award_badges - Processar badges retroativamente
```

#### **Gestão de Usuários**
```
get_all_users - Lista todos usuários (admin)
update_user_status - Ativa/desativa usuários
delete_user_account - Remove conta de usuário
```

#### **Sistema de Pagamentos**
```
increment_user_credits - Adiciona créditos
add_user_rifas - Adiciona rifas
confirm_rifa_purchase - Confirma compra
```

#### **Campanhas e CRM**
```
create_campaign_atomic - Cria campanha completa
crm_dashboard - Dashboard de anunciante
unlock_crm_participant_details - Desbloqueia detalhes de participante
```

#### **Cashback**
```
redeem_cashback - Resgata cashback
get_active_cashback_campaigns - Lista campanhas ativas
get_user_cashback_balance - Saldo do usuário
```

#### **Sorteios**
```
participate_in_raffle - Participa de sorteio
check_raffle_deadlines - Verifica prazos (scheduled)
```

### Edge Functions (supabase.functions.invoke)

#### **Moderação**
```
moderate-mission-submission - Processa aprovações/rejeições
```

#### **Pagamentos**
```
purchase-credits - Inicia compra de créditos
confirm-payment - Confirma pagamento
update-credit-purchase-status - Atualiza status de compra
update-rifa-purchase-status - Atualiza status de compra de rifas
check-payment-status - Verifica status no Stripe
```

#### **Webhooks**
```
stripe-webhook - Recebe eventos do Stripe
```

#### **Sorteios**
```
draw-raffle - Executa sorteio
check-raffle-deadlines - Agenda automática
```

#### **Admin**
```
admin-create-user - Criação de usuários por admin
get-config - Configurações do sistema
unlock-crm-details - CRM de anunciantes
```

### Policies, Triggers e Views Importantes

#### **Row Level Security (RLS)**
- Todas as tabelas principais têm RLS ativo
- Políticas baseadas em `auth.uid()` e `user_type`
- Funções auxiliares: `is_admin()`, `is_admin_or_moderator()`, `is_advertiser_user()`

#### **Triggers Críticos**
```
update_user_rewards_on_approval() - Processa recompensas automaticamente
update_updated_at_column() - Atualiza timestamps
```

#### **Funções de Utilidade**
```
get_current_user_id() - ID do usuário atual
get_current_user_type() - Tipo do usuário atual
get_user_role() - Role do usuário
```

## 3. Restrições para Limpeza

### **⚠️ NUNCA REMOVER**

#### **Tabelas Essenciais**
- `profiles` - Core do sistema de usuários
- `missions` - Core do negócio
- `mission_submissions` - Dados críticos de participação
- `mission_rewards` - Histórico de recompensas processadas
- `mission_validation_logs` - Auditoria obrigatória
- `user_badges` - Gamificação core
- `lotteries`/`raffles` - Sistema de sorteios
- `rifa_purchases`/`credit_purchases` - Dados financeiros

#### **Edge Functions Críticas**
- `moderate-mission-submission` - Chamada via trigger e UI
- `stripe-webhook` - Webhooks automáticos do Stripe
- `purchase-credits` - Fluxo de compra
- `check-raffle-deadlines` - Execução scheduled

#### **RPC Functions Core**
- `process_mission_rewards` - Chamada por triggers
- `create_campaign_atomic` - Transação crítica
- `get_all_users` - Admin dashboard
- Todas as funções de moderação (`approve_submission_*`, `reject_submission_*`)

### **🔍 VERIFICAR ANTES DE REMOVER**

#### **Tabelas com Referências Cruzadas**
- `cashback_campaigns` ↔ `cashback_redemptions`
- `lottery_participants` ↔ `lotteries`
- `raffle_numbers` ↔ `raffles`
- `transactions` - Pode ter foreign keys não explícitas

#### **Colunas com Dependências**
- `profiles.user_type` - Usado em RLS policies
- `profiles.rifas` - Core da gamificação  
- `profiles.cashback_balance` - Sistema monetário
- `missions.advertiser_id` - RLS e ownership
- `missions.has_badge`, `has_lootbox` - Lógica de recompensas

#### **Funções com Triggers Dependentes**
- Qualquer função chamada por triggers automáticos
- Funções usadas em RLS policies
- Funções chamadas por edge functions

### **📋 CRITÉRIOS DE ANÁLISE**

#### **Antes de Sugerir Remoção de Tabela:**
1. ✅ Não há foreign keys apontando para ela
2. ✅ Não é referenciada em RLS policies  
3. ✅ Não é usada em triggers ou functions
4. ✅ Não há chamadas diretas no código frontend
5. ✅ Não contém dados críticos de negócio ou auditoria

#### **Antes de Sugerir Remoção de Coluna:**
1. ✅ Não é usada em policies RLS
2. ✅ Não é referenciada em índices críticos
3. ✅ Não é usada em triggers ou functions  
4. ✅ Não há joins dependentes no código
5. ✅ Não contém dados de conformidade ou auditoria

#### **Antes de Sugerir Remoção de Function/Edge Function:**
1. ✅ Não é chamada por triggers automáticos
2. ✅ Não é invocada por webhooks externos
3. ✅ Não é usada em scheduled jobs
4. ✅ Não há chamadas diretas no frontend
5. ✅ Não é crítica para fluxos de pagamento ou moderação

### **🚨 AMBIGUIDADES IDENTIFICADAS**

1. **Dualidade de Sistemas**: Existem tanto `lotteries` quanto `raffles` - pode indicar migração incompleta
2. **Colunas de Pontos**: `profiles.rifas` vs `profiles.points` - verificar qual é o atual
3. **Tabelas de Créditos**: `rifa_packages` vs `credit_packages` - possível duplicação
4. **User Types**: Variação entre `user_type` e `role` em diferentes contextos
5. **Cashback vs Rifas**: Dois sistemas de recompensa paralelos - verificar se ambos são necessários

### **📊 RECOMENDAÇÕES DE ANÁLISE**

1. **Executar Query de Uso**: Verificar últimas atividades em tabelas suspeitas
2. **Análise de Foreign Keys**: Mapear todas as relações entre tabelas
3. **Log de Edge Functions**: Verificar quais functions são realmente chamadas
4. **Análise de Policies**: Revisar policies RLS para dependências ocultas
5. **Teste de Remoção**: Ambiente de staging para validar impactos

---

**Documento gerado**: 2024-12-27  
**Versão do Sistema**: PremiAds Gamified Galaxy  
**Tecnologias**: React + TypeScript + Supabase + Stripe 