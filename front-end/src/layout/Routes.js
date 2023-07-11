import { Redirect, Route, Switch, useLocation } from "react-router-dom";

import Dashboard from "../dashboard/Dashboard";
import NewReservation from "../reservations/NewReservation";
import NotFound from "./NotFound";
import React from "react";
import ReservationSeat from "../reservations/ReservationSeat";
import Search from "../search/Search";
import TableForm from "../tables/TableForm";
import { today } from "../utils/date-time";

/**
 * Defines all the routes for the application.
 *
 * You will need to make changes to this file.
 *
 * @returns {JSX.Element}
 */
function Routes() {
  const query = useQuery();
  const date = query.get('date') ? query.get('date') : today(); 
  return (
    <Switch>
      <Route exact={true} path="/">
        <Redirect to={"/dashboard"} />
      </Route>
      <Route exact={true} path="/reservations">
        <Redirect to={"/dashboard"} />
      </Route>
      <Route path="/dashboard">
        <Dashboard date={date} />
      </Route>
      <Route path={['/reservations/new', '/reservations/:reservation_id/edit']}>
        <NewReservation />
      </Route>
      <Route path="/tables/new">
        <TableForm />
      </Route>
      <Route path="/reservations/:reservation_id/seat">
        <ReservationSeat />
      </Route>
      <Route path="/search">
        <Search />
      </Route>
      <Route>
        <NotFound />
      </Route>
    </Switch>
  );
}

// have to make a custom hook to extract to function.
function useQuery(){
  return new URLSearchParams(useLocation().search);
}

export default Routes;
