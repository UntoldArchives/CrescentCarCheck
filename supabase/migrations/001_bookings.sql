create extension if not exists "uuid-ossp";

create table if not exists bookings (
  id                       uuid default gen_random_uuid() primary key,
  created_at               timestamptz default now() not null,
  updated_at               timestamptz default now() not null,

  customer_name            text not null,
  customer_phone           text not null,
  customer_email           text,

  emirate                  text not null,
  address                  text not null,
  location_lat             double precision,
  location_lng             double precision,
  parking_type             text not null check (parking_type in ('showroom', 'outdoor', 'home')),
  additional_notes         text,

  car_make                 text not null,
  car_model                text not null,
  car_year                 text not null,

  -- Preferred date + window only; the exact arrival time is confirmed later.
  preferred_date           date not null,
  preferred_window         text not null check (preferred_window in ('morning', 'afternoon', 'evening')),

  package_id               text not null,
  package_name             text not null,
  package_price            integer not null,

  -- Filled when a tentative Google Calendar hold is created for the request.
  google_calendar_event_id text,

  -- Reserved for future Stripe wiring (no payment is taken today).
  stripe_session_id        text unique,
  stripe_payment_intent_id text,

  payment_status           text not null default 'pending'
    check (payment_status in ('pending', 'paid', 'failed')),
  booking_status           text not null default 'pending_confirmation'
    check (booking_status in ('pending_confirmation', 'confirmed', 'cancelled', 'completed'))
);

create index bookings_payment_status_idx  on bookings(payment_status);
create index bookings_booking_status_idx  on bookings(booking_status);
create index bookings_preferred_date_idx  on bookings(preferred_date);
create index bookings_created_at_idx      on bookings(created_at desc);
create index bookings_stripe_session_idx  on bookings(stripe_session_id) where stripe_session_id is not null;

alter table bookings enable row level security;
create policy "Service role only" on bookings using (false) with check (false);
