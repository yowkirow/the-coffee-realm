-- FIX: Increment Points RPC
-- This script ensures the function exists and has correct permissions.

-- 1. Create/Replace the function with SECURITY DEFINER (bypassing RLS)
CREATE OR REPLACE FUNCTION increment_points(target_user_id UUID, points_to_add INT)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER -- Runs with privileges of the creator (postgres/admin)
AS $$
DECLARE
  current_user_role TEXT;
  new_total INT;
  result JSONB;
BEGIN
  -- Check if the EXECUTOR is allowed (Admin or Barista)
  -- (We check the role of the person SCANNING, not the target)
  SELECT role INTO current_user_role FROM public.profiles WHERE id = auth.uid();

  IF current_user_role NOT IN ('admin', 'barista') THEN
     RAISE EXCEPTION 'Unauthorized: Only Baristas and Admins can add points.';
  END IF;

  -- Update the target user's points
  UPDATE public.profiles
  SET points = COALESCE(points, 0) + points_to_add
  WHERE id = target_user_id
  RETURNING points INTO new_total;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'User not found.';
  END IF;

  result := jsonb_build_object('success', true, 'new_points', new_total);
  RETURN result;
END;
$$;

-- 2. Grant Permissions
-- Allow any logged-in user to *call* it (the internal logic checks their role)
GRANT EXECUTE ON FUNCTION increment_points(UUID, INT) TO authenticated;
GRANT EXECUTE ON FUNCTION increment_points(UUID, INT) TO service_role;

-- 3. Verify it exists
SELECT proname, prosrc FROM pg_proc WHERE proname = 'increment_points';
