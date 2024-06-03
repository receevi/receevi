create table "public"."broadcast" (
    "id" uuid not null default gen_random_uuid(),
    "name" text not null,
    "template_name" text not null,
    "contact_tags" text[],
    "created_at" timestamp with time zone not null default now(),
    "sent_count" integer not null default 0,
    "delivered_count" integer not null default 0,
    "read_count" integer not null default 0,
    "replied_count" integer not null default 0,
    "language" text not null,
    "scheduled_count" integer
);


alter table "public"."broadcast" enable row level security;

create table "public"."broadcast_contact" (
    "id" uuid not null default gen_random_uuid(),
    "broadcast_id" uuid not null,
    "contact_id" numeric not null,
    "wam_id" text,
    "sent_at" timestamp with time zone,
    "delivered_at" timestamp with time zone,
    "replied_at" timestamp with time zone,
    "created_at" timestamp with time zone not null default now(),
    "read_at" timestamp with time zone,
    "batch_id" uuid not null
);


alter table "public"."broadcast_contact" enable row level security;

CREATE UNIQUE INDEX broadcast_contact_pkey ON public.broadcast_contact USING btree (id);

CREATE UNIQUE INDEX broadcast_pkey ON public.broadcast USING btree (id);

alter table "public"."broadcast" add constraint "broadcast_pkey" PRIMARY KEY using index "broadcast_pkey";

alter table "public"."broadcast_contact" add constraint "broadcast_contact_pkey" PRIMARY KEY using index "broadcast_contact_pkey";

create policy "Enable all for authenticated users only on broadcast"
on "public"."broadcast"
as permissive
for all
to authenticated
using (true)
with check (true);


create policy "Enable all for authenticated users only on broadcast_contact"
on "public"."broadcast_contact"
as permissive
for all
to authenticated
using (true)
with check (true);



