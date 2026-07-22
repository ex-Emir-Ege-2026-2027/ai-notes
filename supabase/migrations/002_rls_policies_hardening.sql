-- ============================================================
-- AI Notes — RLS Hardening (operation-specific policies)
-- Run after 001_initial_schema.sql
-- ============================================================

-- 1) Ensure RLS is enabled on all business tables
alter table public.categories enable row level security;
alter table public.notes enable row level security;
alter table public.files enable row level security;
alter table public.ai_results enable row level security;

-- Optional: force table owner to respect RLS as well
-- alter table public.categories force row level security;
-- alter table public.notes force row level security;
-- alter table public.files force row level security;
-- alter table public.ai_results force row level security;

-- 2) Remove broad "for all" policies created earlier
drop policy if exists "Users can manage their own categories" on public.categories;
drop policy if exists "Users can manage their own notes" on public.notes;
drop policy if exists "Users can manage their own files" on public.files;
drop policy if exists "Users can manage their own AI results" on public.ai_results;

-- ============================================================
-- CATEGORIES
-- ============================================================

create policy categories_select_own
  on public.categories
  for select
  to authenticated
  using (auth.uid() = user_id);

create policy categories_insert_own
  on public.categories
  for insert
  to authenticated
  with check (auth.uid() = user_id);

create policy categories_update_own
  on public.categories
  for update
  to authenticated
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy categories_delete_own
  on public.categories
  for delete
  to authenticated
  using (auth.uid() = user_id);

-- If you later add an is_public column, replace select policy with:
-- using (auth.uid() = user_id or is_public = true)

-- ============================================================
-- NOTES
-- ============================================================

create policy notes_select_own
  on public.notes
  for select
  to authenticated
  using (auth.uid() = user_id);

create policy notes_insert_own
  on public.notes
  for insert
  to authenticated
  with check (
    auth.uid() = user_id
    and (
      category_id is null
      or exists (
        select 1
        from public.categories c
        where c.id = category_id
          and c.user_id = auth.uid()
      )
    )
  );

create policy notes_update_own
  on public.notes
  for update
  to authenticated
  using (auth.uid() = user_id)
  with check (
    auth.uid() = user_id
    and (
      category_id is null
      or exists (
        select 1
        from public.categories c
        where c.id = category_id
          and c.user_id = auth.uid()
      )
    )
  );

create policy notes_delete_own
  on public.notes
  for delete
  to authenticated
  using (auth.uid() = user_id);

-- ============================================================
-- FILES
-- ============================================================

create policy files_select_own
  on public.files
  for select
  to authenticated
  using (auth.uid() = user_id);

create policy files_insert_own
  on public.files
  for insert
  to authenticated
  with check (
    auth.uid() = user_id
    and (
      note_id is null
      or exists (
        select 1
        from public.notes n
        where n.id = note_id
          and n.user_id = auth.uid()
      )
    )
  );

create policy files_update_own
  on public.files
  for update
  to authenticated
  using (auth.uid() = user_id)
  with check (
    auth.uid() = user_id
    and (
      note_id is null
      or exists (
        select 1
        from public.notes n
        where n.id = note_id
          and n.user_id = auth.uid()
      )
    )
  );

create policy files_delete_own
  on public.files
  for delete
  to authenticated
  using (auth.uid() = user_id);

-- ============================================================
-- AI RESULTS
-- ============================================================

create policy ai_results_select_own
  on public.ai_results
  for select
  to authenticated
  using (
    auth.uid() = user_id
    and exists (
      select 1
      from public.notes n
      where n.id = note_id
        and n.user_id = auth.uid()
    )
  );

create policy ai_results_insert_own
  on public.ai_results
  for insert
  to authenticated
  with check (
    auth.uid() = user_id
    and exists (
      select 1
      from public.notes n
      where n.id = note_id
        and n.user_id = auth.uid()
    )
  );

create policy ai_results_update_own
  on public.ai_results
  for update
  to authenticated
  using (auth.uid() = user_id)
  with check (
    auth.uid() = user_id
    and exists (
      select 1
      from public.notes n
      where n.id = note_id
        and n.user_id = auth.uid()
    )
  );

create policy ai_results_delete_own
  on public.ai_results
  for delete
  to authenticated
  using (auth.uid() = user_id);

-- ============================================================
-- STORAGE (optional hardening for update operation)
-- Existing migration already has insert/select/delete policies.
-- Add update policy if you support object rename/move/metadata update.
-- ============================================================

drop policy if exists "Users can update their own files" on storage.objects;

create policy "Users can update their own files"
  on storage.objects
  for update
  to authenticated
  using (bucket_id = 'note-files' and (storage.foldername(name))[1] = auth.uid()::text)
  with check (bucket_id = 'note-files' and (storage.foldername(name))[1] = auth.uid()::text);
