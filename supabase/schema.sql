-- Create a table for public profiles linked to auth.users
create table profiles (
  id uuid references auth.users on delete cascade not null primary key,
  email text,
  full_name text,
  avatar_url text,
  points int default 0, -- Legacy trigger support
  role text check (role in ('admin', 'staff', 'customer')) default 'customer',
  stamps_balance int default 0,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS
alter table profiles enable row level security;

-- Policies
create policy "Public profiles are viewable by everyone." on profiles
  for select using (true);

create policy "Users can insert their own profile." on profiles
  for insert with check (auth.uid() = id);

create policy "Users can update own profile." on profiles
  for update using (auth.uid() = id);

-- Create a table for transactions (stamps history)
create table transactions (
  id uuid default gen_random_uuid() primary key,
  customer_id uuid references profiles(id) not null,
  staff_id uuid references profiles(id), -- Nullable if system action
  type text check (type in ('earn', 'redeem')) not null,
  amount int not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS
alter table transactions enable row level security;

create policy "Users can view their own transactions." on transactions
  for select using (auth.uid() = customer_id);

create policy "Staff can insert transactions." on transactions
  for insert with check (
    exists (
      select 1 from profiles
      where id = auth.uid()
      and role in ('staff', 'admin')
    )
  );

-- Create a table for loyalty configuration (Singleton pattern)
create table loyalty_config (
  id int primary key default 1, -- Force singleton by constraint or convention
  program_name text default 'The Coffee Realm',
  total_stamps_required int default 12,
  reward_milestones jsonb default '{"6": "Free Coffee", "12": "Any Item for $1"}',
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
  constraint singleton_check check (id = 1)
);

-- Enable RLS
alter table loyalty_config enable row level security;

-- Policies
create policy "Everyone can view loyalty config." on loyalty_config
  for select using (true);

create policy "Only admins can update config." on loyalty_config
  for update using (
    exists (
      select 1 from profiles
      where id = auth.uid()
      and role = 'admin'
    )
  );

-- Insert default config if not exists
insert into loyalty_config (id, program_name, total_stamps_required)
values (1, 'The Coffee Realm', 12)
on conflict (id) do nothing;
