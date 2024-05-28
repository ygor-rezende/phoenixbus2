DROP FUNCTION IF EXISTS calculate_farmout_balance();
CREATE OR REPLACE FUNCTION calculate_farmout_balance()
RETURNS TABLE (account_id integer,
			  company_id character varying,
			  company_name character varying,
			  balance numeric,
			  total_payments numeric)
LANGUAGE 'plpgsql'
AS $BODY$
DECLARE payment_record RECORD;
BEGIN
	FOR payment_record IN (SELECT SUM(sd.payment) AS amount_due, sd.company_id FROM service_details sd
						   JOIN services s ON s.service_id = sd.service_id
							JOIN bookings b ON b.invoice = s.booking_id
							WHERE sd.use_farmout = true AND b.status != 'canceled' AND b.is_quote = false
							GROUP BY sd.company_id) LOOP		
			UPDATE farmout_accounts SET balance = payment_record.amount_due - farmout_accounts.total_payments WHERE farmout_accounts.company_id = payment_record.company_id;	
	END LOOP;
	RETURN query SELECT fa.account_id, fa.company_id, c.company_name, fa.balance, fa.total_payments 
				FROM farmout_accounts fa JOIN companies c ON c.company_id = fa.company_id
				ORDER BY c.company_name;
END;
$BODY$;
	
	

