create policy "Give download permission to authenticated user 1ps738_0"
on "storage"."objects"
as permissive
for select
to authenticated
using ((bucket_id = 'media'::text));



