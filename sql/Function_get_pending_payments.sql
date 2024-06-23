DROP FUNCTION IF EXISTS public.get_pending_payments();

CREATE OR REPLACE FUNCTION public.get_pending_payments(
	)
    RETURNS TABLE(service_name text, invoice character varying, start_date character varying, cost numeric, amount_paid numeric, invoice_balance numeric,
				  client_id character varying, agency character varying, account_balance numeric, received numeric) 
    LANGUAGE 'plpgsql'
    COST 100
    VOLATILE PARALLEL UNSAFE
    ROWS 1000

AS $BODY$
BEGIN 
	return query
		(WITH balances AS (
			select 
			b.invoice,
			b.cost,
			COALESCE(SUM (tr.amount),0) AS amount_paid,
			b.cost - COALESCE(SUM (tr.amount),0) AS balance
			FROM bookings b JOIN transactions tr ON tr.invoice = b.invoice
			WHERE is_quote = false AND b.status != 'canceled' AND tr.transaction_type = 'p'
			GROUP BY b.invoice, b.cost, tr.transaction_type
			)		  
			SELECT
				MIN(s.service_name) AS service_name,
				b.invoice,
				b.trip_start_date,
				b.cost,
				COALESCE(ba.amount_paid,0) AS amount_paid,
				CASE WHEN ba.balance is null THEN b.cost ELSE ba.balance END AS invoice_balance,
				cli.client_id,
				cli.agency,
				ac.balance AS account_balance,                                             
				ac.total_payments
			FROM services s JOIN bookings b ON b.invoice = s.booking_id
			JOIN clients cli ON cli.client_id = b.client_id
			JOIN accounts ac ON ac.client_id = cli.client_id
			FULL OUTER JOIN balances ba ON ba.invoice = b.invoice
			WHERE (b.cost - COALESCE(ba.amount_paid,0)) > 0AND b.is_quote = false AND b.trip_start_date::date < now() AND b.status != 'canceled'
			GROUP BY b.invoice, b.trip_start_date, b.cost, ba.amount_paid, ba.balance, cli.client_id, cli.agency, ac.balance, ac.total_payments
			ORDER BY cli.agency, b.invoice
	);
END
$BODY$;

SELECT * FROM get_pending_payments();