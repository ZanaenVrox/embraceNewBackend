require("dotenv").config();
const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    await mongoose.set("strictQuery", true);
    await mongoose.connect(process.env.MONGO_URI);

    console.log("mongodb connection success!");
    const response = "mongodb connection success!";
    return response;
  } catch (err) {
    console.log("mongodb connection failed!", err.message);
    const response = "mongodb connection failed!" + err.message;
    return response;
  }
};

module.exports = connectDB;
