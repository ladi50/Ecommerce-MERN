const AWS = require("aws-sdk");
const path = require("path");
const fs = require("fs");

const Product = require("../models/product");
const User = require("../models/user");
const Wishlist = require("../models/whishlist");
const Cart = require("../models/cart");

exports.getProducts = async (req, res) => {
  let foundProducts;

  try {
    foundProducts = await Product.find({}, { description: 0 }).sort({
      createdAt: -1
    });
  } catch (err) {
    return res.status(500).json(err);
  }

  if (!foundProducts) {
    return res.status(404).json("No products found!");
  }

  res.status(200).json({ products: foundProducts });
};

exports.getProduct = async (req, res) => {
  const prodId = req.params.prodId;

  let foundProduct;

  try {
    foundProduct = await Product.findById(prodId);
  } catch (err) {
    return res.status(500).json(err);
  }

  if (!foundProduct) {
    return res.status(404).json("Could not find product!");
  }

  res.status(200).json({ product: foundProduct });
};

exports.addProduct = async (req, res) => {
  const productData = req.body;
  const image = req.file;
  const userId = req.userId;

  let foundUser;

  try {
    foundUser = await User.findById(userId);
  } catch (err) {
    return res.status(500).json(err);
  }

  if (!foundUser) {
    return res.status(401).json("Not authorized!");
  }

  if (
    !req.file ||
    !productData.title ||
    !productData.description ||
    !productData.price
  ) {
    return res.status(422).json("All fields are required!");
  }

  const product = new Product({
    ...productData,
    imageUrl: `https://${process.env.AWS_BUCKET_NAME}.s3.amazonaws.com/${image.filename}`,
    user: userId
  });

  let createdProduct;

  try {
    foundUser.products.push(product._id);
    await foundUser.save();

    createdProduct = await product.save();
  } catch (err) {
    return res.status(500).json("Could not create new product!");
  }

  if (createdProduct) {
    AWS.config.update({
      accessKeyId: process.env.AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
    });

    const s3 = new AWS.S3();

    const params = {
      Bucket: process.env.AWS_BUCKET_NAME,
      Key: req.file.filename,
      Body: fs.createReadStream(req.file.path),
      ACL: "public-read",
      ContentType: req.file.mimetype
    };

    s3.upload(params, (err, data) => {
      if (err) {
        throw new Error("Could not upload image to AWS S3! " + err);
      } else if (data && createdProduct) {
        fs.unlink(path.join(__dirname, "..", image.filename), (err) => {
          if (err) {
            throw new Error("Could not unlink image from server!");
          }
        });

        console.log("Image uploaded to AWS S3!");
      }
    });
  }

  res.status(201).json({ product: createdProduct });
};

exports.updateProduct = async (req, res) => {
  const productId = req.params.prodId;
  const productData = req.body;
  const image = req.file;
  const user = req.params.userId;
  const userId = req.userId;

  if (userId !== user) {
    return res.status(401).json("Unauthorized!");
  }

  if (
    !productData.title ||
    !productData.price ||
    !productData.description ||
    !productData.dbImage
  ) {
    return res.status(404).json("All fields are required!");
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

  let userProduct;

  try {
    userProduct = await foundUser.products.find(
      (p) => p.toString() === productId
    );
  } catch (err) {
    return res.status(500).json(err);
  }

  if (!userProduct) {
    return res.status(401).json("Unauthorized!");
  }

  let foundProduct;

  try {
    foundProduct = await Product.findOne({ _id: productId, user: userId });
  } catch (err) {
    return res.status(500).json(err);
  }

  if (!foundProduct) {
    return res.status(404).json("Product not found!");
  }

  let updatedProduct;

  try {
    if (req.file) {
      foundProduct.title = productData.title;
      foundProduct.price = productData.price;
      foundProduct.description = productData.description;
      foundProduct.imageUrl = `https://${process.env.AWS_BUCKET_NAME}.s3.amazonaws.com/${image.filename}`;

      updatedProduct = await foundProduct.save();
    } else {
      foundProduct.title = productData.title;
      foundProduct.price = productData.price;
      foundProduct.description = productData.description;

      updatedProduct = await foundProduct.save();
    }
  } catch (err) {
    return res.status(500).json(err);
  }

  if (updatedProduct && req.file) {
    AWS.config.update({
      accessKeyId: process.env.AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
    });

    const s3 = new AWS.S3();

    const params = {
      Bucket: process.env.AWS_BUCKET_NAME,
      Key: productData.dbImage
    };

    s3.deleteObject(params, (err, data) => {
      if (err) {
        return console.log(err);
      } else if (data) {
        console.log("Image deleted from AWS S3!");

        AWS.config.update({
          accessKeyId: process.env.AWS_ACCESS_KEY_ID,
          secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
        });

        const s3 = new AWS.S3();

        const params = {
          Bucket: process.env.AWS_BUCKET_NAME,
          Key: req.file.filename,
          Body: fs.createReadStream(req.file.path),
          ACL: "public-read",
          ContentType: req.file.mimetype
        };

        s3.upload(params, (err, data) => {
          if (err) {
            console.log(err);
          } else if (data && updatedProduct) {
            fs.unlink(path.join(__dirname, "..", image.filename), (err) => {
              if (err) {
                throw new Error("Could not unlink image from server!");
              }
            });

            console.log("Image uploaded to AWS S3!");
          }
        });
      }
    });
  }

  if (!updatedProduct) {
    return res.status(500).json("Could not update product!", err);
  }

  res.status(200).json({ product: updatedProduct });
};

exports.deleteProduct = async (req, res) => {
  const productId = req.params.prodId;
  const userId = req.userId;
  const user = req.params.userId;

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

  let userProduct;

  try {
    userProduct = await foundUser.products.find(
      (p) => p.toString() === productId
    );
  } catch (err) {
    return res.status(500).json(err);
  }

  if (!userProduct) {
    return res.status(404).json("Product not found!");
  }

  let foundProduct;

  try {
    foundProduct = await Product.findById(productId);
  } catch (err) {
    return res.status(500).json(err);
  }

  if (!foundProduct) {
    return res.status(404).json("Product not found!");
  }

  try {
    await Product.findOneAndRemove({ _id: productId, user: userId });
  } catch (err) {
    return res.status(500).json(err);
  }

  let savedUser;

  try {
    foundUser.products = foundUser.products.filter(
      (p) => p.toString() !== productId
    );
    savedUser = await foundUser.save().then(() => {
      AWS.config.update({
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
      });

      const s3 = new AWS.S3();

      const params = {
        Bucket: process.env.AWS_BUCKET_NAME,
        Key: foundProduct.imageUrl.split(".com/")[1]
      };

      s3.deleteObject(params, (err, data) => {
        if (err) {
          return console.log(err);
        } else if (data) {
          console.log("Product removed from AWS S3!");
        }
      });
    });
  } catch (err) {
    return res.status(500).json(err);
  }

  let foundCarts;

  try {
    foundCarts = await Cart.find();
  } catch (err) {
    return res.status(500).json(err);
  }

  const cartsWithProduct = foundCarts.filter((fc) =>
    fc.products.find((obj) => obj.product.toString() === productId)
  );

  if (cartsWithProduct && cartsWithProduct.length > 0) {
    try {
      for (const foundCart of cartsWithProduct) {
        if (foundCart.products.length > 0) {
          foundCart.products = await foundCart.products.filter((obj) => {
            return obj.product.toString() !== productId;
          });
          await foundCart.save();
        }
      }
      await cartsWithProduct.save();
    } catch (err) {
      return res.status(500).json(err);
    }
  }

  res.status(200).json("Product deleted!");
};

exports.getUserProducts = async (req, res) => {
  const user = req.params.userId;
  const userId = req.userId;

  let foundUser;

  try {
    if (user === userId) {
      foundUser = await User.findById(userId);
    } else {
      return res.status(401).json("Unauthorized!");
    }
  } catch (err) {
    return res.status(500).json(err);
  }

  if (!foundUser) {
    return res.status(401).json("Unauthorized!");
  }

  let foundProducts;

  try {
    foundProducts = await Product.find({ user: userId }).sort({ createdAt: 1 });
  } catch (err) {
    return res.status(500).json(err);
  }

  if (!foundProducts) {
    return res.status(404).json("No products found!");
  }

  res.status(200).json({ products: foundProducts });
};

exports.addToWishlist = async (req, res) => {
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

  let foundProduct;

  try {
    foundProduct = await Product.findById(prodId);
  } catch (err) {
    return res.status(500).json(err);
  }

  let foundWishlist;
  let createdWishlist;

  try {
    foundWishlist = await Wishlist.findById(foundUser.wishlist);
  } catch (err) {
    return res.status(500).json(err);
  }

  let foundItem;

  if (foundWishlist) {
    foundItem = await foundWishlist.products.find(
      (item) => item.toString() === prodId
    );

    if (foundItem) {
      return res.status(200).json("Product already in wishlist!");
    } else {
      foundWishlist.products.push(prodId);
      createdWishlist = await foundWishlist.save();
    }
  } else {
    const wishlist = new Wishlist({ products: [prodId], user: userId });
    createdWishlist = await wishlist.save();

    foundUser.wishlist = wishlist._id;
    await foundUser.save();
  }

  res.status(201).json({ wishlist: createdWishlist });
};

exports.getWishlist = async (req, res) => {
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

  let foundWishlist;

  try {
    foundWishlist = await Wishlist.findById(foundUser.wishlist).populate(
      "products"
    );
  } catch (err) {
    return res.status(500).json(err);
  }

  if (!foundWishlist) {
    return res.status(200).json("User has no wishlist!");
  }

  res.status(200).json({ wishlist: foundWishlist.products });
};

exports.removeWishListItem = async (req, res) => {
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

  let foundWishlist;

  try {
    foundWishlist = await Wishlist.findById(foundUser.wishlist);
  } catch (err) {
    return res.status(500).json(err);
  }

  if (!foundWishlist) {
    return res.status(404).json("Wishlist not found!");
  }

  try {
    foundWishlist.products = foundWishlist.products.filter(
      (p) => p.toString() !== prodId
    );

    await foundWishlist.save();
  } catch (err) {
    return res.status(500).json(err);
  }

  res.status(200).json("Product deleted from wishlist!");
};

exports.calculateRating = async (req, res) => {
  const { userRating } = req.body;
  const prodId = req.params.prodId;
  const user = req.params.userId;
  const userId = req.userId;

  if (userId !== user) {
    return res.status(401).json({ message: "Unauthorized!" });
  }

  // if (!userRating || userRating.length === 0) {
  //   return res.status(200).json({ message: "User did not rate product!" });
  // }

  let foundUser;

  try {
    foundUser = await User.findById(userId);
  } catch (err) {
    return res.status(500).json(err);
  }

  if (!foundUser) {
    return res.status(404).json({ message: "User not found!" });
  }

  let foundProduct;

  try {
    foundProduct = await Product.findById(prodId);
  } catch (err) {
    return res.status(500).json(err);
  }

  if (!foundProduct) {
    return res.status(404).json({ message: "Product not found!" });
  }

  if (foundUser._id.toString() === foundProduct.user.toString()) {
    return res.status(200).json({ message: "This is the user's product" });
  }

  const foundUserRating = await foundProduct.rating.userRatings.find(
    (userRating) => userRating.user.toString() === userId
  );

  if (foundUserRating !== undefined) {
    const filteredUserRatings = foundProduct.rating.userRatings.filter(
      (userRating) => userRating.user.toString() !== userId
    );

    foundProduct.rating.userRatings = [
      ...filteredUserRatings,
      { rating: userRating, user: userId }
    ];
  } else {
    foundProduct.rating.userRatings.push({ rating: userRating, user: userId });
  }

  let savedProduct;

  try {
    savedProduct = await foundProduct.save();
  } catch (err) {
    return res.status(500).json(err);
  }

  res.status(201).json({ rating: savedProduct.rating.averageRating });
};
