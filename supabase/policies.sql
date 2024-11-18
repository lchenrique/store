-- Função para verificar admin
create or replace function public.is_admin()
returns boolean
language sql
security definer
set search_path = public
stable
as $$
  select exists (
    select 1
    from "User"
    where id = auth.uid()
    and is_admin = true
  );
$$;

-- Habilitar RLS nas tabelas
alter table "User" enable row level security;
alter table "Address" enable row level security;

-- Políticas para tabela User
create policy "Users can view own data"
    on "User"
    for select
    using (
        auth.uid() = id 
        or public.is_admin()
    );

create policy "Users can update own data"
    on "User"
    for update
    using (auth.uid() = id)
    with check (auth.uid() = id);

create policy "Users can delete own data"
    on "User"
    for delete
    using (auth.uid() = id);

-- Políticas para tabela Address
create policy "Users can view own addresses"
    on "Address"
    for select
    using (
        auth.uid() = "userId"::uuid
        or public.is_admin()
    );

create policy "Users can insert own addresses"
    on "Address"
    for insert
    with check (auth.uid() = "userId"::uuid);

create policy "Users can update own addresses"
    on "Address"
    for update
    using (auth.uid() = "userId"::uuid)
    with check (auth.uid() = "userId"::uuid);

create policy "Users can delete own addresses"
    on "Address"
    for delete
    using (auth.uid() = "userId"::uuid);
