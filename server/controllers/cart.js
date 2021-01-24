const Stripe = require("stripe");
const stripe = Stripe(process.env.STRIPE_SECRET_KEY);

const User = require("../models/user");
const Cart = require("../models/cart");
const Order = require("../models/order");

exports.addToCart = async (req, res) => {
  const productData = req.body;
  const user = req.params.userId;
  const userId = req.userId;

  let foundUser;

  if (userId !== user) {
    return res.status(401).json("Unauthorized!");
  }

  try {
    foundUser = await User.findById(userId);
  } catch (err) {
    return res.status(500).json(err);
  }

  if (!foundUser) {
    return res.status(404).json("User not found!");
  }

  try {
    for (const product of foundUser.products) {
      if (product.toString() === productData.prodId) {
        throw new Error("You can't add your own products to cart!");
      }
    }
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }

  let createdCart;

  if (foundUser.cart) {
    const foundCart = await Cart.findById(foundUser.cart);

    let quantityIncreased = false;

    if (foundCart) {
      for (const product of foundCart.products) {
        if (product.product == productData.prodId) {
          product.quantity += productData.quantity;

          quantityIncreased = true;

          break;
        }
      }

      if (!quantityIncreased) {
        foundCart.products.push({
          product: productData.prodId,
          quantity: productData.quantity
        });
      }
    }

    try {
      createdCart = await foundCart.save();
    } catch (err) {
      return res.status(500).json(err);
    }
  } else {
    const cart = new Cart({
      products: [
        {
          product: productData.prodId,
          quantity: productData.quantity
        }
      ],
      user: userId
    });

    try {
      createdCart = await cart.save();

      foundUser.cart = cart._id;
      await foundUser.save();
    } catch (err) {
      return res.status(500).json(err);
    }
  }

  res.status(201).json(createdCart);
};

exports.getUserCart = async (req, res) => {
  const user = req.params.userId;
  const userId = req.userId;

  if (userId !== user) {
    return res.status(401).json("Unauthorized!");
  }

  let foundUser;

  try {
    foundUser = await User.findById(userId);
  } catch (err) {
    return res.status(500).json(err);
  }

  let foundCart;

  try {
    foundCart = await Cart.findById(foundUser.cart).populate(
      "products.product"
    );
  } catch (err) {
    return res.status(500).json(err);
  }

  if (!foundCart) {
    return res.status(200).json({ message: "Cart not found!" });
  }

  res.status(200).json({ cart: foundCart });
};

exports.removeCartItem = async (req, res) => {
  const prodId = req.params.prodId;
  const user = req.params.userId;
  const userId = req.userId;

  if (userId !== user) {
    return res.status(401).json("Unauthorized!");
  }

  let foundUser;

  try {
    foundUser = await User.findById(userId);
  } catch (err) {
    return res.status(500).json(err);
  }

  if (!foundUser) {
    return res.status(404).json("User not found!");
  }

  let foundCart;

  try {
    foundCart = await Cart.findById(foundUser.cart);
  } catch (err) {
    return res.status(500).json(err);
  }

  if (!foundCart) {
    return res.status(404).json("Cart not found!");
  }

  try {
    foundCart.products = foundCart.products.filter(
      (p) => p.product._id.toString() !== prodId
    );

    await foundCart.save();
  } catch (err) {
    return res.status(500).json(err);
  }

  res.status(200).json("Product deleted!");
};

exports.createOrder = async (req, res) => {
  const user = req.params.userId;
  const userId = req.userId;

  if (userId !== user) {
    return res.status(401).json({ message: "Unauthorized!" });
  }

  let foundUser;

  try {
    foundUser = await User.findById(userId);
  } catch (err) {
    return res.status(500).json({ message: err });
  }

  if (!foundUser) {
    return res.status(404).json("User not found!");
  }

  let foundCart;

  try {
    foundCart = await Cart.findById(foundUser.cart).populate(
      "products.product"
    );
  } catch (err) {
    return res.status(500).json({ message: err });
  }

  if (!foundCart) {
    return res.status(404).json({ message: "Cart not found!" });
  }

  let cartItems = [];

  try {
    for (const item of foundCart.products) {
      cartItems.push({
        price_data: {
          currency: "usd",
          product_data: {
            name: item.product.title,
            images: [item.product.imageUrl]
          },
          unit_amount: item.product.price * 100
        },
        quantity: item.quantity
      });
    }
  } catch (err) {
    return res.status(500).json({ meassge: err });
  }

  let session;

  try {
    session = await stripe.checkout.sessions.create({
      success_url: process.env.STRIPE_SUCCESS_URL,
      cancel_url: process.env.STRIPE_CANCEL_URL,
      payment_method_types: ["card"],
      line_items: cartItems,
      mode: "payment"
    });
  } catch (err) {
    return res.status(500).json({ message: err });
  }

  const order = new Order({ products: foundCart.products, user: userId });

  let createdOrder;

  try {
    createdOrder = await order.save();
  } catch (err) {
    return res.status(500).json({ message: err });
  }

  if (!createdOrder) {
    return res.status(500).json({ message: "Order could not be created!" });
  }

  let savedUser;

  try {
    foundUser.orders.push(order._id);
    foundUser.cart = null;
    savedUser = await foundUser.save();
  } catch (err) {
    return res.status(500).json({ message: err });
  }

  if (!savedUser) {
    return res.status(500).json({ message: "Could not add orderID to user!" });
  }

  try {
    foundCart.remove();
  } catch (err) {
    return res.status(500).json({ message: err });
  }

  res.status(200).json({ id: session.id, order: createdOrder });
};

exports.getOrders = async (req, res) => {
  const user = req.params.userId;
  const userId = req.userId;

  if (userId !== user) {
    return res.status(401).json({ message: "Unauthorized!" });
  }

  let foundOrders;

  try {
    foundOrders = await Order.find({ user: userId })
      .sort({ createdAt: -1 })
      .populate("products.product");
  } catch (err) {
    return res.status(500).json({ message: err });
  }

  if (!foundOrders) {
    res.status(200).json({ message: "User does not have orders!" });
  }

  res.status(200).json({ orders: foundOrders });
};
