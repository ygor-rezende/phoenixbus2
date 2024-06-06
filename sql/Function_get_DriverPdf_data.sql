DROP FUNCTION IF EXISTS public.get_driver_pdf_data(integer);
DROP TYPE IF EXISTS driver_pdf_table_type;
CREATE TYPE public.driver_pdf_table_type AS
(
	invoice character varying(255),
	service_date character varying(30),
	service_code character varying(10),
	detail_id integer,
	spot_time character varying(30),
	start_time character varying(30),
	return_time character varying(30),
	instructions text,
	payment numeric(10,2),
	use_farmout boolean,
	additional_stop_info text,
	additional_stop_detail character varying(10),
	company_name character varying(255),
	firstname character varying(30),
	lastname character varying(30),
	vehicle_name character varying(255),
	agency character varying(255),
	contact character varying(255),
	phone character varying(16),
	from_location character varying(255),
	from_city character varying(100),
	from_address character varying(255),
	from_state character varying(255),
	to_location character varying(255),
	to_city character varying(100),
	to_address character varying(255),
	to_state character varying(255),
	return_location character varying(255),
	return_city character varying(100),
	return_address character varying(255),
	return_state character varying(255)
);

CREATE OR REPLACE FUNCTION public.get_driver_pdf_data(
	detailid integer)
	RETURNS TABLE(table_result driver_pdf_table_type)
	LANGUAGE 'plpgsql'
	
AS $BODY$
BEGIN
	return query
		select 
				b.invoice,
				s.service_date,
				s.service_code,
				d.detail_id,
				d.spot_time,
				d.start_time,
				d.return_time,
				d.instructions,
				d.payment,
				d.use_farmout,
				d.additional_stop_info,
				d.additional_stop_detail,
				c.company_name,
				e.firstname,
				e.lastname,
				v.vehicle_name,
				cli.agency,
				cli.contact,
				cli.phone,
				lf.location_name as from_location,
				lf.city as from_city,
				lf.address as from_address,
				lf.location_state as from_state,
				lt.location_name as to_location,
				lt.city as to_city,
				lt.address as to_address,
				lt.location_state as to_state,
				lr.location_name as return_location,
				lr.city as return_city,
				lr.address as return_address,
				lr.location_state as return_state
				from bookings b join services s on b.invoice = s.booking_id
				join clients cli on cli.client_id = b.client_id
				join service_details d on d.service_id = s.service_id
				full outer join employees e on e.employee_id = d.employee_id
				full outer join vehicles v on v.vehicle_id = d.vehicle_id
				join locations lf on lf.location_id = d.from_location_id
				join locations lt on lt.location_id = d.to_location_id
				full outer join locations lr on lr.location_id = d.return_location_id
				full outer join companies c on c.company_id = d.company_id
				WHERE d.detail_id = detailid;
END; 
$BODY$;

SELECT * FROM get_driver_pdf_data(20);