DROP FUNCTION IF EXISTS public.delete_detail(integer, character varying);
CREATE OR REPLACE FUNCTION public.delete_detail(detailId integer, changeUser character varying)
RETURNS integer
LANGUAGE 'plpgsql'
AS $$
BEGIN 
	UPDATE service_details SET change_user = changeUser WHERE detail_id = detailId;
	DELETE from service_details WHERE detail_id = detailId;
	return 1;
END
$$;