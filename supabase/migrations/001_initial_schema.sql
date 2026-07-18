-- ============================================================
-- AI Notes — Initial Schema Migration
-- Supabase SQL Editor'da çalıştırın
-- ============================================================

-- Extensions
create extension if not exists "uuid-ossp";
create extension if not exists "pg_trgm"; -- full-text search için

-- ============================================================
-- CATEGORIES
-- ============================================================
create table if not exists public.categories (
  id          uuid primary key default uuid_generate_v4(),
  user_id     uuid not null references auth.users(id) on delete cascade,
  name        text not null,
  color       text not null default '#6366f1',  -- indigo default
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now(),
  constraint categories_name_user_unique unique (user_id, name)
);

-- ============================================================
-- NOTES
-- ============================================================
create table if not exists public.notes (
  id           uuid primary key default uuid_generate_v4(),
  user_id      uuid not null references auth.users(id) on delete cascade,
  category_id  uuid references public.categories(id) on delete set null,
  title        text not null,
  content      text not null default '',
  summary      text,
  keywords     text[],
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now()
);

-- Full-text search index
create index if not exists notes_search_idx
  on public.notes using gin(to_tsvector('turkish', coalesce(title, '') || ' ' || coalesce(content, '')));

create index if not exists notes_user_id_idx on public.notes(user_id);
create index if not exists notes_category_id_idx on public.notes(category_id);

-- ============================================================
-- FILES (PDF & Uploads)
-- ============================================================
create table if not exists public.files (
  id           uuid primary key default uuid_generate_v4(),
  user_id      uuid not null references auth.users(id) on delete cascade,
  note_id      uuid references public.notes(id) on delete set null,
  name         text not null,
  size         bigint not null default 0,
  mime_type    text not null,
  storage_path text not null,          -- Supabase Storage path
  created_at   timestamptz not null default now()
);

create index if not exists files_user_id_idx on public.files(user_id);

-- ============================================================
-- AI RESULTS (quiz, questions vb. önbelleği)
-- ============================================================
create table if not exists public.ai_results (
  id          uuid primary key default uuid_generate_v4(),
  note_id     uuid not null references public.notes(id) on delete cascade,
  user_id     uuid not null references auth.users(id) on delete cascade,
  type        text not null check (type in ('summary', 'keywords', 'questions', 'quiz')),
  result      jsonb not null,
  created_at  timestamptz not null default now()
);

create index if not exists ai_results_note_id_idx on public.ai_results(note_id);

-- ============================================================
-- updated_at otomatik güncelleme fonksiyonu
-- ============================================================
create or replace function public.handle_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger notes_updated_at
  before update on public.notes
  for each row execute function public.handle_updated_at();

create trigger categories_updated_at
  before update on public.categories
  for each row execute function public.handle_updated_at();

-- ============================================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================================

-- CATEGORIES
alter table public.categories enable row level security;

create policy "Users can manage their own categories"
  on public.categories for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- NOTES
alter table public.notes enable row level security;

create policy "Users can manage their own notes"
  on public.notes for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- FILES
alter table public.files enable row level security;

create policy "Users can manage their own files"
  on public.files for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- AI RESULTS
alter table public.ai_results enable row level security;

create policy "Users can manage their own AI results"
  on public.ai_results for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- ============================================================
-- STORAGE BUCKET (PDF & Dosyalar)
-- ============================================================
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'note-files',
  'note-files',
  false,
  52428800, -- 50 MB
  array['application/pdf', 'image/png', 'image/jpeg', 'image/webp', 'image/gif']
)
on conflict (id) do nothing;

-- Storage RLS
create policy "Authenticated users can upload files"
  on storage.objects for insert
  to authenticated
  with check (bucket_id = 'note-files' and (storage.foldername(name))[1] = auth.uid()::text);

create policy "Users can view their own files"
  on storage.objects for select
  to authenticated
  using (bucket_id = 'note-files' and (storage.foldername(name))[1] = auth.uid()::text);

create policy "Users can delete their own files"
  on storage.objects for delete
  to authenticated
  using (bucket_id = 'note-files' and (storage.foldername(name))[1] = auth.uid()::text);

-- ============================================================
-- DEMO DATA (opsiyonel — ilk kullanıcı için)
-- ============================================================
-- Gerçek auth.uid() ile çalışır, test için manuel olarak çalıştırın:
-- insert into public.categories (user_id, name, color) values
--   (auth.uid(), 'Matematik', '#6366f1'),
--   (auth.uid(), 'Fizik',     '#8b5cf6'),
--   (auth.uid(), 'Tarih',     '#ec4899'),
--   (auth.uid(), 'Genel',     '#14b8a6');
