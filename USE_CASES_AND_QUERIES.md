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
   password = md5(y).

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
2. Create new flights: He or she creates a new flight, providing all the needed data, via forms. The application should
   prevent unauthorized users from doing this action. Defaults will be showing all the upcoming flights operated by the
   airline he/she works for the next 30 days.
3. Change Status of flights: He or she changes a flight status (from upcoming to in progress, in progress to delayed
   etc) via forms.
4. Add airplane in the system: He or she adds a new airplane, providing all the needed data, via forms. The application
   should prevent unauthorized users from doing this action. In the confirmation page, she/he will be able to see all
   the airplanes owned by the airline he/she works for.
5. Add new airport in the system: He or she adds a new airport, providing all the needed data, via forms. The
   application should prevent unauthorized users from doing this action.
6. View all the booking agents: Top 5 booking agents based on number of tickets sales for the past month and past year.
   Top 5 booking agents based on the amount of commission received for the last year.
7. View frequent customers: Airline Staff will also be able to see the most frequent customer within the last year. In
   addition, Airline Staff will be able to see a list of all flights a particular Customer has taken only on that
   particular airline.
8. View reports: Total amounts of ticket sold based on range of dates/last year/last month etc. Month wise tickets sold
   in a bar chart.
9. Comparison of Revenue earned: Draw a pie chart for showing total amount of revenue earned from direct sales (when
   customer bought tickets without using a booking agent) and total amount of revenue earned from indirect sales (when
   customer bought tickets using booking agents) in the last month and last year.
10. View Top destinations: Find the top 3 most popular destinations for last 3 months and last year.
11. Logout: The session is destroyed and a “goodbye” page or the login page is displayed.
