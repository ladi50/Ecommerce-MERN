const jwt = require("jsonwebtoken");

const jwtAuth = async (req, res, next) => {
  if (req.method === "OPTIONS") {
    return next();
  }

  try {
    const token = jwt.verify(
      req.headers.authorization.split(" ")[1],
      process.env.JWT_SECRET
    );

    if (token) {
      req.userId = token.id;
    }

    next();
  } catch (err) {
    res.status(401).json("Unauthorized!");
  }
};

module.exports = jwtAuth;
