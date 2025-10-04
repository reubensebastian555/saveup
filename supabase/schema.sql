-- Run these in Supabase SQL editor

-- Enable UUID extension (usually enabled by default)
create extension if not exists "uuid-ossp";

-- Profiles (optional)
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text,
  created_at timestamp with time zone default now()
);
alter table public.profiles enable row level security;

-- Goals
create table if not exists public.goals (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references auth.users(id) on delete cascade not null,
  title text not null,
  target_amount numeric not null check (target_amount >= 0),
  current_amount numeric not null default 0,
  deadline date,
  created_at timestamp with time zone default now()
);
alter table public.goals enable row level security;

-- Savings
create table if not exists public.savings (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references auth.users(id) on delete cascade not null,
  goal_id uuid references public.goals(id) on delete cascade,
  amount numeric not null check (amount >= 0),
  note text,
  created_at timestamp with time zone default now()
);
alter table public.savings enable row level security;

-- Policies: owner-can-read-write
create policy "profiles owner access" on public.profiles
  for all using (auth.uid() = id) with check (auth.uid() = id);

create policy "goals owner access" on public.goals
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

create policy "savings owner access" on public.savings
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- Trigger to keep goals.current_amount in sync based on savings
create or replace function public.update_goal_amount()
returns trigger as $$
begin
  if tg_op = 'INSERT' then
    update public.goals set current_amount = coalesce(current_amount,0) + new.amount where id = new.goal_id;
  elsif tg_op = 'DELETE' then
    update public.goals set current_amount = coalesce(current_amount,0) - old.amount where id = old.goal_id;
  elsif tg_op = 'UPDATE' then
    update public.goals set current_amount = coalesce(current_amount,0) - old.amount + new.amount where id = new.goal_id;
  end if;
  return null;
end;
$$ language plpgsql security definer;

drop trigger if exists trg_update_goal_amount_ins on public.savings;
drop trigger if exists trg_update_goal_amount_upd on public.savings;
drop trigger if exists trg_update_goal_amount_del on public.savings;

create trigger trg_update_goal_amount_ins
after insert on public.savings
for each row execute function public.update_goal_amount();

create trigger trg_update_goal_amount_upd
after update on public.savings
for each row execute function public.update_goal_amount();

create trigger trg_update_goal_amount_del
after delete on public.savings
for each row execute function public.update_goal_amount();
