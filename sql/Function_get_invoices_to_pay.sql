CREATE OR REPLACE FUNCTION public.get_invoices_to_pay(
	)
    RETURNS TABLE(invoice character varying, account_id integer, amount numeric, payment_type character varying, doc_number character varying,
				 	transaction_date character varying, transaction_type character, cost numeric, balance numeric) 
    LANGUAGE 'plpgsql'
    COST 100
    VOLATILE PARALLEL UNSAFE
    ROWS 1000

AS $BODY$
BEGIN 
	return query (
		WITH balances AS (
			select 
			b.invoice,
			b.cost - COALESCE(SUM (tr.amount),0) AS balance
			FROM bookings b JOIN transactions tr ON tr.invoice = b.invoice
			WHERE is_quote = false AND b.status != 'canceled' AND tr.transaction_type = 'p'
			GROUP BY b.invoice, b.cost, tr.transaction_type
			)		  
				SELECT
					  b.invoice,
					  tr.account_id,
					  tr.amount,
					  tr.payment_type,
					  tr.doc_number,
					  tr.transaction_date,
					  tr.transaction_type,
					  b.cost,
					  CASE WHEN ba.balance is null THEN b.cost ELSE ba.balance END AS balance
				  FROM bookings b JOIN transactions tr ON tr.invoice = b.invoice
				  FULL OUTER JOIN balances ba ON ba.invoice = b.invoice
				  WHERE is_quote = false AND b.status != 'canceled'
				  ORDER BY b.invoice, tr.transaction_date
		);
END
$BODY$;