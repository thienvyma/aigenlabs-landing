create or replace function public.set_landing_cms_documents_updated_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.updated_at = timezone('utc', now());
  new.version = coalesce(old.version, 0) + 1;
  return new;
end;
$$;

revoke all on function public.set_landing_cms_documents_updated_at() from public;

drop policy if exists landing_assets_public_read on storage.objects;
