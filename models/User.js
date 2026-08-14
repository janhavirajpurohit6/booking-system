// Encapsulation: walletBalance is a private field (# prefix) - it can only
// be read or changed through the methods below, never directly from outside
// this class. That's the actual point of encapsulation: controlled access.

class User {
  #walletBalance;

  constructor(id, name, email, walletBalance = 0) {
    this.id = id;
    this.name = name;
    this.email = email;
    this.#walletBalance = walletBalance;
  }

  getBalance() {
    return this.#walletBalance;
  }

  deduct(amount) {
    if (amount > this.#walletBalance) {
      throw new Error("Insufficient wallet balance");
    }
    this.#walletBalance -= amount;
    return this.#walletBalance;
  }

  addFunds(amount) {
    if (amount <= 0) {
      throw new Error("Amount must be positive");
    }
    this.#walletBalance += amount;
    return this.#walletBalance;
  }
}

module.exports = User;