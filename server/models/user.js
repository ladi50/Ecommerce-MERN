const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true
  },
  email: {
    type: String,
    unique: true
  },
  password: {
    type: String,
  },
  avatar: {
    type: String,
    default: ""
  },
  products: [
    {
      type: mongoose.Types.ObjectId,
      ref: "Product"
    }
  ],
  cart: {
    type: mongoose.Types.ObjectId,
    ref: "Cart"
  },
  orders: [
    {
      type: mongoose.Types.ObjectId,
      ref: "Order"
    }
  ],
  wishlist: {
    type: mongoose.Types.ObjectId,
    ref: "Wishlist"
  }
});

const User = mongoose.model("User", userSchema);

module.exports = User;
