-- OftaStudy — Fase 1: tabelas iniciais + segurança (RLS "só o dono").
-- Rode este arquivo inteiro no SQL Editor do Supabase (veja docs/contas.md).

create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  nome text not null default '',
  meta_cronograma date not null default '2027-12-31',
  prova_mes int check (prova_mes between 1 and 12),
  prova_ano int check (prova_ano >= 2026),
  horas_diarias numeric check (horas_diarias between 0.5 and 16),
  criado_em timestamptz not null default now(),
  constraint prova_completa check ((prova_mes is null) = (prova_ano is null))
);

create table public.specialties (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null default auth.uid() references auth.users(id) on delete cascade,
  nome text not null,
  ordem int not null default 0,
  unique (user_id, nome)
);

create table public.subjects (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null default auth.uid() references auth.users(id) on delete cascade,
  specialty_id uuid not null references public.specialties(id) on delete cascade,
  nome text not null
);

create table public.lessons (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null default auth.uid() references auth.users(id) on delete cascade,
  specialty_id uuid not null references public.specialties(id),
  subject_id uuid references public.subjects(id),
  titulo text not null,
  descricao text,
  duracao_seg int,
  source_type text not null default 'local' check (source_type in ('local', 'url', 'externo')),
  source_ref text
);

create table public.lesson_progress (
  user_id uuid not null default auth.uid() references auth.users(id) on delete cascade,
  lesson_id uuid not null references public.lessons(id) on delete cascade,
  posicao_seg int not null default 0,
  concluida boolean not null default false,
  ultimo_acesso timestamptz not null default now(),
  primary key (user_id, lesson_id)
);

create table public.questions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null default auth.uid() references auth.users(id) on delete cascade,
  specialty_id uuid references public.specialties(id),
  subject_id uuid references public.subjects(id),
  enunciado text not null,
  correta char(1) check (correta in ('A', 'B', 'C', 'D', 'E')),
  comentario text,
  dificuldade text,
  ano int,
  origem text
);

create table public.question_options (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null default auth.uid() references auth.users(id) on delete cascade,
  question_id uuid not null references public.questions(id) on delete cascade,
  letra char(1) not null check (letra in ('A', 'B', 'C', 'D', 'E')),
  texto text not null,
  unique (question_id, letra)
);

create table public.question_attempts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null default auth.uid() references auth.users(id) on delete cascade,
  question_id uuid not null references public.questions(id) on delete cascade,
  escolhida char(1),
  correta boolean not null,
  respondida_em timestamptz not null default now()
);

create table public.study_sessions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null default auth.uid() references auth.users(id) on delete cascade,
  inicio timestamptz not null default now(),
  duracao_seg int not null check (duracao_seg >= 0),
  tipo text not null default 'geral'
);

create index on public.lesson_progress (user_id, ultimo_acesso desc);
create index on public.question_attempts (user_id, respondida_em desc);
create index on public.study_sessions (user_id, inicio desc);

-- RLS: cada tabela só deixa o dono ler e escrever.
alter table public.profiles enable row level security;
create policy "dono" on public.profiles for all
  using (id = auth.uid()) with check (id = auth.uid());

do $$
declare t text;
begin
  foreach t in array array['specialties','subjects','lessons','lesson_progress','questions',
                           'question_options','question_attempts','study_sessions']
  loop
    execute format('alter table public.%I enable row level security', t);
    execute format('create policy "dono" on public.%I for all using (user_id = auth.uid()) with check (user_id = auth.uid())', t);
  end loop;
end $$;


-- OftaStudy — cria o perfil e as 14 especialidades iniciais para cada usuário novo.

create or replace function public.seed_specialties(uid uuid) returns void
language sql security definer set search_path = public as $$
  insert into public.specialties (user_id, nome, ordem)
  select uid, nome, ordem from (values
    ('Anatomia e fisiologia ocular', 1), ('Catarata', 2), ('Glaucoma', 3), ('Retina', 4),
    ('Córnea', 5), ('Uveítes', 6), ('Neuro-oftalmologia', 7), ('Estrabismo', 8),
    ('Oftalmopediatria', 9), ('Órbita e plástica ocular', 10),
    ('Lentes de contato e refração', 11), ('Emergências oftalmológicas', 12),
    ('Oncologia ocular', 13), ('Cirurgia refrativa', 14)
  ) as v(nome, ordem)
  on conflict (user_id, nome) do nothing;
$$;

revoke all on function public.seed_specialties(uuid) from public, anon, authenticated;

create or replace function public.handle_new_user() returns trigger
language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (id, nome) values (new.id, coalesce(new.raw_user_meta_data->>'nome', ''))
  on conflict (id) do nothing;
  perform public.seed_specialties(new.id);
  return new;
end $$;

create trigger on_auth_user_created after insert on auth.users
  for each row execute function public.handle_new_user();

-- Se você já criou o usuário antes de rodar este arquivo, isto o completa:
insert into public.profiles (id) select id from auth.users on conflict (id) do nothing;
select public.seed_specialties(id) from auth.users;
