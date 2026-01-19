-- Create table for global loyalty settings
CREATE TABLE IF NOT EXISTS public.loyalty_settings (
    id int PRIMARY KEY DEFAULT 1,
    stamps_required int NOT NULL DEFAULT 8,
    reward_name text NOT NULL DEFAULT 'Free Coffee',
    -- Enforce single row pattern
    CONSTRAINT single_row_const CHECK (id = 1)
);

-- Seed the initial row if it doesn't exist
INSERT INTO public.loyalty_settings (id, stamps_required, reward_name)
VALUES (1, 8, 'Free Coffee')
ON CONFLICT (id) DO NOTHING;

-- Enable RLS
ALTER TABLE public.loyalty_settings ENABLE ROW LEVEL SECURITY;

-- Policy 1: Everyone can READ the settings (public)
CREATE POLICY "Public read access" ON public.loyalty_settings
    FOR SELECT USING (true);

-- Policy 2: Only Admins can UPDATE
-- Note: This relies on the 'admin' role being set in public.profiles/auth.users metadata
-- For simplicity in this app, we will check public.profiles
CREATE POLICY "Admins can update" ON public.loyalty_settings
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM public.profiles
            WHERE id = auth.uid() AND role = 'admin'
        )
    );

-- Grant permissions
GRANT SELECT ON public.loyalty_settings TO anon, authenticated;
GRANT UPDATE ON public.loyalty_settings TO authenticated;
