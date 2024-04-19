DROP FUNCTION IF EXISTS public.get_trips_by_driver(character varying);
DROP TYPE IF EXISTS public.my_table_type;

CREATE TYPE public.my_table_type AS
(
	employee_id character varying(255),
	service_date character varying(30),
	service_code character varying(10),
	vehicle_name character varying(255),
	vehicle_color character varying(255),
	spot_time character varying(30),
	start_time character varying(30),
	end_time character varying(30),
	return_time character varying(30),
	instructions text,
	from_location_name character varying(255),
	from_address character varying(255),
	from_city character varying(100),
	from_state character varying(255),
	from_zip character varying(6),
	to_location_name character varying(255),
	to_address character varying(255),
	to_city character varying(100),
	to_state character varying(255),
	to_zip character varying(6),
	num_people smallint
);


CREATE OR REPLACE FUNCTION public.get_trips_by_driver(
	userid character varying)
    RETURNS TABLE(table_result my_table_type) 
    LANGUAGE 'plpgsql'
    COST 100
    VOLATILE PARALLEL UNSAFE
    ROWS 1000

AS $BODY$
BEGIN
	return query
		SELECT 
			e.employee_id,
			s.service_date,
			s.service_code,
			v.vehicle_name,
			v.vehicle_color,
			sd.spot_time,
			sd.start_time,
			sd.end_time,
			sd.return_time,
			sd.instructions,
			fl.location_name AS from_location_name,
			fl.address AS from_address,
			fl.city AS from_city,
			fl.location_state AS from_state,
			fl.zip AS from_zip,
			tl.location_name AS to_location_name,
			tl.address AS to_address,
			tl.city AS to_city,
			tl.location_state AS to_state,
			tl.zip AS to_zip,
			b.num_people
		from employees e
		join service_details sd on e.employee_id = sd.employee_id
		join locations fl on fl.location_id = sd.from_location_id
		join locations tl on tl.location_id = sd.to_location_id
		join vehicles v on v.vehicle_id = sd.vehicle_id
		join services s on s.service_id = sd.service_id
		join bookings b on b.invoice = s.booking_id
		where user_id = userId AND b.is_quote = false AND b.status != 'canceled';
END; 
$BODY$;

DROP TYPE IF EXISTS public.service_details_table_type;

CREATE TYPE public.service_details_table_type AS
(
	detail_id integer,
	service_id integer,
	employee_id character varying(50),
	vehicle_id character varying(50),
	from_location_id character varying(50),
	to_location_id character varying(50),
	spot_time character varying(30),
	start_time character varying(30),
	end_time character varying(30),
	instructions text,
	payment numeric(10,2),
	gratuity numeric(10,2),
	company_id character varying(50),
	use_farmout boolean,
	return_location_id character varying(50),
	additional_stop boolean,
	additional_stop_info text,
	additional_stop_detail character varying(10),
	trip_length numeric(10,2),
	change_user character varying(50),
	return_time character varying(30)
);
