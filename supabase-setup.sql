-- Execute no SQL Editor do Supabase.
create table if not exists public.caoportamental_state (
  user_id uuid primary key references auth.users(id) on delete cascade,
  data jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);
create or replace function public.caoportamental_set_updated_at()
returns trigger language plpgsql set search_path = '' as $$
begin
  new.updated_at = clock_timestamp();
  return new;
end; $$;
drop trigger if exists caoportamental_touch on public.caoportamental_state;
create trigger caoportamental_touch before update on public.caoportamental_state
for each row execute function public.caoportamental_set_updated_at();
alter table public.caoportamental_state enable row level security;
grant select, insert, update, delete on public.caoportamental_state to authenticated;
revoke all on public.caoportamental_state from anon;
drop policy if exists "own_select" on public.caoportamental_state;
drop policy if exists "own_insert" on public.caoportamental_state;
drop policy if exists "own_update" on public.caoportamental_state;
create policy "own_select" on public.caoportamental_state for select to authenticated using (auth.uid() = user_id);
create policy "own_insert" on public.caoportamental_state for insert to authenticated with check (auth.uid() = user_id);
create policy "own_update" on public.caoportamental_state for update to authenticated using (auth.uid() = user_id) with check (auth.uid() = user_id);
-- Opcional: habilite a tabela em Database > Publications > supabase_realtime.
