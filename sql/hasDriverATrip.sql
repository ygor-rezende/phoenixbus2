DROP FUNCTION IF EXISTS public.has_driver_trip(integer, character varying, character varying);
CREATE OR REPLACE FUNCTION public.has_driver_trip(detailId integer, employeeId character varying, serviceDate character varying)
RETURNS table (foundit integer)
LANGUAGE 'plpgsql'
AS $$
BEGIN 
	return query
		select 1 as foundit from service_details sd 
		join services s ON s.service_id = sd.service_id 
		where sd.employee_id = employeeId
		AND sd.detail_id != detailId
		AND s.service_date LIKE serviceDate || '%';
END
$$;