DROP TABLE IF EXISTS log_locations;
CREATE TABLE log_locations(
	log_id SERIAL PRIMARY KEY,
	operation char(1) NOT NULL,
	stamp timestamp NOT NULL,
	userid text NOT NULL,
	location_id text NOT NULL,
	field_updated text NOT NULL,
	from_value text,
	to_value text
);

CREATE OR REPLACE FUNCTION process_log_locations() RETURNS TRIGGER AS $log_locations$
DECLARE i text;
		new_data jsonb;
		old_data jsonb;
	BEGIN
		IF (TG_OP = 'DELETE') THEN
			INSERT INTO log_locations (operation, stamp, userid, location_id, field_updated, from_value, to_value)
				VALUES ('D', now(), OLD.change_user, OLD.location_id, '-', '-', 'Deleted location ' || OLD.location_id);
		ELSIF(TG_OP = 'INSERT') THEN
			INSERT INTO log_locations (operation, stamp, userid, location_id, field_updated, from_value, to_value)
				VALUES ('I', now(), NEW.change_user, NEW.location_id, '-', '-', 'Created location ' || NEW.location_id);
		ELSIF(TG_OP = 'UPDATE') THEN
			new_data := to_jsonb(NEW);
			old_data := to_jsonb(OLD);
			FOR i IN SELECT jsonb_object_keys(new_data) INTERSECT SELECT jsonb_object_keys(old_data) LOOP
				IF (old_data ->> i != new_data ->> i) THEN
					INSERT INTO log_locations (operation, stamp, userid, location_id, field_updated, from_value, to_value)
					VALUES ('U', now(), NEW.change_user, OLD.location_id, i, (old_data ->> i)::TEXT, (new_data ->> i)::TEXT);
				END IF;
			END LOOP;
		END IF;
		RETURN NULL;
	END;
$log_locations$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS log_locations ON locations;
CREATE TRIGGER log_locations
AFTER INSERT OR UPDATE OR DELETE ON locations
	FOR EACH ROW EXECUTE FUNCTION process_log_locations();