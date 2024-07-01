DROP TABLE IF EXISTS public.notes;
CREATE TABLE IF NOT EXISTS public.notes
(
    note_id serial,
    note_text text NOT NULL,
    username character varying(255) NOT NULL,
    datetime timestamp without time zone NOT NULL,
    CONSTRAINT notes_pkey PRIMARY KEY (note_id),
    CONSTRAINT fk_user FOREIGN KEY (username)
        REFERENCES public.users (username) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION
        NOT VALID
);

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

CREATE OR REPLACE PROCEDURE public.delete_note(
	IN noteid integer,
	IN changeuser text)
LANGUAGE 'plpgsql'
AS $BODY$
DECLARE username character varying(255) := (SELECT username FROM notes WHERE note_id = noteid);
BEGIN
	IF(username = changeuser) THEN
	  UPDATE notes SET note_text = 'note deleted on ' || TO_CHAR(CURRENT_TIMESTAMP, 'YYYY-MM-DD"T"HH24:MI:SS.000Z') WHERE note_id = noteid;
	END IF;
END;
$BODY$;
