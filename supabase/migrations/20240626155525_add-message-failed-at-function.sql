alter table "public"."messages" add column "failed_at" timestamp with time zone;
alter table "public"."broadcast_contact" add column "failed_at" timestamp with time zone;
alter table "public"."broadcast" add column "failed_count" integer not null default 0;


set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.update_message_failed_status(wam_id_in text, failed_at_in timestamp with time zone)
 RETURNS boolean
 LANGUAGE plpgsql
AS $function$DECLARE
  failed_at_existing TIMESTAMPTZ;
  successful bool;
BEGIN
  SELECT failed_at INTO failed_at_existing
  FROM messages
  WHERE wam_id = wam_id_in
  LIMIT 1 FOR UPDATE;
  if failed_at_existing is not null then
    successful := false;
  ELSE
    UPDATE messages
    SET failed_at = failed_at_in
    WHERE wam_id = wam_id_in;
    successful := true;
  END IF;
  RETURN successful;
END;

$function$
;


CREATE OR REPLACE FUNCTION public.add_failed_count_to_broadcast(b_id uuid, failed_count_to_be_added integer)
 RETURNS void
 LANGUAGE plpgsql
AS $function$BEGIN

  update broadcast
  set failed_count = failed_count + failed_count_to_be_added
  WHERE id = b_id;

END;
$function$
;

