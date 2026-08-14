const Booking = require("./Booking");

class FlightBooking extends Booking {
  constructor(userId, flight, seatClass = "ECONOMY") {
    super(userId);
    this.type = "FLIGHT";
    this.flight = flight; // { id, flight_no, source, destination, price }
    this.seatClass = seatClass;
  }

  // Polymorphism: overrides Booking's confirmBooking() with flight-specific logic
  confirmBooking() {
    if (this.flight.seats_available <= 0) {
      throw new Error("No seats available on this flight");
    }
    this.status = "CONFIRMED";
    return `Flight ${this.flight.flight_no} booked from ${this.flight.source} to ${this.flight.destination}`;
  }

  // Polymorphism: business class costs more - different pricing logic than a hotel
  calculatePrice() {
    const multiplier = this.seatClass === "BUSINESS" ? 2.5 : 1;
    return Math.round(this.flight.price * multiplier);
  }
}

module.exports = FlightBooking;