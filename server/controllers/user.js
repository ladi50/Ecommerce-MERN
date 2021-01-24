const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const AWS = require("aws-sdk");
const fs = require("fs");
const path = require("path");

const User = require("../models/user");

exports.createUser = async (req, res) => {
  const userData = req.body;

  if (!userData.username || !userData.email || !userData.password) {
    return res.status(200).json({ message: "All fields are required!" });
  }

  if (userData.password.length < 6) {
    return res
      .status(200)
      .json({ message: "Minimum password length is 6 characters!" });
  }

  if (
    (!userData.email.includes(".com") || !userData.email.includes(".co.il")) &&
    !userData.email.includes("@")
  ) {
    return res.status(200).json("Email is not valid!");
  }

  let foundUser;

  try {
    foundUser = await User.findOne({ email: userData.email });
  } catch (err) {
    return res.status(500).json(err);
  }

  if (foundUser) {
    return res.status(422).json("Email already exists!");
  }

  const hashedPassword = bcrypt.hashSync(userData.password, 12);

  if (!hashedPassword) {
    return res.status(500).json("Could not hash password!");
  }

  const user = new User({ ...userData, password: hashedPassword });

  let createdUser;

  try {
    createdUser = await user.save();
  } catch (err) {
    return res.status(500).json(err.message);
  }

  let token;

  try {
    token = jwt.sign(
      {
        email: createdUser.email,
        username: createdUser.username,
        id: createdUser._id.toString()
      },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );
  } catch (err) {
    return res.status(500).json();
  }

  res.status(201).json({ user: createdUser, token });
};

exports.login = async (req, res) => {
  const userData = req.body;

  let foundUser;

  if (!userData.email || !userData.password) {
    return res.status(200).json({ message: "All fields are required!" });
  }

  try {
    foundUser = await User.findOne({
      email: userData.email
    });
  } catch (err) {
    return res.status(500).json(err);
  }

  if (!foundUser) {
    return res
      .status(422)
      .json({ message: "Email or password are incorrect!" });
  }

  const passwordsComparison = bcrypt.compareSync(
    userData.password,
    foundUser.password
  );

  if (!passwordsComparison) {
    return res.status(422).json("Email or password are incorrect!");
  }

  let token;

  try {
    token = jwt.sign(
      {
        email: foundUser.email,
        username: foundUser.username,
        id: foundUser._id.toString()
      },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );
  } catch (err) {
    return res.status(500).json();
  }

  res.status(200).json({ user: foundUser, token });
};

exports.getUser = async (req, res) => {
  const user = req.params.userId;
  const userId = req.userId;

  let foundUser;

  if (userId !== user) {
    return res.status(401).json({ message: "Unauthorized!" });
  }

  try {
    foundUser = await User.findById(userId);
  } catch (err) {
    return res.status(500).json(err);
  }

  if (!foundUser) {
    return res.status(422).json("Email or password are incorrect!");
  }

  res.status(200).json({ user: foundUser });
};

exports.updateProfile = async (req, res) => {
  const userData = req.body;
  const user = req.params.userId;
  const userId = req.userId;

  if (userId !== user) {
    return res.status(401).json({ message: "Unauthorized!" });
  }

  if (
    userData.newPassword &&
    userData.oldPassword &&
    userData.newPassword === userData.oldPassword
  ) {
    return res
      .status(422)
      .json({ message: "New Password can't match old password!" });
  }

  let foundUser;

  try {
    foundUser = await User.findById(userId);
  } catch (err) {
    return res.status(500).json(err);
  }

  if (!foundUser) {
    return res.status(404).json({ message: "User not found!" });
  }

  let comparedPasswords;

  if (userData.oldPassword) {
    comparedPasswords = bcrypt.compareSync(
      userData.oldPassword,
      foundUser.password
    );

    if (!comparedPasswords) {
      return res.status(422).json({ message: "Old password is invalid!" });
    }
  }

  let encryptedPassword;

  if (userData.newPassword) {
    encryptedPassword = bcrypt.hashSync(userData.newPassword, 12);

    if (!encryptedPassword) {
      return res.status(500).json({ message: "Could not encrypt password!" });
    }
  }

  if (userData.oldAvatar && req.file) {
    AWS.config.update({
      accessKeyId: process.env.AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
    });

    const s3 = new AWS.S3();

    const params = {
      Bucket: process.env.AWS_BUCKET_NAME,
      Key: userData.oldAvatar.split(".com/")[1]
    };

    s3.deleteObject(params, (err, data) => {
      if (err) console.log(err);
      else if (data) console.log("Image removed from AWS S3!");
    });
  }

  let updatedUser;

  try {
    foundUser.avatar = req.file
      ? `https://${process.env.AWS_BUCKET_NAME}.s3.amazonaws.com/${req.file.filename}`
      : foundUser.avatar;
    foundUser.email = userData.email ? userData.email : foundUser.email;
    foundUser.password =
      userData.newPassword && comparedPasswords && encryptedPassword
        ? encryptedPassword
        : foundUser.password;

    updatedUser = await foundUser.save();
  } catch (err) {
    return res.status(500).json(err);
  }

  if (!updatedUser) {
    return res.status(500).json({ message: "Could not update user!" });
  }

  if (updatedUser && req.file) {
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
      } else if (data) {
        fs.unlink(path.join(__dirname, "..", req.file.filename), (err) => {
          if (err) {
            throw new Error("Could not unlink image from server!");
          }
        });

        console.log("Image uploaded to AWS S3!");
      }
    });
  }

  res.status(200).json({ user: updatedUser });
};
