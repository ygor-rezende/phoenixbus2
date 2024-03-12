DROP TABLE IF EXISTS log_services;
CREATE TABLE log_services(
	log_id SERIAL,
	operation char(1) NOT NULL,
	stamp timestamp NOT NULL,
	userid text NOT NULL,
	service_id integer NOT NULL,
	field_updated text NOT NULL,
	from_value text,
	to_value text
);

CREATE OR REPLACE FUNCTION process_log_services() RETURNS TRIGGER AS $log_services$
DECLARE i text;
		new_data jsonb;
		old_data jsonb;
	BEGIN
		IF (TG_OP = 'DELETE') THEN
			INSERT INTO log_services SELECT 'D', now(), OLD.change_user, OLD.service_id, '-', '-', 'Deleted service ' || OLD.service_id || ' from booking ' || OLD.booking_id;
		ELSIF(TG_OP = 'INSERT') THEN
			INSERT INTO log_services SELECT 'I', now(), NEW.change_user, NEW.service_id, '-', '-', 'Created service ' || NEW.service_id;
		ELSIF(TG_OP = 'UPDATE') THEN
			new_data := to_jsonb(NEW);
			old_data := to_jsonb(OLD);
			FOR i IN SELECT jsonb_object_keys(new_data) INTERSECT SELECT jsonb_object_keys(old_data) LOOP
				IF (old_data ->> i != new_data ->> i) THEN
					INSERT INTO log_services SELECT 'U', now(), NEW.change_user, OLD.service_id, i, (old_data ->> i)::TEXT, (new_data ->> i)::TEXT;
				END IF;
			END LOOP;
		END IF;
		RETURN NULL;
	END;
$log_services$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS log_services ON services;
CREATE TRIGGER log_services
AFTER INSERT OR UPDATE OR DELETE ON services
	FOR EACH ROW EXECUTE FUNCTION process_log_services();
				