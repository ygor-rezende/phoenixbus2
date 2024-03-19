SELECT
sum(sd.payment) as totalfarmout
FROM service_details sd JOIN services s ON s.service_id = sd.service_id
JOIN bookings b ON b.invoice = s.booking_id
WHERE sd.use_farmout = true AND b.is_quote = false AND s.service_date >= '2024-02-01' AND s.service_date < '2024-02-29'


SELECT
cli.agency,
SUM(s.charge) AS totalsales
FROM bookings b JOIN services s ON b.invoice = s.booking_id
JOIN clients cli ON b.client_id = cli.client_id
WHERE b.is_quote = false AND s.service_date >= '2024-02-01' AND s.service_date < '2024-02-29'
GROUP BY cli.agency


SELECT
cli.agency,
SUM(s.charge) AS totalsales,
x.totalfarmout
FROM bookings b JOIN services s ON b.invoice = s.booking_id
JOIN clients cli ON b.client_id = cli.client_id
LEFT JOIN LATERAL(SELECT
					sum(sd.payment) as totalfarmout
					FROM service_details sd JOIN services s ON s.service_id = sd.service_id
					JOIN bookings b ON b.invoice = s.booking_id
					WHERE sd.use_farmout = true AND b.is_quote = false AND s.service_date >= '2024-02-01' AND s.service_date < '2024-02-29') AS x ON true
WHERE b.is_quote = false AND s.service_date >= '2024-02-01' AND s.service_date < '2024-02-29'
GROUP BY cli.agency, x.totalfarmout