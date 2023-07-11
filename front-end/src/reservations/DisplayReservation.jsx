import { useHistory } from "react-router";
import { cancelReservation } from "../utils/api";

const DisplayReservation = ({ reservation }) => {
  const history = useHistory();
  async function cancelHandler() {
    const abortController = new AbortController();
    if (
      window.confirm(
        "Do you want to cancel this reservation? This cannot be undone."
      )
    ) {
      await cancelReservation(reservation.reservation_id, abortController.signal);
      // reload page
      history.go(0);
    }
  }

  return (
    <div className='card m-3'>
      <div className='card-body'>
        <h5 className='card-title'>
          {reservation.first_name} {reservation.last_name}
        </h5>
        <h6 className='card-subtitle mb-2 text-muted'>{reservation.mobile_number}</h6>
        <p className='card-text'>Date: {reservation.reservation_date}</p>
        <p className='card-text'>Time: {reservation.reservation_time}</p>
        <p className='card-text'>Party Size: {reservation.people}</p>
        <p className='card-text' data-reservation-id-status={reservation.reservation_id}>Status: {reservation.status}</p>
        <p className='card-text'>Reservation ID: {reservation.reservation_id}</p>
        {reservation.status === 'booked' ? (
        <a
          className='btn btn-success m-1'
          href={`/reservations/${reservation.reservation_id}/seat`}
        >
          Seat
        </a>
        ) : null}

        {reservation.status !== 'cancelled' ? (
        <a
          className='btn btn-primary m-1'
          href={`/reservations/${reservation.reservation_id}/edit`}
        >
          Edit
        </a>
        ) : null}
        {(reservation.status === 'cancelled' || reservation.status === 'finished') ? null :
        (
          <button
            className='btn btn-danger m-1'
            onClick={cancelHandler}
            data-reservation-id-cancel={reservation.reservation_id}
          >
            Cancel
          </button>
        )}
      </div>
    </div>
  );
};

export default DisplayReservation;