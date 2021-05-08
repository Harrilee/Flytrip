INSERT INTO airport (airport_name, airport_city)
VALUES ('airport 1', 'city 1'),
       ('airport 2', 'city 1'),
       ('airport 3', 'city 1'),
       ('airport 4', 'city 2'),
       ('airport 5', 'city 3'),
       ('airport 6', 'city 3'),
       ('airport 7', 'city 4'),
       ('airport 8', 'city 4');

INSERT INTO airline (airline_name)
VALUES ('airline 1'),
       ('airline 2'),
       ('airline 3'),
       ('airline 4'),
       ('airline 5'),
       ('airline 6'),
       ('airline 7'),
       ('airline 8');

INSERT INTO customer (email, firstname, lastname, password, building_number, street, city, state, phone_number,
                      passport_number,
                      passport_expiration, passport_country, date_of_birth)
VALUES ('user1@test.com', 'user1', 'smith',
        'pbkdf2:sha256:150000$p3CdU0xc$08ae5552757d5693af38bf8373cbbc338eb828dd0941255b952553a2a0572cfd', 'building1',
        'street1', 'Shanghai', 'Shanghai', '123456789', 'CN123456',
        '2021-1-1', 'China', '2000-1-1'),
       ('user2@test.com', 'user2', 'smith',
        'pbkdf2:sha256:150000$p3CdU0xc$08ae5552757d5693af38bf8373cbbc338eb828dd0941255b952553a2a0572cfd', 'building2',
        'street2', 'Shanghai', 'Shanghai', '123456789', 'CN123456',
        '2021-1-1', 'China', '2000-1-1'),
       ('user3@test.com', 'user3', 'smith',
        'pbkdf2:sha256:150000$p3CdU0xc$08ae5552757d5693af38bf8373cbbc338eb828dd0941255b952553a2a0572cfd', 'building1',
        'street3', 'Shanghai', 'Shanghai', '123456789', 'CN123456',
        '2021-1-1', 'China', '2000-1-1'),
       ('user4@test.com', 'user4', 'smith',
        'pbkdf2:sha256:150000$p3CdU0xc$08ae5552757d5693af38bf8373cbbc338eb828dd0941255b952553a2a0572cfd', 'building4',
        'street4', 'Shanghai', 'Shanghai', '123456789', 'CN123456',
        '2021-1-1', 'China', '2000-1-1');

INSERT INTO booking_agent (email, password, booking_agent_id)
VALUES ('agent1@test.com',
        'pbkdf2:sha256:150000$p3CdU0xc$08ae5552757d5693af38bf8373cbbc338eb828dd0941255b952553a2a0572cfd', 1),
       ('agent2@test.com',
        'pbkdf2:sha256:150000$p3CdU0xc$08ae5552757d5693af38bf8373cbbc338eb828dd0941255b952553a2a0572cfd', 2);

INSERT INTO airplane (airplane_id, airline_name, FCseats, BCseats, ECseats)
VALUES (1, 'airline 1', 10, 20, 300),
       (2, 'airline 1', 13, 20, 300),
       (3, 'airline 1', 12, 20, 300),
       (4, 'airline 1', 10, 23, 300),
       (5, 'airline 1', 10, 20, 300),
       (6, 'airline 1', 10, 25, 300),
       (1, 'airline 2', 10, 20, 330),
       (2, 'airline 2', 10, 20, 300),
       (3, 'airline 2', 10, 22, 300),
       (4, 'airline 2', 1, 20, 300),
       (1, 'airline 3', 5, 20, 304),
       (1, 'airline 4', 9, 20, 350),
       (1, 'airline 5', 10, 20, 300),
       (1, 'airline 6', 10, 20, 300),
       (1, 'airline 7', 10, 20, 300),
       (1, 'airline 8', 10, 20, 200);

INSERT INTO airline_staff (username, password, first_name, last_name, date_of_birth, airline_name)
VALUES ('staff1', 'pbkdf2:sha256:150000$p3CdU0xc$08ae5552757d5693af38bf8373cbbc338eb828dd0941255b952553a2a0572cfd',
        'john1', 'smith', '2000-12-1', 'airline 1'),
       ('staff2', 'pbkdf2:sha256:150000$p3CdU0xc$08ae5552757d5693af38bf8373cbbc338eb828dd0941255b952553a2a0572cfd',
        'john2', 'smith', '2000-1-15', 'airline 1'),
       ('staff3', 'pbkdf2:sha256:150000$p3CdU0xc$08ae5552757d5693af38bf8373cbbc338eb828dd0941255b952553a2a0572cfd',
        'john3', 'smith', '2000-1-21', 'airline 1'),
       ('staff4', 'pbkdf2:sha256:150000$p3CdU0xc$08ae5552757d5693af38bf8373cbbc338eb828dd0941255b952553a2a0572cfd',
        'john4', 'smith', '2000-1-5', 'airline 1'),
       ('staff5', 'pbkdf2:sha256:150000$p3CdU0xc$08ae5552757d5693af38bf8373cbbc338eb828dd0941255b952553a2a0572cfd',
        'john5', 'smith', '2000-1-3', 'airline 2'),
       ('staff6', 'pbkdf2:sha256:150000$p3CdU0xc$08ae5552757d5693af38bf8373cbbc338eb828dd0941255b952553a2a0572cfd',
        'john6', 'smith', '2000-1-2', 'airline 2'),
       ('staff7', 'pbkdf2:sha256:150000$p3CdU0xc$08ae5552757d5693af38bf8373cbbc338eb828dd0941255b952553a2a0572cfd',
        'john7', 'smith', '2000-1-21', 'airline 2');

INSERT INTO flight (airline_name, airplane_id, flight_num, departure_time, arrival_time, FCprice, BCprice, ECprice,
                    status,
                    departure_airport, arrival_airport, date)
VALUES ('airline 1', 1, 1, '2021-1-1 00:00:00', '2021-1-2 00:00:00', 100, 10, 1, 'upcoming', 'airport 1', 'airport 2',
        '2021-1-1'),
       ('airline 2', 1, 1, '2021-1-1 00:00:00', '2021-1-2 00:00:00', 100, 10, 1, 'delayed', 'airport 1', 'airport 2',
        '2021-1-1'),
       ('airline 1', 1, 3, '2021-1-1 00:00:00', '2021-1-2 00:00:00', 100, 10, 1, 'canceled', 'airport 3', 'airport 5',
        '2021-1-1'),
       ('airline 1', 1, 4, '2021-1-1 00:00:00', '2021-1-2 00:00:00', 100, 10, 1, 'in-progress', 'airport 2', 'airport 1',
        '2021-1-1');

INSERT INTO ticket (airline_name, flight_num, ticket_id, class, date)
VALUES ('airline 1', 1, 1, 'BC', '2021-1-1'),
       ('airline 1', 1, 2, 'BC', '2021-1-1'),
       ('airline 1', 1, 3, 'EC', '2021-1-1'),
       ('airline 1', 1, 4, 'BC', '2021-1-1'),
       ('airline 1', 1, 5, 'BC', '2021-1-1'),
       ('airline 2', 1, 6, 'EC', '2021-1-1'),
       ('airline 2', 1, 7, 'BC', '2021-1-1'),
       ('airline 2', 1, 8, 'BC', '2021-1-1'),
       ('airline 2', 1, 9, 'EC', '2021-1-1'),
       ('airline 2', 1, 10, 'BC', '2021-1-1'),
       ('airline 1', 1, 11, 'BC', '2021-1-1'),
       ('airline 1', 1, 12, 'EC', '2021-1-1'),
       ('airline 1', 1, 13, 'FC', '2021-1-1');

INSERT INTO purchases (customer_email, ticket_id, booking_agent_id, purchase_date)
VALUES ('user1@test.com', 1, NULL, '2021-1-1'),
       ('user1@test.com', 2, NULL, '2021-1-1'),
       ('user2@test.com', 3, 1, '2021-1-1'),
       ('user3@test.com', 4, 1, '2021-1-1'),
       ('user4@test.com', 5, 2, '2021-1-1'),
       ('user4@test.com', 6, 2, '2021-1-1'),
       ('user4@test.com', 7, 2, '2021-1-1'),
       ('user4@test.com', 8, 2, '2021-1-1');


INSERT INTO admin (admin_name, password)
VALUES ('1', 'pbkdf2:sha256:150000$SbLyIzDI$0df83a4f07f173c445fec78079824601aa4935c0a88fc5a4d99f86c55c0f4e0e');
