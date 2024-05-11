DROP TABLE IF EXISTS public.emails;

CREATE TABLE IF NOT EXISTS public.emails
(
    email_id character varying(50) COLLATE pg_catalog."default" NOT NULL,
    email_address character varying(50) COLLATE pg_catalog."default" NOT NULL,
    attachment_path character varying(100) COLLATE pg_catalog."default" NOT NULL,
    time_stamp timestamp without time zone NOT NULL,
    who_sent character varying(50) COLLATE pg_catalog."default",
    email_type character varying(10) COLLATE pg_catalog."default" NOT NULL,
    num_times_sent smallint NOT NULL,
	num_times_opened smallint NOT NULL,
    CONSTRAINT emails_pkey PRIMARY KEY (email_id)
);


CREATE OR REPLACE PROCEDURE public.create_update_email(
	IN emailid text,
	IN emailaddress text,
	IN attachmentpath text,
	IN whosent text,
	IN emailtype text)
LANGUAGE 'plpgsql'
AS $BODY$
DECLARE id_selected character varying := (SELECT email_id FROM emails WHERE email_id = emailid);
	numtimessent smallint := (SELECT num_times_sent FROM emails WHERE email_id = emailid);
BEGIN
	IF(id_selected IS NOT NULL) THEN
		UPDATE emails SET email_address = emailaddress, who_sent = whosent, num_times_sent = numtimessent + 1, 
		time_stamp = now() WHERE email_id = id_selected;
	ELSE
  		INSERT INTO emails (email_id, email_address, attachment_path, time_stamp, who_sent, email_type, num_times_sent, num_times_opened)
			VALUES (emailid, emailaddress, attachmentpath, now(), whosent, emailtype, 1, 0);
	END IF;
END;
$BODY$;
