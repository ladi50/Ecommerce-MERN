const router = require("express").Router();

const userController = require("../controllers/user");
const jwtAuth = require("../middlewares/token/jwt");
const upload = require("../middlewares/upload/multer");

router.post("/user/new", userController.createUser);

router.post("/login", userController.login);

router.get("/profile/:userId", jwtAuth, userController.getUser);

router.patch(
  "/profile/:userId",
  jwtAuth,
  upload.single("avatar"),
  userController.updateProfile
);

module.exports = router;
