require("dotenv").config();
const express = require("express");
const cors = require("cors");

const connectDB = require("./config/db");
const multer = require("multer");
const helmet = require("helmet");

const customersRoutes = require("./routes/customersRoutes");
const userOrderRoutes = require("./routes/customersOrderRoutes");
const userRoutes = require("./routes/usersRoutes");
const couponRoutes = require("./routes/couponRoutes");
const postCategoryRoutes = require("./routes/postCategoryRoutes");
const postsRoutes = require("./routes/postsRoutes");
const productRoutes = require("./routes/productRoutes");
const orderRoutes = require("./routes/orderRoutes");
const symptomsRoutes = require("./routes/symptomsRoutes");
const symptomsCategoryRoutes = require("./routes/symptomsCategoryRoutes");
const subscriptionRoutes = require("./routes/subscriptionRoutes");
const appRoutes = require("./routes/appRoutes");
const productCateRoutes = require("./routes/productCateRoutes");
const dashboardRoutes = require("./routes/dashboardRoutes");
const cityRoutes = require("./routes/cityRoutes");
const emailRoutes = require("./routes/emailRoutes");

connectDB();
const app = express();

app.set("trust proxy", 1);

app.use(express.json({ limit: "4mb" }));
app.use(helmet());
app.use(cors());

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
app.post("/api/upload/multiple", upload.array("images", 5), (req, res) => {
  const files = req.files;
  const filePaths = files.map((file) => file.path);
  res.send({
    status: true,
    message: "Images uploaded successfully",
    data: {
      filePaths,
    },
  });
});

// app.use("/api/images", express.static("images"));

//this for route will need for store front, also for admin dashboard
app.use("/api/customers/", customersRoutes);
//if you not use admin dashboard then these two route will not needed.
app.use("/api/user/", userRoutes);
app.use("/api/coupons/", couponRoutes);
app.use("/api/user/orders/", userOrderRoutes);
app.use("/api/posts/category/", postCategoryRoutes);
app.use("/api/posts/", postsRoutes);
app.use("/api/products/", productRoutes);
app.use("/api/products/category/", productCateRoutes);
app.use("/api/orders/", orderRoutes);
app.use("/api/subscription/", subscriptionRoutes);
app.use("/api/symptoms/", symptomsRoutes);
app.use("/api/symptoms/category/", symptomsCategoryRoutes);
app.use("/api/app/", appRoutes);
app.use("/api/dashboard/", dashboardRoutes);
app.use("/api/city/", cityRoutes);
app.use("/api/email/", emailRoutes);

// Use express's default error handling middleware
app.use((err, req, res, next) => {
  if (res.headersSent) return next(err);
  res.status(400).json({ message: err.message });
});

const PORT = process.env.PORT || 5000;

// app.listen(PORT, () => console.log(`server running on port ${PORT}`));

//root route
app.get("/home", (req, res) => {
  res.send("App works properly!");
});

app.listen(PORT, () =>
  console.log(`server running on port http://localhost:${PORT}`)
);
