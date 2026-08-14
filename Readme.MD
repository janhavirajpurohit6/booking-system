# Flight & Hotel Booking System

A REST API for booking flights and hotels, built to demonstrate OOP design principles backed by real SQL persistence.

## Tech Stack
- **Backend:** Node.js + Express
- **Database:** SQLite (via `better-sqlite3`)
- **Design:** Object-Oriented (abstraction, inheritance, polymorphism, encapsulation)

## OOP Design

- **Abstraction** – `Booking` is a base class that cannot be instantiated directly. It defines `confirmBooking()` and `calculatePrice()` as methods subclasses must implement.
- **Inheritance** – `FlightBooking` and `HotelBooking` both extend `Booking`.
- **Polymorphism** – Each subclass implements `confirmBooking()` and `calculatePrice()` differently (e.g. flight pricing depends on seat class, hotel pricing depends on number of nights).
- **Encapsulation** – `User.walletBalance` is a private class field (`#walletBalance`), only accessible through `getBalance()`, `deduct()`, and `addFunds()`.

## Database Schema

Four tables: `users`, `flights`, `hotels`, `bookings` (with foreign keys linking bookings to users and to either a flight or a hotel). Full schema in [`db/schema.sql`](db/schema.sql).

## Setup

```bash
npm install
npm start
```

Server runs on `http://localhost:3000`. The SQLite database is created automatically on first run, pre-seeded with sample flights and hotels.

## API Endpoints

| Method | Endpoint                  | Description                          |
|--------|----------------------------|---------------------------------------|
| POST   | `/api/users`               | Create a new user                     |
| GET    | `/api/users/:id`           | Get user details                      |
| GET    | `/api/users/:id/bookings`  | Get all bookings for a user (JOIN)    |
| GET    | `/api/flights`             | List all flights                      |
| GET    | `/api/hotels`              | List all hotels                       |
| POST   | `/api/bookings/flight`     | Book a flight                         |
| POST   | `/api/bookings/hotel`      | Book a hotel                          |
| DELETE | `/api/bookings/:id`        | Cancel a booking (refunds + restores availability) |

### Example: Create a user
```bash
curl -X POST http://localhost:3000/api/users \
  -H "Content-Type: application/json" \
  -d '{"name": "Aarav Sharma", "email": "aarav@example.com", "walletBalance": 10000}'
```

### Example: Book a flight
```bash
curl -X POST http://localhost:3000/api/bookings/flight \
  -H "Content-Type: application/json" \
  -d '{"userId": 1, "flightId": 1, "seatClass": "BUSINESS"}'
```

## Project Structure
```
booking-system/
├── db/
│   ├── schema.sql        # Table definitions + seed data
│   └── db.js              # SQLite connection setup
├── models/
│   ├── Booking.js         # Abstract base class
│   ├── FlightBooking.js   # Extends Booking
│   ├── HotelBooking.js    # Extends Booking
│   └── User.js             # Encapsulated wallet balance
├── routes/
│   └── api.js              # Express route handlers
├── bookingManager.js       # Connects OOP classes to SQL persistence
└── server.js                # Express app entry point
```