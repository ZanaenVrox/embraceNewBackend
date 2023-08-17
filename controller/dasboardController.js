const Product = require("../models/Products");
const Order = require("../models/Order");
const Customers = require("../models/Customers");
const Subscription = require("../models/Subscription");

const getTotalData = async (req, res) => {
  try {
    const OrderData = await Order.find({});
    const totalRevenu = OrderData.reduce(
      (sum, order) => sum + (order.total || 0),
      0
    );

    const totalProducts = await Product.countDocuments();
    const totalOrders = await Order.countDocuments();
    const totalOrdersPending = await Order.find({
      status: "Pending",
    }).countDocuments();
    const totalOrdersDelivered = await Order.find({
      status: "Delivered",
    }).countDocuments();
    const totalCustomers = await Customers.countDocuments();
    const totalSubscription = await Subscription.countDocuments();
    const lastFiveOrders = await Order.find().sort({ _id: -1 }).limit(5);

    const topFiveProductsData = [];

    // Define a dictionary to store the counts of each product
    const productCounts = {};

    // Loop through each order in the OrderData array
    OrderData.forEach((order) => {
      // Loop through each item in the cart of the current order
      order.cart.forEach((item) => {
        // If the product ID already exists in the dictionary, increment the count
        // Otherwise, initialize the count to 1

        const productId = item._id;
        if (productId in productCounts) {
          productCounts[productId] += 1;
        } else {
          productCounts[productId] = 1;
        }
      });
    });

    // Sort the products based on the count
    const sortedProducts = Object.entries(productCounts).sort(
      (a, b) => b[1] - a[1]
    );

    // Select the top five products and calculate the total price
    let topFiveProducts = sortedProducts.slice(0, 5);

    console.log("topFiveProducts", topFiveProducts);

    topFiveProducts.forEach((product) => {
      const productId = product[0];
      const count = product[1];
      const item = OrderData.find((order) =>
        order.cart.find((item) => item._id === productId)
      ).cart.find((item) => item._id === productId);
      const data = {
        productName: item.productName,
        productCount: count,
        productTotal: count * item.price,
        productImage: item.productImage,
      };

      topFiveProductsData.push(data);
    });
    const object = {
      OrderData: OrderData,
      totalRevenu: totalRevenu,
      totalProducts: totalProducts,
      totalOrders: totalOrders,
      totalCustomers: totalCustomers,
      totalOrdersPending: totalOrdersPending,
      totalSubscription: totalSubscription,
      totalOrdersDelivered: totalOrdersDelivered,
      lastFiveOrders: lastFiveOrders,
      topFiveProductsData: topFiveProductsData,
    };
    res.status(200).json(object);
  } catch (error) {
    res.status(500).json(error.message);
  }
};

module.exports = {
  getTotalData,
};
