const Subscription = require("../models/Subscription");
const Customers = require("../models/Customers");
const Order = require("../models/Order");
const Product = require("../models/Products");
const moment = require("moment");
const {
  exposendPushNotification,
} = require("../pushnotifications/expoNotifications");
const { createNotificationBack } = require("./NotificationController");
const createSubscription = async (req, res) => {
  const prducts = [];

  for (i = 0; i <= req?.body?.cart?.length; i++) {
    const element = req?.body?.cart[i];
    if (element !== undefined) {
      const obj = {
        id: element?._id,
        count: element?.count,
        userId: req?.body?.userId,
      };
      prducts.push(obj);
    }
  }

  try {
    const subscription_data = {
      userId: req.body.userId,
      subscriptionType: req.body.subscriptionType,
      products: prducts,
      status: req.body.status,
      address: req.body.address,
      city: req.body.city,
      country: req.body.country,
      nextOrderDate: moment(req.body.nextOrderDate)
        .add(30, "days")
        .format("DD/MM/YYYY"),
    };
    const customer_data = {
      phone: req.body.number,
      address: req.body.address,
      country: req.body.country,
      postalcode: req.body.postalcode,
    };
    const order_data = {
      userId: req.body.userId,
      orderId: req.body.orderId,
      cart: req.body.cart,
      name: req.body.name,
      address: req.body.address,
      city: req.body.city,
      contact: req.body.contact,
      country: req.body.country,
      zipCode: req.body.postalcode,
      subTotal: req.body.subTotal,
      shippingCost: req.body.shippingCost,
      discount: req.body.discount,
      total: req.body.total,
      shippingOption: req.body.shippingOption,
      paymentMethod: req.body.paymentMethod,
      cardInfo: req.body.cardInfo,
      subscriptionType: req.body.subscriptionType,
    };

    const user = await Customers.findOneAndUpdate(
      { userId: req.body.userId },
      {
        $set: {
          phone: req.body.number,
          address: req.body.address,
          country: req.body.country,
          postalcode: req.body.postalcode,
        },
      },
      { new: true }
    );
    console.log("subscription_data", newSubscription);

    const newSubscription = new Subscription(subscription_data);

    await newSubscription.save();
    const newOrder = new Order(order_data);
    await newOrder.save();

    res.status(200).send({ message: "Subscribed" });
  } catch (err) {
    res.status(400).json(err);
  }
};

// const subscriptionCheckerJob = async (req, res) => {
//   try {
//     const today = moment().format("DD/MM/YYYY");
//     const dateToFind = moment(today, "DD/MM/YYYY")
//       .add(3, "days")
//       .format("DD/MM/YYYY");
//     console.log("dateToFind", dateToFind);
//     const subscriptions = await Subscription.find({
//       nextOrderDate: dateToFind,
//       status: true,
//     });

//     subscriptions.forEach(async (subscription) => {
//       if (subscription.status) {
//         const customer = await Customers.findOne({
//           userId: subscription.userId,
//         });
//         var products = [];
//         subscription.products[0].productsData.forEach(async (product) => {
//           const item = await Product.findById(product._id);
//           products.push({
//             productName: item.productName,
//             price: item.salePrice,
//             image: process.env.IMAGE_PATH_LINK + item.productImage[0],
//             description: item.description,
//             quantity: product.count,
//           });
//         });
//         const order = new Order({
//           createdAt: moment().format(),
//           orderId: "dsadasdad",
//           cart: products,
//           name: customer.name,
//           address: customer.address,
//           city: customer.city,
//           contact: customer.contact,
//           country: customer.country,
//           zipCode: customer.zipCode,
//           subTotal: products.reduce((a, c) => a + c.price * c.count, 0),
//           shippingCost: 0,
//           total: products.reduce((a, c) => a + c.price * c.count, 0),
//           paymentMethod: "Cash on Delivery",
//           subscriptionType: subscription.subscriptionType,
//         });

//         await order.save();

//         if (subscription.subscriptionType === "Monthly") {
//           subscription.nextOrderDate = moment(
//             subscription.nextOrderDate,
//             "DD/MM/YYYY"
//           )
//             .add(1, "months")
//             .format("DD/MM/YYYY");
//         } else if (subscription.subscriptionType === "Quarterly") {
//           subscription.nextOrderDate = moment(
//             subscription.nextOrderDate,
//             "DD/MM/YYYY"
//           )
//             .add(3, "months")
//             .format("DD/MM/YYYY");
//         } else if (subscription.subscriptionType === "Bimonthly") {
//           subscription.nextOrderDate = moment(
//             subscription.nextOrderDate,
//             "DD/MM/YYYY"
//           )
//             .add(2, "months")
//             .format("DD/MM/YYYY");
//         }

//         await Subscription.updateOne({ _id: subscription._id }, subscription);
//       }
//     });

//     return res.status(200).json({
//       success: true,
//       message: "Orders created successfully!",
//     });
//   } catch (error) {
//     return res.status(500).json({
//       success: false,
//       message: "Error creating orders: " + error,
//     });
//   }
// };

const subscriptionCheckerJob = async (req, res) => {
  try {
    const today = moment().format("DD/MM/YYYY");

    const dateToFind = moment(today, "DD/MM/YYYY")
      .add(3, "days")
      .format("DD/MM/YYYY");

    const subscriptions = await Subscription.find({
      nextOrderDate: dateToFind,
      status: true,
    });
    console.log("subscriptions", subscriptions);

    // Check if subscriptions array is not empty before accessing the first element
    if (subscriptions.length > 0) {
      for (const subscription of subscriptions) {
        if (subscription.status) {
          const customer = await Customers.findOne({
            customerId: subscription.userId,
          });

          let ttk = [];
          const tok = customer.token;
          ttk.push(tok);

          let products = [];
          for (const product of subscription.products) {
            console.log("item", product);
            const item = await Product.findById(product.id);

            products.push({
              productName: item?.productName,
              price: item?.salePrice,
              salePrice: item?.salePrice,
              image: process.env.IMAGE_PATH_LINK + item?.productImage[0],
              productImage: item?.productImage,
              description: item?.description,
              quantity: product.count,
              status: item?.status,
              sku: item?.sku,
              pieces: item?.pieces,
              productCategory: item?.productCategory,
              createdAt: item?.createdAt,
              updatedAt: item?.updatedAt,
              reviews: item?.reviews,
            });
          }

          console.log("products", products);
          console.log("subscription", subscription);

          const order = new Order({
            createdAt: moment().format(),
            userId: subscription.userId,
            cart: products,
            name: customer.full_name,
            address: subscription.address,
            city: subscription.city,
            contact: subscription.contact,
            country: customer.country,
            zipCode: customer.zipCode,
            subTotal: products.reduce((a, c) => a + c.price * c.quantity, 0),
            shippingCost: 0,
            total: products.reduce((a, c) => a + c.price * c.quantity, 0),
            paymentMethod: "Cash on Delivery",
            subscriptionType: subscription.subscriptionType,
            trackingnumber: "",
            status: "Pending",
            token: customer.token,
          });

          console.log("order", order);
          await order.save();

          const pushMessg = `Exciting news! Your next delivery is\njust 3 days away!\nYour order is#${order.orderId}`;
          createNotificationBack(subscription.userId, pushMessg);
          exposendPushNotification(ttk, pushMessg);

          if (subscription.subscriptionType === "Monthly") {
            subscription.nextOrderDate = moment(
              subscription.nextOrderDate,
              "DD/MM/YYYY"
            )
              .add(1, "months")
              .format("DD/MM/YYYY");
          } else if (subscription.subscriptionType === "Quarterly") {
            subscription.nextOrderDate = moment(
              subscription.nextOrderDate,
              "DD/MM/YYYY"
            )
              .add(3, "months")
              .format("DD/MM/YYYY");
          } else if (subscription.subscriptionType === "Bimonthly") {
            subscription.nextOrderDate = moment(
              subscription.nextOrderDate,
              "DD/MM/YYYY"
            )
              .add(2, "months")
              .format("DD/MM/YYYY");
          }

          await Subscription.updateOne({ _id: subscription._id }, subscription);
        }
      }
    } else {
      // Handle the case when no subscriptions are found for the given date
      return res.status(200).json({
        success: true,
        message: "No subscriptions found for the given date.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Orders created successfully!",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error creating orders: " + error,
    });
  }
};

const getAllSubscriptions = async (req, res) => {
  try {
    const subscriptions = await Subscription.find({});

    // Map over each subscription and get the corresponding products
    const subscriptionWithProducts = await Promise.all(
      subscriptions.map(async (subscription) => {
        const products = [];
        for (const product of subscription.products) {
          const productData = await Product.findById(product.id);
          products.push({
            ...productData.toObject(),
            count: product.count,
          });
        }

        return {
          ...subscription.toObject(),
          products: { productsData: { productsin: products } },
        };
      })
    );

    const Data = [];

    for (let index = 0; index < subscriptionWithProducts.length; index++) {
      const element = subscriptionWithProducts[index];
      const CustomersData = await Customers.findOne({
        customerId: element.userId,
      });

      const obj = {
        _id: element._id,
        userId: element.userId,
        subscriptionType: element.subscriptionType,
        CustomersData: CustomersData,
        products: element.products,
        nextOrderDate: element.nextOrderDate,
        status: element.status,
        createdAt: element.createdAt,
        updatedAt: element.updatedAt,
      };
      Data.push(obj);
    }

    res.status(200).json(Data);
  } catch (error) {
    res.status(500).json(error.message);
  }
};

const getSubscriptionOfUser = async (req, res) => {
  try {
    const customerID = req.params.userId;
    const subscriptions = await Subscription.find({ userId: customerID });

    const productIds = subscriptions.flatMap((subscription) => {
      return subscription.products.map((product) => product.id);
    });

    const products = await Product.find({ _id: { $in: productIds } });

    const response = subscriptions.map((subscription) => {
      const subscriptionProducts = subscription.products.map(
        (subscriptionProduct) => {
          const product = products.find(
            (product) => product._id.toString() === subscriptionProduct.id
          );
          return {
            productName: product.productName,
            price: product.salePrice,
            image: process.env.IMAGE_PATH_LINK + product.productImage[0],
            description: product.description,
            quantity: subscriptionProduct.count,
          };
        }
      );

      return {
        ...subscription.toJSON(),
        products: subscriptionProducts,
      };
    });

    res.status(200).json(response);
  } catch (error) {
    res.status(500).json(error.message);
  }
};

const editSubscription = async (req, res) => {
  const subscriptionId = req.params.id;
  try {
    const subscription = await Subscription.findById(subscriptionId);
    if (!subscription) throw new Error("Subscription not found");

    const { subscriptionType, products, check } = req.body;

    subscription.subscriptionType = subscriptionType;
    subscription.products = products;

    if (check) {
      const frequencyMap = {
        Monthly: 1,
        Quarterly: 3,
        Bimonthly: 2,
      };

      const frequency = frequencyMap[subscriptionType];

      if (!frequency) throw new Error("Invalid subscription type");

      const nextOrderDate = moment(subscription.lastOrderDate, "DD/MM/YYYY")
        .add(frequency, "months")
        .format("DD/MM/YYYY");

      subscription.nextOrderDate = nextOrderDate;
    }

    const updatedSubscription = await subscription.save();
    res.status(200).send(updatedSubscription);
  } catch (err) {
    res.status(404).send(err.message);
  }
};

module.exports = {
  createSubscription,
  subscriptionCheckerJob,
  getAllSubscriptions,
  getSubscriptionOfUser,
  editSubscription,
};
