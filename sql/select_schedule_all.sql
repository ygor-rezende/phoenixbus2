select 
b.invoice,
s.service_id,
s.charge,
s.service_date,
s.service_code,
d.detail_id,
d.spot_time,
d.start_time,
d.end_time,
d.instructions,
d.payment,
d.use_farmout,
c.company_id,
c.company_name,
e.employee_id,
e.firstname,
e.lastname,
v.vehicle_id,
v.vehicle_name,
v.vehicle_color,
lf.location_id as from_location_id,
lf.location_name as from_location,
lf.city as from_city,
lt.location_id as to_location_id,
lt.location_name as to_location,
lt.city as to_city
from bookings b join services s on b.invoice = s.booking_id
join service_details d on d.service_id = s.service_id
full outer join employees e on e.employee_id = d.employee_id
full outer join vehicles v on v.vehicle_id = d.vehicle_id
join locations lf on lf.location_id = d.from_location_id
join locations lt on lt.location_id = d.to_location_id
full outer join companies c on c.company_id = d.company_id
WHERE s.service_date >= '2024-02-01' AND s.service_date < to_char((DATE '2024-02-22' + INTERVAL '1 day'),'YYYY-MM-DD')
ORDER BY s.service_date, d.start_time