create table if not exists public.landing_cms_documents (
  id text primary key,
  data jsonb not null,
  version bigint not null default 1,
  created_at timestamp with time zone not null default timezone('utc', now()),
  updated_at timestamp with time zone not null default timezone('utc', now()),
  constraint landing_cms_documents_data_is_object check (jsonb_typeof(data) = 'object')
);

alter table public.landing_cms_documents enable row level security;

revoke all on table public.landing_cms_documents from anon, authenticated;
grant select, insert, update, delete on table public.landing_cms_documents to service_role;

create or replace function public.set_landing_cms_documents_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = timezone('utc', now());
  new.version = coalesce(old.version, 0) + 1;
  return new;
end;
$$;

drop trigger if exists landing_cms_documents_set_updated_at on public.landing_cms_documents;
create trigger landing_cms_documents_set_updated_at
before update on public.landing_cms_documents
for each row
execute function public.set_landing_cms_documents_updated_at();

insert into storage.buckets (id, name, public, file_size_limit)
values ('landing-assets', 'landing-assets', true, 10485760)
on conflict (id) do update
set public = excluded.public,
    file_size_limit = excluded.file_size_limit;

do $$
begin
  if not exists (
    select 1
    from pg_policies
    where schemaname = 'storage'
      and tablename = 'objects'
      and policyname = 'landing_assets_public_read'
  ) then
    create policy landing_assets_public_read
    on storage.objects
    for select
    to anon, authenticated
    using (bucket_id = 'landing-assets');
  end if;
end $$;
