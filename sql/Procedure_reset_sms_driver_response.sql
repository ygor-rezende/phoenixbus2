CREATE OR REPLACE PROCEDURE public.reset_sms_driver_response(IN smsid text)
LANGUAGE 'plpgsql'
AS $BODY$
BEGIN
	UPDATE sms SET confirmed_rejected = NULL, answer_timestamp = NULL WHERE sms_id = smsid;
END;
$BODY$;