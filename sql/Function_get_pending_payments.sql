CREATE OR REPLACE FUNCTION public.get_pending_payments()
    RETURNS TABLE(service_name character varying,
				  invoice character varying, 
				  service_date character varying,
				  cost numeric,
				  gratuity numeric,
				  client_id character varying,
				  agency character varying,
				  balance numeric,
				  received numeric
				 ) 
    LANGUAGE 'plpgsql'
AS $BODY$
BEGIN 
	return query
		(SELECT
			s.service_name,
			s.booking_id,
			s.service_date,
			s.charge * s.qty as cost,
			s.gratuity,
			cli.client_id,
			cli.agency,
			ac.balance,
			ac.total_payments
		FROM services s JOIN bookings b ON b.invoice = s.booking_id
		JOIN clients cli ON cli.client_id = b.client_id
		JOIN accounts ac ON ac.client_id = cli.client_id
		WHERE ac.balance > 0 AND s.charge > 0);
END
$BODY$;