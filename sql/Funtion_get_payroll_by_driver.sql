Drop function get_payroll_by_driver;
CREATE OR REPLACE FUNCTION public.get_payroll_by_driver(
	startdate character varying,
	enddate character varying)
    RETURNS TABLE(driver text,
				  employee_id text,
				  service_date text,
				  start_time text,
				  end_time text,
				  location_from text,
				  location_to text,
				  invoice text,
				  payment numeric,
				  gratuity numeric
				 ) 
    LANGUAGE 'plpgsql'
    COST 100
    VOLATILE PARALLEL UNSAFE
    ROWS 1000

AS $BODY$
BEGIN 
	return query
		(SELECT
			e.firstname || ' ' || e.lastname AS fullname,
		 	e.employee_id,
			s.service_date,
			sd.start_time,
			sd.end_time,
			lf.location_name AS location_from,
			lt.location_name AS location_to,
			s.booking_id,
			sd.payment,
			sd.gratuity
		FROM employees e JOIN service_details sd ON sd.employee_id = e.employee_id
		JOIN services s ON s.service_id = sd.service_id
		JOIN locations lf ON sd.from_location_id = lf.location_id
		JOIN locations lt ON sd.to_location_id = lt.location_id
		JOIN bookings b ON b.invoice = s.booking_id
		WHERE e.title = 'Driver' AND b.is_quote = false AND s.service_date >= startdate AND s.service_date <= enddate
		ORDER BY 1);
END
$BODY$;