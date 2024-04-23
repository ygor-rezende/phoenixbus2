UPDATE service_details SET confirmed = false;

DROP PROCEDURE IF EXISTS public.update_detail(text, text, text, text, text, numeric, text, text, text, text, text, boolean, text, text, integer);

CREATE OR REPLACE PROCEDURE public.update_detail(
	IN spottime text,
	IN starttime text,
	IN endtime text,
	IN returntime text,
	IN instructions1 text,
	IN payment1 numeric,
	IN employeeid text,
	IN vehicleid text,
	IN fromlocationid text,
	IN tolocationid text,
	IN returnlocationid text,
	IN usefarmout boolean,
	IN companyid text,
	IN changeuser text,
	IN confirmed1 boolean,
	IN specialevents text,
	IN detailid integer)
LANGUAGE 'plpgsql'
AS $BODY$
BEGIN
  UPDATE service_details SET employee_id = employeeid, company_id = companyid, vehicle_id = vehicleid, from_location_id = fromlocationid, 
  to_location_id = tolocationid, return_location_id = returnlocationid, use_farmout = usefarmout, spot_time = spottime, start_time = starttime, end_time = endtime, 
  return_time = returntime, instructions = instructions1, payment = payment1, change_user = changeuser, confirmed = confirmed1, special_events = specialevents
  WHERE detail_id = detailid;
END;
$BODY$;

DROP PROCEDURE IF EXISTS public.update_detail(integer, text, text, text, text, text, text, boolean, text, text, text, text, text, numeric, numeric, boolean, text, text, numeric, text, integer);

CREATE OR REPLACE PROCEDURE public.update_detail(
	IN serviceid integer,
	IN employeeid text,
	IN companyid text,
	IN vehicleid text,
	IN fromlocationid text,
	IN tolocationid text,
	IN returnlocationid text,
	IN usefarmout boolean,
	IN spottime text,
	IN starttime text,
	IN endtime text,
	IN returntime text,
	IN instructions1 text,
	IN payment1 numeric,
	IN gratuity1 numeric,
	IN additionalstop boolean,
	IN additionalstopinfo text,
	IN additionalstopdetail text,
	IN triplength numeric,
	IN changeuser text,
	IN specialevents text,
	IN detailid integer)
LANGUAGE 'plpgsql'
AS $BODY$
BEGIN
  UPDATE service_details SET service_id = serviceid, employee_id = employeeid, company_id = companyid, vehicle_id = vehicleid, from_location_id = fromlocationid, 
  to_location_id = tolocationid, return_location_id = returnlocationid, use_farmout = usefarmout, spot_time = spottime, start_time = starttime, end_time = endtime, 
  return_time = returntime, instructions = instructions1, payment = payment1, gratuity = gratuity1, additional_stop = additionalstop, additional_stop_info = additionalstopinfo, 
  additional_stop_detail = additionalstopdetail, trip_length = triplength, change_user = changeuser, special_events = specialevents
  WHERE detail_id = detailid;
END;
$BODY$;

DROP PROCEDURE IF EXISTS public.create_detail(integer, text, text, text, text, text, text, boolean, text, text, text, text, text, numeric, numeric, boolean, text, text, numeric, text);

CREATE OR REPLACE PROCEDURE public.create_detail(
	IN service_id integer,
	IN employee_id text,
	IN company_id text,
	IN vehicle_id text,
	IN from_location_id text,
	IN to_location_id text,
	IN return_location_id text,
	IN use_farmout boolean,
	IN spot_time text,
	IN start_time text,
	IN end_time text,
	IN return_time text,
	IN instructions text,
	IN payment numeric,
	IN gratuity numeric,
	IN additional_stop boolean,
	IN additional_stop_info text,
	IN additional_stop_detail text,
	IN trip_length numeric,
	IN change_user text,
	IN special_events text)
LANGUAGE 'plpgsql'
AS $BODY$
BEGIN
  INSERT INTO service_details (service_id, employee_id, company_id, vehicle_id, from_location_id, to_location_id, return_location_id, use_farmout, spot_time, start_time, 
							   end_time, return_time, instructions, payment, gratuity, additional_stop, additional_stop_info, additional_stop_detail, trip_length, 
							   change_user, special_events)
			VALUES (service_id, employee_id, company_id, vehicle_id, from_location_id, to_location_id, return_location_id, use_farmout, spot_time, start_time, 
					end_time, return_time, instructions, payment, gratuity, additional_stop, additional_stop_info, additional_stop_detail, trip_length, change_user, 
					special_events);
END;
$BODY$;


SELECT confirmed from service_details;