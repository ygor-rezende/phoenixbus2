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

