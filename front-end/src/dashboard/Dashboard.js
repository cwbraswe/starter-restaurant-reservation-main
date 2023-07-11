import React, { useEffect, useState } from "react";
import { listReservations, listTables } from "../utils/api";
import ErrorAlert from "../layout/ErrorAlert";
import { next, previous } from '../utils/date-time';
import { useHistory } from 'react-router-dom';
import DisplayReservation from '../reservations/DisplayReservation';
import TableDisplay from '../tables/TableDisplay';


/**
 * Defines the dashboard page.
 * @param date
 *  the date for which the user wants to view reservations.
 * @returns {JSX.Element}
 */
function Dashboard({ date }) {
  const [reservations, setReservations] = useState([]);
  const [reservationsError, setReservationsError] = useState(null);
  const [tables, setTables] = useState([]);
  const history = useHistory();

  useEffect(loadDashboard, [date]);

  function loadDashboard() {
    const abortController = new AbortController();
    setReservationsError(null);
    listReservations({ date }, abortController.signal)
      .then(setReservations)
      .then(listTables)
      .then((tables) => tables.sort(tableSortByOccupied))
      .then(setTables)
      .catch(setReservationsError);
    return () => abortController.abort();
  }

  function tableSortByOccupied(tableA, tableB) { //moves the tables with reservations to the top of the list
      if (tableA.reservation_id && !tableB.reservation_id) return -1;
      if (!tableA.reservation_id && tableB.reservation_id) return 1;
      return 0;
  }

  function todaysDate() {
    const today = new Date()
    const year = today.getFullYear();
    const month = today.getMonth() + 1;
    const day = today.getDate();

    const todaysDate = `${year}- ${month}-${day}`
    history.push(`/dashboard?date=${todaysDate}`);
  }

  function previousDate() {
    const previousDate = previous(date);
    history.push(`/dashboard?date=${previousDate}`);
  }

  function nextDate() {
    const nextDate = next(date);
    history.push(`/dashboard?date=${nextDate}`);
  }

  return (
    <main>
    <h1>Dashboard</h1>
    <div className='d-md-flex flex-column mb-3 align-items-center justify-content-center'>
      <h4 className='mb-3'>Reservations for Date</h4>
      <h5 className='mb-3'>{date}</h5>
      <div className='ml-md-3 mb-3'>
        <div className='d-flex justify-content-center'>
          <button type='button' className='btn btn-secondary m-2' onClick={previousDate}>
            Previous
          </button>
          <button type='button' className='btn btn-secondary m-2' onClick={todaysDate}>
            Today
          </button>
          <button type='button' className='btn btn-secondary m-2' onClick={nextDate}>
            Next
          </button>
        </div>
      </div>
    </div>

    <ErrorAlert error={reservationsError} />
    <div className='d-flex flex-wrap justify-content-evenly'>
      {/* {JSON.stringify(reservations)} */}
      <div className='col-md-6'>
        <h4>Reservations</h4>
        {reservations.length > 0 ? (
          reservations.map((reservation) => (
            <DisplayReservation key={reservation.reservation_id} reservation={reservation} />
          ))
        ) : (
          <h4>No reservations found</h4>
        )}
      </div>
      <div className='col-md-6'>
        <h4>Tables</h4>
        {tables.length > 0 ? (
          tables.map((table) => <TableDisplay key={table.table_id} table={table} loadDashboard={loadDashboard} />)
        ) : (
          <h4>No tables found</h4>
        )}
      </div>
    </div>
  </main>
);
}

export default Dashboard;
