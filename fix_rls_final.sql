-- FINAL RLS FIX: Grant Admins Total Vision
-- Run this in Supabase SQL Editor

-- 1. Enable RLS (just in case)
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- 2. Drop existing restrictive policies to avoid conflicts
DROP POLICY IF EXISTS "Admins can view all profiles" ON public.profiles;
DROP POLICY IF EXISTS "Admins can update any profile" ON public.profiles;
DROP POLICY IF EXISTS "Public profiles are viewable by everyone." ON public.profiles;

-- 3. Create a Simple "Read All" Policy for Authenticated Users (or just Admins)
-- For a social/community app, usually everyone can read basics.
-- For strict privacy, only admins see all.
-- Let's enable "Admins see ALL" and "Users see THEMSELVES".

CREATE POLICY "Users can see own profile" ON public.profiles
FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Admins can see all profiles" ON public.profiles
FOR SELECT USING (
  (SELECT role FROM public.profiles WHERE id = auth.uid()) = 'admin'
);

-- 4. Create "Update" Policy for Admins
CREATE POLICY "Admins can update any profile" ON public.profiles
FOR UPDATE USING (
  (SELECT role FROM public.profiles WHERE id = auth.uid()) = 'admin'
);

-- 5. Create "Delete" Policy for Admins (if you want them to delete profiles directly, mostly handled by RPC though)
CREATE POLICY "Admins can delete any profile" ON public.profiles
FOR DELETE USING (
  (SELECT role FROM public.profiles WHERE id = auth.uid()) = 'admin'
);

-- 6. EMERGENCY OVERRIDE: If the above is too complex or failing due to recursion:
-- Uncomment the line below to simply make profiles public read-only (easiest fix if privacy isn't huge concern yet)
-- CREATE POLICY "Public profiles are viewable by everyone" ON public.profiles FOR SELECT USING (true);
