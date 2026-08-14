const express = require("express");
const router = express.Router();
const bookingManager = require("../bookingManager");

// Small wrapper so we don't repeat try/catch in every route
function handle(fn) {
  return (req, res) => {
    try {
      const result = fn(req);
      res.json(result);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  };
}

// ---------- USERS ----------
router.post("/users", handle((req) => {
  const { name, email, walletBalance } = req.body;
  if (!name || !email) throw new Error("name and email are required");
  return bookingManager.createUser(name, email, walletBalance || 0);
}));

router.get("/users/:id", handle((req) => {
  const user = bookingManager.getUserById(req.params.id);
  if (!user) throw new Error("User not found");
  return user;
}));

router.get("/users/:id/bookings", handle((req) => {
  return bookingManager.getBookingsForUser(req.params.id);
}));

// ---------- FLIGHTS ----------
router.get("/flights", handle(() => bookingManager.getAllFlights()));

// ---------- HOTELS ----------
router.get("/hotels", handle(() => bookingManager.getAllHotels()));

// ---------- BOOKINGS ----------
router.post("/bookings/flight", handle((req) => {
  const { userId, flightId, seatClass } = req.body;
  if (!userId || !flightId) throw new Error("userId and flightId are required");
  return bookingManager.bookFlight(userId, flightId, seatClass || "ECONOMY");
}));

router.post("/bookings/hotel", handle((req) => {
  const { userId, hotelId, nights } = req.body;
  if (!userId || !hotelId) throw new Error("userId and hotelId are required");
  return bookingManager.bookHotel(userId, hotelId, nights || 1);
}));

router.delete("/bookings/:id", handle((req) => {
  return bookingManager.cancelBooking(req.params.id);
}));

module.exports = router;