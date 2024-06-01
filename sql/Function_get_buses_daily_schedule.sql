CREATE OR REPLACE FUNCTION public.get_buses_daily_schedule(
	servicedate character varying)
    RETURNS TABLE(vehicle_name character varying, maintenance boolean, yard_time character varying, end_time character varying) 
    LANGUAGE 'plpgsql'
    COST 100
    VOLATILE PARALLEL UNSAFE
    ROWS 1000

AS $BODY$
BEGIN 
	return query	
		(WITH trips AS (SELECT d.detail_id,
		d.spot_time,
		d.end_time,
		d.vehicle_id
		FROM service_details d JOIN services s ON s.service_id = d.service_id
					   JOIN bookings b ON b.invoice = s.booking_id
		WHERE s.service_date LIKE serviceDate AND b.is_quote = false AND b.status != 'canceled' AND d.use_farmout = false)
		SELECT 
		v.vehicle_name, 
		v.maintenance,
		tr.spot_time,
		tr.end_time
		FROM vehicles v FULL OUTER JOIN trips tr ON tr.vehicle_id = v.vehicle_id
		WHERE v.inactive = false
		order by v.vehicle_name);
END
$BODY$;
