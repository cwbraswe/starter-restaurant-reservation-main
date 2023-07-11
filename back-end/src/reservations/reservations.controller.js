/**
 * List handler for reservation resources
 */
const services = require('./reservations.services');
const asyncErrorBoundary = require('../errors/asyncErrorBoundary');
const hasProps = require('../util/hasProp');

// helper functions and variables this section is for the lower level functions that are used in the middleware and the routes
// Best practice is to make the code clear to read and avoid commenting.

const today = Date.now(); // today's date in milliseconds
const UTC = (date) => {
  return Date.UTC(
    date.getUTCFullYear(),
    date.getUTCMonth(),
    date.getUTCDate(),
    date.getUTCHours(),
    date.getUTCMinutes(),
    date.getUTCSeconds(),
  );
}; // converts a date to UTC

const isPast = (date) => date <= today; // checks if a date is in the past
const isTuesday = (date) => date.getDay() === 2; // checks if a date is a Tuesday
const validDate = /\d{4}-\d{2}-\d{2}/; // regex for a valid date
const validTime = /\d{2}:\d{2}/; // regex for a valid time
const validStatus = ['booked', 'seated', 'finished', 'cancelled']; // array of valid status values
const requiredProperties = [
  'first_name',
  'last_name',
  'mobile_number',
  'reservation_date',
  'reservation_time',
  'people',
]; // array of required properties for a reservation

// middleware

function hasData(req, res, next) {
  if (req.body.data) {
    res.locals.data = req.body.data;
    return next();
  }
  next({ status: 400, message: 'Body must have data property' });
} // checks if the request body has a data property

const hasRequiredProperties = hasProps(requiredProperties);

function validateCapacity(req, res, next) {
  const { data = {} } = res.locals;
  const people = data.people;
  if (!Number.isInteger(people)) {
    return next({
      status: 400,
      message: 'The people field must be a number.',
    });
  }
  if (+people < 1) {
    return next({
      status: 400,
      message: 'The reservation must be for at least 1 person.',
    });
  }
  next(); 
} // checks if the people property is a number and is greater than 0

function validateDateFormat(req, res, next) {
  const { data = {} } = res.locals;
  const reservation_date = data.reservation_date;
  if (!validDate.test(reservation_date)) {
    return next({
      status: 400,
      message: 'The reservation_date field must be a valid date.',
    });
  }
  next();
} // checks if the reservation_date property is a valid date

function validateTimeFormat(req, res, next) {
  const { data = {} } = res.locals;
  const reservation_time = data.reservation_time;
  if (!validTime.test(reservation_time)) {
    return next({
      status: 400,
      message: 'The reservation_time field must be a valid time.',
    });
  }
  next();
} // checks if the reservation_time property is a valid time

function validateDateTime(req, res, next) {
  const { data = {} } = res.locals;
  const { reservation_date, reservation_time } = data;
  const reservation = new Date(`${reservation_date}T${reservation_time}`);

  const dateUTC = Date.UTC(
    reservation.getUTCFullYear(),
    reservation.getUTCMonth(),
    reservation.getUTCDate(),
    reservation.getUTCHours(),
    reservation.getUTCMinutes(),
    reservation.getUTCSeconds(),
  ); // converts the date to UTC

  if (isPast(dateUTC)) {
    return next({
      status: 400,
      message: 'The reservation must be in the future.',
    });
  } // check if reservation is in the past
  if (isTuesday(reservation)) {
    return next({
      status: 400,
      message: 'The restaurant is closed on Tuesdays.',
    });
  } // check if reservation is on a Tuesday
  const open = new Date(`${reservation_date}T10:30`); // set the opening time to 10:30am
  const openUTC = UTC(open); // convert the opening time to UTC
  if (dateUTC < openUTC) {
    return next({
      status: 400,
      message: 'The reservation must be after 10:30am.',
    });
  } // check if reservation is before 10:30am


  const close = new Date(`${reservation_date}T21:30`); // set the closing time to 9:30pm
  const closeUTC = UTC(close); // convert the closing time to UTC
  if (dateUTC > closeUTC) {
    return next({
      status: 400,
      message: 'The reservation must be before 9:30pm.',
    });
  } // check if reservation is after 9:30pm
  next();
} // checks if the reservation is in the future, on a Tuesday, before 10:30am, or after 9:30pm

function validatePhoneNumber(req, res, next) {

  const { data = {} } = res.locals;
  const mobile_number = data.mobile_number;
  const formatted = mobile_number.replace(/\D/g, '');
  if (formatted.length !== 10) {
    return next({
      status: 400,
      message: 'The mobile_number field must be a valid phone number.',
    });
  }

  next();
} // checks if the mobile_number property is a valid phone number

async function validateReservationExists(req, res, next) {
  const { reservation_id } = req.params;
  const reservation = await services.read(reservation_id);
  if (!reservation) {
    return next({
      status: 404,
      message: `Reservation ${reservation_id} cannot be found.`,
    });
  }
  res.locals.reservation = reservation;
  next();
} // checks if the reservation exists

function validateBookedStatus(req, res, next) {
  const { data = {} } = res.locals;
  const status = data.status;
  if (status) {
  if (status === 'seated' || status === 'finished' || status === 'cancelled') {
    return next({
      status: 400,
      message: `Cannot create a reservation with a status of ${status}.`,
    });
  }
  }
  
  next();
} // checks if the status property is booked

function validateStatus(req, res, next) {
  const { data = {} } = res.locals;
  const status = data.status;
  if (!status || !validStatus.includes(status)) {
    return next({
      status: 400,
      message: `The status must be booked, seated, finished, or cancelled. Not: ${status}`,
    });
  }
  next();
} // checks if the status property is booked, seated, finished, or cancelled

function validateReservationUpdatable(req, res, next) {
  const { reservation } = res.locals;
  if (reservation.status === 'finished') {
    return next({
      status: 400,
      message: 'A finished reservation cannot be updated.',
    });
  }
  if (reservation.status === 'cancelled') {
    return next({
      status: 400,
      message: 'A cancelled reservation cannot be updated.',
    });
  }
  next();
} // checks if the reservation is finished or cancelled

function validateTableIdExists(req, res, next) {
  const { data = {} } = res.locals;
  const table_id = data.table_id;
  if (!table_id) {
    return next({
      status: 400,
      message: 'The table_id field is required.',
    });
  }
  next();
} // checks if the table_id property exists

// CRUD functions

async function list(req, res) {
  const { date, mobile_number } = req.query;
  if (date) {
    const data = await services.listByDate(date);
    res.json({ data });
  } else if (mobile_number) {
    const data = await services.search(mobile_number);
    res.json({ data });
  } else {
    const data = await services.list();
    res.json({ data });
  }
} // lists all reservations

async function create(req, res) {
  const data = await services.create(res.locals.data);
  res.status(201).json({ data });
} // creates a new reservation

async function read(req, res) {
  const { reservation } = res.locals;
  res.json({ data: reservation });
}   

async function update(req, res) {
  const { reservation_id } = req.params;
  const response = await services.update(res.locals.data, reservation_id);
  const data = {
    first_name: response.first_name,
    last_name: response.last_name,
    mobile_number: response.mobile_number,
    people: response.people,
  };
  res.json({ data });
} // updates a reservation

async function updateStatus(req, res) {
  const { reservation_id } = res.locals.reservation;
  const { status } = res.locals.data;
  const data = await services.updateStatus(reservation_id, status);
  res.status(200).json({ data });
} // updates the status of a reservation

async function seat(req, res) {
  const { reservation_id } = res.locals.reservation;
  const { table_id } = res.locals.data;
  const data = await services.seat(reservation_id, table_id);
  res.json({ data });
} // seats a reservation

async function finish(req, res) {
  const { reservation_id } = res.locals.reservation;
  const { table_id } = res.locals.data;
  const data = await services.finish(reservation_id, table_id);
  res.json({ data });
} // finishes a reservation

module.exports = {
  list: asyncErrorBoundary(list),
  create: [
    hasData,
    hasRequiredProperties,
    validateCapacity,
    validateDateFormat,
    validateTimeFormat,
    validateDateTime,
    validatePhoneNumber,
    validateBookedStatus,
    asyncErrorBoundary(create),
  ],
  read: [asyncErrorBoundary(validateReservationExists), read],
  update: [
    asyncErrorBoundary(validateReservationExists),
    hasData,
    hasRequiredProperties,
    validateCapacity,
    validateDateFormat,
    validateTimeFormat,
    validateDateTime,
    validatePhoneNumber,
    validateReservationUpdatable,
    asyncErrorBoundary(update),
  ],
  updateStatus: [
    asyncErrorBoundary(validateReservationExists),
    hasData,
    validateStatus,
    validateReservationUpdatable,
    asyncErrorBoundary(updateStatus),
  ],
  seat: [
    asyncErrorBoundary(validateReservationExists),
    hasData,
    hasProps(['table_id']),
    validateTableIdExists,
    asyncErrorBoundary(seat),
  ],
  finish: [
    asyncErrorBoundary(validateReservationExists),
    hasData,
    hasProps(['table_id']),
    validateTableIdExists,
    asyncErrorBoundary(finish),
  ],
};
