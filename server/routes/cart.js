const router = require("express").Router();

const cartControllers = require("../controllers/cart");
const jwtAuth = require("../middlewares/token/jwt");

router.post("/add-to-cart/:userId", jwtAuth, cartControllers.addToCart);

router.get("/cart/:userId", jwtAuth, cartControllers.getUserCart);

router.delete(
  "/cart/:userId/product/:prodId",
  jwtAuth,
  cartControllers.removeCartItem
);

router.post("/order/:userId", jwtAuth, cartControllers.createOrder);

router.get("/orders/:userId", jwtAuth, cartControllers.getOrders);

module.exports = router;
