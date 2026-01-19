-- EMERGENCY FIX: Create Missing Profiles
-- Run this in Supabase SQL Editor

-- 1. Insert a profile for any user in auth.users who DOES NOT have a profile
INSERT INTO public.profiles (id, email, full_name, role, points)
SELECT 
    id, 
    email, 
    COALESCE(raw_user_meta_data->>'full_name', 'Unknown User'), 
    'customer',
    0
FROM auth.users
WHERE id NOT IN (SELECT id FROM public.profiles);

-- 2. Verify it worked by selecting count
SELECT count(*) as "Profiles Created" FROM public.profiles;

-- 3. Double check the Trigger exists for FUTURE users
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, avatar_url, email, role, points)
  VALUES (
      new.id, 
      COALESCE(new.raw_user_meta_data->>'full_name', 'New User'), 
      new.raw_user_meta_data->>'avatar_url', 
      new.email,
      'customer',
      0
  );
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
