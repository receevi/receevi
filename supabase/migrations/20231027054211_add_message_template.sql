create table "public"."message_template" (
    "id" text not null,
    "name" text,
    "category" text,
    "previous_category" text,
    "status" text,
    "language" text,
    "components" jsonb,
    "created_at" timestamp with time zone default now(),
    "updated_at" timestamp with time zone default now()
);


alter table "public"."message_template" enable row level security;

CREATE UNIQUE INDEX message_template_pkey ON public.message_template USING btree (id);

alter table "public"."message_template" add constraint "message_template_pkey" PRIMARY KEY using index "message_template_pkey";

create policy "Enable all for authenticated users only on message_templates"
on "public"."message_template"
as permissive
for all
to authenticated
using (true)
with check (true);




