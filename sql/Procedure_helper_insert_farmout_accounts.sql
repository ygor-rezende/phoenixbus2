CREATE OR REPLACE PROCEDURE public.insert_farmout_accounts()
LANGUAGE 'plpgsql'
AS $BODY$
DECLARE 
	companyRec RECORD;
BEGIN
	FOR companyRec IN (SELECT company_id FROM companies) LOOP
	  INSERT INTO farmout_accounts (company_id, balance, total_payments)
		VALUES (companyRec.company_id, 0, 0);
	END LOOP;
END;
$BODY$;

CALL insert_farmout_accounts();