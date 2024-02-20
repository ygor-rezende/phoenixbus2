DROP FUNCTION get_trips_by_driver;
DROP TYPE my_table_type;
CREATE TYPE my_table_type AS (
	employee_id VARCHAR(255),
	service_date VARCHAR(30),
	service_code VARCHAR(10),
	vehicle_name VARCHAR(255),
	vehicle_color VARCHAR(255),
	spot_time VARCHAR(30),
	start_time VARCHAR(30),
	end_time VARCHAR(30),
	instructions VARCHAR(255),
	from_location_name VARCHAR(255),
	from_address VARCHAR(255),
	from_city VARCHAR(100),
	from_state VARCHAR(255),
	from_zip VARCHAR(6),
	to_location_name VARCHAR(255),
	to_address VARCHAR(255),
	to_city VARCHAR(100),
	to_state VARCHAR(255),
	to_zip VARCHAR(6),
	num_people SMALLINT
);
CREATE OR REPLACE FUNCTION get_trips_by_driver (userId VARCHAR(255))
RETURNS TABLE (table_result my_table_type) language plpgsql AS $$
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
		where user_id = userId;
END; $$

SELECT * FROM get_trips_by_driver('ylopezr')
		

