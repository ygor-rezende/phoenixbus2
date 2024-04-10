CREATE OR REPLACE FUNCTION check_service_type() RETURNS TRIGGER AS $service_type_check$
DECLARE
	i integer;
	BEGIN		
		IF (OLD.service_code = 'RT' AND NEW.service_code != 'RT') THEN
			FOR i IN SELECT detail_id FROM service_details WHERE service_id = NEW.service_id LOOP
				UPDATE service_details SET return_time = null, return_location_id = null WHERE detail_id = i;
			END LOOP;
		END IF;
		RETURN NULL;
	END;
$service_type_check$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS service_type_check ON services;
CREATE TRIGGER service_type_check
AFTER UPDATE ON services
	FOR EACH ROW EXECUTE FUNCTION check_service_type();