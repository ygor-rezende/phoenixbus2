DROP FUNCTION IF EXISTS public.login(character varying, character varying);
CREATE OR REPLACE FUNCTION public.login(user_name character varying, refreshToken character varying)
RETURNS integer
LANGUAGE 'plpgsql'
AS $$
BEGIN 
	UPDATE users SET refresh_token = refreshToken WHERE username = user_name;
	return 1;
END
$$;

