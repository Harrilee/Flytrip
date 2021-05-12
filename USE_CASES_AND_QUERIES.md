# Flytrip - Use Cases and Queries

CSCI-SHU 213 database course project

Harry Lee [hl3794@nyu.edu](mailto:hl3794@nyu.edu), Zihang Xia [zx961@nyu.edu](mailto:zx961@nyu.edu)

## Guest

1. View Public Info: All users, whether logged in or not, can

   a. Search for upcoming flights based on source city/airport name, destination city/airport name, date.

   b. Will be able to see the flights status based on flight number, arrival/departure date.
   ```mysql
   -- The following query fetches the basic info about the flights
   SELECT airplane_id,
          airline_name,
          date,
          flight.departure_airport AS departure_airport,
          d_airport.airport_city   AS departure_city,
          a_airport.airport_city   AS arrival_city,
          a_airport.airport_name   AS arrival_airport,
          FCprice,
          BCprice,
          ECprice,
          departure_time,
          arrival_time,
          flight_num
   FROM flight
            JOIN airport AS d_airport
            JOIN airport AS a_airport
   WHERE flight.departure_airport = d_airport.airport_name
     AND flight.arrival_airport = a_airport.airport_name
     AND date = % s
     AND (UPPER(%s) = UPPER(d_airport.airport_name) OR UPPER(%s) = UPPER(d_airport.airport_city))
     AND (UPPER(%s) = UPPER(a_airport.airport_name) OR UPPER(%s) = UPPER(a_airport.airport_city));
   
   -- This query computes whether the specific flights are still available
   WITH sold_ticket_info AS (
       SELECT COUNT(class) AS sold_tickets, class
       FROM ticket
       WHERE airline_name = % s
         AND flight_num = % s
         AND date = % s
       GROUP BY class
   ),
        available_ticket_info_temp AS (
            SELECT ECseats, FCseats, BCseats
            FROM airplane
                     JOIN flight USING (airplane_id, airline_name)
            WHERE airline_name = % s
              AND flight_num = % s
              AND date = % s
        ),
        available_ticket_info AS (
            SELECT 'EC' AS class, ECseats AS available
            FROM available_ticket_info_temp
            UNION
            SELECT 'BC' AS class, BCseats AS available
            FROM available_ticket_info_temp
            UNION
            SELECT 'FC' AS class, FCseats AS available
            FROM available_ticket_info_temp
        )
   SELECT class, sold_tickets < available AS soldable
   FROM available_ticket_info
            NATURAL JOIN sold_ticket_info;
   ```
2. Register: 3 types of user registrations (Customer, Booking agent, Airline Staff) option via forms.
    1. Customer
   ```mysql
   INSERT INTO customer(email, firstname, lastname, password, building_number, street, city, state, phone_number,
   passport_number, passport_expiration, passport_country, date_of_birth)
   VALUES(%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
   ```
    2. Booking Agent
   ```mysql
   INSERT INTO booking_agent(email, password, booking_agent_id)
   VALUES(%s, %s, %s)
   ```   
    3. Airline Staff
   ```mysql
   INSERT INTO
   airline_staff(username, password, first_name, last_name, date_of_birth, airline_name)
   VALUES(%s, %s, %s, %s, %s, %s)
   ```   
    4. __Admin* (to operate database through front end)__
   ```mysql
   INSERT INTO
   airline_staff(username, password, first_name, last_name, date_of_birth, airline_name)
   VALUES(%s, %s, %s, %s, %s, %s)
   ```   

3. Login: 3 types of user login (Customer, Booking agent, Airline Staff). User enters their username (email address will
   be used as username), x, and password, y, via forms on login page. This data is sent as POST parameters to the
   login-authentication component, which checks whether there is a tuple in the Person table with username=x and the
   password = check_password_hash(y). This is the builtin function provided by werkzeug.security that implements salting
   and hashing.

    1. If so, login is successful. A session is initiated with the member’s username stored as a session variable.
       Optionally, you can store other session variables. Control is redirected to a component that displays the user’s
       home page.

    2. If not, login is unsuccessful. A message is displayed indicating this to the user.
     ```mysql
     SELECT * FROM customer WHERE email = %s LIMIT 1;
     SELECT * FROM booking_agent WHERE email = %s LIMIT 1;
     SELECT * FROM airline_staff WHERE username = %s LIMIT 1;
     SELECT * FROM admin WHERE admin_name = %s LIMIT 1;
   -- After getting user infomation, Python will compare whether user input match
   -- the recorded hash of the password 
      ```

## Customer

1. View My flights: Provide various ways for the user to see flights information which he/she purchased. The default
   should be showing for the upcoming flights. Optionally you may include a way for the user to specify a range of
   dates, specify destination and/or source airport name or city name etc.
2. Purchase tickets: Customer chooses a flight and purchase ticket for this flight. You may find it easier to implement
   this along with a use case to search for flights.
3. Search for flights: Search for upcoming flights based on source city/airport name, destination city/airport name,
   date.
4. Track My Spending: Default view will be total amount of money spent in the past year and a bar chart showing month
   wise money spent for last 6 months. He/she will also have option to specify a range of dates to view total amount of
   money spent within that range and a bar chart showing month wise money spent within that range.
5. Logout: The session is destroyed and a “goodbye” page or the login page is displayed.

## Booking Agent

1. View My flights: Provide various ways for the booking agents to see flights information for which he/she purchased on
   behalf of customers. The default should be showing for the upcoming flights. Optionally you may include a way for the
   user to specify a range of dates, specify destination and/or source airport name and/or city name etc to show all the
   flights for which he/she purchased tickets.
2. Purchase tickets: Booking agent chooses a flight and purchases tickets for other customers giving customer
   information. You may find it easier to implement this along with a use case to search for flights.
3. Search for flights: Search for upcoming flights based on source city/airport name, destination city/airport name,
   date.
4. View my commission: Default view will be total amount of commission received in the past 30 days and the average
   commission he/she received per ticket booked in the past 30 days and total number of tickets sold by him in the past
   30 days. He/she will also have option to specify a range of dates to view total amount of commission received and
   total numbers of tickets sold.
5. View Top Customers: Top 5 customers based on number of tickets bought from the booking agent in the past 6 months and
   top 5 customers based on amount of commission received in the last year. Show a bar chart showing each of these 5
   customers in x-axis and number of tickets bought in y-axis. Show another bar chart showing each of these 5 customers
   in x-axis and amount commission received in y- axis.
6. Logout: The session is destroyed and a “goodbye” page or the login page is displayed.

## Airline Staff

1. View My flights: Defaults will be showing all the upcoming flights operated by the airline he/she works for the next
   30 days. He/she will be able to see all the current/future/past flights operated by the airline he/she works for
   based range of dates, source/destination airports/city etc. He/she will be able to see all the customers of a
   particular flight.
   ```sql
   -- Get the upcoming flight information
   SELECT flight_num,
      arrival_airport,
      departure_airport,
      arrival_time,
      departure_time,
      status,
      airline_name airline,
      DATE_FORMAT(date, '%%Y-%%m-%%d') date

   FROM flight WHERE airline_name = %s;
   
   
   -- See all customers of a particular fligh
   SELECT * FROM customer JOIN purchases p ON customer.email = p.customer_email 
    JOIN ticket t ON p.ticket_id = t.ticket_id
    JOIN flight f ON t.airline_name = f.airline_name AND t.flight_num = f.flight_num
   WHERE f.flight_num = %s AND f.airline_name = %s AND f.date = %s;
   
   -- Get one particular passenger's info
   SELECT * FROM customer WHERE email = %s;
   ```
2. Create new flights: He or she creates a new flight, providing all the needed data, via forms. The application should
   prevent unauthorized users from doing this action. Defaults will be showing all the upcoming flights operated by the
   airline he/she works for the next 30 days.
   ```sql
   -- Get the airline this staff belongs to
   SELECT * FROM airline_staff WHERE username = %s;
   
   -- Create new flights
   INSERT INTO flight(airline_name, flight_num, departure_airport, departure_time, arrival_airport
    , arrival_time, ECprice, BCprice, FCprice, status, airplane_id, date) 
    VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
   ```

3. Change Status of flights: He or she changes a flight status (from upcoming to in progress, in progress to delayed
   etc) via forms.
   ```sql
   UPDATE flight SET status = %s WHERE flight_num = %s AND airline_name = %s AND date = %s;
   ```
4. Add airplane in the system: He or she adds a new airplane, providing all the needed data, via forms. The application
   should prevent unauthorized users from doing this action. In the confirmation page, she/he will be able to see all
   the airplanes owned by the airline he/she works for.
   ```sql
   -- Get the airline this staff belongs to
   SELECT * FROM airline_staff WHERE username = %s;
   
   -- Add new airplane
   INSERT INTO airplane(airline_name, airplane_id, ECseats, FCseats, BCseats) 
   VALUES (%s, %s, %s, %s, %s);
   ```
5. Add new airport in the system: He or she adds a new airport, providing all the needed data, via forms. The
   application should prevent unauthorized users from doing this action.
   ```sql
   INSERT INTO airport(airport_name, airport_city) VALUES (%s, %s);
   ```
6. View all the booking agents: Top 5 booking agents based on number of tickets sales for the past month and past year.
   Top 5 booking agents based on the amount of commission received for the last year.
   ```sql
   -- By selling
   WITH agent_ticket AS (
   SELECT booking_agent_id, email,
           CASE
               WHEN class = 'BC' THEN BCprice
               WHEN class = 'EC' THEN ECprice
               WHEN class = 'FC' THEN FCprice
               END price
   FROM ticket
             NATURAL JOIN purchases
             NATURAL JOIN flight
             NATURAL JOIN booking_agent
   WHERE booking_agent_id IS NOT NULL
     AND date > DATE_SUB(NOW(), INTERVAL 1 YEAR))
   SELECT CONCAT('Agent ', booking_agent_id) name, SUM(price) selling, email
   FROM agent_ticket
   GROUP BY email
   ORDER BY selling DESC
   LIMIT 5;
   
   -- By ticket, in a year
   SELECT CONCAT('Agent ',booking_agent_id) name, COUNT(*) tickets, email
   FROM purchases
   NATURAL JOIN booking_agent
   WHERE booking_agent_id IS NOT NULL
     AND purchase_date > DATE_SUB(NOW(), INTERVAL 1 YEAR)
   GROUP BY email
   ORDER BY tickets DESC
   LIMIT 5;
   
   -- By ticket, in a month
   SELECT CONCAT('Agent ',booking_agent_id) name, COUNT(*) tickets, email
   FROM purchases
   NATURAL JOIN booking_agent
   WHERE booking_agent_id IS NOT NULL
     AND purchase_date > DATE_SUB(NOW(), INTERVAL 1 MONTH)
   GROUP BY email
   ORDER BY tickets DESC
   LIMIT 5;
   ```
7. View frequent customers: Airline Staff will also be able to see the most frequent customer within the last year. In
   addition, Airline Staff will be able to see a list of all flights a particular Customer has taken only on that
   particular airline.
   ```sql
   -- Get the airline this staff belongs to
   SELECT * FROM airline_staff WHERE username = %s;
   
   -- Get top 5 customers
   WITH SUM_CATEGORY AS (
    WITH TEMP_SUM AS (
        SELECT CONCAT(firstname, ' ', lastname) AS name,
               email,
               class,
               SUM(BCprice)                     AS BC,
               SUM(FCprice)                     AS EC,
               SUM(ECprice)                     AS FC
        FROM ticket
                 JOIN purchases USING (ticket_id)
                 JOIN flight USING (airline_name, flight_num),
             customer
        WHERE customer.email = purchases.customer_email
        and airline_name = %s
        GROUP BY email, class
    )
    SELECT name, email, class, BC AS price
    FROM TEMP_SUM
    WHERE class = 'BC'
    UNION
    SELECT name, email, class, EC AS price
    FROM TEMP_SUM
    WHERE class = 'EC'
    UNION
    SELECT name, email, class, FC AS price
    FROM TEMP_SUM
    WHERE class = 'FC'
   )
   SELECT name, email, SUM(price) AS spending
   FROM SUM_CATEGORY
   GROUP BY email, name
   ORDER BY spending DESC
   LIMIT 5;
   
   -- View customer orders
   SELECT flight.date,
       airline_name                     airline,
       flight_num,
       departure_time,
       departure_airport,
       arrival_time,
       arrival_airport,
       CASE
           WHEN class = 'BC' THEN BCprice
           WHEN class = 'EC' THEN ECprice
           WHEN class = 'FC' THEN FCprice
           END                          price,
       purchase_date                    purchase_time,
       status,
       customer_email,
       CONCAT(firstname, ' ', lastname) customer_name
   FROM purchases
            JOIN ticket USING (ticket_id)
            JOIN flight USING (flight_num, airline_name)
            JOIN customer ON purchases.customer_email = customer.email
   WHERE customer_email = %s;
   ```
8. View reports: Total amounts of ticket sold based on range of dates/last year/last month etc. Month wise tickets sold
   in a bar chart.
   ```sql
   -- Get selling by month
   SELECT DATE_FORMAT(purchase_date, '%b') month,
       DATE_FORMAT(purchase_date, '%Y') year,
       SUM(CASE
               WHEN class = 'BC' THEN BCprice
               WHEN class = 'FC' THEN FCprice
               WHEN class = 'EC' THEN ECprice
               ELSE ECprice
           END)
                                        price
   FROM purchases
            JOIN ticket USING (ticket_id)
            JOIN flight USING (airline_name, flight_num)
            JOIN customer c ON purchases.customer_email = c.email
   WHERE purchase_date < %s
     AND purchase_date > %s
     AND customer_email = %s
   GROUP BY DATE_FORMAT(purchase_date, '%b'),
            DATE_FORMAT(purchase_date, '%Y');
   
   -- Get total selling
   WITH temp_sum AS (
    SELECT purchase_date date,
           CASE
               WHEN class = 'BC' THEN BCprice
               WHEN class = 'FC' THEN FCprice
               WHEN class = 'EC' THEN ECprice
               ELSE ECprice
               END
               price
    FROM purchases
             JOIN ticket USING (ticket_id)
             JOIN flight USING (flight_num, date)
    WHERE purchases.purchase_date > DATE_SUB(NOW(), INTERVAL 1 YEAR)
    )
   SELECT DATE_FORMAT(date, '%b') month, SUM(price) selling
   FROM temp_sum
   GROUP BY DATE_FORMAT(date, '%b')
   ```
9. Comparison of Revenue earned: Draw a pie chart for showing total amount of revenue earned from direct sales (when
   customer bought tickets without using a booking agent) and total amount of revenue earned from indirect sales (when
   customer bought tickets using booking agents) in the last month and last year.
   ```sql
   -- In a year
    WITH total_sum AS (
    SELECT booking_agent_id,
           CASE
               WHEN ticket.class = 'EC' THEN ECprice
               WHEN class = 'BC' THEN BCprice
               WHEN class = 'FC' THEN FCprice
               END price
    FROM purchases
             JOIN ticket USING (ticket_id)
             JOIN flight USING (airline_name, flight_num)
    WHERE purchase_date > DATE_SUB(NOW(), INTERVAL 1 YEAR)
   
   -- In a month
    WITH total_sum AS (
    SELECT booking_agent_id,
           CASE
               WHEN ticket.class = 'EC' THEN ECprice
               WHEN class = 'BC' THEN BCprice
               WHEN class = 'FC' THEN FCprice
               END price
    FROM purchases
             JOIN ticket USING (ticket_id)
             JOIN flight USING (airline_name, flight_num)
    WHERE purchase_date > DATE_SUB(NOW(), INTERVAL 1 MONTH)
   )
   SELECT IFNULL(SUM(IF(booking_agent_id IS NOT NULL, 0, price)),0) direct_year,
          IFNULL(SUM(IF(booking_agent_id IS NULL, 0, price)),0)     indirect_year
   FROM total_sum;
   )
   SELECT IFNULL(SUM(IF(booking_agent_id IS NOT NULL, 0, price)),0) direct_year,
          IFNULL(SUM(IF(booking_agent_id IS NULL, 0, price)),0)     indirect_year
   FROM total_sum;
   ```
10. View Top destinations: Find the top 3 most popular destinations for last 3 months and last year.
    ```sql
    -- In a year
    SELECT COUNT(*) COUNT,a.airport_city 
    FROM (flight JOIN airport a ON flight.arrival_airport = a.airport_name) 
    WHERE departure_time > DATE_SUB(NOW(), INTERVAL 1 YEAR) 
    GROUP BY a.airport_city 
    ORDER BY COUNT DESC 
    LIMIT 3; 
    -- In a month
    SELECT COUNT(*) COUNT,a.airport_city 
    FROM (flight JOIN airport a ON flight.arrival_airport = a.airport_name) 
    WHERE departure_time > DATE_SUB(NOW(), INTERVAL 1 MONTH) 
    GROUP BY a.airport_city 
    ORDER BY COUNT DESC 
    LIMIT 3; 
    ```
11. Logout: The session is destroyed and a “goodbye” page or the login page is displayed.

