DROP PROCEDURE IF EXISTS public.update_detail(text, text, text, text, text, numeric, text, text, text, text, text, boolean, text, text, integer, numeric, integer);

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
	IN detailid integer)
LANGUAGE 'plpgsql'
AS $BODY$
BEGIN
  UPDATE service_details SET employee_id = employeeid, company_id = companyid, vehicle_id = vehicleid, from_location_id = fromlocationid, 
  to_location_id = tolocationid, return_location_id = returnlocationid, use_farmout = usefarmout, spot_time = spottime, start_time = starttime, end_time = endtime, 
  return_time = returntime, instructions = instructions1, payment = payment1, change_user = changeuser
  WHERE detail_id = detailid;
END;
$BODY$;