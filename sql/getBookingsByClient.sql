DROP FUNCTION IF EXISTS public.get_bookings_by_client(character varying);
CREATE OR REPLACE FUNCTION public.get_bookings_by_client(clientId character varying)
RETURNS table (invoice character varying,
			   client_id character varying,
			   booking_date character varying,
			   category character varying,
			   num_people smallint,
			   trip_start_date character varying,
			   trip_end_date character varying,
			   deposit numeric,
			   cost numeric,
			   service_id integer,
			   service_name character varying,
			   service_code character varying,
			   service_date character varying,
			   qty integer,
			   charge numeric,
			   agency character varying
			  )
LANGUAGE 'plpgsql'
AS $$
BEGIN 
	return query
		select
			b.invoice,
			b.client_id,
			b.booking_date,
			b.category,
			b.num_people,
			b.trip_start_date,
			b.trip_end_date,
			b.deposit,
			b.cost,
			s.service_id,
			s.service_name,
			s.service_code,
			s.service_date,
			s.qty,
			s.charge,
			cl.agency			
		from bookings b
		join services s on s.booking_id = b.invoice
		join clients cl on cl.client_id = b.client_id
		where b.is_quote = false AND b.client_id = clientId
		order by b.invoice;
END
$$;

