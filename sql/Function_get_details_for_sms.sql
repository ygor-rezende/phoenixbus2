DROP FUNCTION IF EXISTS get_details_for_sms(integer);
CREATE OR REPLACE FUNCTION public.get_details_for_sms(detailid integer)
    RETURNS TABLE(firstname character varying(30), phone character varying(16), yard_time character varying(30), start_time character varying(30), vehicle_name character varying(255)) 
    LANGUAGE 'plpgsql'
    COST 100
    VOLATILE PARALLEL UNSAFE
    ROWS 1000
AS $BODY$
BEGIN
	RETURN QUERY 
		SELECT 
		e.firstname,
		e.phone,
		d.spot_time,
		d.start_time,
		v.vehicle_name
		from service_details d JOIN employees e ON e.employee_id = d.employee_id
		JOIN vehicles v ON v.vehicle_id = d.vehicle_id
		WHERE d.detail_id = detailid;
END
$BODY$;

SELECT * FROM get_details_for_sms(20);