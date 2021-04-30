INSERT INTO airport (airport_name, airport_city)
VALUES ('JFK', 'New York'),
       ('PVG', 'Shanghai');

INSERT INTO airline (airline_name)
VALUES ('China Eastern'),
       ('airline a'),
       ('airline b'),
       ('airline c'),
       ('airline d'),
       ('airline e'),
       ('airline f'),
       ('airline g'),
       ('airline h');

INSERT INTO customer (email, name, password, building_number, street, city, state, phone_number, passport_number,
                      passport_expiration, passport_country, date_of_birth)
VALUES ('user1@test.com', 'user1', 'password1', 'building1', 'street1', 'Shanghai', 'Shanghai', '123456789', 'CN123456',
        '2021-1-1', 'China', '2000-1-1'),
       ('user2@test.com', 'user2', 'password2', 'building2', 'street2', 'Shanghai', 'Shanghai', '123456789', 'CN123456',
        '2021-1-1', 'China', '2000-1-1'),
       ('user3@test.com', 'user3', 'password3', 'building1', 'street3', 'Shanghai', 'Shanghai', '123456789', 'CN123456',
        '2021-1-1', 'China', '2000-1-1'),
       ('user4@test.com', 'user4', 'password4', 'building4', 'street4', 'Shanghai', 'Shanghai', '123456789', 'CN123456',
        '2021-1-1', 'China', '2000-1-1');

INSERT INTO booking_agent (email, password, booking_agent_id)
VALUES ('agent1@test.com', 'password1', 1234);

INSERT INTO airplane (airplane_id, airline_name, seats)
VALUES (1, 'China Eastern', 100),
       (1, 'airline a', 150);

INSERT INTO airline_staff (username, password, first_name, last_name, date_of_birth, airline_name)
VALUES ('staff1', 'password1', 'john', 'smith', '2000-1-1', 'China Eastern');

INSERT INTO flight (airline_name, airplane_id, flight_num, departure_time, arrival_time, price, status,
                    departure_airport, arrival_airport)
VALUES ('China Eastern', 1, 1, '2021-1-1 00:00:00', '2021-1-2 00:00:00', 100, 'upcoming', 'PVG', 'JFK'),
       ('China Eastern', 1, 2, '2021-1-1 00:00:00', '2021-1-2 00:00:00', 100, 'delayed', 'PVG', 'JFK'),
       ('China Eastern', 1, 3, '2021-1-1 00:00:00', '2021-1-2 00:00:00', 100, 'canceled', 'PVG', 'JFK'),
       ('China Eastern', 1, 4, '2021-1-1 00:00:00', '2021-1-2 00:00:00', 100, 'in-progress', 'PVG', 'JFK');

INSERT INTO ticket (airline_name, flight_num, ticket_id)
VALUES ('China Eastern', 1, 1),
       ('China Eastern', 1, 2),
       ('China Eastern', 1, 3),
       ('China Eastern', 1, 4);

INSERT INTO purchases (customer_email, ticket_id, booking_agent_id, purchase_date)
VALUES ('user1@test.com', 1, NULL, '2021-1-1'),
       ('user1@test.com', 2, NULL, '2021-1-1'),
       ('user1@test.com', 3, 1234, '2021-1-1'),
       ('user1@test.com', 4, 1234, '2021-1-1');

INSERT INTO admin (admin_id, password)
VALUES ('1', 'pbkdf2:sha256:150000$SbLyIzDI$0df83a4f07f173c445fec78079824601aa4935c0a88fc5a4d99f86c55c0f4e0e');
