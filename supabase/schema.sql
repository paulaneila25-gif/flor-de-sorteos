
create table if not exists raffles (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  prize text not null,
  price integer not null,
  total_numbers integer not null,
  image_url text,
  status text not null default 'active',
  created_at timestamptz default now()
);

create table if not exists raffle_numbers (
  id uuid primary key default gen_random_uuid(),
  raffle_id uuid references raffles(id) on delete cascade,
  number integer not null,
  status text not null default 'free',
  customer_name text,
  customer_phone text,
  preference_id text,
  payment_id text,
  reserved_until timestamptz,
  created_at timestamptz default now(),
  unique(raffle_id, number)
);

insert into raffles (title, prize, price, total_numbers, image_url)
values ('Sorteo Express', 'Escurridor premium', 3000, 35, null);

insert into raffle_numbers (raffle_id, number)
select r.id, n
from raffles r, generate_series(1,35) as n
where r.prize = 'Escurridor premium'
on conflict do nothing;
