DROP FUNCTION get_amount_due_by_invoice();
CREATE OR REPLACE FUNCTION public.get_amount_due_by_invoice()
    RETURNS TABLE(invoice character varying, total_debit numeric, total_pay numeric, amount_due numeric) 
    LANGUAGE 'plpgsql'
    COST 100
    VOLATILE PARALLEL UNSAFE
    ROWS 1000

AS $BODY$
BEGIN 
	return query
		(WITH payments AS (
			SELECT tr.invoice,
				COALESCE(SUM(amount),0) AS totalPay
			FROM transactions tr
			WHERE transaction_type = 'p'
			GROUP BY tr.invoice
			),
			debits AS(
				SELECT tr.invoice,
					COALESCE(SUM(amount),0) AS totalDebit
				FROM transactions tr
				WHERE transaction_type = 'd'
				GROUP BY tr.invoice
			)
			SELECT
				de.invoice,
				de.totalDebit,
				pa.totalpay,
				CASE WHEN de.totaldebit - pa.totalpay <= 0 THEN 0 ELSE de.totaldebit - pa.totalpay END AS amountdue
			FROM debits de JOIN payments pa ON de.invoice = pa.invoice);
END
$BODY$;


select * from get_amount_due_by_invoice();



