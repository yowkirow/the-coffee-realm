-- Update a specific user to have the 'barista' role
-- NOTE: This assumes the user 'barista@demo.com' already exists in Authentication.

UPDATE public.profiles
SET role = 'barista'
WHERE id = (
  SELECT id 
  FROM auth.users 
  WHERE email = 'barista@demo.com' -- Replace with target email if different
);

-- Verify the change
SELECT email, role 
FROM auth.users 
JOIN public.profiles ON auth.users.id = public.profiles.id
WHERE email = 'barista@demo.com';
