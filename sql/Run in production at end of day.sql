DROP PROCEDURE IF EXISTS public.update_vehicle(text, text, text, integer, text, text, integer, text, boolean, boolean, text);

CREATE OR REPLACE PROCEDURE public.update_vehicle(
	IN vehicleid text,
	IN vehiclename text,
	IN vehiclemodel text,
	IN vehicleyear integer,
	IN vehiclecolor text,
	IN vin1 text,
	IN capacity1 integer,
	IN tag1 text,
	IN maintenance1 boolean,
	IN ada1 boolean,
	IN changeuser text,
	IN inactive1 boolean)
LANGUAGE 'plpgsql'
AS $BODY$
BEGIN
  UPDATE vehicles SET vehicle_name = vehicleName, vehicle_model = vehicleModel, vehicle_year = vehicleYear, vehicle_color = vehicleColor, vin = vin1, capacity = capacity1, tag = tag1, maintenance = maintenance1, ada = ada1, change_user = changeUser, inactive = inactive1 WHERE vehicle_id = vehicleId;
END;
$BODY$;