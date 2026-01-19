-- RUN THIS SCRIPT AFTER MANUALLY SIGNING UP THE USERS

-- Make the Admin user an 'admin'
UPDATE public.profiles
SET role = 'admin'
WHERE id IN (
  SELECT id FROM auth.users WHERE email = 'admin@demo.com'
);

-- Make the Barista user a 'barista'
UPDATE public.profiles
SET role = 'barista'
WHERE id IN (
  SELECT id FROM auth.users WHERE email = 'barista@demo.com'
);

-- The 'user@demo.com' defaults to 'customer', so no action needed.
