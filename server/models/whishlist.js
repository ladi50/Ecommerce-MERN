const mongoose = require("mongoose");

const wishlistSchema = new mongoose.Schema({
  products: [
    {
      type: mongoose.Types.ObjectId,
      ref: "Product"
    }
  ],
  user: {
    type: mongoose.Types.ObjectId,
    ref: "User",
    required: true
  }
});

const Wishlist = mongoose.model("Wishlist", wishlistSchema);

module.exports = Wishlist;
