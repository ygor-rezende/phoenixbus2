DROP TABLE IF EXISTS public.users;
CREATE TABLE IF NOT EXISTS public.users
(
    username character varying(50) COLLATE pg_catalog."default" NOT NULL,
    hashed_password character varying(255) COLLATE pg_catalog."default" NOT NULL,
    user_type character varying(50) COLLATE pg_catalog."default" NOT NULL,
    refresh_token character varying(255) COLLATE pg_catalog."default",
    CONSTRAINT users_pkey PRIMARY KEY (username)
);

DROP TABLE IF EXISTS public.vehicles;
CREATE TABLE IF NOT EXISTS public.vehicles
(
    vehicle_id character varying(255) COLLATE pg_catalog."default" NOT NULL,
    vehicle_name character varying(255) COLLATE pg_catalog."default" NOT NULL,
    vehicle_model character varying(255) COLLATE pg_catalog."default" NOT NULL,
    vehicle_year smallint NOT NULL,
    vehicle_color character varying(255) COLLATE pg_catalog."default" NOT NULL,
    vin character varying(20) COLLATE pg_catalog."default",
    capacity smallint,
    tag character varying(20) COLLATE pg_catalog."default",
    maintenance boolean,
    ada boolean,
	change_user character varying(50) COLLATE pg_catalog."default",
    CONSTRAINT vehicles_pkey PRIMARY KEY (vehicle_id)
);

DROP TABLE IF EXISTS public.clients;
CREATE TABLE IF NOT EXISTS public.clients
(
    client_id character varying(255) COLLATE pg_catalog."default" NOT NULL,
    agency character varying(255) COLLATE pg_catalog."default" NOT NULL,
    contact character varying(255) COLLATE pg_catalog."default" NOT NULL,
    address1 character varying(255) COLLATE pg_catalog."default" NOT NULL,
    address2 character varying(255) COLLATE pg_catalog."default",
    city character varying(100) COLLATE pg_catalog."default" NOT NULL,
    client_state character varying(255) COLLATE pg_catalog."default" NOT NULL,
    zip character varying(6) COLLATE pg_catalog."default" NOT NULL,
    country character varying(50) COLLATE pg_catalog."default" NOT NULL DEFAULT 'US'::character varying,
    phone character varying(16) COLLATE pg_catalog."default" NOT NULL,
    fax character varying(16) COLLATE pg_catalog."default",
    email character varying(50) COLLATE pg_catalog."default" NOT NULL,
    remark character varying(1000) COLLATE pg_catalog."default",
	change_user character varying(50) COLLATE pg_catalog."default",
    CONSTRAINT clients_pkey PRIMARY KEY (client_id)
);

DROP TABLE IF EXISTS public.companies;
CREATE TABLE IF NOT EXISTS public.companies
(
    company_id character varying(255) COLLATE pg_catalog."default" NOT NULL,
    company_name character varying(255) COLLATE pg_catalog."default" NOT NULL,
    contact character varying(255) COLLATE pg_catalog."default" NOT NULL,
    address character varying(255) COLLATE pg_catalog."default" NOT NULL,
    city character varying(100) COLLATE pg_catalog."default" NOT NULL,
    company_state character varying(255) COLLATE pg_catalog."default" NOT NULL,
    zip character varying(6) COLLATE pg_catalog."default" NOT NULL,
    phone character varying(16) COLLATE pg_catalog."default" NOT NULL,
    email character varying(50) COLLATE pg_catalog."default" NOT NULL,
    ein character varying(50) COLLATE pg_catalog."default",
    dot character varying(50) COLLATE pg_catalog."default",
    insurance character varying(50) COLLATE pg_catalog."default",
    account character varying(50) COLLATE pg_catalog."default",
    routing character varying(50) COLLATE pg_catalog."default",
    wire character varying(50) COLLATE pg_catalog."default",
    zelle character varying(50) COLLATE pg_catalog."default",
	change_user character varying(50) COLLATE pg_catalog."default",
    CONSTRAINT companies_pkey PRIMARY KEY (company_id)
);

DROP TABLE IF EXISTS public.employees;
CREATE TABLE IF NOT EXISTS public.employees
(
    employee_id character varying(255) COLLATE pg_catalog."default" NOT NULL,
    firstname character varying(30) COLLATE pg_catalog."default" NOT NULL,
    lastname character varying(30) COLLATE pg_catalog."default" NOT NULL,
    birth character varying(30) COLLATE pg_catalog."default",
    title character varying(20) COLLATE pg_catalog."default",
    hire_date character varying(30) COLLATE pg_catalog."default",
    address character varying(255) COLLATE pg_catalog."default" NOT NULL,
    city character varying(100) COLLATE pg_catalog."default" NOT NULL,
    state character varying(5) COLLATE pg_catalog."default" NOT NULL,
    zip character varying(6) COLLATE pg_catalog."default" NOT NULL,
    phone character varying(16) COLLATE pg_catalog."default" NOT NULL,
    email character varying(50) COLLATE pg_catalog."default" NOT NULL,
    medical_card boolean,
    i9 boolean,
    drug_free boolean,
    drive_license_exp_date character varying(30) COLLATE pg_catalog."default",
    it_number character varying(255) COLLATE pg_catalog."default",
    national_reg character varying(255) COLLATE pg_catalog."default",
    experience character varying(255) COLLATE pg_catalog."default",
    cdl_tag character varying(255) COLLATE pg_catalog."default",
    insurance character varying(255) COLLATE pg_catalog."default",
    insurance_exp_date character varying(30) COLLATE pg_catalog."default",
    mc character varying(255) COLLATE pg_catalog."default",
    point_contact character varying(255) COLLATE pg_catalog."default",
    emergency_contact character varying(255) COLLATE pg_catalog."default",
    marital_status character varying(255) COLLATE pg_catalog."default",
    notes character varying(500) COLLATE pg_catalog."default",
    user_id character varying(255) COLLATE pg_catalog."default",
	change_user character varying(50) COLLATE pg_catalog."default",
    CONSTRAINT employees_pkey PRIMARY KEY (employee_id),
    CONSTRAINT uk_user UNIQUE (user_id),
    CONSTRAINT fk_user FOREIGN KEY (user_id)
        REFERENCES public.users (username) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION
        NOT VALID
);

DROP TABLE IF EXISTS public.invoices;
CREATE TABLE IF NOT EXISTS public.invoices
(
    invoice character varying(15) COLLATE pg_catalog."default" NOT NULL,
    CONSTRAINT invoices_pkey PRIMARY KEY (invoice)
);

DROP TABLE IF EXISTS public.locations;
CREATE TABLE IF NOT EXISTS public.locations
(
    location_id character varying(255) COLLATE pg_catalog."default" NOT NULL,
    location_name character varying(255) COLLATE pg_catalog."default" NOT NULL,
    address character varying(255) COLLATE pg_catalog."default" NOT NULL,
    city character varying(100) COLLATE pg_catalog."default" NOT NULL,
    location_state character varying(255) COLLATE pg_catalog."default" NOT NULL,
    zip character varying(6) COLLATE pg_catalog."default" NOT NULL,
    phone character varying(16) COLLATE pg_catalog."default",
    fax character varying(16) COLLATE pg_catalog."default",
	change_user character varying(50) COLLATE pg_catalog."default",
    CONSTRAINT locations_pkey PRIMARY KEY (location_id)
);

DROP TABLE IF EXISTS public.bookings;
CREATE TABLE IF NOT EXISTS public.bookings
(
    invoice character varying(255) COLLATE pg_catalog."default" NOT NULL,
    client_id character varying(255) COLLATE pg_catalog."default" NOT NULL,
    employee_id character varying(255) COLLATE pg_catalog."default" NOT NULL,
    responsible_name character varying(50) COLLATE pg_catalog."default",
    responsible_email character varying(50) COLLATE pg_catalog."default",
    responsible_phone character varying(16) COLLATE pg_catalog."default",
    quote_date character varying(30) COLLATE pg_catalog."default",
    booking_date character varying(30) COLLATE pg_catalog."default",
    category character varying(50) COLLATE pg_catalog."default" NOT NULL,
    num_people smallint NOT NULL,
    trip_start_date character varying(30) COLLATE pg_catalog."default" NOT NULL,
    trip_end_date character varying(30) COLLATE pg_catalog."default" NOT NULL,
    deposit numeric(10,2),
    cost numeric(10,2),
    hours_quote_valid smallint,
    client_comments character varying(255) COLLATE pg_catalog."default",
    intinerary_details character varying(255) COLLATE pg_catalog."default",
    internal_coments character varying(255) COLLATE pg_catalog."default",
    is_quote boolean NOT NULL,
	change_user character varying(50) COLLATE pg_catalog."default",
    CONSTRAINT bookings_pkey PRIMARY KEY (invoice),
    CONSTRAINT fk_client FOREIGN KEY (client_id)
        REFERENCES public.clients (client_id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION
        NOT VALID,
    CONSTRAINT fk_employee FOREIGN KEY (employee_id)
        REFERENCES public.employees (employee_id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION
        NOT VALID
);

DROP TABLE IF EXISTS public.services;
CREATE TABLE IF NOT EXISTS public.services
(
    service_id serial,
    booking_id character varying(255) COLLATE pg_catalog."default" NOT NULL,
    service_name character varying(50) COLLATE pg_catalog."default" NOT NULL,
    service_code character varying(10) COLLATE pg_catalog."default" NOT NULL,
    service_date character varying(30) COLLATE pg_catalog."default",
    qty integer NOT NULL,
    charge numeric(10,2),
    sales_tax numeric(10,2),
    gratuity numeric(10,2),
	change_user character varying(50) COLLATE pg_catalog."default",
    CONSTRAINT servicespk PRIMARY KEY (service_id),
    CONSTRAINT fk_booking FOREIGN KEY (booking_id)
        REFERENCES public.bookings (invoice) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION
        NOT VALID
);

DROP TABLE IF EXISTS public.service_details;
CREATE TABLE IF NOT EXISTS public.service_details
(
    detail_id serial,
    service_id integer NOT NULL,
    employee_id character varying(50) COLLATE pg_catalog."default",
    vehicle_id character varying(50) COLLATE pg_catalog."default",
    from_location_id character varying(50) COLLATE pg_catalog."default" NOT NULL,
    to_location_id character varying(50) COLLATE pg_catalog."default" NOT NULL,
    spot_time character varying(30) COLLATE pg_catalog."default",
    start_time character varying(30) COLLATE pg_catalog."default",
    end_time character varying(30) COLLATE pg_catalog."default",
    instructions character varying(255) COLLATE pg_catalog."default",
    payment numeric(10,2),
    gratuity numeric(10,2),
    company_id character varying(50) COLLATE pg_catalog."default",
    use_farmout boolean,
    return_location_id character varying(50) COLLATE pg_catalog."default",
    additional_stop boolean,
    additional_stop_info character varying(50) COLLATE pg_catalog."default",
    additional_stop_detail character varying(10) COLLATE pg_catalog."default",
    trip_length numeric(10,2),
    change_user character varying(50) COLLATE pg_catalog."default",
    CONSTRAINT service_detailspk PRIMARY KEY (detail_id),
    CONSTRAINT fk_company FOREIGN KEY (company_id)
        REFERENCES public.companies (company_id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION
        NOT VALID,
    CONSTRAINT fk_employee FOREIGN KEY (employee_id)
        REFERENCES public.employees (employee_id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION
        NOT VALID,
    CONSTRAINT fk_fromlocation FOREIGN KEY (from_location_id)
        REFERENCES public.locations (location_id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION
        NOT VALID,
    CONSTRAINT fk_returnlocation FOREIGN KEY (return_location_id)
        REFERENCES public.locations (location_id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION
        NOT VALID,
    CONSTRAINT fk_service FOREIGN KEY (service_id)
        REFERENCES public.services (service_id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION
        NOT VALID,
    CONSTRAINT fk_tolocation FOREIGN KEY (to_location_id)
        REFERENCES public.locations (location_id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION
        NOT VALID,
    CONSTRAINT fk_vehicle FOREIGN KEY (vehicle_id)
        REFERENCES public.vehicles (vehicle_id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION
        NOT VALID
);



