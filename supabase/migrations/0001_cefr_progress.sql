-- CEFR learning-path progress.
--
-- Content (levels, chapters, units, lessons, questions) is NOT stored here.
-- It lives in versioned JSON bundled with the app (see data/cefr/*.json and
-- lib/cefr.ts). This schema only holds per-user mutable progress, keyed by the
-- hierarchical slug IDs from that JSON (e.g. "a1.ch1.u1.l1.q3").
--
-- Unit/chapter/level completion is DERIVED from these rows in the app, not
-- stored, so there is no redundant state to drift out of sync.

-- Lesson completion: one row per lesson the user has finished.
create table lesson_progress (
  user_id      uuid        not null references auth.users (id) on delete cascade,
  lesson_id    text        not null,          -- slug, matches JSON lesson id
  completed_at timestamptz not null default now(),
  score        int,                           -- nullable, e.g. percent correct
  primary key (user_id, lesson_id)
);

alter table lesson_progress enable row level security;

create policy "own lesson_progress"
  on lesson_progress for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- Per-question correctness: latest result per question, no attempt history.
create table question_progress (
  user_id     uuid        not null references auth.users (id) on delete cascade,
  question_id text        not null,           -- slug, matches JSON question id
  correct     boolean     not null,
  answered_at timestamptz not null default now(),
  primary key (user_id, question_id)
);

alter table question_progress enable row level security;

create policy "own question_progress"
  on question_progress for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);
