DROP FUNCTION get_pending_farmout_payments();
CREATE OR REPLACE FUNCTION get_pending_farmout_payments()
RETURNS TABLE (company_id character varying,
			  company_name character varying,
			  invoice character varying,
			  trip_start_date character varying,
			  past_due numeric,
			  paid numeric,
			  amount_due numeric,
			  total_payments numeric)
LANGUAGE 'plpgsql'
AS $BODY$
BEGIN
	return query
	WITH due AS(
	WITH transactions AS (
		SELECT 
		SUM(amount) AS paid,
		farmout_transactions.invoice,
		farmout_transactions.account_id
		FROM farmout_transactions
		GROUP BY farmout_transactions.invoice, farmout_transactions.account_id
	)
	SELECT
		SUM(payment) AS past_due,
		d.company_id,
		b.invoice,
		b.trip_start_date,
		COALESCE (tr.paid,0) AS paid,
		SUM(payment) - COALESCE(tr.paid, 0) AS balance
	FROM service_details d JOIN services s ON s.service_id = d.service_id
		JOIN bookings b ON b.invoice = s.booking_id
		FULL OUTER JOIN farmout_accounts fa ON fa.company_id = d.company_id
		FULL OUTER JOIN transactions tr ON tr.invoice = b.invoice AND tr.account_id = fa.account_id
	WHERE start_time::date < now() AND d.use_farmout = true AND b.status != 'canceled' AND b.is_quote = false
	GROUP BY d.company_id, b.invoice, b.trip_start_date, fa.account_id, tr.paid)
	SELECT 
	a.company_id, 
	c.company_name, 
	d.invoice,
	d.trip_start_date,
	d.past_due,
	d.paid,
	d.balance as amount_due,
	a.total_payments
	FROM farmout_accounts a JOIN companies c ON c.company_id = a.company_id
	JOIN due d ON d.company_id = a.company_id
	ORDER BY c.company_name, d.invoice;
END;
$BODY$;



SELECT * FROM get_pending_farmout_payments();
