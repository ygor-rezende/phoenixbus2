CREATE TABLE users (
    username VARCHAR(255) PRIMARY KEY,
    hashed_password VARCHAR(255) NOT NULL,
    user_type VARCHAR(255) NOT NULL
),

CREATE TABLE vehicles (
    vehicle_id VARCHAR(255) PRIMARY KEY,
    vehicle_name VARCHAR(255) NOT NULL,
    vehicle_model VARCHAR(255) NOT NULL, 
    vehicle_year SMALLINT NOT NULL,
    vehicle_color VARCHAR(255) NOT NULL
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
    client_id VARCHAR(255) NOT NULL,
    employee_id VARCHAR(255) NOT NULL, 
    quote_date VARCHAR(30) NOT NULL,  
    category VARCHAR(50) NOT NULL, 
    pax_group VARCHAR(255), 
    num_adults SMALLINT NOT NULL, 
    num_child SMALLINT NOT NULL,
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

