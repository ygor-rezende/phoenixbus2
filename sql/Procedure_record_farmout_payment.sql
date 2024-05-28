CREATE OR REPLACE PROCEDURE public.record_farmout_payment(
	IN accountid integer,
	IN amount numeric,
	IN transaction_date text,
	IN payment_type text,
	IN doc_number text)
LANGUAGE 'plpgsql'
AS $BODY$
DECLARE 
	current_payments decimal(10,2) := (SELECT total_payments FROM farmout_accounts WHERE account_id = accountid);
BEGIN
  INSERT INTO farmout_transactions (account_id, amount, transaction_date, payment_type, doc_number)
  	VALUES (accountid, amount, transaction_date, payment_type, doc_number);
  UPDATE farmout_accounts SET total_payments = current_payments + amount WHERE account_id = accountid;
END;
$BODY$;