DROP FUNCTION IF EXISTS public.has_vehicle_trip(integer, character varying, character varying);
CREATE OR REPLACE FUNCTION public.has_vehicle_trip(detailId integer, vehicleId character varying, serviceDate character varying)
RETURNS table (foundit integer)
LANGUAGE 'plpgsql'
AS $$
BEGIN 
	return query
		select 1 as foundit from service_details sd 
		join services s ON s.service_id = sd.service_id 
		where sd.vehicle_id = vehicleId
		AND sd.detail_id != detailId
		AND s.service_date LIKE serviceDate || '%';
END
$$;