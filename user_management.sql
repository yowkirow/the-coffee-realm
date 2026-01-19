-- 1. Add email column to profiles for easier searching
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS email text;

-- 2. Backfill email for existing users (run as Superuser/Service Role)
UPDATE public.profiles
SET email = auth.users.email
FROM auth.users
WHERE public.profiles.id = auth.users.id
AND public.profiles.email IS NULL;

-- 3. Update the Trigger to capture email on new signups
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, avatar_url, email)
  VALUES (new.id, new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'avatar_url', new.email);
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 4. Secure RPC function to allow Admins to delete users from auth.users
-- This requires SECURITY DEFINER to bypass standard auth restrictions
CREATE OR REPLACE FUNCTION delete_user_by_admin(target_user_id uuid)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Strict Check: Is the caller an admin?
  IF NOT EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = auth.uid() AND role = 'admin'
  ) THEN
    RAISE EXCEPTION 'Access Denied: Only admins can perform this action.';
  END IF;

  -- Delete from auth.users (High-level delete, cascades to profiles)
  DELETE FROM auth.users WHERE id = target_user_id;
END;
$$;

-- 5. RLS: Allow Admins to update ANY profile (to change Roles)
CREATE POLICY "Admins can update any profile" ON public.profiles
  FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Allow Admins to View All Profiles (already covered by Public Read, but good to be explicit for future privacy)
-- Currently "Public profiles are viewable by everyone" covers this.
