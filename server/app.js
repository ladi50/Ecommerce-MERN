require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const cors = require("cors");
const helmet = require("helmet");
const compression = require("compression");

const userRoutes = require("./routes/user");
const productRoutes = require("./routes/product");
const cartRoutes = require("./routes/cart");

const app = express();

app.use(cors());
app.use(bodyParser.json());
app.use(compression())
app.use(helmet())

app.use(userRoutes);
app.use(productRoutes);
app.use(cartRoutes);

mongoose
  .connect(process.env.MONGO_URL, {
    useCreateIndex: true,
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false
  })
  .then(() => {
    app.listen(process.env.PORT || 8000);
  })
  .catch((err) => console.log(err));
