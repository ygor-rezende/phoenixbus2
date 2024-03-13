DROP TABLE IF EXISTS log_vehicles;
CREATE TABLE log_vehicles(
	log_id SERIAL PRIMARY KEY,
	operation char(1) NOT NULL,
	stamp timestamp NOT NULL,
	userid text NOT NULL,
	vehicle_id text NOT NULL,
	field_updated text NOT NULL,
	from_value text,
	to_value text
);

CREATE OR REPLACE FUNCTION process_log_vehicles() RETURNS TRIGGER AS $log_vehicles$
DECLARE i text;
		new_data jsonb;
		old_data jsonb;
	BEGIN
		IF (TG_OP = 'DELETE') THEN
			INSERT INTO log_vehicles (operation, stamp, userid, vehicle_id, field_updated, from_value, to_value)
				VALUES ('D', now(), OLD.change_user, OLD.vehicle_id, '-', '-', 'Deleted vehicle ' || OLD.vehicle_id);
		ELSIF(TG_OP = 'INSERT') THEN
			INSERT INTO log_vehicles (operation, stamp, userid, vehicle_id, field_updated, from_value, to_value)
				VALUES ('I', now(), NEW.change_user, NEW.vehicle_id, '-', '-', 'Created vehicle ' || NEW.vehicle_id);
		ELSIF(TG_OP = 'UPDATE') THEN
			new_data := to_jsonb(NEW);
			old_data := to_jsonb(OLD);
			FOR i IN SELECT jsonb_object_keys(new_data) INTERSECT SELECT jsonb_object_keys(old_data) LOOP
				IF (old_data ->> i != new_data ->> i) THEN
					INSERT INTO log_vehicles (operation, stamp, userid, vehicle_id, field_updated, from_value, to_value)
					VALUES ('U', now(), NEW.change_user, OLD.vehicle_id, i, (old_data ->> i)::TEXT, (new_data ->> i)::TEXT);
				END IF;
			END LOOP;
		END IF;
		RETURN NULL;
	END;
$log_vehicles$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS log_vehicles ON vehicles;
CREATE TRIGGER log_vehicles
AFTER INSERT OR UPDATE OR DELETE ON vehicles
	FOR EACH ROW EXECUTE FUNCTION process_log_vehicles();