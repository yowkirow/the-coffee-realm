-- Create Transactions Table
CREATE TABLE IF NOT EXISTS public.transactions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('EARN', 'REDEEM', 'PURCHASE')), -- Enforce types
  amount INT NOT NULL, -- Points change (positive for earn, negative for redeem)
  description TEXT, -- e.g. "Latte purchased", "Daily login"
  created_at TIMESTAMPTZ DEFAULT now()
);

-- RLS: Users can read their OWN transactions
ALTER TABLE public.transactions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own transactions" ON public.transactions
FOR SELECT USING (auth.uid() = user_id);

-- Admins can view ALL transactions
CREATE POLICY "Admins can view all transactions" ON public.transactions
FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
);


-- UPDATE RPC: Increment Points + Log Transaction
-- logic: Update points user, then insert to transactions
CREATE OR REPLACE FUNCTION increment_points(target_user_id UUID, points_to_add INT)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  current_user_role TEXT;
  new_total INT;
  result JSONB;
BEGIN
  -- 1. Check Authority
  SELECT role INTO current_user_role FROM public.profiles WHERE id = auth.uid();
  IF current_user_role NOT IN ('admin', 'barista') THEN
     RAISE EXCEPTION 'Unauthorized: Only Baristas and Admins can add points.';
  END IF;

  -- 2. Update Points
  UPDATE public.profiles
  SET points = COALESCE(points, 0) + points_to_add
  WHERE id = target_user_id
  RETURNING points INTO new_total;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'User not found.';
  END IF;

  -- 3. Log Transaction
  INSERT INTO public.transactions (user_id, type, amount, description)
  VALUES (target_user_id, 'EARN', points_to_add, 'Points added by barista scan');

  result := jsonb_build_object('success', true, 'new_points', new_total);
  RETURN result;
END;
$$;
