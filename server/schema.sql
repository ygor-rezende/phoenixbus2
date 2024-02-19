CREATE TABLE users (
    username VARCHAR(255) PRIMARY KEY,
    hashed_password VARCHAR(255) NOT NULL,
    user_type VARCHAR(255) NOT NULL,
    refresh_token VARCHAR(255)
),

CREATE TABLE vehicles (
    vehicle_id VARCHAR(255) PRIMARY KEY,
    vehicle_name VARCHAR(255) NOT NULL,
    vehicle_model VARCHAR(255) NOT NULL, 
    vehicle_year SMALLINT NOT NULL,
    vehicle_color VARCHAR(255) NOT NULL
    vin VARCHAR(20),
    capacity SMALLINT NOT NULL,
    tag VARCHAR (20),
    maintenance BOOLEAN,
    ada BOOLEAN
),

CREATE TABLE clients (
    client_id VARCHAR(255) PRIMARY KEY,
    agency VARCHAR(255) NOT NULL,
    contact VARCHAR(255) NOT NULL, 
    address1 VARCHAR(255) NOT NULL, 
    address2 VARCHAR(255),     
    city VARCHAR(100) NOT NULL, 
    client_state VARCHAR(255) NOT NULL, 
    zip VARCHAR(6) NOT NULL, 
    country VARCHAR(50) DEFAULT 'US' NOT NULL, 
    phone VARCHAR(16) NOT NULL,
    fax VARCHAR(16),
    email VARCHAR(50) NOT NULL, 
    remark VARCHAR(1000)
)


CREATE TABLE locations (
    location_id VARCHAR(255) PRIMARY KEY,
    location_name VARCHAR(255) NOT NULL,
    address VARCHAR(255) NOT NULL, 
    city VARCHAR(100) NOT NULL, 
    location_state VARCHAR(255) NOT NULL, 
    zip VARCHAR(6) NOT NULL, 
    phone VARCHAR(16) NOT NULL,
    fax VARCHAR(16)
)


CREATE TABLE companies (
    company_id VARCHAR(255) PRIMARY KEY,
    company_name VARCHAR(255) NOT NULL,
    contact VARCHAR(255) NOT NULL, 
    address VARCHAR(255) NOT NULL,  
    city VARCHAR(100) NOT NULL, 
    company_state VARCHAR(255) NOT NULL, 
    zip VARCHAR(6) NOT NULL, 
    phone VARCHAR(16) NOT NULL,
    email VARCHAR(50) NOT NULL, 
    ein VARCHAR(50),
    dot VARCHAR(50), 
    insurance VARCHAR(50), 
    account VARCHAR(50), 
    routing VARCHAR(50), 
    wire VARCHAR(50), 
    zelle VARCHAR(50)
)

CREATE TABLE employees(
    employee_id VARCHAR(255) PRIMARY KEY,
    user_id VARCHAR(255) REFERENCES users(username) UNIQUE,
    firstname VARCHAR(30) NOT NULL,
    lastname VARCHAR(30) NOT NULL,
    birth VARCHAR(30),
    title VARCHAR(20),
    hire_date VARCHAR(30),
    address VARCHAR(255) NOT NULL,
    city VARCHAR(100) NOT NULL,
    state VARCHAR(5) NOT NULL,
    zip VARCHAR(6) NOT NULL, 
    phone VARCHAR(16) NOT NULL,
    email VARCHAR(50) NOT NULL,
    medical_card BOOLEAN,
    i9 BOOLEAN,
    drug_free BOOLEAN,
    drive_license_exp_date VARCHAR(30),
    it_number VARCHAR(255),
    national_reg VARCHAR(255),
    experience VARCHAR(255),
    cdl_tag VARCHAR(255),
    insurance VARCHAR(255),
    insurance_exp_date VARCHAR(30),
    mc VARCHAR(255),
    point_contact VARCHAR(255),
    emergency_contact VARCHAR(255),
    marital_status VARCHAR(255),
    notes VARCHAR(500)
)

CREATE TABLE quotes (
    quote_id VARCHAR(255) PRIMARY KEY,
    client_id VARCHAR(255) NOT NULL REFERENCES clients(client_id),
    employee_id VARCHAR(255) NOT NULL REFERENCES employees(employee_id), 
    pickup_location_id VARCHAR(255) REFERENCES locations(location_id), 
    destination_location_id VARCHAR(255) REFERENCES locations(location_id), 
    return_location_id VARCHAR(255) REFERENCES locations(location_id), 
    responsible_name VARCHAR(50),
    responsible_email VARCHAR(50),
    responsible_phone  VARCHAR(16),
    quote_date VARCHAR(30) NOT NULL,  
    category VARCHAR(50) NOT NULL, 
    pax_group VARCHAR(255), 
    num_people SMALLINT NOT NULL, 
    trip_start_date VARCHAR(30) NOT NULL, 
    trip_end_date VARCHAR(30) NOT NULL,
    deposit DECIMAL(10,2), 
    cost DECIMAL(10,2) NOT NULL, 
    mco_mca BOOLEAN, 
    service_type VARCHAR(10),
    pickup_time VARCHAR(30),
    return_time VARCHAR(30),
    additional_stop BOOLEAN,
    additional_stop_info VARCHAR(50),
    additional_stop_detail VARCHAR(10),
    trip_length DECIMAL (10,2),
    hours_quote_valid SMALLINT, 
    client_comments VARCHAR(255), 
    intinerary_details VARCHAR(255),
    internal_coments VARCHAR(255)
)

CREATE TABLE bookings (
    invoice VARCHAR(255) PRIMARY KEY,
    quote_id VARCHAR(255),
    client_id VARCHAR(255) NOT NULL,
    employee_id VARCHAR(255) NOT NULL,
    responsible_name VARCHAR(50),
    responsible_email VARCHAR(50),
    responsible_phone  VARCHAR(16),
    quote_date VARCHAR(30),  
    booking_date VARCHAR(30) NOT NULL,
    category VARCHAR(50) NOT NULL, 
    pax_group VARCHAR(255), 
    num_people SMALLINT NOT NULL, 
    trip_start_date VARCHAR(30) NOT NULL, 
    trip_end_date VARCHAR(30) NOT NULL,
    deposit DECIMAL(10,2), 
    cost DECIMAL(10,2) NOT NULL, 
    mco_mca BOOLEAN, 
    hours_quote_valid SMALLINT, 
    client_comments VARCHAR(255), 
    intinerary_details VARCHAR(255),
    internal_coments VARCHAR(255)
)

CREATE TABLE services (
    service_id SERIAL,
    booking_id VARCHAR(255) NOT NULL,
    service_name VARCHAR(50) NOT NULL,
    service_code VARCHAR(10) NOT NULL, 
    service_date VARCHAR(30),  
    qty INT NOT NULL,
    charge DECIMAL(10,2), 
    tips DECIMAL(10,2), 
    sales_tax DECIMAL(10,2), 
    optional BOOLEAN,
    CONSTRAINT servicesPK PRIMARY KEY (service_id)
)

CREATE TABLE service_details (
    detail_id SERIAL,
    service_id INT NOT NULL,
    employee_id VARCHAR(50),
    company_id VARCHAR(50),
    vehicle_id VARCHAR(50) NOT NULL,
    from_location_id VARCHAR(50) NOT NULL,
    to_location_id VARCHAR(50) NOT NULL,
    use_farmout BOOLEAN,
    spot_time VARCHAR(30),
    start_time VARCHAR(30), 
    end_time VARCHAR(30),
    base_time VARCHAR(30),
    released_time VARCHAR(30), 
    service_type VARCHAR(10),
    instructions VARCHAR(255),
    payment DECIMAL(10,2), 
    perdiem DECIMAL(10,2), 
    gratuity DECIMAL(10,2), 
    CONSTRAINT service_detailsPK PRIMARY KEY (detail_id)
)


ALTER TABLE child_table 
ADD CONSTRAINT constraint_name 
FOREIGN KEY (fk_columns) 
REFERENCES parent_table (parent_key_columns);