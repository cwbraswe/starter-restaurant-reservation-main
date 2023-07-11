# Restarurant Reservation App

## Live Demo

This is a full stack capstone project for the Thinkful Software Engineering Program. The following technologies were used:

- React
- React Router
- Bootstrap
- Express
- Knex
- PostgreSQL
- Node.js

![Screenshot 2023-07-10 105041](https://github.com/cwbraswe/starter-restaurant-reservation-main/assets/31020426/84073452-ba5d-4684-959b-25fab95b295f)


The instructions were to create a restaurant reservation app that meets the criteria and functionality provided by a fictional restaurant manager. The following functinoality had to be met:
- Create and list reservations
- Create reservation on a future, working date (errors set to trigger if scheduled outside of restaurant working days)
- Create reservation within eligible timeframe (errors set to trigger if scheduled outside of eligible timeframes)
- Seat reservation 
- Finish an occupied table
- Reservation Status
- Search for a reservation by phone number
- Change an existing reservation

![Screenshot 2023-07-10 105233](https://github.com/cwbraswe/starter-restaurant-reservation-main/assets/31020426/356a3681-162e-45ea-9abe-3a4548f0ab74)


## Backend Endpoints
### /reservations
- GET

  - Returns a list of reservations between, date, mobile_number query parameters.
  - Example Request: /reservations?date=2020-12-31
  - Example Response:
```{
  "data": [
    {
      "reservation_id": 1,
      "first_name": "Rick",
      "last_name": "Sanchez",
      "mobile_number": "202-555-0164",
      "reservation_date": "2020-12-31",
      "reservation_time": "20:00:00",
      "people": 6,
      "created_at": "2020-12-10T08:30:32.326Z",
      "updated_at": "2020-12-10T08:30:32.326Z",
      "status": "booked"
    },
    {
      "reservation_id": 2,
      "first_name": "Frank",
      "last_name": "Palicky",
      "mobile_number": "202-555-0153",
      "reservation_date": "2020-12-30",
      "reservation_time": "20:00",
      "people": 1,
      "created_at": "2020-12-10T08:31:32.326Z",
      "updated_at": "2020-12-10T08:31:32.326Z",
      "status": "booked"
    }
  ]
}
```
- POST

  - Creates a new reservation.
  - Example Request:
```{
  "data": {
    "first_name": "Rick",
    "last_name": "Sanchez",
    "mobile_number": "202-555-0164",
    "reservation_date": "2020-12-31",
    "reservation_time": "20:00",
    "people": 6
  }
}
```
### /reservations/:reservation_id
- GET

  - Returns a reservation by reservation_id.
  - Example Request: /reservations/1
  - Example Response:
```{
  "data": {
    "reservation_id": 1,
    "first_name": "Rick",
    "last_name": "Sanchez",
    "mobile_number": "202-555-0164",
    "reservation_date": "2020-12-31",
    "reservation_time": "20:00:00",
    "people": 6,
    "created_at": "2020-12-10T08:30:32.326Z",
    "updated_at": "2020-12-10T08:30:32.326Z",
    "status": "booked"
  }
}
```
- PUT

  - Updates a reservation by reservation_id.
  - Example Request:
```{
  "data": {
    "reservation_id": 1,
    "first_name": "Rick",
    "last_name": "Sanchez",
    "mobile_number": "202-555-0164",
    "reservation_date": "2020-12-31",
    "reservation_time": "20:00",
    "people": 6,
    "created_at": "2020-12-10T08:30:32.326Z",
    "updated_at": "2020-12-10T08:30:32.326Z",
    "status": "booked"
  }
}
```
### /reservations/:reservation_id/status
- PUT

  - Updates a reservation status by reservation_id.
  - Example Request:
```{
  "data": {
    "status": "cancelled"
  }
}
```
### /tables
- GET

  - Returns a list of tables.
  - Example Request: /tables
  - Example Response:
```{
  "data": [
    {
      "table_id": 1,
      "table_name": "#1",
      "capacity": 6,
      "reservation_id": null,
      "created_at": "2020-12-10T08:30:32.326Z",
      "updated_at": "2020-12-10T08:30:32.326Z"
    },
    {
      "table_id": 2,
      "table_name": "#2",
      "capacity": 6,
      "reservation_id": null,
      "created_at": "2020-12-10T08:30:32.326Z",
      "updated_at": "2020-12-10T08:30:32.326Z"
    }
  ]
}
```
- POST

  - Creates a new table.
  - Example Request:
```{
  "data": {
    "table_name": "#1",
    "capacity": 6
  }
}
```
### /tables/:table_id/seat
- PUT

  - Updates a table by table_id with a reservation_id. To seat a reservation at a table.
  - Example Request:
```{
  "data": {
    "reservation_id": 1
  }
}
```
- DELETE

  - Updates a table by table_id with a reservation_id. To finish a reservation at a table.
  - Example Request:
```{
  "data": {
    "reservation_id": null
  }
}
```


## Installation
1. Fork and clone this repository.
2. Run cp ./back-end/.env.sample ./back-end/.env.
3. Update the ./back-end/.env file with db connections. You can set some up for free with ElephantSQL database instances.
4. Run cp ./front-end/.env.sample ./front-end/.env.
5. You should not need to make changes to the ./front-end/.env file unless you want to connect to a backend at a location other than http://localhost:5000.
6. Run npm install to install project dependencies.
7. Run npm run start:dev from the back-end directory to start your server in development mode.
8. Run npm start from the front-end directory to start the React app at http://localhost:3000.
