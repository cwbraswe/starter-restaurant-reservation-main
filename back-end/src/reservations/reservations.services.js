const knex = require("../db/connection");

function create(reservation) {
  return knex("reservations")
    .insert(reservation)
    .returning("*")
    .then((createdRecords) => createdRecords[0]);
}

function read(reservation_id) {
  return knex("reservations").select("*").where({ reservation_id }).first();
}

function update(reservation, reservation_id) {
  return knex("reservations")
    .where({ reservation_id })
    .update(reservation, "*")
    .then((updatedRecords) => updatedRecords[0]);
}

function updateStatus(reservation_id, status) {
  return knex("reservations")
    .where({ reservation_id })
    .update({ status }, "*")
    .then((updatedRecords) => updatedRecords[0]);
}

function search(mobile_number) {
  return knex("reservations")
    .select("*")
    .whereRaw(
      "translate(mobile_number, '() -', '') like ?",
      `%${mobile_number.replace(/\D/g, "")}%`
    )
    .orderBy("reservation_date");
}

function listByDate(reservation_date) {
  return knex("reservations")
    .select("*")
    .where({ reservation_date })
    .whereIn("status", ["booked", "seated"])
    .orderBy("reservation_time");
}

function list() {
  return knex("reservations").select("*").orderBy("reservation_date");
}

function seat(table_id, reservation_id) {
  return knex.transaction(async (trx) => {
    await trx("tables")
      .where({ table_id })
      .update({ reservation_id })
      .then(() => {
        return trx("reservations")
          .where({ reservation_id })
          .update({ status: "seated" });
      });
  });
}

function finish(table_id, reservation_id) {
  return knex.transaction(async (trx) => {
    await trx("tables")
      .where({ table_id })
      .update({ reservation_id: null })
      .then(() => {
        return trx("reservations")
          .where({ reservation_id })
          .update({ status: "finished" });
      });
  });
}

module.exports = {
  create,
  read,
  update,
  search,
  list,
  seat,
  finish,
  listByDate,
  updateStatus,
};