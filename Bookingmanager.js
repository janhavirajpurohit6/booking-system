const db = require("./db/db");
const FlightBooking = require("./models/FlightBooking");
const HotelBooking = require("./models/HotelBooking");

class BookingManager {
  // ---------- USERS ----------
  createUser(name, email, walletBalance = 0) {
    const stmt = db.prepare(
      "INSERT INTO users (name, email, wallet_balance) VALUES (?, ?, ?)"
    );
    const result = stmt.run(name, email, walletBalance);
    return this.getUserById(result.lastInsertRowid);
  }

  getUserById(id) {
    return db.prepare("SELECT * FROM users WHERE id = ?").get(id);
  }

  // ---------- FLIGHTS ----------
  getAllFlights() {
    return db.prepare("SELECT * FROM flights").all();
  }

  getFlightById(id) {
    return db.prepare("SELECT * FROM flights WHERE id = ?").get(id);
  }

  // ---------- HOTELS ----------
  getAllHotels() {
    return db.prepare("SELECT * FROM hotels").all();
  }

  getHotelById(id) {
    return db.prepare("SELECT * FROM hotels WHERE id = ?").get(id);
  }

  // ---------- BOOKINGS ----------
  bookFlight(userId, flightId, seatClass) {
    const user = this.getUserById(userId);
    const flight = this.getFlightById(flightId);
    if (!user) throw new Error("User not found");
    if (!flight) throw new Error("Flight not found");

    // This is where the OOP classes actually get used, not just defined
    const booking = new FlightBooking(userId, flight, seatClass);
    const price = booking.calculatePrice();
    const message = booking.confirmBooking(); // throws if no seats

    db.prepare("UPDATE users SET wallet_balance = wallet_balance - ? WHERE id = ?").run(price, userId);
    db.prepare("UPDATE flights SET seats_available = seats_available - 1 WHERE id = ?").run(flightId);

    const result = db.prepare(
      `INSERT INTO bookings (user_id, type, flight_id, status, amount_paid)
       VALUES (?, 'FLIGHT', ?, ?, ?)`
    ).run(userId, flightId, booking.status, price);

    return { id: result.lastInsertRowid, message, amountPaid: price };
  }

  bookHotel(userId, hotelId, nights) {
    const user = this.getUserById(userId);
    const hotel = this.getHotelById(hotelId);
    if (!user) throw new Error("User not found");
    if (!hotel) throw new Error("Hotel not found");

    const booking = new HotelBooking(userId, hotel, nights);
    const price = booking.calculatePrice();
    const message = booking.confirmBooking();

    db.prepare("UPDATE users SET wallet_balance = wallet_balance - ? WHERE id = ?").run(price, userId);
    db.prepare("UPDATE hotels SET rooms_available = rooms_available - 1 WHERE id = ?").run(hotelId);

    const result = db.prepare(
      `INSERT INTO bookings (user_id, type, hotel_id, status, amount_paid)
       VALUES (?, 'HOTEL', ?, ?, ?)`
    ).run(userId, hotelId, booking.status, price);

    return { id: result.lastInsertRowid, message, amountPaid: price };
  }

  // JOIN query - fetch a user's bookings with flight/hotel details attached
  getBookingsForUser(userId) {
    return db.prepare(
      `SELECT b.id, b.type, b.status, b.booking_date, b.amount_paid,
              f.flight_no, f.source, f.destination,
              h.name AS hotel_name, h.city AS hotel_city
       FROM bookings b
       LEFT JOIN flights f ON b.flight_id = f.id
       LEFT JOIN hotels h ON b.hotel_id = h.id
       WHERE b.user_id = ?
       ORDER BY b.booking_date DESC`
    ).all(userId);
  }

  cancelBooking(bookingId) {
    const booking = db.prepare("SELECT * FROM bookings WHERE id = ?").get(bookingId);
    if (!booking) throw new Error("Booking not found");

    db.prepare("UPDATE bookings SET status = 'CANCELLED' WHERE id = ?").run(bookingId);

    // Give the seat/room back
    if (booking.type === "FLIGHT") {
      db.prepare("UPDATE flights SET seats_available = seats_available + 1 WHERE id = ?").run(booking.flight_id);
    } else {
      db.prepare("UPDATE hotels SET rooms_available = rooms_available + 1 WHERE id = ?").run(booking.hotel_id);
    }

    // Refund
    db.prepare("UPDATE users SET wallet_balance = wallet_balance + ? WHERE id = ?").run(
      booking.amount_paid,
      booking.user_id
    );

    return { id: bookingId, status: "CANCELLED" };
  }
}

module.exports = new BookingManager();