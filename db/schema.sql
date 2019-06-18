DROP database IF EXISTS opentable;

CREATE database opentable;

\c opentable;

CREATE TABLE restaurants (
  id SERIAL PRIMARY KEY UNIQUE,
  name VARCHAR (50),
  "6:00 PM" INT,
  "6:15 PM" INT,
  "6:30 PM" INT,
  "6:45 PM" INT,
  "7:00 PM" INT,
  "7:15 PM" INT,
  "7:30 PM" INT,
  "7:45 PM" INT,
  "8:00 PM" INT,
  "8:15 PM" INT,
  "8:30 PM" INT
);

CREATE TABLE reservations (
  reservation_id SERIAL PRIMARY KEY,
  restaurant_id INT NOT NULL REFERENCES restaurants(id),
  reservation_date DATE NOT NULL,
  reservation_time VARCHAR NOT NULL,
  guests INT NOT NULL,
  date_created DATE DEFAULT CURRENT_DATE
);

-- ALTER TABLE reservations
--     ADD CONSTRAINT fk_reservations FOREIGN KEY (restaurant_id) REFERENCES restaurants (id);

COPY restaurants(id, name, "6:00 PM", "6:15 PM", "6:30 PM", "6:45 PM", "7:00 PM", "7:15 PM", "7:30 PM", "7:45 PM", "8:00 PM", "8:15 PM", "8:30 PM") FROM '/Users/williamchan/Desktop/sdc/reservations-service/restaurantData.csv' DELIMITER ',' CSV HEADER;

COPY reservations(reservation_id, restaurant_id, reservation_date, reservation_time, guests) FROM '/Users/williamchan/Desktop/sdc/reservations-service/db/reservationData.csv' DELIMITERS ',' CSV HEADER;


-- To pipe schema into PostgreSQL DB: 
-- psql -d opentable -a -f schema.sql

-- To copy CSV data into 'restaurants' table, run the following in a separate terminal:
-- psql postgres (start PostgreSQL)
-- \list (shows all databases)
-- \c opentable (use database)
-- \dt (shows all tables in database)
-- COPY restaurants(id, name, "6:00 PM", "6:15 PM", "6:30 PM", "6:45 PM", "7:00 PM", "7:15 PM", "7:30 PM", "7:45 PM", "8:00 PM", "8:15 PM", "8:30 PM") FROM '/Users/williamchan/Desktop/sdc/reservations-service/restaurantData.csv' DELIMITER ',' CSV HEADER;
-- COPY reservations(reservation_id, restaurant_id, reservation_date, reservation_time, guests) FROM '/Users/williamchan/Desktop/sdc/reservations-service/reservationData.csv' DELIMITER ',' CSV HEADER;

-- To improve read query speed:
-- CREATE INDEX name_idx ON restaurants (name);
-- CREATE INDEX restaurant_idx ON reservations (restaurant_id);

-- CASSANDRA
-- UPDATE restaurants SET "8:15 PM" = 5  WHERE name='Le Petit Chef 9998469';

-- JOIN Query
-- SELECT restaurants.id, name, "6:00 PM", "6:15 PM", "6:30 PM", "6:45 PM", "7:00 PM", "7:15 PM", "7:30 PM", "7:45 PM", "8:00 PM", "8:15 PM", "8:30 PM", reservation_id, restaurant_id, reservation_date, reservation_time, guests FROM reservations INNER JOIN restaurants ON restaurants.id = reservations.restaurant_id WHERE reservations.restaurant_id = 9800000;