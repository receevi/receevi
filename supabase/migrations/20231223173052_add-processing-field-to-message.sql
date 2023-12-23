alter table "public"."broadcast" add column "processed_count" integer not null default 0;

alter table "public"."broadcast_contact" add column "processed_at" timestamp with time zone;

set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.add_processed_count_to_broadcast(b_id uuid, processed_count_to_be_added integer)
 RETURNS void
 LANGUAGE plpgsql
AS $function$BEGIN

  update broadcast
  set processed_count = processed_count + processed_count_to_be_added
  WHERE id = b_id;

END;
$function$
;


