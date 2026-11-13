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
