create table "public"."contact_tag" (
    "id" uuid not null default gen_random_uuid(),
    "name" text not null,
    "created_at" timestamp with time zone not null default now()
);


alter table "public"."contact_tag" enable row level security;

CREATE UNIQUE INDEX contact_tag_pkey ON public.contact_tag USING btree (id);

alter table "public"."contact_tag" add constraint "contact_tag_pkey" PRIMARY KEY using index "contact_tag_pkey";

create policy "Enable all for authenticated users only on contact_tag"
on "public"."contact_tag"
as permissive
for all
to authenticated
using (true)
with check (true);



