const router = require("express").Router();

const productControllers = require("../controllers/product");
const jwtAuth = require("../middlewares/token/jwt");
const upload = require("../middlewares/upload/multer");

router.get("/products", productControllers.getProducts);

router.get("/product/:prodId", productControllers.getProduct);

router.post(
  "/add-product",
  jwtAuth,
  upload.single("imageUrl"),
  productControllers.addProduct
);

router.patch(
  "/products/:userId/product/:prodId",
  jwtAuth,
  upload.single("imageUrl"),
  productControllers.updateProduct
);

router.delete(
  "/products/:userId/product/:prodId",
  jwtAuth,
  productControllers.deleteProduct
);

router.get("/products/:userId", jwtAuth, productControllers.getUserProducts);

router.post(
  "/product/:prodId/wishlist/:userId",
  jwtAuth,
  productControllers.addToWishlist
);

router.get("/wishlist/:userId", jwtAuth, productControllers.getWishlist);

router.delete(
  "/wishlist/:userId/product/:prodId",
  jwtAuth,
  productControllers.removeWishListItem
);

router.post(
  "/product/:prodId/rating/:userId",
  jwtAuth,
  productControllers.calculateRating
);

module.exports = router;
