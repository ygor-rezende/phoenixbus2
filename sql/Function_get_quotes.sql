DROP FUNCTION IF EXISTS public.get_quotes;
DROP TYPE IF EXISTS public.quotes_table_type;
CREATE TYPE public.quotes_table_type AS
(
	invoice character varying(255),
    client_id character varying(255),
    employee_id character varying(255),
    responsible_name character varying(50),
    responsible_email character varying(50),
    responsible_phone character varying(16),
    quote_date character varying(30),
    booking_date character varying(30),
    category character varying(50),
    num_people smallint,
    trip_start_date character varying(30),
    trip_end_date character varying(30),
    deposit numeric(10,2),
    cost numeric(10,2),
    hours_quote_valid smallint,
    client_comments character varying(255),
    intinerary_details text,
    internal_coments character varying(255),
    is_quote boolean,
    change_user character varying(50),
    status character varying(20),
	quote_id character varying(255),
	has_booking boolean
);


CREATE OR REPLACE FUNCTION public.get_quotes(
	)
    RETURNS TABLE (table_result quotes_table_type)
    LANGUAGE 'plpgsql'
    COST 100
    VOLATILE PARALLEL UNSAFE
    ROWS 1000

AS $BODY$
BEGIN 
	return query
		(WITH transfInvoices AS (SELECT invoice AS quote_id, true AS hasBooking from bookings q
			join (select invoice|| 'Q' AS book from bookings where is_quote = false) b ON b.book = q.invoice
			where is_quote = true)
		SELECT * from bookings b
		FULL OUTER JOIN transfInvoices ti ON b.invoice = ti.quote_id
		where is_quote = true ORDER BY invoice);
END
$BODY$;