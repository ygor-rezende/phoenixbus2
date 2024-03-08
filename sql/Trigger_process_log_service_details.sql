DROP TABLE log_service_details;
CREATE TABLE log_service_details(
	operation char(1) NOT NULL,
	stamp timestamp NOT NULL,
	userid text NOT NULL,
	detail_id integer NOT NULL,
	field_updated text NOT NULL,
	from_value text,
	to_value text
);

CREATE OR REPLACE FUNCTION process_log_service_details() RETURNS TRIGGER AS $log_service_details$
DECLARE i text;
		new_data jsonb;
		old_data jsonb;
	BEGIN
		IF (TG_OP = 'DELETE') THEN
			INSERT INTO log_service_details SELECT 'D', now(), OLD.change_user, OLD.detail_id, '-', '-', 'Deleted service detail id ' || OLD.detail_id || ' from service ' || OLD.service_id;
		ELSIF(TG_OP = 'INSERT') THEN
			INSERT INTO log_service_details SELECT 'I', now(), NEW.change_user, NEW.detail_id, '-', '-', 'Created service detail id ' || NEW.detail_id;
		ELSIF(TG_OP = 'UPDATE') THEN
			new_data := to_jsonb(NEW);
			old_data := to_jsonb(OLD);
			FOR i IN SELECT jsonb_object_keys(new_data) INTERSECT SELECT jsonb_object_keys(old_data) LOOP
				IF (old_data ->> i != new_data ->> i) THEN
					INSERT INTO log_service_details SELECT 'U', now(), NEW.change_user, OLD.detail_id, i, (old_data ->> i)::TEXT, (new_data ->> i)::TEXT;
				END IF;
			END LOOP;
		END IF;
		RETURN NULL;
	END;
$log_service_details$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS log_service_details ON service_details;
CREATE TRIGGER log_service_details
AFTER INSERT OR UPDATE OR DELETE ON service_details
	FOR EACH ROW EXECUTE FUNCTION process_log_service_details();
				
				
			