-- ==============================================================================
-- Portfolio Database Schema & Production RLS Policies
-- Target Project: Mohamed Reda Portfolio
-- Target Owner: mooreda542@gmail.com
-- ==============================================================================

-- Enable UUID extension if not already present
create extension if not exists "uuid-ossp";

-- ------------------------------------------------------------------------------
-- 1. TABLES (Fully aligned with src/lib/storage.ts & src/types/portfolio.ts)
-- ------------------------------------------------------------------------------

-- Profile table (holds primary developer bio, contact, and narrative)
create table if not exists public.profile (
  id text primary key default 'main',
  name text not null,
  display_name text not null,
  title text not null,
  location text not null,
  phone text not null,
  email text not null,
  github text not null,
  about text not null,
  photo_url text,
  hero_greeting text,
  hero_description text,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Projects table (portfolio projects showcase)
create table if not exists public.projects (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  category text not null,
  description text not null,
  technologies text[] default '{}'::text[],
  image text not null,
  screenshots text[] default '{}'::text[],
  live_url text,
  github_url text,
  featured boolean default false,
  order_index integer default 0,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Skills table (technical skills categorized with description)
create table if not exists public.skills (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  category text not null,
  description text,
  order_index integer default 0,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- ------------------------------------------------------------------------------
-- 2. ROW LEVEL SECURITY (RLS) ENABLEMENT
-- ------------------------------------------------------------------------------

alter table public.profile enable row level security;
alter table public.projects enable row level security;
alter table public.skills enable row level security;

-- ------------------------------------------------------------------------------
-- 3. POLICY CLEANUP (IDEMPOTENCY & SAFE RE-RUNS)
-- Drops existing policies across legacy and current naming schemes.
-- ------------------------------------------------------------------------------

-- Profile policies cleanup
drop policy if exists "Allow public read access to profile" on public.profile;
drop policy if exists "Allow authenticated admin to update profile" on public.profile;
drop policy if exists "Allow owner to update profile" on public.profile;
drop policy if exists "Allow owner to insert profile" on public.profile;

-- Projects policies cleanup
drop policy if exists "Allow public read access to projects" on public.projects;
drop policy if exists "Allow authenticated admin to insert projects" on public.projects;
drop policy if exists "Allow authenticated admin to update projects" on public.projects;
drop policy if exists "Allow authenticated admin to delete projects" on public.projects;
drop policy if exists "Allow owner to insert projects" on public.projects;
drop policy if exists "Allow owner to update projects" on public.projects;
drop policy if exists "Allow owner to delete projects" on public.projects;

-- Skills policies cleanup
drop policy if exists "Allow public read access to skills" on public.skills;
drop policy if exists "Allow authenticated admin to insert skills" on public.skills;
drop policy if exists "Allow authenticated admin to update skills" on public.skills;
drop policy if exists "Allow authenticated admin to delete skills" on public.skills;
drop policy if exists "Allow owner to insert skills" on public.skills;
drop policy if exists "Allow owner to update skills" on public.skills;
drop policy if exists "Allow owner to delete skills" on public.skills;

-- Storage policies cleanup (includes legacy and current policy names)
drop policy if exists "Allow public access to portfolio assets" on storage.objects;
drop policy if exists "Allow public read access to portfolio assets" on storage.objects;
drop policy if exists "Allow authenticated admin to upload portfolio assets" on storage.objects;
drop policy if exists "Allow authenticated admin to update portfolio assets" on storage.objects;
drop policy if exists "Allow authenticated admin to delete portfolio assets" on storage.objects;
drop policy if exists "Allow owner to upload portfolio assets" on storage.objects;
drop policy if exists "Allow owner to update portfolio assets" on storage.objects;
drop policy if exists "Allow owner to delete portfolio assets" on storage.objects;

-- ------------------------------------------------------------------------------
-- 4. ROW LEVEL SECURITY POLICIES: PUBLIC READ ACCESS
-- ------------------------------------------------------------------------------

create policy "Allow public read access to profile"
  on public.profile for select
  using (true);

create policy "Allow public read access to projects"
  on public.projects for select
  using (true);

create policy "Allow public read access to skills"
  on public.skills for select
  using (true);

-- ------------------------------------------------------------------------------
-- 5. ROW LEVEL SECURITY POLICIES: OWNER MUTATIONS
-- Strictly restricted to verified owner: mooreda542@gmail.com
-- ------------------------------------------------------------------------------

-- Profile mutations
create policy "Allow owner to insert profile"
  on public.profile for insert
  with check (
    auth.role() = 'authenticated' and
    lower(auth.jwt() ->> 'email') = 'mooreda542@gmail.com'
  );

create policy "Allow owner to update profile"
  on public.profile for update
  using (
    auth.role() = 'authenticated' and
    lower(auth.jwt() ->> 'email') = 'mooreda542@gmail.com'
  )
  with check (
    auth.role() = 'authenticated' and
    lower(auth.jwt() ->> 'email') = 'mooreda542@gmail.com'
  );

-- Projects mutations
create policy "Allow owner to insert projects"
  on public.projects for insert
  with check (
    auth.role() = 'authenticated' and
    lower(auth.jwt() ->> 'email') = 'mooreda542@gmail.com'
  );

create policy "Allow owner to update projects"
  on public.projects for update
  using (
    auth.role() = 'authenticated' and
    lower(auth.jwt() ->> 'email') = 'mooreda542@gmail.com'
  )
  with check (
    auth.role() = 'authenticated' and
    lower(auth.jwt() ->> 'email') = 'mooreda542@gmail.com'
  );

create policy "Allow owner to delete projects"
  on public.projects for delete
  using (
    auth.role() = 'authenticated' and
    lower(auth.jwt() ->> 'email') = 'mooreda542@gmail.com'
  );

-- Skills mutations
create policy "Allow owner to insert skills"
  on public.skills for insert
  with check (
    auth.role() = 'authenticated' and
    lower(auth.jwt() ->> 'email') = 'mooreda542@gmail.com'
  );

create policy "Allow owner to update skills"
  on public.skills for update
  using (
    auth.role() = 'authenticated' and
    lower(auth.jwt() ->> 'email') = 'mooreda542@gmail.com'
  )
  with check (
    auth.role() = 'authenticated' and
    lower(auth.jwt() ->> 'email') = 'mooreda542@gmail.com'
  );

create policy "Allow owner to delete skills"
  on public.skills for delete
  using (
    auth.role() = 'authenticated' and
    lower(auth.jwt() ->> 'email') = 'mooreda542@gmail.com'
  );

-- ------------------------------------------------------------------------------
-- 6. STORAGE BUCKET CONFIGURATION & POLICIES
-- Bucket: portfolio-assets
-- ------------------------------------------------------------------------------

-- Ensure the portfolio-assets bucket exists and is set to public read
insert into storage.buckets (id, name, public)
values ('portfolio-assets', 'portfolio-assets', true)
on conflict (id) do update set public = true;

-- Public read access
create policy "Allow public read access to portfolio assets"
  on storage.objects for select
  using (bucket_id = 'portfolio-assets');

-- Owner-only upload
create policy "Allow owner to upload portfolio assets"
  on storage.objects for insert
  with check (
    bucket_id = 'portfolio-assets' and
    auth.role() = 'authenticated' and
    lower(auth.jwt() ->> 'email') = 'mooreda542@gmail.com'
  );

-- Owner-only update
create policy "Allow owner to update portfolio assets"
  on storage.objects for update
  using (
    bucket_id = 'portfolio-assets' and
    auth.role() = 'authenticated' and
    lower(auth.jwt() ->> 'email') = 'mooreda542@gmail.com'
  )
  with check (
    bucket_id = 'portfolio-assets' and
    auth.role() = 'authenticated' and
    lower(auth.jwt() ->> 'email') = 'mooreda542@gmail.com'
  );

-- Owner-only delete
create policy "Allow owner to delete portfolio assets"
  on storage.objects for delete
  using (
    bucket_id = 'portfolio-assets' and
    auth.role() = 'authenticated' and
    lower(auth.jwt() ->> 'email') = 'mooreda542@gmail.com'
  );

-- ------------------------------------------------------------------------------
-- 7. INITIAL SEED (Accurate, Non-Fabricated Junior Developer Profile)
-- Non-destructive: existing customizations are never overwritten on re-runs.
-- ------------------------------------------------------------------------------

insert into public.profile (
  id,
  name,
  display_name,
  title,
  location,
  phone,
  email,
  github,
  about,
  photo_url,
  hero_greeting,
  hero_description
) values (
  'main',
  'Mohamed Reda Nour Mohamed',
  'Mohamed Reda',
  'Front-End Developer',
  'Zagazig, Sharqia, Egypt',
  '01018274271',
  'mooreda542@gmail.com',
  'https://github.com/mooreda542-bit',
  'I am a motivated Front-End Developer focused on crafting clean, responsive, and interactive web interfaces using React, TypeScript, and modern styling practices. I enjoy turning designs into functional web applications and continuously refining my skills through real-world and practical development projects.',
  '/mohamed-reda.jpg',
  'Hi, I''m Mohamed Reda',
  'Front-End Developer building modern, responsive, and interactive web applications.'
)
on conflict (id) do nothing;
