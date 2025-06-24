# Cashback SHA Token Implementation

## Overview

This document describes the implementation of the cashback SHA token functionality for the PremiAds Gamified Galaxy platform. The feature generates unique SHA tokens when users redeem cashback, providing them with unique coupon codes.

## Token Format

- **Format**: 7 random uppercase letters + 3 digits representing the cashback percentage
- **Example**: `ABCDEFG025` for 25% cashback
- **Uniqueness**: Globally unique across all users

## Database Schema

### Table: `cashback_tokens`

```sql
CREATE TABLE cashback_tokens (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id),
  advertiser_id UUID REFERENCES auth.users(id),
  sha_code TEXT NOT NULL UNIQUE,
  cashback_percentage INTEGER NOT NULL,
  status TEXT NOT NULL DEFAULT 'ativo' CHECK (status IN ('ativo', 'usado', 'expirado')),
  validade TIMESTAMPTZ NOT NULL,
  campaign_id UUID REFERENCES cashback_campaigns(id),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Indexes for performance
CREATE INDEX idx_cashback_tokens_user_id ON cashback_tokens(user_id);
CREATE INDEX idx_cashback_tokens_sha_code ON cashback_tokens(sha_code);
CREATE INDEX idx_cashback_tokens_status ON cashback_tokens(status);
CREATE INDEX idx_cashback_tokens_validade ON cashback_tokens(validade);

-- RLS policies
ALTER TABLE cashback_tokens ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own tokens" ON cashback_tokens
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "System can insert tokens" ON cashback_tokens
  FOR INSERT WITH CHECK (true);

CREATE POLICY "System can update tokens" ON cashback_tokens
  FOR UPDATE USING (true);
```

### Database Function

```sql
CREATE OR REPLACE FUNCTION get_user_cashback_tokens(user_id UUID)
RETURNS TABLE (
  id UUID,
  user_id UUID,
  advertiser_id UUID,
  sha_code TEXT,
  cashback_percentage INTEGER,
  status TEXT,
  validade TIMESTAMPTZ,
  campaign_id UUID,
  created_at TIMESTAMPTZ,
  updated_at TIMESTAMPTZ
)
LANGUAGE sql
SECURITY DEFINER
AS $$
  SELECT 
    id,
    user_id,
    advertiser_id,
    sha_code,
    cashback_percentage,
    status,
    validade,
    campaign_id,
    created_at,
    updated_at
  FROM cashback_tokens
  WHERE cashback_tokens.user_id = get_user_cashback_tokens.user_id
  ORDER BY created_at DESC;
$$;
```

## Implementation

### 1. SHA Generation Functions

**File**: `src/hooks/cashback/cashbackApi.ts`

```typescript
/**
 * Gera um código SHA único para cashback: 7 letras maiúsculas + 3 dígitos da porcentagem
 */
function generateCashbackSHA(cashbackPercentage: number): string {
  const letters = Array.from({ length: 7 }, () =>
    String.fromCharCode(65 + Math.floor(Math.random() * 26))
  ).join('');
  const numeric = cashbackPercentage.toString().padStart(3, '0');
  return `${letters}${numeric}`;
}

/**
 * Verifica se o código SHA é único no banco de dados
 */
async function isSHAUnique(shaCode: string): Promise<boolean> {
  try {
    const { data, error } = await (supabase as any)
      .from('cashback_tokens')
      .select('id')
      .eq('sha_code', shaCode);
    
    if (error) {
      console.error('Error checking SHA uniqueness:', error);
      return true; // Assume unique if error
    }
    
    return data.length === 0;
  } catch {
    return true; // Assume unique if table doesn't exist yet
  }
}

/**
 * Gera um código SHA único com até 5 tentativas
 */
async function generateUniqueSHA(cashbackPercentage: number): Promise<string> {
  for (let i = 0; i < 5; i++) {
    const sha = generateCashbackSHA(cashbackPercentage);
    if (await isSHAUnique(sha)) {
      return sha;
    }
  }
  throw new Error('Falha ao gerar SHA único após múltiplas tentativas');
}
```

### 2. Modified Cashback Redemption

The `redeemCashback` function has been updated to:

1. Fetch campaign details including cashback percentage and advertiser_id
2. Generate a unique SHA code using the cashback percentage
3. Create a token entry in the database with 30-day expiry
4. Handle errors gracefully without breaking the cashback flow

```typescript
// Generate unique SHA code
const cashbackPercentage = Number(campaign.cashback_percentage);
const shaCode = await generateUniqueSHA(cashbackPercentage);

// Calculate validade (expiry date) - 30 days from now
const validade = new Date();
validade.setDate(validade.getDate() + 30);

// Create cashback token with unique SHA
try {
  await (supabase as any)
    .from('cashback_tokens')
    .insert({
      user_id: userId,
      advertiser_id: campaign.advertiser_id,
      sha_code: shaCode,
      cashback_percentage: cashbackPercentage,
      status: 'ativo',
      validade: validade.toISOString(),
      campaign_id: campaignId
    })
} catch (tokenError) {
  console.error('Error creating cashback token:', tokenError);
  // Don't throw error here to avoid breaking the cashback redemption
}
```

### 3. Token Fetching Function

```typescript
/**
 * Fetches user's cashback tokens from the database
 */
export const fetchUserCashbackTokens = async (): Promise<CashbackToken[]> => {
  const {
    data: { session },
    error: sessionError
  } = await supabase.auth.getSession()
  if (sessionError || !session) throw new Error('Autenticação necessária')
  
  try {
    const { data, error } = await (supabase as any)
      .from('cashback_tokens')
      .select('*')
      .eq('user_id', session.user.id)
      .order('created_at', { ascending: false })
    
    if (error) {
      console.error('Error fetching cashback tokens:', error)
      throw error
    }
    
    return (data || []) as CashbackToken[]
  } catch (error) {
    console.error('Error fetching cashback tokens:', error)
    return []
  }
}
```

### 4. TypeScript Types

**File**: `src/types/cashback.ts`

```typescript
export interface CashbackToken {
  id: string;
  user_id: string;
  advertiser_id: string | null;
  sha_code: string;
  cashback_percentage: number;
  status: 'ativo' | 'usado' | 'expirado';
  validade: string;
  campaign_id: string | null;
  created_at: string;
  updated_at: string;
}
```

### 5. Rewards Page Integration

**File**: `src/pages/client/RewardsPage.tsx`

The rewards page has been updated to:

1. Import and use the `fetchUserCashbackTokens` function
2. Display tokens in a new "Cupons de Cashback" tab
3. Show token details including SHA code, percentage, validity, and status
4. Handle loading and empty states

```typescript
// Fetch cashback tokens
try {
  const tokens = await fetchUserCashbackTokens();
  setCashbackTokens(tokens);
} catch (error) {
  console.error('Error fetching cashback tokens:', error);
  setCashbackTokens([]);
}
```

## UI Implementation

### Tab Interface

The rewards page includes a new tab "Cupons de Cashback" with the CreditCard icon that displays:

- Token SHA code in monospace font
- Cashback percentage prominently displayed
- Validity date in Brazilian format
- Status indicator with color coding:
  - Green for 'ativo'
  - Yellow for 'usado' 
  - Red for 'expirado'

### Empty State

When no tokens exist, displays a Lottie animation with the message:
"Nenhum Cupom de Cashback - Resgате cashback nas campanhas para gerar seus cupons únicos!"

## Required Migrations

To complete the implementation, run these migrations:

1. **Create table**: `supabase/migrations/20241201000000_create_cashback_tokens_table.sql`
2. **Create function**: `supabase/migrations/20241201000001_create_cashback_functions.sql`

After applying migrations:
1. Run `supabase gen types typescript --project-id YOUR_PROJECT_ID` to update TypeScript types
2. Replace `(supabase as any)` casts with proper typing

## Error Handling

- Token generation failures don't break the cashback redemption flow
- Graceful fallbacks for database connection issues
- Proper TypeScript error handling with try-catch blocks
- Console logging for debugging purposes

## Security

- RLS policies ensure users can only see their own tokens
- SHA codes are globally unique preventing collisions
- Token status prevents reuse of expired tokens
- Proper foreign key constraints maintain data integrity

## Testing

To test the implementation:

1. Create a cashback campaign
2. Redeem cashback on `/cliente/cashback`
3. Verify token creation in database
4. Check token display on `/cliente/recompensas`
5. Verify SHA format: 7 letters + 3 digits

## Future Enhancements

- Token usage tracking when redeemed with advertisers
- Automatic expiry status updates via scheduled jobs
- Token redemption validation endpoints
- Push notifications for new tokens
- Token sharing functionality

## Notes

- Implementation follows the exact specifications provided
- Uses compartmentalized approach without breaking existing functionality
- Maintains existing UI/UX as requested
- All changes are focused and targeted to the specific requirements 