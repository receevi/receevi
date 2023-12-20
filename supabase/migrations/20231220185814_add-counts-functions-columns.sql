alter table "public"."broadcast_contact" add column "reply_counted" boolean not null default false;

alter table "public"."messages" add column "delivered_at" timestamp with time zone;

alter table "public"."messages" add column "read_at" timestamp with time zone;

alter table "public"."messages" add column "sent_at" timestamp with time zone;

set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.add_delivered_count_to_broadcast(b_id uuid, delivered_count_to_be_added integer)
 RETURNS void
 LANGUAGE plpgsql
AS $function$BEGIN

  update broadcast
  set delivered_count = delivered_count + delivered_count_to_be_added
  WHERE id = b_id;

END;
$function$
;

CREATE OR REPLACE FUNCTION public.add_read_count_to_broadcast(b_id uuid, read_count_to_be_added integer)
 RETURNS void
 LANGUAGE plpgsql
AS $function$BEGIN

  update broadcast
  set read_count = read_count + read_count_to_be_added
  WHERE id = b_id;

END;
$function$
;

CREATE OR REPLACE FUNCTION public.add_replied_to_broadcast_contact(b_id uuid, replied_count_to_be_added integer)
 RETURNS void
 LANGUAGE plpgsql
AS $function$BEGIN

  update broadcast
  set replied_count = replied_count + replied_count_to_be_added
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

  -- BEGIN

    -- Fetch broadcast batch id
    SELECT id INTO batch_id
    FROM broadcast_batch
    WHERE broadcast_id = b_id and status is null
    LIMIT 1 FOR UPDATE;

    -- Update status to "PICKED"
    UPDATE broadcast_batch
    SET status = 'PICKED'
    WHERE id = batch_id;

    -- COMMIT;

  -- EXCEPTION
  -- WHEN OTHERS THEN
  --   -- Handle exceptions and rollback the transaction
  --   ROLLBACK;
  --   RAISE;
  -- END;

  -- Return the broadcast id
  RETURN batch_id;
END;
$function$
;


