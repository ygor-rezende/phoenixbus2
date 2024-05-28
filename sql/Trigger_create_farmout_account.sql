DROP FUNCTION IF EXISTS public.create_farmout_account();

CREATE OR REPLACE FUNCTION public.create_farmout_account()
    RETURNS trigger
    LANGUAGE 'plpgsql'
    COST 100
    VOLATILE NOT LEAKPROOF
AS $BODY$
	BEGIN
		IF(TG_OP = 'INSERT') THEN
			INSERT INTO farmout_accounts (company_id, balance, total_payments)
				VALUES (NEW.company_id, 0, 0);
		END IF;
		RETURN NULL;
	END;
$BODY$;


DROP TRIGGER IF EXISTS create_farmout_account ON public.companies;

CREATE OR REPLACE TRIGGER create_farmout_account
    AFTER INSERT
    ON public.companies
    FOR EACH ROW
    EXECUTE FUNCTION public.create_farmout_account();