-- Users table
CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    wallet_balance REAL NOT NULL DEFAULT 0
);

-- Flights table
CREATE TABLE IF NOT EXISTS flights (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    flight_no TEXT NOT NULL,
    source TEXT NOT NULL,
    destination TEXT NOT NULL,
    price REAL NOT NULL,
    seats_available INTEGER NOT NULL DEFAULT 0
);

-- Hotels table
CREATE TABLE IF NOT EXISTS hotels (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    city TEXT NOT NULL,
    price_per_night REAL NOT NULL,
    rooms_available INTEGER NOT NULL DEFAULT 0
);

-- Bookings table (polymorphic: type tells us flight or hotel)
CREATE TABLE IF NOT EXISTS bookings (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    type TEXT NOT NULL CHECK(type IN ('FLIGHT', 'HOTEL')),
    flight_id INTEGER,
    hotel_id INTEGER,
    status TEXT NOT NULL DEFAULT 'CONFIRMED',
    booking_date TEXT NOT NULL DEFAULT (datetime('now')),
    amount_paid REAL NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (flight_id) REFERENCES flights(id),
    FOREIGN KEY (hotel_id) REFERENCES hotels(id)
);

-- Seed data so you can test immediately without inserting flights/hotels by hand
INSERT INTO flights (flight_no, source, destination, price, seats_available)
VALUES
    ('EX101', 'Delhi', 'Mumbai', 4500, 30),
    ('EX202', 'Mumbai', 'Bangalore', 3800, 25),
    ('EX303', 'Delhi', 'Goa', 5200, 15);

INSERT INTO hotels (name, city, price_per_night, rooms_available)
VALUES
    ('Ocean View Resort', 'Goa', 3200, 10),
    ('City Center Inn', 'Mumbai', 2100, 20),
    ('Mountain Retreat', 'Manali', 2800, 8);