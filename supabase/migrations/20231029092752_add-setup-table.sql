create table "public"."setup" (
    "id" uuid not null default gen_random_uuid(),
    "name" character varying,
    "display_text" text not null,
    "sequence" integer,
    "done_at" timestamp with time zone,
    "created_at" timestamp with time zone default now(),
    "in_progress" boolean not null default false
);

alter table "public"."setup" enable row level security;

CREATE UNIQUE INDEX setup_pkey ON public.setup USING btree (id);

alter table "public"."setup" add constraint "setup_pkey" PRIMARY KEY using index "setup_pkey";

create policy "Enable all for authenticated users only on setup"
on "public"."setup"
as permissive
for all
to authenticated
using (true)
with check (true);

alter publication supabase_realtime add table setup;

insert into setup (name, display_text, sequence) values ('download_message_templates', 'Download message templates', 1);
