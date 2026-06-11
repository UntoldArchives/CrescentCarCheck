-- ⚠️ SUPERSEDED / DO NOT APPLY — historical only. The booking schema now lives in
-- the Crescent Car Reports project (migrations 006/007); this old website-owned
-- model is no longer applied to the shared database. Kept for history only.
--
-- Migrates the existing production `bookings` table (created by 001 before the
-- Stripe payment flow) up to the availability-aware payment schema. Idempotent:
-- safe to run more than once. A fresh database created from the current 001
-- already has everything below, so each statement is guarded.

-- 1) New columns for the payment-hold lifecycle.
alter table bookings add column if not exists hold_expires_at timestamptz;
alter table bookings add column if not exists paid_at         timestamptz;
alter table bookings add column if not exists cancelled_at     timestamptz;

-- 2) Widen the status check constraints.
--    payment_status: add 'refunded'.
alter table bookings drop constraint if exists bookings_payment_status_check;
alter table bookings add  constraint bookings_payment_status_check
  check (payment_status in ('pending', 'paid', 'failed', 'refunded'));

--    booking_status: add 'pending_payment' (the new initial, pre-payment state).
alter table bookings drop constraint if exists bookings_booking_status_check;
alter table bookings add  constraint bookings_booking_status_check
  check (booking_status in ('pending_payment', 'pending_confirmation', 'confirmed', 'cancelled', 'completed'));

-- 3) New default: a freshly inserted booking is an unpaid hold.
alter table bookings alter column booking_status set default 'pending_payment';

-- 4) Indexes for availability queries + hold expiry sweeps.
create index if not exists bookings_slot_idx         on bookings(preferred_date, preferred_window);
create index if not exists bookings_hold_expires_idx on bookings(hold_expires_at) where hold_expires_at is not null;

-- 5) Atomic single-slot guarantee (see 001 for the full rationale).
create unique index if not exists bookings_active_slot_idx
  on bookings (preferred_date, preferred_window)
  where (payment_status = 'paid' and booking_status in ('pending_confirmation', 'confirmed'))
     or (payment_status = 'pending' and booking_status = 'pending_payment');

-- 6) Contact messages (saved before the owner email is sent).
create table if not exists contact_messages (
  id          uuid primary key default gen_random_uuid(),
  created_at  timestamptz default now() not null,
  name        text not null,
  email       text not null,
  phone       text,
  topic       text,
  car_make    text,
  car_model   text,
  car_year    text,
  message     text not null
);

create index if not exists contact_messages_created_at_idx on contact_messages(created_at desc);
alter table contact_messages enable row level security;
drop policy if exists "Service role only" on contact_messages;
create policy "Service role only" on contact_messages using (false) with check (false);
