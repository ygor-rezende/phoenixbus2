CREATE OR REPLACE PROCEDURE public.delete_note(
	IN noteid integer,
	IN changeuser text)
LANGUAGE 'plpgsql'
AS $BODY$
DECLARE username character varying(255) := (SELECT username FROM notes WHERE note_id = noteid);
BEGIN
	IF(username = changeuser) THEN
	  UPDATE notes SET note_text = 'Note deleted', delete_timestamp = now() WHERE note_id = noteid;
	END IF;
END;
$BODY$;