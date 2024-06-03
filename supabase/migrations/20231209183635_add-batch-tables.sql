create table "public"."broadcast_batch" (
    "id" uuid not null,
    "broadcast_id" uuid not null,
    "started_at" timestamp with time zone,
    "ended_at" timestamp with time zone,
    "created_at" timestamp with time zone not null default now(),
    "scheduled_count" integer not null,
    "sent_count" integer not null default 0,
    "status" text
);


alter table "public"."broadcast_batch" enable row level security;

CREATE UNIQUE INDEX broadcas_batch_pkey ON public.broadcast_batch USING btree (id);

alter table "public"."broadcast_batch" add constraint "broadcas_batch_pkey" PRIMARY KEY using index "broadcas_batch_pkey";

set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.add_sent_count_to_broadcast(b_id uuid, sent_count_to_be_added integer)
 RETURNS void
 LANGUAGE plpgsql
AS $function$BEGIN

  -- SELECT id INTO batch_id
  -- FROM broadcast
  -- WHERE broadcast_id = b_id and status is null;

  update broadcast
  set sent_count = sent_count + sent_count_to_be_added
  WHERE id = b_id;

END;
$function$
;

CREATE OR REPLACE FUNCTION public.pick_next_broadcast_batch(b_id uuid)
 RETURNS uuid
 LANGUAGE plpgsql
AS $function$DECLARE
  batch_id UUID;
BEGIN
  -- Fetch broadcast batch id
  SELECT id INTO batch_id
  FROM broadcast_batch
  WHERE broadcast_id = b_id and status is null
  LIMIT 1 FOR UPDATE;

  -- Update status to "PICKED"
  UPDATE broadcast_batch
  SET status = 'PICKED'
  WHERE id = batch_id;

  -- Return the broadcast id
  RETURN batch_id;
END;
$function$
;

create policy "Enable all for authenticated users only on broadcast batch"
on "public"."broadcast_batch"
as permissive
for all
to authenticated
using (true)
with check (true);



