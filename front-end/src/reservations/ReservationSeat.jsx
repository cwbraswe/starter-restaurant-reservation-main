import { useEffect, useState } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import { listTables, readReservation, seatTable } from '../utils/api';

import ErrorAlert from '../layout/ErrorAlert';

function ReservationSeat() {
  const { reservation_id } = useParams();
  const [formData, setFormData] = useState('');
  const [errors, setErrors] = useState(null);
  const [tables, setTables] = useState([]);
  const [reservation, setReservation] = useState({});

  const history = useHistory();

  useEffect(loadTables, [reservation_id]);

  useEffect(loadReservation, [reservation_id]);

  function loadTables() {
    const abortController = new AbortController();
    setErrors(null);
    listTables(abortController.signal).then(setTables).catch(setErrors);
    return () => abortController.abort();
  }

  function loadReservation() {
    const abortController = new AbortController();
    setErrors(null);
    readReservation(reservation_id, abortController.signal)
      .then((reservation) => setReservation(reservation))
      .catch(setErrors);
    return () => abortController.abort();
  }

  function handleChange({ target }) {
    setFormData((previousFormData) => ({
      ...previousFormData,
      [target.name]: target.value,
    }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setErrors(null);

    const abortController = new AbortController();
    const tableId = +formData.table_id;
    const reservationId = +reservation_id;

    try {
      await seatTable(tableId, reservationId, abortController.signal);
      history.push(`/dashboard`);
    } catch (error) {
      if (error.name !== 'AbortError') {
      setErrors(error);
      }
    }
    return () => abortController.abort();
  }

  return (
    <div>
      <h1>Seat Reservation Number {reservation_id}</h1>
      <ErrorAlert error={errors} />
      <h3>Select a table to seat this reservation</h3>
      <p>Reservation must meet capacity of {reservation.people}</p>
      <h4>Current Tables</h4>
      <form onSubmit={handleSubmit}>
        <div className='form-group'>
          <div className='form-floating col-6 mb-3'>
            <select
              id='table_id'
              name='table_id'
              className='form-control mt-5'
              onChange={handleChange}
              value={formData.table_id}
            >
              <option value=''>Select a table</option>
              {tables.map((table) => (
                <option key={table.table_id} value={table.table_id}>
                  {table.table_name} - {table.capacity}
                </option>
              ))}
            </select>
            <label htmlFor='table_id'>Table Number</label>
          </div>
        </div>

        <button type='submit' className='btn btn-success m-1'>
          Submit
        </button>
        <button type='button' className='btn btn-danger m-1' onClick={() => history.goBack()}>
          Cancel
        </button>
      </form>
    </div>
  );
}

export default ReservationSeat;