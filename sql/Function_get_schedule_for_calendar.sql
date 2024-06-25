CREATE OR REPLACE FUNCTION public.get_schedule_for_calendar(start_date character varying, end_date character varying)
    RETURNS TABLE(service_id integer, charge numeric, service_date character varying, service_code character varying, detail_id integer, use_farmout boolean) 
    LANGUAGE 'plpgsql'
    COST 100
    VOLATILE PARALLEL UNSAFE
    ROWS 1000
AS $BODY$
BEGIN 
	return query
		select 
				s.service_id,
				s.charge,
				s.service_date,
				s.service_code,
				d.detail_id,        
				d.use_farmout        
				from services s join service_details d on d.service_id = s.service_id
				join bookings b on b.invoice = s.booking_id
				WHERE b.is_quote = false AND s.service_date >= start_date AND s.service_date < end_date AND b.status != 'canceled'
				ORDER BY s.service_date;
END
$BODY$;