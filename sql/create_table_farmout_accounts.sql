DROP TABLE IF EXISTS public.farmout_accounts;
CREATE TABLE IF NOT EXISTS public.farmout_accounts
(
    account_id SERIAL PRIMARY KEY,
    company_id character varying(50) NOT NULL UNIQUE,
    balance decimal(10,2),
	total_payments decimal(10,2),
	CONSTRAINT fk_company FOREIGN KEY (company_id)
        REFERENCES public.companies (company_id) MATCH SIMPLE
		ON UPDATE NO ACTION
        ON DELETE CASCADE
        NOT VALID	
);

DROP TABLE IF EXISTS public.farmout_transactions;
CREATE TABLE IF NOT EXISTS public.farmout_transactions
(
	transaction_id SERIAL PRIMARY KEY,
	account_id integer NOT NULL,
	amount decimal(10,2) NOT NULL,
	transaction_date character varying(30) NOT NULL,
	payment_type character varying(10),
	doc_number character varying(30),
	CONSTRAINT fk_account FOREIGN KEY (account_id)
        REFERENCES public.farmout_accounts (account_id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE CASCADE
        NOT VALID
);