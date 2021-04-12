CREATE DATABASE IF NOT EXISTS flytrip;
USE flytrip;
DROP TABLE IF EXISTS airline, airplane, airport, booking_agent, customer, flight, staff, ticket, purchase;

CREATE TABLE airline
(
    name VARCHAR(100) NOT NULL,
    PRIMARY KEY (name)
);

CREATE TABLE staff
(
    username      VARCHAR(100) NOT NULL,
    password      VARCHAR(100) NOT NULL,
    first_name    VARCHAR(100) NOT NULL,
    last_name     VARCHAR(100) NOT NULL,
    date_of_birth DATE         NOT NULL,
    airline_name  VARCHAR(100) NOT NULL,
    PRIMARY KEY (username),
    FOREIGN KEY (airline_name) REFERENCES airline (name)
);

CREATE TABLE airplane
(
    id           INT(20)      NOT NULL,
    airline_name VARCHAR(100) NOT NULL,
    seats        INT(20)      NOT NULL,
    PRIMARY KEY (id, airline_name),
    FOREIGN KEY (airline_name) REFERENCES airline (name)
);

CREATE TABLE customer
(
    email               VARCHAR(100) NOT NULL,
    name                VARCHAR(100) NOT NULL,
    password            VARCHAR(100) NOT NULL,
    building_number     VARCHAR(100) NOT NULL,
    street              VARCHAR(100) NOT NULL,
    city                VARCHAR(100) NOT NULL,
    state               VARCHAR(100) NOT NULL,
    phone_number        VARCHAR(100) NOT NULL,
    passport_number     VARCHAR(100) NOT NULL,
    passport_expiration DATETIME     NOT NULL,
    passport_country    VARCHAR(100) NOT NULL,
    date_of_birth       DATETIME     NOT NULL,
    PRIMARY KEY (email)
);

CREATE TABLE booking_agent
(
    email            VARCHAR(100) NOT NULL,
    password         VARCHAR(100) NOT NULL,
    booking_agent_id INT(20)      NOT NULL,
    PRIMARY KEY (email)
);

CREATE TABLE airport
(
    name VARCHAR(100) NOT NULL,
    city VARCHAR(100) NOT NULL,
    PRIMARY KEY (name)
);

CREATE TABLE flight
(
    airline_name      VARCHAR(100)   NOT NULL,
    airplane_id       INT(20)        NOT NULL,
    flight_num        INT(20)        NOT NULL,
    departure_time    DATETIME       NOT NULL,
    arrival_time      DATETIME       NOT NULL,
    price             DECIMAL(10, 2) NOT NULL,
    status            VARCHAR(100)   NOT NULL,
    departure_airport VARCHAR(100)   NOT NULL,
    arrival_airport   VARCHAR(100)   NOT NULL,
    PRIMARY KEY (airline_name, flight_num),
    FOREIGN KEY (airline_name) REFERENCES airline (name),
    FOREIGN KEY (airplane_id) REFERENCES airplane (id),
    FOREIGN KEY (arrival_airport) REFERENCES airport (name),
    FOREIGN KEY (departure_airport) REFERENCES airport (name)
);

CREATE TABLE ticket
(
    airline_name VARCHAR(100) NOT NULL,
    flight_num   INT(20)      NOT NULL,
    ticket_id    INT(20)      NOT NULL,
    PRIMARY KEY (ticket_id),
    FOREIGN KEY (airline_name, flight_num) REFERENCES flight (airline_name, flight_num)
);

CREATE TABLE purchase
(
    customer_email VARCHAR(100) NOT NULL,
    ticket_id      INT(20)      NOT NULL,
    agent_id       INT(20)      NULL,
    date           DATE         NOT NULL,
    PRIMARY KEY (customer_email, ticket_id),
    FOREIGN KEY (customer_email) REFERENCES customer (email),
    FOREIGN KEY (ticket_id) REFERENCES ticket (ticket_id)
);
