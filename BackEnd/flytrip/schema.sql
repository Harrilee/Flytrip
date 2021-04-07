DROP TABLE IF EXISTS airline, airplane, airport, booking_agent, customer, flight, staff, ticket, purchase;

CREATE TABLE airline
(
    name varchar(100) NOT NULL,
    PRIMARY KEY (name)
);

CREATE TABLE staff
(
    username      varchar(100) NOT NULL,
    password      varchar(100) NOT NULL,
    first_name    varchar(100) NOT NULL,
    last_name     varchar(100) NOT NULL,
    date_of_birth date         NOT NULL,
    airline_name  varchar(100) NOT NULL,
    PRIMARY KEY (username),
    FOREIGN KEY (airline_name) REFERENCES airline (name)
);

CREATE TABLE airplane
(
    id           int(20)      NOT NULL,
    airline_name varchar(100) NOT NULL,
    seats        int(20)      NOT NULL,
    PRIMARY KEY (id, airline_name),
    FOREIGN KEY (airline_name) REFERENCES airline (name)
);

CREATE TABLE customer
(
    email               varchar(100) NOT NULL,
    name                varchar(100) NOT NULL,
    password            varchar(100) NOT NULL,
    building_number     varchar(100) NOT NULL,
    street              varchar(100) NOT NULL,
    city                varchar(100) NOT NULL,
    state               varchar(100) NOT NULL,
    phone_number        int(20)      NOT NULL,
    passport_number     varchar(100) NOT NULL,
    passport_expiration date         NOT NULL,
    passport_country    varchar(100) NOT NULL,
    date_of_birth       date         NOT NULL,
    PRIMARY KEY (email)
);

CREATE TABLE booking_agent
(
    email            varchar(100) NOT NULL,
    password         varchar(100) NOT NULL,
    booking_agent_id int(20)      NOT NULL,
    PRIMARY KEY (email)
);

CREATE TABLE airport
(
    name varchar(100) NOT NULL,
    city varchar(100) NOT NULL,
    PRIMARY KEY (name)
);

CREATE TABLE flight
(
    airline_name      varchar(100)   NOT NULL,
    airplane_id       int(20)        NOT NULL,
    flight_num        int(20)        NOT NULL,
    departure_time    datetime       NOT NULL,
    arrival_time      datetime       NOT NULL,
    price             decimal(10, 2) NOT NULL,
    status            varchar(100)   NOT NULL,
    departure_airport varchar(100)   NOT NULL,
    arrival_airport   varchar(100)   NOT NULL,
    PRIMARY KEY (airline_name, flight_num),
    FOREIGN KEY (airline_name) REFERENCES airline (name),
    FOREIGN KEY (airplane_id) REFERENCES airplane (id),
    FOREIGN KEY (arrival_airport) REFERENCES airport (name),
    FOREIGN KEY (departure_airport) REFERENCES airport (name)
);

CREATE TABLE ticket
(
    airline_name varchar(100) NOT NULL,
    flight_num   int(20)      NOT NULL,
    ticket_id    int(20)      NOT NULL,
    PRIMARY KEY (ticket_id),
    FOREIGN KEY (airline_name, flight_num) REFERENCES flight (airline_name, flight_num)
);

CREATE TABLE purchase
(
    customer_email varchar(100) NOT NULL,
    ticket_id      int(20)      NOT NULL,
    agent_id       int(20)      NULL,
    date           date         NOT NULL,
    PRIMARY KEY (customer_email, ticket_id),
    FOREIGN KEY (customer_email) REFERENCES customer (email),
    FOREIGN KEY (ticket_id) REFERENCES ticket (ticket_id)
);