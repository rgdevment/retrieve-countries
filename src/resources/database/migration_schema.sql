-- Crear base de datos si no existe
CREATE DATABASE IF NOT EXISTS countries_geo CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE countries_geo;

-- Tabla de países
CREATE TABLE IF NOT EXISTS countries (
                                         id INT AUTO_INCREMENT PRIMARY KEY,
                                         code VARCHAR(5) NOT NULL UNIQUE,
    iso3 VARCHAR(5),
    name VARCHAR(128) NOT NULL,
    capital VARCHAR(128),
    latitude DOUBLE,
    longitude DOUBLE,
    phone_code VARCHAR(16), -- aumentado de 10 a 16
    region VARCHAR(64),
    subregion VARCHAR(64),
    tld VARCHAR(16),

    currency_code VARCHAR(10),
    currency_symbol VARCHAR(10),
    currency_name VARCHAR(64),

    flag_ico VARCHAR(8),
    flag_alt TEXT,
    flag_png TEXT,
    flag_svg TEXT,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    );

-- Tabla de estados
CREATE TABLE IF NOT EXISTS states (
                                      id INT AUTO_INCREMENT PRIMARY KEY,
                                      name VARCHAR(128) NOT NULL,
    code VARCHAR(10),
    country_code VARCHAR(5) NOT NULL,
    latitude DOUBLE,
    longitude DOUBLE,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    FOREIGN KEY (country_code) REFERENCES countries(code)
                                                   ON DELETE CASCADE
                                                   ON UPDATE CASCADE
    );

-- Tabla de ciudades
CREATE TABLE IF NOT EXISTS cities (
                                      id INT AUTO_INCREMENT PRIMARY KEY,
                                      name VARCHAR(128) NOT NULL,
    state_code VARCHAR(10),
    country_code VARCHAR(5) NOT NULL,
    latitude DOUBLE,
    longitude DOUBLE,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    FOREIGN KEY (country_code) REFERENCES countries(code)
                                                   ON DELETE CASCADE
                                                   ON UPDATE CASCADE
    );
-- Crear base de datos si no existe
CREATE DATABASE IF NOT EXISTS countries_geo CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE countries_geo;

-- Tabla de países
CREATE TABLE IF NOT EXISTS countries (
                                         id INT AUTO_INCREMENT PRIMARY KEY,
                                         code VARCHAR(5) NOT NULL UNIQUE,
    iso3 VARCHAR(5),
    name VARCHAR(128) NOT NULL,
    capital VARCHAR(128),
    latitude DOUBLE,
    longitude DOUBLE,
    phone_code VARCHAR(16), -- aumentado de 10 a 16
    region VARCHAR(64),
    subregion VARCHAR(64),
    tld VARCHAR(16),

    currency_code VARCHAR(10),
    currency_symbol VARCHAR(10),
    currency_name VARCHAR(64),

    flag_ico VARCHAR(8),
    flag_alt TEXT,
    flag_png TEXT,
    flag_svg TEXT,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    );

-- Tabla de estados
CREATE TABLE IF NOT EXISTS states (
                                      id INT AUTO_INCREMENT PRIMARY KEY,
                                      name VARCHAR(128) NOT NULL,
    code VARCHAR(10),
    country_code VARCHAR(5) NOT NULL,
    latitude DOUBLE,
    longitude DOUBLE,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    FOREIGN KEY (country_code) REFERENCES countries(code)
                                                   ON DELETE CASCADE
                                                   ON UPDATE CASCADE
    );

-- Tabla de ciudades
CREATE TABLE IF NOT EXISTS cities (
                                      id INT AUTO_INCREMENT PRIMARY KEY,
                                      name VARCHAR(128) NOT NULL,
    state_code VARCHAR(10),
    country_code VARCHAR(5) NOT NULL,
    latitude DOUBLE,
    longitude DOUBLE,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    FOREIGN KEY (country_code) REFERENCES countries(code)
                                                   ON DELETE CASCADE
                                                   ON UPDATE CASCADE
    );
