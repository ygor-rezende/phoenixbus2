SELECT 
	e.employee_id,
	s.service_date,
	v.vehicle_name,
	v.vehicle_color,
	sd.spot_time,
	sd.start_time,
	sd.end_time,
	sd.base_time,
	sd.released_time,
	sd.service_type,
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
	tl.zip AS to_zip
	
from employees e
join service_details sd on e.employee_id = sd.employee_id
join locations fl on fl.location_id = sd.from_location_id
join locations tl on tl.location_id = sd.to_location_id
join vehicles v on v.vehicle_id = sd.vehicle_id
join services s on s.service_id = sd.service_id
where user_id = 'ylopezr';