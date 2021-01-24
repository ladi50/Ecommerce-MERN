const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true
    },
    imageUrl: {
      type: String,
      required: true
    },
    description: {
      type: String,
      required: true
    },
    price: {
      type: Number,
      required: true
    },
    rating: {
      averageRating: {
        type: Number
      },
      userRatings: [
        {
          rating: {
            type: Number
          },
          user: {
            type: mongoose.Types.ObjectId,
            ref: "User"
          }
        }
      ]
    },
    user: {
      type: mongoose.Types.ObjectId,
      required: true,
      ref: "User"
    }
  },
  { timestamps: true }
);

productSchema.pre("save", function (next) {
  let averageRating;
  let userRatings = 0;
  let usersAmount = this.rating.userRatings.length;

  if (usersAmount > 0) {
    this.rating.userRatings.forEach(
      (userRating) => (userRatings += userRating.rating)
    );

    averageRating = Math.round((userRatings / usersAmount) * 2) / 2;

    this.rating.averageRating = averageRating;
  }

  next();
});

const Product = mongoose.model("Product", productSchema);

module.exports = Product;
