require("dotenv").config();
const express = require("express");
const cors = require("cors");
const path = require("path");
const helmet = require("helmet");
const fileUpload = require("express-fileupload");
const multer = require("multer");
const connectDB = require("./config/db");
const customersRoutes = require("./routes/customersRoutes");
const userRoutes = require("./routes/usersRoutes");
const categoryRoutes = require("./routes/categoryRoutes");
const postsRoutes = require("./routes/postsRoutes");

const { isAuth, isAdmin } = require("./config/auth");

connectDB();
const app = express();

app.set("trust proxy", 1);

app.use(express.json({ limit: "4mb" }));
app.use(helmet());
app.use(cors());

app.get("/", (req, res) => {
  res.send("App works properly!");
});

var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./images");
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});
var upload = multer({ storage: storage });

app.use("/a", express.static("/b"));

app.use(express.static(__dirname + "/images"));
app.use("/api/images", express.static("images"));

app.post("/api/upload", upload.single("file"), function (req, res, next) {
  return res.status(200).send("Image uploaded Succesfully");
});

//this for route will need for store front, also for admin dashboard
app.use("/api/customers/", customersRoutes);

//if you not use admin dashboard then these two route will not needed.
app.use("/api/user/", userRoutes);
app.use("/api/category/", categoryRoutes);
app.use("/api/posts/", postsRoutes);

// Use express's default error handling middleware
app.use((err, req, res, next) => {
  if (res.headersSent) return next(err);
  res.status(400).json({ message: err.message });
});

const PORT = process.env.PORT || 5000;

// app.listen(PORT, () => console.log(`server running on port ${PORT}`));

app.listen(PORT, () =>
  console.log(`server running on port http://localhost:${PORT}`)
);
