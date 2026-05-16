-- Create portfolios table
create table public.portfolios (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id) on delete cascade not null,
  username text unique not null,
  hook text not null,
  problem text not null,
  solution text not null,
  tech_stack jsonb not null default '[]'::jsonb,
  win text not null,
  learning text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable Row Level Security (RLS)
alter table public.portfolios enable row level security;

-- Create policies
create policy "Public portfolios are viewable by everyone."
  on public.portfolios for select
  using ( true );

create policy "Users can insert their own portfolios."
  on public.portfolios for insert
  with check ( auth.uid() = user_id );

create policy "Users can update their own portfolios."
  on public.portfolios for update
  using ( auth.uid() = user_id );
