
-- This function allows incrementing a numeric column in a specified table
CREATE OR REPLACE FUNCTION public.increment(x integer, row_id uuid, table_name text)
RETURNS void AS $$
BEGIN
  EXECUTE format('UPDATE public.%I SET points = points + $1 WHERE id = $2', table_name)
  USING x, row_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
