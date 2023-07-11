import { useState } from 'react';
import ErrorAlert from '../layout/ErrorAlert';
import DisplayReservation from '../reservations/DisplayReservation';
import { findReservation } from '../utils/api';

function Search() {
  const [search, setSearch] = useState({
    mobile_number: '',
  });
  const [errors, setErrors] = useState(null);
  const [reservations, setReservations] = useState([]);

  function handleChange({ target }) {
    setSearch({
      ...search,
      [target.name]: target.value,
    });
  }

  function handleSubmit(event) {
    event.preventDefault();
    const abortController = new AbortController();
    const errors = validateSearch();
    setErrors(errors);
    if (errors === null) {
      findReservation(search.mobile_number, abortController.signal)
        .then((foundReservation) => {
          setReservations(foundReservation);
        })
        .catch(setErrors);
    }
    return () => abortController.abort();
  }

  function validateSearch() {
    const errors = [];
    if (search.mobile_number === undefined || search.mobile_number === '') {
      errors.push({ message: 'Please enter a valid phone number.' });
    }
    return errors.length > 0 ? errors : null;
  }

  return (
    <div>
      <ErrorAlert error={errors} />
      <form onSubmit={handleSubmit} className='form p-3'>
        <div className='input-group'>
          <label htmlFor='mobile_number' className='input-group-text'>Phone Number</label>
          <input
            id='mobile_number'
            name='mobile_number'
            type='text'
            className='form-control'
            placeholder="Enter a customer's phone number"
            onChange={handleChange}
            value={search.mobile_number}
            required
          />
          <button type='submit' className='btn btn-primary'>
            Search
          </button>
        </div>
      </form>
      <div className='ms-3'>
        {reservations.length > 0 ? (
          reservations.map((reservation) => (
            <DisplayReservation key={reservation.reservation_id} reservation={reservation} />
          ))
        ) : (
          <p>No reservations found</p>
        )}
      </div>
    </div>
  );
}

export default Search;