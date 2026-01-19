-- Allow Admins to SELECT (view) ALL profiles
-- Previously, users could likely only see their own profile.

CREATE POLICY "Admins can view all profiles" ON public.profiles
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Ensure public read access remains (usually "Profiles are viewable by everyone" is standard, but if not:)
-- If you want stricter privacy (users can only see themselves), keep the above.
-- If you want a social app (everyone sees everyone), you'd have a public policy.
-- For this app, Admins DEFINITELY need to see everyone.

-- Also, re-verify the Update policy
DROP POLICY IF EXISTS "Admins can update any profile" ON public.profiles;
CREATE POLICY "Admins can update any profile" ON public.profiles
  FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin'
    )
  );
