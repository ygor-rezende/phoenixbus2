DROP TABLE IF EXISTS log_clients;
CREATE TABLE log_clients(
	log_id SERIAL PRIMARY KEY,
	operation char(1) NOT NULL,
	stamp timestamp NOT NULL,
	userid text NOT NULL,
	client_id text NOT NULL,
	field_updated text NOT NULL,
	from_value text,
	to_value text
);

CREATE OR REPLACE FUNCTION process_log_clients() RETURNS TRIGGER AS $log_clients$
DECLARE i text;
		new_data jsonb;
		old_data jsonb;
	BEGIN
		IF (TG_OP = 'DELETE') THEN
			INSERT INTO log_clients (operation, stamp, userid, client_id, field_updated, from_value, to_value)
				VALUES ('D', now(), OLD.change_user, OLD.client_id, '-', '-', 'Deleted client ' || OLD.client_id);
		ELSIF(TG_OP = 'INSERT') THEN
			INSERT INTO log_clients (operation, stamp, userid, client_id, field_updated, from_value, to_value)
				VALUES ('I', now(), NEW.change_user, NEW.client_id, '-', '-', 'Created client ' || NEW.client_id);
		ELSIF(TG_OP = 'UPDATE') THEN
			new_data := to_jsonb(NEW);
			old_data := to_jsonb(OLD);
			FOR i IN SELECT jsonb_object_keys(new_data) INTERSECT SELECT jsonb_object_keys(old_data) LOOP
				IF (old_data ->> i != new_data ->> i) THEN
					INSERT INTO log_clients (operation, stamp, userid, client_id, field_updated, from_value, to_value)
					VALUES ('U', now(), NEW.change_user, OLD.client_id, i, (old_data ->> i)::TEXT, (new_data ->> i)::TEXT);
				END IF;
			END LOOP;
		END IF;
		RETURN NULL;
	END;
$log_clients$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS log_clients ON clients;
CREATE TRIGGER log_clients
AFTER INSERT OR UPDATE OR DELETE ON clients
	FOR EACH ROW EXECUTE FUNCTION process_log_clients();