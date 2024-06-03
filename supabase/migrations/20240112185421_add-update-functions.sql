set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.update_message_delivered_status(delivered_at_in timestamp with time zone, wam_id_in text)
 RETURNS boolean
 LANGUAGE plpgsql
AS $function$DECLARE
  delivered_at_existing TIMESTAMPTZ;
  successful bool;
BEGIN
  SELECT delivered_at INTO delivered_at_existing
  FROM messages
  WHERE wam_id = wam_id_in
  LIMIT 1 FOR UPDATE;
  if delivered_at_existing != null then
    successful := false;
  ELSE
    UPDATE messages
    SET delivered_at = delivered_at_in
    WHERE wam_id = wam_id_in;
    successful := true;
  END IF;
  RETURN successful;
END;

$function$
;

CREATE OR REPLACE FUNCTION public.update_message_read_status(wam_id_in text, read_at_in timestamp with time zone)
 RETURNS boolean
 LANGUAGE plpgsql
AS $function$DECLARE
  read_at_existing TIMESTAMPTZ;
  successful bool;
BEGIN
  SELECT read_at INTO read_at_existing
  FROM messages
  WHERE wam_id = wam_id_in
  LIMIT 1 FOR UPDATE;
  if read_at_existing != null then
    successful := false;
  ELSE
    UPDATE messages
    SET read_at = read_at_in
    WHERE wam_id = wam_id_in;
    successful := true;
  END IF;
  RETURN successful;
END;

$function$
;

CREATE OR REPLACE FUNCTION public.update_message_sent_status(wam_id_in text, sent_at_in timestamp with time zone)
 RETURNS boolean
 LANGUAGE plpgsql
AS $function$DECLARE
  sent_at_existing TIMESTAMPTZ;
  successful bool;
BEGIN
  SELECT sent_at INTO sent_at_existing
  FROM messages
  WHERE wam_id = wam_id_in
  LIMIT 1 FOR UPDATE;
  if sent_at_existing != null then
    successful := false;
  ELSE
    UPDATE messages
    SET sent_at = sent_at_in
    WHERE wam_id = wam_id_in;
    successful := true;
  END IF;
  RETURN successful;
END;

$function$
;


