DROP FUNCTION IF EXISTS public.get_pending_payments_for_email();
CREATE OR REPLACE FUNCTION public.get_pending_payments_for_email()
RETURNS TABLE(invoice character varying, trip_start_date character varying, booking_date character varying,
			  num_people smallint, trip_end_date character varying, client_comments character varying,
			  responsible_name character varying, responsible_email character varying, agency character varying, 
			  contact character varying, phone character varying, email character varying,
			 address1 character varying, city character varying, client_state character varying) 
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
				b.invoice,
	 			b.trip_start_date,
	 			b.booking_date,
	 			b.num_people,
	 			b.trip_end_date,
	 			b.client_comments,
				b.responsible_name,
				b.responsible_email,
				cli.agency,
	 			cli.contact,
	 			cli.phone,
				cli.email,
	 			cli.address1,
	 			cli.city,
	 			cli.client_state
			FROM bookings b
			JOIN clients cli ON cli.client_id = b.client_id
			FULL OUTER JOIN balances ba ON ba.invoice = b.invoice
			WHERE (b.cost - COALESCE(ba.amount_paid,0)) > 0 AND b.is_quote = false AND b.trip_start_date::date < now() AND b.status != 'canceled'
			ORDER BY cli.agency, b.invoice);
END
$BODY$;

SELECT * FROM get_pending_payments_for_email()