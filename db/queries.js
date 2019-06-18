const { Pool } = require('pg');

const pool = new Pool({
  host: '3.17.5.98',
  database: 'opentable',
  user: 'postgres',
  password: 'postgres',
  port: 5432
});

const getReservations = (restaurant_id, callback) => {
  pool.query(`SELECT restaurants.id, name, "6:00 PM", "6:15 PM", "6:30 PM", "6:45 PM", "7:00 PM", "7:15 PM", "7:30 PM", "7:45 PM", "8:00 PM", "8:15 PM", "8:30 PM", reservation_id, restaurant_id, reservation_date, reservation_time, guests FROM reservations INNER JOIN restaurants ON restaurants.id = reservations.restaurant_id WHERE reservations.restaurant_id = ${restaurant_id};`, callback);
};

const addReservation = (reservationInfo, callback) => {
  const { restaurant_id, reservation_date, reservation_time, guests } = reservationInfo;
  pool.query(`INSERT INTO reservations(restaurant_id, reservation_date, reservation_time, guests) VALUES (${restaurant_id}, '${reservation_date}', '${reservation_time}', ${guests});`, callback);
};

const updateReservation = (reservationInfo, callback) => {
  const { restaurant_id, guests } = reservationInfo;
  pool.query(`UPDATE reservations SET "guests" = ${guests} WHERE restaurant_id=${restaurant_id};`, callback);
};

const deleteReservation = (reservation_id, callback) => {
  pool.query(`DELETE from reservations WHERE reservation_id=${reservation_id};`, callback);
};

module.exports = {
  getReservations,
  updateReservation,
  deleteReservation,
  addReservation,
};