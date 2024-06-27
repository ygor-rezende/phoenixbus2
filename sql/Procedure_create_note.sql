CREATE OR REPLACE PROCEDURE public.create_note(
	IN note_text text,
	IN username text)
LANGUAGE 'plpgsql'
AS $BODY$
BEGIN
	  INSERT INTO notes (note_text, username, datetime)
	  VALUES (note_text, username, now());
END;
$BODY$;