// Booking is a "base class" that FlightBooking and HotelBooking extend.
// It defines the shape every booking must have, and forces subclasses
// to implement their own confirmBooking() and calculatePrice() logic.
// (JS doesn't have true `abstract` classes like Java/C++, so we enforce
// this by throwing an error if the base methods are called directly -
// this is the common JS pattern for abstraction.)

class Booking {
  constructor(userId, bookingDate = new Date().toISOString()) {
    if (new.target === Booking) {
      throw new Error("Booking is abstract and cannot be instantiated directly");
    }
    this.userId = userId;
    this.bookingDate = bookingDate;
    this.status = "PENDING";
  }

  // Subclasses MUST override this
  confirmBooking() {
    throw new Error("confirmBooking() must be implemented by subclass");
  }

  // Subclasses MUST override this
  calculatePrice() {
    throw new Error("calculatePrice() must be implemented by subclass");
  }

  cancel() {
    this.status = "CANCELLED";
    return this.status;
  }
}

module.exports = Booking;