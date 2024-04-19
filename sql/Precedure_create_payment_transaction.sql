DROP PROCEDURE IF EXISTS public.create_payment_transaction(text, text, numeric, text, character, text, text);

CREATE OR REPLACE PROCEDURE public.create_payment_transaction(
	IN invoice text,
	IN accountid integer,
	IN amount numeric,
	IN transaction_date text,
	IN transaction_type character,
	IN payment_type text,
	IN doc_number text)
LANGUAGE 'plpgsql'
AS $BODY$
DECLARE 
	current_balance decimal(10,2) := (SELECT balance FROM accounts WHERE account_id = accountid);
	current_payments decimal(10,2) := (SELECT total_payments FROM accounts WHERE account_id = accountid);
BEGIN
  INSERT INTO transactions (account_id, invoice, amount, transaction_date, transaction_type, payment_type, doc_number)
  	VALUES (accountid, invoice, amount, transaction_date, transaction_type, payment_type, doc_number);
  UPDATE accounts SET balance = current_balance - amount, total_payments = current_payments + amount WHERE account_id = accountid;
END;
$BODY$;