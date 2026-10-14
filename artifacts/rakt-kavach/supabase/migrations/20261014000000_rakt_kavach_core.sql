-- Rakt Kavach core schema. Apply in the Supabase SQL editor before enabling live data.
-- Aadhaar numbers are deliberately not represented in this schema.

create extension if not exists pgcrypto;
create sequence if not exists public.rakt_node_sequence;

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  phone text not null unique,
  display_name text,
  role text not null default 'donor'
    check (role in ('donor', 'hospital', 'lab', 'authority', 'founder')),
  requested_role text
    check (requested_role is null or requested_role in ('donor', 'hospital', 'lab')),
  status text not null default 'active'
    check (status in ('active', 'pending', 'suspended')),
  node_id text not null unique default
    ('RC-IN-' || lpad(nextval('public.rakt_node_sequence')::text, 6, '0')),
  identity_provider text,
  identity_token_hash text,
  identity_verified_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.donors (
  user_id uuid primary key references public.profiles(id) on delete cascade,
  blood_type text check (blood_type is null or blood_type in ('A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-')),
  is_available boolean not null default false,
  last_donation_at timestamptz,
  created_at timestamptz not null default now()
);

create table if not exists public.hospitals (
  user_id uuid primary key references public.profiles(id) on delete cascade,
  facility_name text not null,
  village text,
  block text,
  district text,
  state text,
  latitude double precision check (latitude between -90 and 90),
  longitude double precision check (longitude between -180 and 180),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.blood_inventory (
  id uuid primary key default gen_random_uuid(),
  node_id uuid not null references public.hospitals(user_id) on delete cascade,
  blood_type text not null check (blood_type in ('A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-')),
  units integer not null default 0 check (units >= 0),
  updated_at timestamptz not null default now(),
  unique (node_id, blood_type)
);

create table if not exists public.blood_wallet (
  donor_id uuid primary key references public.donors(user_id) on delete cascade,
  balance_units integer not null default 0 check (balance_units >= 0),
  updated_at timestamptz not null default now()
);

create table if not exists public.blood_wallet_transfers (
  id uuid primary key default gen_random_uuid(),
  sender_id uuid not null references public.donors(user_id),
  recipient_id uuid not null references public.donors(user_id),
  units integer not null check (units > 0),
  created_at timestamptz not null default now(),
  check (sender_id <> recipient_id)
);

create table if not exists public.emergency_requests (
  id uuid primary key default gen_random_uuid(),
  hospital_id uuid not null references public.hospitals(user_id),
  blood_type text not null check (blood_type in ('A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-')),
  units_requested integer not null check (units_requested > 0),
  status text not null default 'open'
    check (status in ('open', 'responding', 'resolved', 'cancelled')),
  created_at timestamptz not null default now(),
  resolved_at timestamptz
);

create table if not exists public.blood_exchange_requests (
  id uuid primary key default gen_random_uuid(),
  source_hospital_id uuid not null references public.hospitals(user_id),
  target_hospital_id uuid not null references public.hospitals(user_id),
  blood_type text not null check (blood_type in ('A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-')),
  units integer not null check (units > 0),
  status text not null default 'pending'
    check (status in ('pending', 'accepted', 'rejected', 'cancelled')),
  created_at timestamptz not null default now(),
  resolved_at timestamptz,
  check (source_hospital_id <> target_hospital_id)
);

create index if not exists blood_inventory_node_idx on public.blood_inventory(node_id);
create index if not exists emergency_requests_open_idx on public.emergency_requests(status, created_at desc);
create index if not exists blood_exchange_target_idx on public.blood_exchange_requests(target_hospital_id, status);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
set search_path = public
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists profiles_updated_at on public.profiles;
create trigger profiles_updated_at before update on public.profiles
for each row execute function public.set_updated_at();
drop trigger if exists hospitals_updated_at on public.hospitals;
create trigger hospitals_updated_at before update on public.hospitals
for each row execute function public.set_updated_at();
drop trigger if exists inventory_updated_at on public.blood_inventory;
create trigger inventory_updated_at before update on public.blood_inventory
for each row execute function public.set_updated_at();
drop trigger if exists wallet_updated_at on public.blood_wallet;
create trigger wallet_updated_at before update on public.blood_wallet
for each row execute function public.set_updated_at();

create or replace function public.handle_new_rakt_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  requested text;
begin
  requested := new.raw_user_meta_data ->> 'requested_role';
  if requested not in ('donor', 'hospital', 'lab') then
    requested := 'donor';
  end if;

  insert into public.profiles (id, phone, requested_role)
  values (new.id, coalesce(new.phone, ''), requested)
  on conflict (id) do nothing;

  -- Public registration cannot grant hospital, lab, authority, or founder privileges.
  insert into public.donors (user_id) values (new.id) on conflict (user_id) do nothing;
  insert into public.blood_wallet (donor_id) values (new.id) on conflict (donor_id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created_rakt on auth.users;
create trigger on_auth_user_created_rakt
after insert on auth.users
for each row execute function public.handle_new_rakt_user();

create or replace function public.current_rakt_role()
returns text
language sql
stable
security definer
set search_path = public
as $$
  select role from public.profiles where id = auth.uid()
$$;

alter table public.profiles enable row level security;
alter table public.donors enable row level security;
alter table public.hospitals enable row level security;
alter table public.blood_inventory enable row level security;
alter table public.blood_wallet enable row level security;
alter table public.blood_wallet_transfers enable row level security;
alter table public.emergency_requests enable row level security;
alter table public.blood_exchange_requests enable row level security;

drop policy if exists "profile owner or authority can read" on public.profiles;
create policy "profile owner or authority can read" on public.profiles
for select to authenticated
using (id = auth.uid() or public.current_rakt_role() in ('authority', 'founder'));
drop policy if exists "donor owner or authority can read" on public.donors;
create policy "donor owner or authority can read" on public.donors
for select to authenticated
using (user_id = auth.uid() or public.current_rakt_role() in ('authority', 'founder'));
drop policy if exists "donor owner can edit own availability" on public.donors;
create policy "donor owner can edit own availability" on public.donors
for update to authenticated
using (user_id = auth.uid())
with check (user_id = auth.uid());
drop policy if exists "authenticated can read facilities" on public.hospitals;
create policy "authenticated can read facilities" on public.hospitals
for select to authenticated using (true);
drop policy if exists "authenticated can read inventory" on public.blood_inventory;
create policy "authenticated can read inventory" on public.blood_inventory
for select to authenticated using (true);
drop policy if exists "wallet owner can read" on public.blood_wallet;
create policy "wallet owner can read" on public.blood_wallet
for select to authenticated using (donor_id = auth.uid());
drop policy if exists "transfer parties can read ledger" on public.blood_wallet_transfers;
create policy "transfer parties can read ledger" on public.blood_wallet_transfers
for select to authenticated using (sender_id = auth.uid() or recipient_id = auth.uid());
drop policy if exists "authenticated can read emergency requests" on public.emergency_requests;
create policy "authenticated can read emergency requests" on public.emergency_requests
for select to authenticated using (true);
drop policy if exists "facility can create emergency requests" on public.emergency_requests;
create policy "facility can create emergency requests" on public.emergency_requests
for insert to authenticated
with check (
  hospital_id = auth.uid()
  and public.current_rakt_role() in ('hospital', 'lab')
);
drop policy if exists "parties can read exchanges" on public.blood_exchange_requests;
create policy "parties can read exchanges" on public.blood_exchange_requests
for select to authenticated
using (source_hospital_id = auth.uid() or target_hospital_id = auth.uid());

create or replace function public.transfer_blood_credits(p_recipient_node_id text, p_units integer)
returns integer
language plpgsql
security definer
set search_path = public
as $$
declare
  recipient uuid;
  remaining integer;
begin
  if auth.uid() is null or p_units is null or p_units < 1 then
    raise exception 'A signed-in donor and a positive whole-number credit amount are required';
  end if;
  if public.current_rakt_role() <> 'donor' then
    raise exception 'Only donor accounts can transfer credits';
  end if;

  select id into recipient
  from public.profiles
  where node_id = upper(trim(p_recipient_node_id))
    and role = 'donor'
    and status = 'active';
  if recipient is null or recipient = auth.uid() then
    raise exception 'Recipient node was not found or is not eligible';
  end if;

  update public.blood_wallet
  set balance_units = balance_units - p_units
  where donor_id = auth.uid() and balance_units >= p_units
  returning balance_units into remaining;
  if not found then
    raise exception 'Insufficient blood credits';
  end if;

  update public.blood_wallet
  set balance_units = balance_units + p_units
  where donor_id = recipient;
  insert into public.blood_wallet_transfers (sender_id, recipient_id, units)
  values (auth.uid(), recipient, p_units);
  return remaining;
end;
$$;

create or replace function public.adjust_blood_inventory(p_blood_type text, p_delta integer)
returns integer
language plpgsql
security definer
set search_path = public
as $$
declare
  remaining integer;
begin
  if auth.uid() is null
    or public.current_rakt_role() not in ('hospital', 'lab')
    or p_delta is null
    or p_delta = 0
    or p_blood_type not in ('A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-')
    or not exists (select 1 from public.hospitals where user_id = auth.uid()) then
    raise exception 'A registered facility, valid blood type, and non-zero adjustment are required';
  end if;

  if p_delta > 0 then
    insert into public.blood_inventory (node_id, blood_type, units)
    values (auth.uid(), p_blood_type, p_delta)
    on conflict (node_id, blood_type)
    do update set units = public.blood_inventory.units + excluded.units
    returning units into remaining;
  else
    update public.blood_inventory
    set units = units + p_delta
    where node_id = auth.uid()
      and blood_type = p_blood_type
      and units + p_delta >= 0
    returning units into remaining;
    if not found then
      raise exception 'Inventory cannot be reduced below zero';
    end if;
  end if;
  return remaining;
end;
$$;

create or replace function public.request_blood_exchange(
  p_target_hospital_id uuid,
  p_blood_type text,
  p_units integer
)
returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
  source_row public.hospitals%rowtype;
  target_row public.hospitals%rowtype;
  exchange_id uuid;
  distance_km double precision;
begin
  if auth.uid() is null
    or public.current_rakt_role() <> 'hospital'
    or p_units < 1
    or p_blood_type not in ('A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-') then
    raise exception 'A registered hospital, blood type, and positive unit count are required';
  end if;
  select * into source_row from public.hospitals where user_id = auth.uid();
  select * into target_row from public.hospitals where user_id = p_target_hospital_id;
  if source_row.user_id is null or target_row.user_id is null
    or source_row.latitude is null or source_row.longitude is null
    or target_row.latitude is null or target_row.longitude is null then
    raise exception 'Both hospitals must have verified coordinates';
  end if;

  distance_km := 6371 * acos(least(1, greatest(-1,
    sin(radians(source_row.latitude)) * sin(radians(target_row.latitude))
    + cos(radians(source_row.latitude)) * cos(radians(target_row.latitude))
    * cos(radians(source_row.longitude - target_row.longitude))
  )));
  if distance_km > 100 then
    raise exception 'Emergency exchange is limited to hospitals within 100 km';
  end if;
  if not exists (
    select 1 from public.blood_inventory
    where node_id = auth.uid() and blood_type = p_blood_type and units >= p_units
  ) then
    raise exception 'Insufficient available inventory';
  end if;

  insert into public.blood_exchange_requests
    (source_hospital_id, target_hospital_id, blood_type, units)
  values (auth.uid(), p_target_hospital_id, p_blood_type, p_units)
  returning id into exchange_id;
  return exchange_id;
end;
$$;

create or replace function public.resolve_blood_exchange(p_exchange_id uuid, p_accept boolean)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  exchange public.blood_exchange_requests%rowtype;
begin
  select * into exchange
  from public.blood_exchange_requests
  where id = p_exchange_id and target_hospital_id = auth.uid() and status = 'pending'
  for update;
  if not found then
    raise exception 'Pending exchange request not found';
  end if;

  if p_accept then
    update public.blood_inventory
    set units = units - exchange.units
    where node_id = exchange.source_hospital_id
      and blood_type = exchange.blood_type
      and units >= exchange.units;
    if not found then
      raise exception 'The sending hospital no longer has enough units';
    end if;
    insert into public.blood_inventory (node_id, blood_type, units)
    values (exchange.target_hospital_id, exchange.blood_type, exchange.units)
    on conflict (node_id, blood_type)
    do update set units = public.blood_inventory.units + excluded.units;
    update public.blood_exchange_requests
    set status = 'accepted', resolved_at = now()
    where id = p_exchange_id;
  else
    update public.blood_exchange_requests
    set status = 'rejected', resolved_at = now()
    where id = p_exchange_id;
  end if;
end;
$$;

create or replace view public.live_grid_summary as
select
  (select count(*)::integer from public.profiles where status = 'active' and role in ('hospital', 'lab')) as connected_nodes,
  (select count(*)::integer from public.donors) as total_donors,
  (select count(*)::integer from public.hospitals) as total_hospitals,
  coalesce((select sum(units)::integer from public.blood_inventory), 0) as live_inventory_units,
  coalesce((select sum(units_requested)::integer from public.emergency_requests where status in ('open', 'responding')), 0) as demand_units,
  (select count(*)::integer from public.emergency_requests where status in ('open', 'responding')) as open_alerts,
  coalesce((
    select avg(extract(epoch from resolved_at - created_at))::integer
    from public.emergency_requests
    where status = 'resolved' and resolved_at is not null
  ), 0) as average_response_seconds,
  now() as updated_at;

grant select on public.live_grid_summary to authenticated;
grant execute on function public.transfer_blood_credits(text, integer) to authenticated;
grant execute on function public.adjust_blood_inventory(text, integer) to authenticated;
grant execute on function public.request_blood_exchange(uuid, text, integer) to authenticated;
grant execute on function public.resolve_blood_exchange(uuid, boolean) to authenticated;

do $$
declare
  table_name text;
begin
  foreach table_name in array array[
    'profiles', 'donors', 'hospitals', 'blood_inventory', 'blood_wallet',
    'emergency_requests', 'blood_exchange_requests'
  ] loop
    begin
      execute format('alter publication supabase_realtime add table public.%I', table_name);
    exception when duplicate_object then
      null;
    end;
  end loop;
end;
$$;
