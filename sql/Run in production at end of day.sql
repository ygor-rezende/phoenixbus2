CREATE OR REPLACE PROCEDURE public.update_email_views(
	IN emailid text)
LANGUAGE 'plpgsql'
AS $BODY$
DECLARE id_selected character varying := (SELECT email_id FROM emails WHERE email_id = emailid);
	numtimesviewed smallint := (SELECT num_times_opened FROM emails WHERE email_id = emailid);
BEGIN
	IF(id_selected IS NOT NULL) THEN
		UPDATE emails SET num_times_opened = numtimesviewed + 1
		WHERE email_id = id_selected;
	END IF;
END;
$BODY$;