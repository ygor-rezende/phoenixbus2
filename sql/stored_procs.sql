DROP PROCEDURE create_vehicle;
CREATE OR REPLACE PROCEDURE create_vehicle(
    IN vehicle_id TEXT,
    IN vehicle_name TEXT,
    IN vehicle_model TEXT,
    IN vehicle_year INTEGER,
    IN vehicle_color TEXT,
    IN vin TEXT,
    IN capacity INTEGER,
    IN tag TEXT,
    IN maintenance BOOLEAN,
    IN ada BOOLEAN
)
LANGUAGE plpgsql
AS $$
BEGIN
  INSERT INTO vehicles (vehicle_id, vehicle_name, vehicle_model, vehicle_year, vehicle_color, vin, capacity, tag, maintenance, ada)
  VALUES (vehicle_id, vehicle_name, vehicle_model, vehicle_year, vehicle_color, vin, capacity, tag, maintenance, ada);
END;
$$;


DROP PROCEDURE delete_vehicle;
CREATE OR REPLACE PROCEDURE delete_vehicle(IN vehicleId TEXT)
LANGUAGE plpgsql
AS $$
BEGIN
  DELETE from vehicles WHERE vehicle_id = vehicleId;
END;
$$;


DROP PROCEDURE update_vehicle;
CREATE OR REPLACE PROCEDURE update_vehicle(
    IN vehicleId TEXT,
    IN vehicleName TEXT,
    IN vehicleModel TEXT,
    IN vehicleYear INTEGER,
    IN vehicleColor TEXT,
    IN vin1 TEXT,
    IN capacity1 INTEGER,
    IN tag1 TEXT,
    IN maintenance1 BOOLEAN,
    IN ada1 BOOLEAN
)
LANGUAGE plpgsql
AS $$
BEGIN
  UPDATE vehicles SET vehicle_name = vehicleName, vehicle_model = vehicleModel, vehicle_year = vehicleYear, vehicle_color = vehicleColor, vin = vin1, capacity = capacity1, tag = tag1, maintenance = maintenance1, ada = ada1 WHERE vehicle_id = vehicleId;
END;
$$;


DROP PROCEDURE create_location;
CREATE OR REPLACE PROCEDURE create_location(
    IN location_id TEXT,
    IN location_name TEXT,
    IN address TEXT,
    IN city TEXT,
    IN location_state TEXT,
    IN zip TEXT,
    IN phone TEXT,
    IN fax TEXT   
)
LANGUAGE plpgsql
AS $$
BEGIN
  INSERT INTO locations (location_id, location_name, address, city, location_state, zip, phone, fax)
  VALUES (location_id, location_name, address, city, location_state, zip, phone, fax);
END;
$$;


DROP PROCEDURE update_location;
CREATE OR REPLACE PROCEDURE update_location(
    IN locationId TEXT,
    IN locationName TEXT,
    IN address1 TEXT,
    IN city1 TEXT,
    IN locationState TEXT,
    IN zip1 TEXT,
    IN phone1 TEXT,
    IN fax1 TEXT   
)
LANGUAGE plpgsql
AS $$
BEGIN
  UPDATE locations SET location_name = locationName, address = address1, city = city1, location_state = locationState, zip = zip1, phone = phone1, fax = fax1 WHERE location_id = locationId;
END;
$$;

DROP PROCEDURE delete_location;
CREATE OR REPLACE PROCEDURE delete_location(IN locationId TEXT)
LANGUAGE plpgsql
AS $$
BEGIN
  DELETE from locations WHERE location_id = locationId;
END;
$$;

DROP PROCEDURE create_client;
CREATE OR REPLACE PROCEDURE create_client(
    IN client_id TEXT,
    IN agency TEXT,
    IN contact TEXT,
    IN address1 TEXT,
    IN address2 TEXT,
    IN city TEXT,
    IN client_state TEXT,
    IN zip TEXT,
    IN country TEXT,
    IN phone TEXT,
    IN fax TEXT,
    IN email TEXT,
    IN remark TEXT
)
LANGUAGE plpgsql
AS $$
BEGIN
  INSERT INTO clients (client_id, agency, contact, address1, address2, city, client_state, zip, country, phone, fax, email, remark)
  VALUES (client_id, agency, contact, address1, address2, city, client_state, zip, country, phone, fax, email, remark);
END;
$$;


DROP PROCEDURE update_client;
CREATE OR REPLACE PROCEDURE update_client(
    IN clientId TEXT,
    IN agency1 TEXT,
    IN contact1 TEXT,
    IN address11 TEXT,
    IN address21 TEXT,
    IN city1 TEXT,
    IN clientState TEXT,
    IN zip1 TEXT,
    IN country1 TEXT,
    IN phone1 TEXT,
    IN fax1 TEXT,
    IN email1 TEXT,
    IN remark1 TEXT  
)
LANGUAGE plpgsql
AS $$
BEGIN
  UPDATE clients 
  SET agency = agency1,
    contact = contact1,
    address1 = address11,
    address2 = address21,
    city = city1, 
    client_state = clientState,
    zip = zip1, 
    country = country1,
    phone = phone1, 
    fax = fax1, 
    email = email1,
    remark = remark1 
  WHERE client_id = clientId;
END;
$$;


DROP PROCEDURE delete_client;
CREATE OR REPLACE PROCEDURE delete_client(IN clientId TEXT)
LANGUAGE plpgsql
AS $$
BEGIN
  DELETE from clients WHERE client_id = clientId;
END;
$$;