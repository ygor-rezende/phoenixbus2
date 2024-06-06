DROP TABLE IF EXISTS public.sms;

CREATE TABLE IF NOT EXISTS public.sms
(
    sms_id character varying(50) COLLATE pg_catalog."default" NOT NULL,
    to_phone character varying(50) COLLATE pg_catalog."default" NOT NULL,
    delivery_status character varying(10) COLLATE pg_catalog."default" NOT NULL,
    delivery_timestamp timestamp without time zone NOT NULL,
    confirmed_rejected character(1),
    answer_timestamp timestamp without time zone,
    detail_id smallint,
    CONSTRAINT sms_pkey PRIMARY KEY (sms_id),
    CONSTRAINT fk_detail_id FOREIGN KEY (detail_id)
        REFERENCES public.service_details (detail_id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION
        NOT VALID
);

DROP PROCEDURE IF EXISTS public.confirm_sms(text);

CREATE OR REPLACE PROCEDURE public.confirm_sms(
	IN smsid text,
	IN answer character)
LANGUAGE 'plpgsql'
AS $BODY$
BEGIN
  UPDATE sms SET confirmed_rejected = answer, answer_timestamp = now()
  WHERE sms_id = smsid;
END;
$BODY$;

DROP PROCEDURE IF EXISTS public.create_sms(text, smallint, text, text);

CREATE OR REPLACE PROCEDURE public.create_sms(
	IN sms_id text,
	IN detail_id smallint,
	IN to_phone text,
	IN delivery_status text)
LANGUAGE 'plpgsql'
AS $BODY$
BEGIN
  INSERT INTO sms (sms_id, detail_id, to_phone, delivery_status, delivery_timestamp)
  VALUES (sms_id, detail_id, to_phone, delivery_status, now());
END;
$BODY$;