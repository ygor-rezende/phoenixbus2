UPDATE bookings SET status = 'new';

DROP PROCEDURE IF EXISTS public.create_booking(text, text, text, text, text, text, text, text, text, smallint, text, text, numeric, numeric, smallint, text, text, text, boolean, text);
CREATE OR REPLACE PROCEDURE public.create_booking(
	IN invoice text,
	IN client_id text,
	IN employee_id text,
	IN responsible_name text,
	IN responsible_email text,
	IN responsible_phone text,
	IN quote_date text,
	IN booking_date text,
	IN category text,
	IN num_people smallint,
	IN trip_start_date text,
	IN trip_end_date text,
	IN deposit numeric,
	IN cost numeric,
	IN hours_quote_valid smallint,
	IN client_comments text,
	IN intinerary_details text,
	IN internal_coments text,
	IN is_quote boolean,
	IN change_user text,
	IN status text)
LANGUAGE 'plpgsql'
AS $BODY$
BEGIN
  INSERT INTO bookings SELECT invoice, client_id, employee_id, responsible_name, responsible_email, responsible_phone, quote_date, booking_date, category, num_people, 
  trip_start_date, trip_end_date, deposit, cost, hours_quote_valid, client_comments, intinerary_details, internal_coments, is_quote, change_user, status;
END;
$BODY$;

DROP PROCEDURE IF EXISTS public.update_booking(text, text, text, text, text, text, text, text, smallint, text, text, numeric, numeric, smallint, text, text, text, boolean, text, text);
CREATE OR REPLACE PROCEDURE public.update_booking(
	IN clientid text,
	IN employeeid text,
	IN responsiblename text,
	IN responsibleemail text,
	IN responsiblephone text,
	IN quotedate text,
	IN bookingdate text,
	IN category1 text,
	IN numpeople smallint,
	IN tripstartdate text,
	IN tripenddate text,
	IN deposit1 numeric,
	IN cost1 numeric,
	IN hoursquotevalid smallint,
	IN clientcomments text,
	IN intinerarydetails text,
	IN internalcoments text,
	IN isquote boolean,
	IN changeuser text,
	IN invoice1 text,
	IN status1 text)
LANGUAGE 'plpgsql'
AS $BODY$
BEGIN
  UPDATE bookings SET client_id = clientId, employee_id = employeeId, responsible_name = responsibleName, responsible_email = responsibleEmail, 
  responsible_phone = responsiblePhone, quote_date = quoteDate, booking_date = bookingDate, category = category1, num_people = numPeople, trip_start_date = tripStartDate,
  trip_end_date = tripEndDate, deposit = deposit1, cost = cost1, hours_quote_valid = hoursQuoteValid, client_comments = clientComments, 
  intinerary_details = intineraryDetails, internal_coments = internalComents, is_quote = isQuote, change_user = changeUser, status = status1
  WHERE invoice = invoice1;
END;
$BODY$;

CREATE OR REPLACE FUNCTION public.get_amount_due_by_invoice()
    RETURNS TABLE(invoice character varying, total_debit numeric, total_pay numeric, amount_due numeric) 
    LANGUAGE 'plpgsql'
    COST 100
    VOLATILE PARALLEL UNSAFE
    ROWS 1000

AS $BODY$
BEGIN 
	return query
		(WITH payments AS (
			SELECT tr.invoice,
				COALESCE(SUM(amount),0) AS totalPay
			FROM transactions tr
			WHERE transaction_type = 'p'
			GROUP BY tr.invoice
			),
			debits AS(
				SELECT tr.invoice,
					COALESCE(SUM(amount),0) AS totalDebit
				FROM transactions tr
				WHERE transaction_type = 'd'
				GROUP BY tr.invoice
			)
			SELECT
				de.invoice,
				COALESCE(de.totalDebit, 0),
				COALESCE(pa.totalpay, 0),
				CASE WHEN COALESCE(de.totalDebit, 0) - COALESCE(pa.totalpay, 0) <= 0 THEN 0 ELSE COALESCE(de.totalDebit, 0) - COALESCE(pa.totalpay, 0) END AS amountdue
			FROM debits de FULL OUTER JOIN payments pa ON de.invoice = pa.invoice);
END
$BODY$;


DROP PROCEDURE IF EXISTS public.update_booking(text, text, text, text, text, text, text, text, smallint, text, text, numeric, numeric, smallint, text, text, text, boolean, text, text, text);
CREATE OR REPLACE PROCEDURE public.update_booking(
	IN clientid text,
	IN employeeid text,
	IN responsiblename text,
	IN responsibleemail text,
	IN responsiblephone text,
	IN quotedate text,
	IN bookingdate text,
	IN category1 text,
	IN numpeople smallint,
	IN tripstartdate text,
	IN tripenddate text,
	IN deposit1 numeric,
	IN cost1 numeric,
	IN hoursquotevalid smallint,
	IN clientcomments text,
	IN intinerarydetails text,
	IN internalcoments text,
	IN isquote boolean,
	IN changeuser text,
	IN invoice1 text,
	IN status1 text)
LANGUAGE 'plpgsql'
AS $BODY$
DECLARE
	current_balance decimal(10,2) := (SELECT balance FROM accounts WHERE client_id = clientid);
BEGIN
  UPDATE bookings SET client_id = clientId, employee_id = employeeId, responsible_name = responsibleName, responsible_email = responsibleEmail, 
  responsible_phone = responsiblePhone, quote_date = quoteDate, booking_date = bookingDate, category = category1, num_people = numPeople, trip_start_date = tripStartDate,
  trip_end_date = tripEndDate, deposit = deposit1, cost = cost1, hours_quote_valid = hoursQuoteValid, client_comments = clientComments, 
  intinerary_details = intineraryDetails, internal_coments = internalComents, is_quote = isQuote, change_user = changeUser, status = status1
  WHERE invoice = invoice1;
  IF(status1 = 'canceled') THEN
  	UPDATE accounts SET balance = current_balance - cost1 WHERE client_id = clientid;
  END IF;
END;
$BODY$;

CREATE OR REPLACE FUNCTION public.get_sales(
	startdate character varying,
	enddate character varying)
    RETURNS TABLE(agency character varying, total_sales numeric, total_farmout numeric) 
    LANGUAGE 'plpgsql'
    COST 100
    VOLATILE PARALLEL UNSAFE
    ROWS 1000

AS $BODY$
BEGIN 
	return query
		(SELECT
			cli.agency,
			COALESCE (SUM(s.charge),0) AS totalsales,
			x.totalfarmout
			FROM bookings b JOIN services s ON b.invoice = s.booking_id
			JOIN clients cli ON b.client_id = cli.client_id
			LEFT JOIN LATERAL(SELECT
								COALESCE (SUM(sd.payment), 0) AS totalfarmout
								FROM service_details sd JOIN services s ON s.service_id = sd.service_id
								JOIN bookings b ON b.invoice = s.booking_id
								WHERE sd.use_farmout = true AND b.is_quote = false AND s.service_date >= startdate AND s.service_date <= enddate AND b.status != 'canceled') AS x ON true
			WHERE b.is_quote = false AND s.service_date >= startdate AND s.service_date <= enddate AND b.status != 'canceled'
			GROUP BY cli.agency, x.totalfarmout);
END
$BODY$;

CREATE OR REPLACE FUNCTION public.get_driver_payment(
	startdate character varying,
	enddate character varying)
    RETURNS TABLE(driver text, payment numeric, gratuity numeric, total numeric) 
    LANGUAGE 'plpgsql'
    COST 100
    VOLATILE PARALLEL UNSAFE
    ROWS 1000

AS $BODY$
BEGIN 
	return query
		(SELECT
			e.firstname || ' ' || e.lastname AS fullname,
			COALESCE (SUM (sd.payment),0) AS payment,
			COALESCE(SUM (sd.gratuity), 0) AS gratuity,
			COALESCE(SUM(X.total), 0) AS total
		FROM employees e join service_details sd ON e.employee_id = sd.employee_id
			JOIN services s on s.service_id = sd.service_id
			JOIN bookings b on b.invoice = s.booking_id
			LEFT JOIN LATERAL (SELECT sd.payment + sd.gratuity AS total) AS X ON true
		WHERE e.title = 'Driver' AND b.is_quote = false AND s.service_date >= startdate AND s.service_date <= enddate AND b.status != 'canceled'
		GROUP BY fullname
		HAVING SUM (sd.payment) > 0 OR SUM (sd.gratuity) > 0);
END
$BODY$;

CREATE OR REPLACE FUNCTION public.get_payroll_by_driver(
	startdate character varying,
	enddate character varying)
    RETURNS TABLE(driver text, employee_id character varying, service_date character varying, start_time character varying, end_time character varying, location_from character varying, location_to character varying, invoice character varying, payment numeric, gratuity numeric) 
    LANGUAGE 'plpgsql'
    COST 100
    VOLATILE PARALLEL UNSAFE
    ROWS 1000

AS $BODY$
BEGIN 
	return query
		(SELECT
			e.firstname || ' ' || e.lastname AS fullname,
		 	e.employee_id,
			s.service_date,
			sd.start_time,
			sd.end_time,
			lf.location_name AS location_from,
			lt.location_name AS location_to,
			s.booking_id,
			sd.payment,
			sd.gratuity
		FROM employees e JOIN service_details sd ON sd.employee_id = e.employee_id
		JOIN services s ON s.service_id = sd.service_id
		JOIN locations lf ON sd.from_location_id = lf.location_id
		JOIN locations lt ON sd.to_location_id = lt.location_id
		JOIN bookings b ON b.invoice = s.booking_id
		WHERE e.title = 'Driver' AND b.is_quote = false AND s.service_date >= startdate AND s.service_date <= enddate AND b.status != 'canceled'
		ORDER BY 1);
END
$BODY$;

CREATE OR REPLACE FUNCTION public.get_pending_payments(
	)
    RETURNS TABLE(service_name character varying, invoice character varying, service_date character varying, cost numeric, gratuity numeric, client_id character varying, agency character varying, balance numeric, received numeric) 
    LANGUAGE 'plpgsql'
    COST 100
    VOLATILE PARALLEL UNSAFE
    ROWS 1000

AS $BODY$
BEGIN 
	return query
		(SELECT
			s.service_name,
			s.booking_id,
			s.service_date,
			s.charge * s.qty as cost,
			s.gratuity,
			cli.client_id,
			cli.agency,
			ac.balance,
			ac.total_payments
		FROM services s JOIN bookings b ON b.invoice = s.booking_id
		JOIN clients cli ON cli.client_id = b.client_id
		JOIN accounts ac ON ac.client_id = cli.client_id
		WHERE ac.balance > 0 AND s.charge > 0 AND b.is_quote = false AND s.service_date::date < now() AND b.status != 'canceled');
END
$BODY$;


CREATE OR REPLACE FUNCTION public.get_trips_by_driver(
	userid character varying)
    RETURNS TABLE(table_result my_table_type) 
    LANGUAGE 'plpgsql'
    COST 100
    VOLATILE PARALLEL UNSAFE
    ROWS 1000

AS $BODY$
BEGIN
	return query
		SELECT 
			e.employee_id,
			s.service_date,
			s.service_code,
			v.vehicle_name,
			v.vehicle_color,
			sd.spot_time,
			sd.start_time,
			sd.end_time,
			sd.return_time,
			sd.instructions,
			fl.location_name AS from_location_name,
			fl.address AS from_address,
			fl.city AS from_city,
			fl.location_state AS from_state,
			fl.zip AS from_zip,
			tl.location_name AS to_location_name,
			tl.address AS to_address,
			tl.city AS to_city,
			tl.location_state AS to_state,
			tl.zip AS to_zip,
			b.num_people
		from employees e
		join service_details sd on e.employee_id = sd.employee_id
		join locations fl on fl.location_id = sd.from_location_id
		join locations tl on tl.location_id = sd.to_location_id
		join vehicles v on v.vehicle_id = sd.vehicle_id
		join services s on s.service_id = sd.service_id
		join bookings b on b.invoice = s.booking_id
		where user_id = userId AND b.is_quote = false AND b.status != 'canceled';
END; 
$BODY$;



