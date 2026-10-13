-- Paste this whole block into Supabase > SQL Editor, then click Run.
create table if not exists scores (
  key        text primary key,
  session    text not null,
  team       text not null,
  members    jsonb default '[]'::jsonb,
  device     text,
  run        int,
  pts        int,
  max        int,
  qdone      int,
  stations   int,
  first_try  int,
  status     text,
  started_at bigint,
  updated_at bigint,
  finished_at bigint,
  answers    jsonb default '[]'::jsonb
);
create index if not exists scores_session_idx on scores (session);

alter table scores enable row level security;
create policy "anyone can read"   on scores for select using (true);
create policy "anyone can add"    on scores for insert with check (true);
create policy "anyone can update" on scores for update using (true) with check (true);
