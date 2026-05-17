-- Add views column to portfolios table
ALTER TABLE public.portfolios ADD COLUMN IF NOT EXISTS views INTEGER DEFAULT 0;

-- Create a secure RPC function to increment views (bypasses RLS so public viewers can trigger it)
CREATE OR REPLACE FUNCTION increment_portfolio_views(portfolio_id UUID)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  UPDATE public.portfolios
  SET views = views + 1
  WHERE id = portfolio_id;
END;
$$;
