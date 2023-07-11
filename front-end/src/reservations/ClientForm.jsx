import { readReservation } from '../utils/api';

const { useState, useEffect } = require('react');
const { useHistory } = require('react-router-dom');

function ClientForm({
  submitHandler,
  initialValues = {
    first_name: '',
    last_name: '',
    mobile_number: '',
    reservation_date: '',
    reservation_time: '',
    people: '',
  },
  reservationId = null,
}) {
  const [formData, setFormData] = useState(initialValues);
  const history = useHistory();

  function changeHandler({ target: { name, value } }) {
    setFormData({
      ...formData,
      [name]: value,
    });
  }

  useEffect(() => {
    if (reservationId) {
      async function loadReservation() {
        const abortController = new AbortController();
        const reservation = await readReservation(
          reservationId,
          abortController.signal
        );

        //format date and time
        const formattedDate = reservation.reservation_date.split('T')[0];
        reservation.reservation_date = formattedDate;

        setFormData({
          first_name: reservation.first_name,
          last_name: reservation.last_name,
          mobile_number: reservation.mobile_number,
          reservation_date: reservation.reservation_date,
          reservation_time: reservation.reservation_time,
          people: reservation.people,
        });
      }
      loadReservation();
    }
  }, [reservationId]);
  

  function formSubmitHandler(event) {
    event.preventDefault();
    submitHandler(formData);
  }

  function cancelHandler() {
    history.goBack();
  }

  return (
    <form onSubmit={formSubmitHandler}>
      <div className='form-group row content-center'>
        <div className='form-floating col-6 mb-3'>
        <label htmlFor='first_name'>First Name:</label>
          <input
            className='form-control'
            id='first_name'
            type='text'
            name='first_name'
            onChange={changeHandler}
            value={formData.first_name}
            required={true}
          />         
        </div>

        <div className='form-floating col-6'>
        <label htmlFor='last_name'>Last Name:</label>
          <input
            className='form-control'
            id='last_name'
            type='text'
            name='last_name'
            onChange={changeHandler}
            value={formData.last_name}
            required={true}
          />
          
        </div>

        <div className='form-floating col-12 mb-3'>
        <label htmlFor='mobile_number'>Mobile Number:</label>
          <input
            className='form-control'
            id='mobile_number'
            type='tel'
            name='mobile_number'
            onChange={changeHandler}
            value={formData.mobile_number}
            pattern='\d{3}-?\d{3}-?\d{4}'
            title='Please enter a valid phone number in the format 123-456-7890.'
            min={10}
            max={10}
            required={true}
          />
          
        </div>

        <div className='form-floating col-6 mb-3'>
        <label htmlFor='reservation_date'>Reservation Date:</label>
          <input
            className='form-control'
            id='reservation_date'
            type='date'
            name='reservation_date'
            onChange={changeHandler}
            value={formData.reservation_date}
            required={true}
          />
          
        </div>

        <div className='form-floating col-6'>
        <label htmlFor='reservation_time'>Reservation Time:</label>
          <input
            className='form-control'
            id='reservation_time'
            type='time'
            name='reservation_time'
            onChange={changeHandler}
            value={formData.reservation_time}
            required={true}
          />
          
        </div>

        <div className='form-floating col-9 mb-3'>
        <label htmlFor='people'>Party Size:</label>
          <input
            className='form-control'
            id='people'
            type='number'
            name='people'
            onChange={changeHandler}
            value={formData.people}
            min='1'
            required={true}
          />
          
        </div>
        <div className='form-group form-floating col-3 pt-4'>
        <button type='submit' className='btn btn-success m-2'>Submit</button>

        <button type='button' className='btn btn-danger m-2' onClick={cancelHandler}>Cancel</button>
        </div>
      </div>
    </form>
  );
}

export default ClientForm;