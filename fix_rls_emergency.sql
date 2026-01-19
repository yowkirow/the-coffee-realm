-- EMERGENCY RLS FIX
-- I accidentally created an "Infinite Loop" in the previous script.
-- (Checking "Are you an Admin?" required reading the Profile, which checked "Are you an Admin?", etc.)
-- This script fixes it by simplifying the rules.

-- 1. Reset Policies
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Admins can see all profiles" ON public.profiles;
DROP POLICY IF EXISTS "Users can see own profile" ON public.profiles;
DROP POLICY IF EXISTS "Admins can view all profiles" ON public.profiles;
DROP POLICY IF EXISTS "Public profiles are viewable by everyone." ON public.profiles;

-- 2. THE FIX: Restore Simple Public Access
-- This ensures everyone can appear in the User List, and you can always read your own data.
CREATE POLICY "Public profiles are viewable by everyone" 
ON public.profiles FOR SELECT USING (true);

-- 3. Keep the Admin Update/Delete powers (these are safe because they don't block reading)
-- (We use separate policies for UPDATE/DELETE)
DROP POLICY IF EXISTS "Admins can update any profile" ON public.profiles;
CREATE POLICY "Admins can update any profile" ON public.profiles
FOR UPDATE USING (
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = auth.uid() AND role = 'admin'
  )
);
-- Note: usage of EXISTS avoids some recursion issues compared to direct comparison, 
-- but if it still flakes, we rely on the Select policy being open.

-- 4. Verify count
SELECT count(*) as "Profiles Visible Now" FROM public.profiles;
