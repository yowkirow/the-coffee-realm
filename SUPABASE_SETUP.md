# Supabase Database Schema

Run these SQL commands in your Supabase SQL Editor:

```sql
-- Enable Row Level Security
ALTER TABLE IF EXISTS user_stamps ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS rewards_config ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS milestones ENABLE ROW LEVEL SECURITY;

-- Create user_stamps table
CREATE TABLE IF NOT EXISTS user_stamps (
    id BIGSERIAL PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    stamps INTEGER DEFAULT 0,
    rewards_earned INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id)
);

-- Create rewards_config table (single row for global config)
CREATE TABLE IF NOT EXISTS rewards_config (
    id INTEGER PRIMARY KEY DEFAULT 1,
    max_stamps INTEGER DEFAULT 8,
    reward_name TEXT DEFAULT 'Free Premium Roast',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    CONSTRAINT single_row CHECK (id = 1)
);

-- Create milestones table
CREATE TABLE IF NOT EXISTS milestones (
    id BIGSERIAL PRIMARY KEY,
    stamps INTEGER NOT NULL,
    reward TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(stamps, reward)
);

-- Insert default config
INSERT INTO rewards_config (id, max_stamps, reward_name)
VALUES (1, 8, 'Free Premium Roast')
ON CONFLICT (id) DO NOTHING;

-- Insert default milestones
INSERT INTO milestones (stamps, reward) VALUES
    (4, 'Free Drink'),
    (6, 'Free Food'),
    (8, 'Free Premium Roast')
ON CONFLICT (stamps, reward) DO NOTHING;

-- RLS Policies for user_stamps
CREATE POLICY "Users can view own stamps"
    ON user_stamps FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can update own stamps"
    ON user_stamps FOR UPDATE
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own stamps"
    ON user_stamps FOR INSERT
    WITH CHECK (auth.uid() = user_id);

-- RLS Policies for rewards_config (read-only for all authenticated users)
CREATE POLICY "Anyone can view rewards config"
    ON rewards_config FOR SELECT
    TO authenticated
    USING (true);

CREATE POLICY "Only service role can update config"
    ON rewards_config FOR UPDATE
    TO authenticated
    USING (true);

-- RLS Policies for milestones (read-only for all authenticated users)
CREATE POLICY "Anyone can view milestones"
    ON milestones FOR SELECT
    TO authenticated
    USING (true);

CREATE POLICY "Authenticated users can manage milestones"
    ON milestones FOR ALL
    TO authenticated
    USING (true);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Add triggers
CREATE TRIGGER update_user_stamps_updated_at
    BEFORE UPDATE ON user_stamps
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_rewards_config_updated_at
    BEFORE UPDATE ON rewards_config
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();
```

## Setup Instructions

1. Go to your Supabase project dashboard
2. Navigate to **SQL Editor**
3. Copy and paste the above SQL
4. Click **Run** to execute
5. Verify tables were created in **Table Editor**
