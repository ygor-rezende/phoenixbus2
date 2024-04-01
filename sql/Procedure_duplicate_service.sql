CREATE OR REPLACE PROCEDURE public.duplicate_service(
	IN serviceid integer,
	IN dates character varying[])
LANGUAGE 'plpgsql'
AS $BODY$
DECLARE
	i character varying;
	details service_details_table_type[];
	service service_table_type[]; 
BEGIN
	SELECT * INTO details from service_details WHERE service_id = serviceid;
	SELECT * INTO service FROM services WHERE service_id = serviceid;
	FOR i IN SELECT dates LOOP
		 raise notice 'Date: %', i;
	END LOOP;
END;
$BODY$;

CALL duplicate_service(5, '{2024-01-01, 2024-05-03}');

INSERT INTO services (booking_id, service_name, service_code, service_date, qty, charge, sales_tax, gratuity, change_user)
			VALUES (service.booking_id, service.service_name, service_code, service_date, qty, charge, sales_tax, gratuity, change_user);


	




