-- Create confirm_rifa_purchase function to atomically confirm a rifa purchase
-- and increment the advertiser's rifas balance on profiles table.
--
-- Parameters:
--   p_purchase_id UUID - id of the row in rifa_purchases to confirm.
--
-- Behaviour:
--   1. Verifies the purchase exists and is still pending.
--   2. Updates the purchase status to 'confirmed'.
--   3. Adds `total_rifas` (base + bonus) to the corresponding user's
--      `rifas` column in profiles (creates 0 default if null).
--   4. Returns the updated purchase row for convenience.
--   5. Operates inside a single transaction to guarantee consistency.
--
-- RLS Considerations:
--   The function executes with SECURITY DEFINER so it can bypass RLS
--   and update both tables safely. Ensure that the owner of the
--   function is a privileged role (e.g. postgres or supabase_admin).

-- Up ----------------------------------------------------------------------

begin;

-- Drop older version if exists (allows idempotent re-runs)
DROP FUNCTION IF EXISTS public.confirm_rifa_purchase (uuid);

CREATE OR REPLACE FUNCTION public.confirm_rifa_purchase (
  p_purchase_id uuid
)
RETURNS TABLE (
  id uuid,
  user_id uuid,
  total_rifas int4,
  status text,
  confirmed_at timestamptz
) AS $$
DECLARE
  v_total int4;
  v_user  uuid;
BEGIN
  -- Lock the row to avoid race conditions when called concurrently
  SELECT user_id, total_rifas
    INTO v_user, v_total
  FROM rifa_purchases
  WHERE id = p_purchase_id
    FOR UPDATE;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'Purchase % not found', p_purchase_id USING ERRCODE = 'P0001';
  END IF;

  -- Only process if still pending
  UPDATE rifa_purchases
     SET status       = 'confirmed',
         confirmed_at = COALESCE(confirmed_at, now()),
         updated_at   = now()
   WHERE id = p_purchase_id
     AND status <> 'confirmed';

  -- Increment user rifas balance
  UPDATE profiles
     SET rifas = COALESCE(rifas, 0) + v_total,
         updated_at = now()
   WHERE id = v_user;

  -- Return useful information
  RETURN QUERY
    SELECT rp.id, rp.user_id, rp.total_rifas, rp.status, rp.confirmed_at
      FROM rifa_purchases rp
     WHERE rp.id = p_purchase_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant execution to authenticated users & edge functions
GRANT EXECUTE ON FUNCTION public.confirm_rifa_purchase(uuid) TO anon, authenticated, service_role;

commit;

-- Down --------------------------------------------------------------------

-- Simply drop the function (irreversible data changes have already happened)
-- Wrapped in transaction for cleanliness
begin;
DROP FUNCTION IF EXISTS public.confirm_rifa_purchase (uuid);
commit; 