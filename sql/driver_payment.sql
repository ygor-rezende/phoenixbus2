SELECT
fullname,
SUM (payperweek) AS payment,
SUM (gratperweek) AS gratuity
FROM (SELECT
e.firstname || ' ' || e.lastname AS fullname,
sd.detail_id,
sd.payment / calc_num_of_days(sd.start_time, sd.end_time) * calc_days_worked_in_week('2024-03-04T05:00:00.000Z','2024-03-11T03:59:59.000Z',sd.start_time,sd.end_time)as payperweek,
sd.gratuity / calc_num_of_days(sd.start_time, sd.end_time) * calc_days_worked_in_week('2024-03-04T05:00:00.000Z','2024-03-11T03:59:59.000Z',sd.start_time,sd.end_time)as gratperweek
FROM employees e join service_details sd ON e.employee_id = sd.employee_id 
WHERE e.title = 'Driver') AS pay
GROUP BY fullname
HAVING SUM (payperweek) > 0 OR SUM (gratperweek) > 0


SELECT
e.firstname || ' ' || e.lastname AS fullname,
sd.detail_id,
sd.payment / calc_num_of_days(sd.start_time, sd.end_time) * calc_days_worked_in_week('2024-03-04T05:00:00.000Z','2024-03-11T03:59:59.000Z',sd.start_time,sd.end_time)as payperweek,
sd.gratuity / calc_num_of_days(sd.start_time, sd.end_time) * calc_days_worked_in_week('2024-03-04T05:00:00.000Z','2024-03-11T03:59:59.000Z',sd.start_time,sd.end_time)as gratperweek
FROM employees e join service_details sd ON e.employee_id = sd.employee_id 
WHERE e.title = 'Driver'


select calc_days_worked_in_week('2024-03-11T05:00:00.000Z','2024-03-18T03:59:59.000Z','2024-03-10T06:00:00.000Z','2024-03-19T06:20:00.000Z')

select * FROM get_driver_payment('2024-02-04T05:00:00.000Z','2024-02-21T03:59:59.000Z')




