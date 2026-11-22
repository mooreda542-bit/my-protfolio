-- ========================================================
-- SUPABASE SCHEMA FOR MOHAMED REDA 3D PORTFOLIO
-- Execute this SQL in your Supabase SQL Editor to set up:
-- 1. Profile Table
-- 2. Projects Table
-- 3. Skills Table
-- 4. Storage Bucket & RLS Policies
-- ========================================================

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- 1. PROFILE TABLE
create table if not exists public.profile (
  id text primary key default 'main',
  name text not null default 'Mohamed Reda Nour Mohamed',
  display_name text not null default 'Mohamed Reda',
  title text not null default 'Front-End Developer',
  location text not null default 'Zagazig, Sharqia, Egypt',
  phone text not null default '01018274271',
  email text not null default 'mooreda542@gmail.com',
  github text not null default 'https://github.com/mooreda542-bit',
  about text not null default 'I build modern, interactive, and responsive web experiences using React and modern web technologies. Focused on front-end development, building clean interfaces, continuous learning, and hands-on practical projects.',
  photo_url text not null default '/mohamed-reda.jpg',
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 2. PROJECTS TABLE
create table if not exists public.projects (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  category text not null,
  description text not null,
  technologies text[] not null default '{}',
  image text not null,
  screenshots text[] not null default '{}',
  live_url text,
  github_url text,
  featured boolean default false,
  order_index integer default 0,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 3. SKILLS TABLE
create table if not exists public.skills (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  category text not null default 'Frontend',
  icon text,
  order_index integer default 0,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- ENABLE ROW LEVEL SECURITY
alter table public.profile enable row level security;
alter table public.projects enable row level security;
alter table public.skills enable row level security;

-- PUBLIC READ ACCESS (Allow visitors to view the portfolio)
create policy "Allow public read access to profile"
  on public.profile for select using (true);

create policy "Allow public read access to projects"
  on public.projects for select using (true);

create policy "Allow public read access to skills"
  on public.skills for select using (true);

-- AUTHENTICATED ADMIN ACCESS (Only authenticated admin can insert/update/delete)
create policy "Allow authenticated admin to update profile"
  on public.profile for all using (auth.role() = 'authenticated');

create policy "Allow authenticated admin to modify projects"
  on public.projects for all using (auth.role() = 'authenticated');

create policy "Allow authenticated admin to modify skills"
  on public.skills for all using (auth.role() = 'authenticated');

-- 4. STORAGE BUCKET FOR PORTFOLIO ASSETS
insert into storage.buckets (id, name, public) 
values ('portfolio-assets', 'portfolio-assets', true)
on conflict (id) do nothing;

create policy "Allow public access to portfolio assets"
  on storage.objects for select
  using (bucket_id = 'portfolio-assets');

create policy "Allow authenticated admin to upload portfolio assets"
  on storage.objects for insert
  with check (bucket_id = 'portfolio-assets' and auth.role() = 'authenticated');

create policy "Allow authenticated admin to update portfolio assets"
  on storage.objects for update
  using (bucket_id = 'portfolio-assets' and auth.role() = 'authenticated');

create policy "Allow authenticated admin to delete portfolio assets"
  on storage.objects for delete
  using (bucket_id = 'portfolio-assets' and auth.role() = 'authenticated');

