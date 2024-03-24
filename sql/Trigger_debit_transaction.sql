CREATE OR REPLACE FUNCTION create_debit_transaction() RETURNS TRIGGER AS $debit_transaction$
DECLARE account integer := (SELECT account_id FROM accounts WHERE client_id = NEW.client_id);
		current_balance decimal(10,2) := (SELECT balance FROM accounts WHERE account_id = account);
	BEGIN
		IF(NEW.is_quote = false) THEN
			IF(TG_OP = 'INSERT') THEN
				INSERT INTO transactions (account_id, invoice, amount, transaction_date, transaction_type)
					VALUES (account, NEW.invoice, NEW.cost, new.booking_date, 'd');
				UPDATE accounts SET balance = current_balance + NEW.cost WHERE account_id = account;
			ELSIF(TG_OP = 'UPDATE') THEN
				IF(NEW.cost != OLD.cost) THEN
					INSERT INTO transactions (account_id, invoice, amount, transaction_date, transaction_type)
						VALUES (account, NEW.invoice, NEW.cost - OLD.cost, TO_CHAR(CURRENT_TIMESTAMP, 'YYYY-MM-DD"T"HH24:MI:SS.000Z'), 'd');
					UPDATE accounts SET balance = current_balance + (NEW.cost - OLD.cost) WHERE account_id = account;
				END IF;
			END IF;
		END IF;
		RETURN NULL;
	END;
$debit_transaction$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS debit_transaction ON bookings;
CREATE TRIGGER debit_transaction
AFTER INSERT OR UPDATE ON bookings
	FOR EACH ROW EXECUTE FUNCTION create_debit_transaction();