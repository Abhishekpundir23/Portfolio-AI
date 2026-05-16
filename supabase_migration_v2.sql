-- Add new columns to portfolios table (run this if you already created the table)
alter table public.portfolios add column if not exists template text default 'bold';
alter table public.portfolios add column if not exists repo_url text;
