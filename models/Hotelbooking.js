const Booking = require("./Booking");

class HotelBooking extends Booking {
  constructor(userId, hotel, nights = 1) {
    super(userId);
    this.type = "HOTEL";
    this.hotel = hotel; // { id, name, city, price_per_night, rooms_available }
    this.nights = nights;
  }

  // Polymorphism: overrides Booking's confirmBooking() with hotel-specific logic
  confirmBooking() {
    if (this.hotel.rooms_available <= 0) {
      throw new Error("No rooms available at this hotel");
    }
    this.status = "CONFIRMED";
    return `${this.nights} night(s) booked at ${this.hotel.name}, ${this.hotel.city}`;
  }

  // Polymorphism: price depends on nights, not seat class - different shape than FlightBooking
  calculatePrice() {
    return Math.round(this.hotel.price_per_night * this.nights);
  }
}

module.exports = HotelBooking;