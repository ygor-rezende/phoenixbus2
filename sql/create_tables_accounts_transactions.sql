DROP TABLE IF EXISTS public.accounts;
CREATE TABLE IF NOT EXISTS public.accounts
(
    account_id SERIAL PRIMARY KEY,
    client_id character varying(50) NOT NULL UNIQUE,
    balance decimal(10,2),
	total_payments decimal(10,2),
	CONSTRAINT fk_client FOREIGN KEY (client_id)
        REFERENCES public.clients (client_id) MATCH SIMPLE
		ON UPDATE NO ACTION
        ON DELETE CASCADE
        NOT VALID	
);

DROP TABLE IF EXISTS public.transactions;
CREATE TABLE IF NOT EXISTS public.transactions
(
	transaction_id SERIAL PRIMARY KEY,
	account_id integer NOT NULL,
	invoice character varying(50) NOT NULL,
	amount decimal(10,2) NOT NULL,
	transaction_date character varying(30) NOT NULL,
	transaction_type character(1) NOT NULL,
	payment_type character varying(10),
	doc_number character varying(30),
	CONSTRAINT fk_account FOREIGN KEY (account_id)
        REFERENCES public.accounts (account_id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE CASCADE
        NOT VALID,
	CONSTRAINT fk_bookings FOREIGN KEY (invoice)
        REFERENCES public.bookings (invoice) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE CASCADE
        NOT VALID	
);