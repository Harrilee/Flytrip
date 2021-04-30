DROP DATABASE IF EXISTS flytrip;
CREATE DATABASE IF NOT EXISTS flytrip;
USE flytrip;
CREATE TABLE `airline`
(
    `airline_name` VARCHAR(50) NOT NULL,
    PRIMARY KEY (`airline_name`)
) ENGINE = InnoDB
  DEFAULT CHARSET = latin1;

-- --------------------------------------------------------

--
-- Table structure for table `airline_staff`
--

CREATE TABLE `airline_staff`
(
    `username`      VARCHAR(50) NOT NULL,
    `password`      VARCHAR(100) NOT NULL,
    `first_name`    VARCHAR(50) NOT NULL,
    `last_name`     VARCHAR(50) NOT NULL,
    `date_of_birth` DATE        NOT NULL,
    `airline_name`  VARCHAR(50) NOT NULL,
    PRIMARY KEY (`username`),
    FOREIGN KEY (`airline_name`) REFERENCES `airline` (`airline_name`)
) ENGINE = InnoDB
  DEFAULT CHARSET = latin1;

-- --------------------------------------------------------

--
-- Table structure for table `airplane`
--

CREATE TABLE `airplane`
(
    `airline_name` VARCHAR(50) NOT NULL,
    `airplane_id`  INT(11)     NOT NULL,
    `seats`        INT(11)     NOT NULL,
    PRIMARY KEY (`airline_name`, `airplane_id`),
    FOREIGN KEY (`airline_name`) REFERENCES `airline` (`airline_name`)
) ENGINE = InnoDB
  DEFAULT CHARSET = latin1;

-- --------------------------------------------------------

--
-- Table structure for table `airport`
--

CREATE TABLE `airport`
(
    `airport_name` VARCHAR(50) NOT NULL,
    `airport_city` VARCHAR(50) NOT NULL,
    PRIMARY KEY (`airport_name`)
) ENGINE = InnoDB
  DEFAULT CHARSET = latin1;

-- --------------------------------------------------------

--
-- Table structure for table `booking_agent`
--

CREATE TABLE `booking_agent`
(
    `email`            VARCHAR(50) NOT NULL,
    `password`         VARCHAR(100) NOT NULL,
    `booking_agent_id` INT(11)     NOT NULL,
    PRIMARY KEY (`email`)
) ENGINE = InnoDB
  DEFAULT CHARSET = latin1;

-- --------------------------------------------------------

--
-- Table structure for table `customer`
--

CREATE TABLE `customer`
(
    `email`               VARCHAR(50) NOT NULL,
    `name`                VARCHAR(50) NOT NULL,
    `password`            VARCHAR(100) NOT NULL,
    `building_number`     VARCHAR(30) NOT NULL,
    `street`              VARCHAR(30) NOT NULL,
    `city`                VARCHAR(30) NOT NULL,
    `state`               VARCHAR(30) NOT NULL,
    `phone_number`        INT(11)     NOT NULL,
    `passport_number`     VARCHAR(30) NOT NULL,
    `passport_expiration` DATE        NOT NULL,
    `passport_country`    VARCHAR(50) NOT NULL,
    `date_of_birth`       DATE        NOT NULL,
    PRIMARY KEY (`email`)
) ENGINE = InnoDB
  DEFAULT CHARSET = latin1;

-- --------------------------------------------------------

--
-- Table structure for table `flight`
--

CREATE TABLE `flight`
(
    `airline_name`      VARCHAR(50)    NOT NULL,
    `flight_num`        INT(11)        NOT NULL,
    `departure_airport` VARCHAR(50)    NOT NULL,
    `departure_time`    DATETIME       NOT NULL,
    `arrival_airport`   VARCHAR(50)    NOT NULL,
    `arrival_time`      DATETIME       NOT NULL,
    `price`             DECIMAL(10, 0) NOT NULL,
    `status`            VARCHAR(50)    NOT NULL,
    `airplane_id`       INT(11)        NOT NULL,
    PRIMARY KEY (`airline_name`, `flight_num`),
    FOREIGN KEY (`airline_name`, `airplane_id`) REFERENCES `airplane` (`airline_name`, `airplane_id`),
    FOREIGN KEY (`departure_airport`) REFERENCES `airport` (`airport_name`),
    FOREIGN KEY (`arrival_airport`) REFERENCES `airport` (`airport_name`)
) ENGINE = InnoDB
  DEFAULT CHARSET = latin1;


-- --------------------------------------------------------

--
-- Table structure for table `ticket`
--

CREATE TABLE `ticket`
(
    `ticket_id`    INT(11)     NOT NULL,
    `airline_name` VARCHAR(50) NOT NULL,
    `flight_num`   INT(11)     NOT NULL,
    PRIMARY KEY (`ticket_id`),
    FOREIGN KEY (`airline_name`, `flight_num`) REFERENCES `flight` (`airline_name`, `flight_num`)
) ENGINE = InnoDB
  DEFAULT CHARSET = latin1;


-- --------------------------------------------------------

--
-- Table structure for table `purchases`
--

CREATE TABLE `purchases`
(
    `ticket_id`        INT(11)     NOT NULL,
    `customer_email`   VARCHAR(50) NOT NULL,
    `booking_agent_id` INT(11),
    `purchase_date`    DATE        NOT NULL,
    PRIMARY KEY (`ticket_id`, `customer_email`),
    FOREIGN KEY (`ticket_id`) REFERENCES `ticket` (`ticket_id`),
    FOREIGN KEY (`customer_email`) REFERENCES `customer` (`email`)
) ENGINE = InnoDB
  DEFAULT CHARSET = latin1;

-- --------------------------------------------------------

--
-- Table structure for table `admin`
--

CREATE TABLE `admin`
(
    `admin_id` INT(11)     NOT NULL,
    `password` VARCHAR(100) NOT NULL,
    PRIMARY KEY (`admin_id`)
) ENGINE = InnoDB
  DEFAULT CHARSET = latin1;
