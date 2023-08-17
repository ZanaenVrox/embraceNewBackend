require("dotenv").config();
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const Users = require("../models/Users");

const signInToken = (user) => {
  return jwt.sign(
    {
      _id: user._id,
      name: user.name,
      email: user.email,
      address: user.address,
      phone: user.phone,
      image: user.image,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: "2d",
    }
  );
};

const tokenForVerify = (user) => {
  return jwt.sign(
    {
      _id: user._id,
      name: user.name,
      email: user.email,
      password: user.password,
    },
    process.env.JWT_SECRET_FOR_VERIFY,
    { expiresIn: "15m" }
  );
};

const isAuth = async (req, res, next) => {
  const { authorization } = req.headers;
  try {
    const token = authorization.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    res.status(401).send({
      message: err.message,
    });
  }
};

const isAdmin = async (req, res, next) => {
  const users = await Users.findOne({ role: "Admin" });
  if (users) {
    next();
  } else {
    res.status(401).send({
      message: "User is not Users",
    });
  }
};

const sendMail = (body, res, message) => {
  const mailTransporter = nodemailer.createTransport({
    service: process.env.SERVICE,
    port: process.env.EMAIL_PORT,
    secure: false,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  console.log(process.env.EMAIL_USER);
  console.log(process.env.EMAIL_PASS);

  mailTransporter.sendMail(body, (err) => {
    if (err) {
      console.log("It has an error:-", err.message);
    } else {
      console.log("Emails is send");
    }
  });
};

module.exports = {
  signInToken,
  tokenForVerify,
  isAuth,
  isAdmin,
  sendMail,
};
