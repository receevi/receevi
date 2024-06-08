alter table "public"."messages" add column "is_received" boolean not null default false;

alter table "public"."messages" add column "read_by_user_at" timestamp with time zone;


