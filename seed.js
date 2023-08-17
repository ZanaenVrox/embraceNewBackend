require("dotenv").config();
const connectDB = require("./config/db");

const Customer = require("./models/Customers");
const userData = require("./utils/customer");
const Orders = require("./models/Order");
const ordersData = require("./utils/orders");
const User = require("./models/Users");
const adminData = require("./utils/users");
const PostCategory = require("./models/PostCategory");
const postCategoryData = require("./utils/postCategories");
const Posts = require("./models/Posts");
const postsData = require("./utils/posts");
const Products = require("./models/Products");
const productsData = require("./utils/products");
const ProductCategory = require("./models/ProductCategory");
const ProductCategoriesData = require("./utils/ProductCategories");
const Symptoms = require("./models/Symptoms");
const SymptomsData = require("./utils/Symptoms");
const Cities = require("./models/Cities");
const citiesData = require("./utils/cities");

connectDB();
const importData = async () => {
  try {
    // await Customer.deleteMany();
    // await Customer.insertMany(userData);

    // await Orders.deleteMany();
    // await Orders.insertMany(ordersData);

    await Cities.deleteMany();
    await Cities.insertMany(citiesData);

    // await PostCategory.deleteMany();
    // await PostCategory.insertMany(postCategoryData);

    // await Posts.deleteMany();
    // await Posts.insertMany(postsData);

    // await Products.deleteMany();
    // await Products.insertMany(productsData);

    // await ProductCategory.deleteMany();
    // await ProductCategory.insertMany(ProductCategoriesData);

    // await Symptoms.deleteMany();
    // await Symptoms.insertMany(SymptomsData);
    console.log("data inserted successfully!");
    process.exit();
  } catch (error) {
    console.log("error", error);
    process.exit(1);
  }
};

importData();
