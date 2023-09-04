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
)