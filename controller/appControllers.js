const Posts = require("../models/Posts");
const PostCategory = require("../models/PostCategory");
const Customer = require("../models/Customers");
const Product = require("../models/Products");
const ProductCategory = require("../models/ProductCategory");
const Order = require("../models/Order");
const Subscription = require("../models/Subscription");
const Menstrual = require("../models/Menstrual");
const UserSymptoms = require("../models/UserSymptoms");
const Coupon = require("../models/Coupon");
const Symptoms = require("../models/Symptoms");
const Address = require("../models/Address");
const Cities = require("../models/Cities");
const Review = require("../models/Reviews");
const ActivityLog = require("../models/ActivityLog");
const { sendMail } = require("../config/auth");
const { createNotificationBack } = require("./NotificationController");
const {
  OrderProcedeMail,
  SubscriptionProcedeMail,
} = require("../config/EmailTemplates");

const {
  exposendPushNotification,
} = require("../pushnotifications/expoNotifications");

const moment = require("moment");
const Promotion = require("../models/Promotion");

const getPostsByCategory = async (req, res) => {
  try {
    const categories = await PostCategory.find();
    let PostBYCate = [];
    for (let i = 0; i < categories.length; i++) {
      const category = categories[i];
      const posts = await Posts.find({
        category: { $in: category.title },
      });
      const blogsData = posts.map((post) => ({
        _id: post._id,
        title: post.title,
        image: process.env.IMAGE_PATH_LINK + post.image,
      }));
      const categoryData = {
        categoryName: category.title,
        blogsData: blogsData,
      };
      PostBYCate.push(categoryData);
    }
    res.status(200).send(PostBYCate);
  } catch (err) {
    res.status(404).json({ nopostsfound: "No posts found for this category" });
  }
};

const getAllCategory = async (req, res) => {
  try {
    const categories = await PostCategory.find({}).sort({ _id: -1 });
    const result = {
      totalCount: categories.length,
      items: categories.map((categorie) => ({
        _id: categorie._id,
        name: categorie.title,
        value: categorie.title,
        colourCode: categorie.colourCode,
        imageUrl: categorie.image,
      })),
    };

    res.send(result);
  } catch (err) {
    res.status(500).send({
      message: err.message,
    });
  }
};

const getPostsById = async (req, res) => {
  try {
    const post = await Posts.findById(req.params.id);
    const blogsData = {
      _id: post._id,
      title: post.title,
      description: post.description,
      categoryId: post.category[0],
      image: process.env.IMAGE_PATH_LINK + post.image,
      createdAt: post.createdAt,
    };

    res.send(blogsData);
  } catch (err) {
    res.status(500).send({
      message: err.message,
    });
  }
};

const GetPostsBySingleCategory = async (req, res) => {
  try {
    const category = req.params.category;
    const posts = await Posts.find({
      category: { $in: category },
    });

    let PostData = [];
    for (let i = 0; i < posts.length; i++) {
      const element = posts[i];
      const object = {
        title: element.title,
        description: element.description,
        imageUrl: process.env.IMAGE_PATH_LINK + element.image,
        _id: element._id,
      };
      PostData.push(object);
    }

    const result = {
      totalCount: posts.length,
      items: PostData,
    };
    res.status(200).send(result);
  } catch (error) {
    res.status(500).send({
      message: error.message,
    });
  }
};

const Customerlogin = async (req, res) => {
  const name = req.body.name;
  const startDatePeriod = req.body.startDatePeriod;
  const dateAndTime = req.body.dateAndTime;
  const endDatePeriod = req.body.endDatePeriod;
  const uniqueID = req.body.uniqueID;
  const token = req.body.token;

  try {
    // const customer = await Customer.findOne({ full_name: name,  });
    const customer = await Customer.findOne({
      $and: [
        { full_name: name },
        { dob: moment(dateAndTime).format("DD/MM/YYYY") },
      ],
    });

    if (customer) {
      const CustomerData = {
        _id: customer._id,
        name: customer.full_name,
        startDatePeriod: startDatePeriod,
        endDatePeriod: endDatePeriod,
        customerId: customer.customerId,
        token: token,
      };

      // customer._id = customer._id;
      // customer.name = customer.name;
      // customer.startDatePeriod = customer.startDatePeriod;
      // customer.endDatePeriod = customer.endDatePeriod;
      // customer.customerId = customer.customerId;
      // customer.token = token;

      await customer.save();

      res.status(200).send({
        data: CustomerData,
        message: "Existing User",
      });
    } else {
      const uniqueID = name + moment(dateAndTime).format("DDMMYYYY");

      const newCustomerData = {
        full_name: name,
        periodStartDate: startDatePeriod,
        periodEndDate: endDatePeriod,
        customerId: uniqueID,
        token: token,
        dob: moment(dateAndTime).format("DD/MM/YYYY"),
      };
      const newCustomer = new Customer(newCustomerData);
      newCustomer.save();
      res.status(200).send({
        data: newCustomer,
        message: "New User",
      });
    }
  } catch (error) {
    res.status(500).send({
      message: error.message,
    });
  }
};

const login = async (req, res) => {
  try {
    const name = req.body.name;
    const dateOfBirth = moment(req.body.dateOfBirth).format("DD/MM/YYYY");
    const phoneNumber = req.body.phoneNumber;
    const token = req.body.token;

    // const customer = await Customer.findOne({
    //   $and: [{ full_name: name }, { dob: dateOfBirth }, { phone: phoneNumber }],
    // });
    const customer = await Customer.findOne({ phone: phoneNumber });

    console.log("customer", customer);

    if (customer) {
      customer.full_name = customer.full_name;
      customer.customerId = customer.customerId;
      customer.dob = customer.dateOfBirth;
      customer.phone = customer.phoneNumber;
      customer.token = token;

      await customer.save();

      res.status(200).send({
        data: customer,
        message: "Existing User",
      });
    } else {
      const uniqueID =
        moment(dateOfBirth, "YYYY-MM-DD").format("DDMMYY") +
        phoneNumber.substr(phoneNumber.length - 7);
      const newCustomerData = {
        full_name: name,
        customerId: phoneNumber,
        dob: dateOfBirth,
        phone: phoneNumber,
        token: token,
      };

      const newCustomer = new Customer(newCustomerData);
      await newCustomer.save();
      res.status(200).send({
        data: newCustomer,
        message: "New User",
      });
    }
  } catch (error) {
    res.status(500).send({
      message: error.message,
    });
  }
};

const addLastPeriodDate = async (req, res) => {
  console.log("S", req.body);

  try {
    //res.json(req.body);
    //return;
    const id = req.body.customerId;
    const PeriodStartDate = moment(req.body.startDate, "DD/MM/YYYY").format(
      "YYYY-MM-DD"
    );

    const current_cycle = await Menstrual.find({ user_id: id, is_current: 1 });
    if (current_cycle.length > 0) {
      console.log("1st check ");
      const current_cycle_start_date = moment(
        current_cycle[0].start_date,
        "YYYY-MM-DD"
      )
        .add(28, "days")
        .format("YYYY-MM-DD");

      let diff = 0;
      console.log("PeriodStartDate", PeriodStartDate);
      console.log("current_cycle_start_date", current_cycle_start_date);

      if (
        PeriodStartDate <=
        moment(current_cycle_start_date, "YYYY-MM-DD").format("YYYY-MM-DD")
      ) {
        console.log("f");
        diff = moment(current_cycle_start_date).diff(
          moment(PeriodStartDate, "YYYY-MM-DD"),
          "days"
        );
      } else {
        console.log("a");
        diff = moment(PeriodStartDate).diff(
          moment(current_cycle_start_date, "YYYY-MM-DD"),
          "days"
        );
      }
      //res.json(diff);
      // return;
      if (diff >= 0 && diff <= 10) {
        const current_cycleup = await Menstrual.find({
          user_id: id,
          is_current: 1,
        });
        const endupdate = current_cycleup[0].end_date; //moment(ovulation_date, "YYYY-MM-DD").subtract(2, "days")
        const stupdate = moment(current_cycleup[0].start_date).format(
          "YYYY-MM-DD"
        );
        const updatedEndDate = moment(PeriodStartDate, "YYYY-MM-DD")
          .subtract(1, "days")
          .format("YYYY-MM-DD");

        var totalcycledaysup = moment(updatedEndDate, "YYYY-MM-DD").diff(
          moment(stupdate, "YYYY-MM-DD"),
          "days"
        );
        const updateOldCycle = {
          is_current: 0,
          end_date: updatedEndDate,
          totalcycledays: totalcycledaysup,
        };
        const fiterUpda = {
          id: current_cycleup[0].id,
        };
        console.log("updateOldCycle", updateOldCycle);
        // res.json(totalcycledaysup);
        // return;
        const categorieds = await Menstrual.updateOne(fiterUpda, {
          $set: updateOldCycle,
        });
        const cycleLength = 28;
        var filter = {
          id: current_cycle[0].id,
        };
        var start_date = PeriodStartDate;
        var end_date = moment(start_date, "YYYY-MM-DD")
          .add(cycleLength - 1, "days")
          .format("YYYY-MM-DD");
        var user_id = id;
        var bleed_start_date = start_date;
        var bleed_end_date = moment(bleed_start_date, "YYYY-MM-DD")
          .add(4, "days")
          .format("YYYY-MM-DD");
        var ovulation_date = moment(start_date, "YYYY-MM-DD")
          .add(13, "days")
          .format("YYYY-MM-DD");
        var ovulation_start_date = moment(ovulation_date, "YYYY-MM-DD")
          .subtract(2, "days")
          .format("YYYY-MM-DD");
        var ovulation_end_date = moment(ovulation_date, "YYYY-MM-DD")
          .add(2, "days")
          .format("YYYY-MM-DD");
        var totalcycledays = moment(end_date, "YYYY-MM-DD").diff(
          moment(start_date, "YYYY-MM-DD"),
          "days"
        );
        var cycle_type = "normal";
        if (totalcycledays < 21 || totalcycledays > 35) {
          cycle_type = "abnormal";
        }
        const iddd = await Menstrual.find().sort({ id: -1 }).limit(1);

        let idd = 0;
        if (iddd.length > 0 && iddd[0].id) {
          idd = iddd[0].id;
        }
        var incId = idd + 1;
        var updatedValue = {
          id: incId,
          user_id: user_id,
          start_date: start_date,
          end_date: end_date,
          bleed_start_date: bleed_start_date,
          bleed_end_date: bleed_end_date,
          ovulation_date: ovulation_date,
          ovulation_start_date: ovulation_start_date,
          ovulation_end_date: ovulation_end_date,
          totalcycledays: totalcycledays + 1,
          cycle_type: cycle_type,
          is_current: 1,
        };
        const categories = await Menstrual.create(updatedValue);

        // const categorieds = await Menstrual.updateOne(filter, {
        //   $set: updatedValue,
        // });
      } else {
        // res.json(diff);
        //           return;
        const current_cycleup = await Menstrual.find({
          user_id: id,
          is_current: 1,
        });
        //res.json(current_cycleup);return;
        const endupdate = current_cycleup[0].end_date; //moment(ovulation_date, "YYYY-MM-DD").subtract(2, "days")
        const stupdate = moment(current_cycleup[0].start_date).format(
          "YYYY-MM-DD"
        );
        const updatedEndDate = moment(PeriodStartDate, "YYYY-MM-DD")
          .subtract(1, "days")
          .format("YYYY-MM-DD");

        var totalcycledaysup = moment(updatedEndDate, "YYYY-MM-DD").diff(
          moment(stupdate, "YYYY-MM-DD"),
          "days"
        );
        console.log("totalcycledaysup", totalcycledaysup);
        var cycle_typeu = "normal";
        if (totalcycledaysup < 21 || totalcycledaysup > 35) {
          cycle_typeu = "abnormal";
        }
        const updateOldCycle = {
          is_current: 0,
          end_date: updatedEndDate,
          totalcycledays: totalcycledaysup,
          cycle_type: cycle_typeu,
        };
        const fiterUpda = {
          // id: current_cycleup[0].id,
          user_id: id,
          is_current: 1,
        };

        const categorieds = await Menstrual.updateOne(fiterUpda, {
          $set: updateOldCycle,
        });

        // res.json(diff);
        // return;
        const iddd = await Menstrual.find().sort({ id: -1 }).limit(1);

        let idd = 0;
        if (iddd.length > 0 && iddd[0].id) {
          idd = iddd[0].id;
        }

        const cycleLength = 28;
        var incId = idd + 1;
        var start_date = PeriodStartDate;
        var end_date = moment(start_date, "YYYY-MM-DD")
          .add(cycleLength - 1, "days")
          .format("YYYY-MM-DD");
        var current_date = moment().format("YYYY-MM-DD");
        console.log("current_date", current_date);
        let Iscurrent = 1;
        if (current_date > end_date) {
          Iscurrent = 0;
        }

        //  res.json(end_date);
        //  return;

        var user_id = id;

        var bleed_start_date = start_date;
        var bleed_end_date = moment(bleed_start_date, "YYYY-MM-DD")
          .add(4, "days")
          .format("YYYY-MM-DD");
        var ovulation_date = moment(start_date, "YYYY-MM-DD")
          .add(13, "days")
          .format("YYYY-MM-DD");
        var ovulation_start_date = moment(ovulation_date, "YYYY-MM-DD")
          .subtract(2, "days")
          .format("YYYY-MM-DD");
        var ovulation_end_date = moment(ovulation_date, "YYYY-MM-DD")
          .add(2, "days")
          .format("YYYY-MM-DD");
        var totalcycledays = moment(end_date, "YYYY-MM-DD").diff(
          moment(start_date, "YYYY-MM-DD"),
          "days"
        );
        var cycle_type = "normal";
        if (totalcycledays < 21 || totalcycledays > 35) {
          cycle_type = "abnormal";
        }

        var updatedValue = {
          id: incId,
          user_id: user_id,
          start_date: start_date,
          end_date: end_date,
          bleed_start_date: bleed_start_date,
          bleed_end_date: bleed_end_date,
          ovulation_date: ovulation_date,
          ovulation_start_date: ovulation_start_date,
          ovulation_end_date: ovulation_end_date,
          totalcycledays: totalcycledays + 1,
          cycle_type: cycle_type,
          is_current: Iscurrent,
        };
        // return res.json(updatedValue)
        const categories = await Menstrual.create(updatedValue);
        if (current_date > end_date) {
          console.log("sad", end_date);
          const iddd = await Menstrual.find().sort({ id: -1 }).limit(1);

          let idd = 0;
          if (iddd.length > 0 && iddd[0].id) {
            idd = iddd[0].id;
          }

          const cycleLength = 28;
          var incId = idd + 1;
          var start_date = moment(end_date, "YYYY-MM-DD")
            .add(1, "days")
            .format("YYYY-MM-DD");
          console.log("sdsda", start_date);
          // res.json(start_date);
          // return;
          var end_date = moment(start_date, "YYYY-MM-DD")
            .add(cycleLength - 1, "days")
            .format("YYYY-MM-DD");
          var current_date = moment().format("YYYY-MM-DD");
          console.log("current_date", current_date);

          var user_id = id;

          var bleed_start_date = start_date;
          var bleed_end_date = moment(bleed_start_date, "YYYY-MM-DD")
            .add(4, "days")
            .format("YYYY-MM-DD");
          var ovulation_date = moment(start_date, "YYYY-MM-DD")
            .add(13, "days")
            .format("YYYY-MM-DD");
          var ovulation_start_date = moment(ovulation_date, "YYYY-MM-DD")
            .subtract(2, "days")
            .format("YYYY-MM-DD");
          var ovulation_end_date = moment(ovulation_date, "YYYY-MM-DD")
            .add(2, "days")
            .format("YYYY-MM-DD");
          var totalcycledays = moment(end_date, "YYYY-MM-DD").diff(
            moment(start_date, "YYYY-MM-DD"),
            "days"
          );
          var cycle_type = "normal";
          if (totalcycledays < 21 || totalcycledays > 35) {
            cycle_type = "abnormal";
          }

          var updatedValue = {
            id: incId,
            user_id: user_id,
            start_date: start_date,
            end_date: end_date,
            bleed_start_date: bleed_start_date,
            bleed_end_date: bleed_end_date,
            ovulation_date: ovulation_date,
            ovulation_start_date: ovulation_start_date,
            ovulation_end_date: ovulation_end_date,
            totalcycledays: totalcycledays + 1,
            cycle_type: cycle_type,
            is_current: 1,
          };
          // return res.json(updatedValue)
          const categories = await Menstrual.create(updatedValue);
        }
      }
    } else {
      console.log("here2");
      const iddd = await Menstrual.find().sort({ id: -1 }).limit(1);

      let idd = 0;
      if (iddd.length > 0 && iddd[0].id) {
        idd = iddd[0].id;
      }

      const cycleLength = 28;
      var incId = idd + 1;
      var start_date = PeriodStartDate;
      var end_date = moment(start_date, "YYYY-MM-DD")
        .add(cycleLength - 1, "days")
        .format("YYYY-MM-DD");
      var user_id = id;

      var bleed_start_date = start_date;
      var bleed_end_date = moment(bleed_start_date, "YYYY-MM-DD")
        .add(4, "days")
        .format("YYYY-MM-DD");
      var ovulation_date = moment(start_date, "YYYY-MM-DD")
        .add(13, "days")
        .format("YYYY-MM-DD");
      var ovulation_start_date = moment(ovulation_date, "YYYY-MM-DD")
        .subtract(2, "days")
        .format("YYYY-MM-DD");
      var ovulation_end_date = moment(ovulation_date, "YYYY-MM-DD")
        .add(2, "days")
        .format("YYYY-MM-DD");
      var totalcycledays = moment(end_date, "YYYY-MM-DD").diff(
        moment(start_date, "YYYY-MM-DD"),
        "days"
      );
      var cycle_type = "normal";
      if (totalcycledays < 21 || totalcycledays > 35) {
        cycle_type = "abnormal";
      }

      var updatedValue = {
        id: incId,
        user_id: user_id,
        start_date: start_date,
        end_date: end_date,
        bleed_start_date: bleed_start_date,
        bleed_end_date: bleed_end_date,
        ovulation_date: ovulation_date,
        ovulation_start_date: ovulation_start_date,
        ovulation_end_date: ovulation_end_date,
        totalcycledays: totalcycledays + 1,
        cycle_type: cycle_type,
        is_current: 1,
      };
      // return res.json(updatedValue)
      const categories = await Menstrual.create(updatedValue);
    }

    // res.json(diff);
    //return;

    const customer = await Customer.findOne({
      customerId: id,
    });

    if (customer) {
      customer.periodEndDate = PeriodStartDate;
      const CustomerPeriodEndDate = await customer.save();
      res.status(200).json(CustomerPeriodEndDate);
    } else {
      res.status(404).json({ message: "Customer not found" });
    }
  } catch (error) {
    res.status(500).send({
      message: error.message,
    });
  }
};

const CustomersLastPeriodEnd = async (req, res) => {
  try {
    const customer = await Customer.findById(req.params.id);
    if (customer) {
      customer.periodEndDate = req.body.periodEndDate;
      const updatedCustomer = await customer.save();
      res.send(updatedCustomer);
    }
  } catch (err) {
    res.status(404).send({
      message: "Your email is not valid!",
    });
  }
};

const getProductByCategory = async (req, res) => {
  try {
    const category = req.params.category;

    const products = await Product.find({
      productCategory: { $in: category },
    });

    let ProductsData = [];
    for (let index = 0; index < products.length; index++) {
      const element = products[index];
      const Object = {
        productName: element.productName,
        productCategoryName: element.productCategory,
        productImage: process.env.IMAGE_PATH_LINK + element.productImage,
        description: element.description,
        price: element.salePrice,
        _id: element._id,
      };
      ProductsData.push(Object);
    }

    const result = {
      totalCount: products.length,
      items: ProductsData,
    };
    res.status(200).send(result);
  } catch (error) {
    res.status(500).send({
      message: "Error",
    });
  }
};

const getAllProductsCategories = async (req, res) => {
  try {
    const ProductCategories = await ProductCategory.find({}).sort({ _id: -1 });

    const result = {
      totalCount: ProductCategories.length,
      items: ProductCategories.map((categorie) => ({
        _id: categorie._id,
        name: categorie.title,
        value: categorie.title,
        imageUrl: categorie.image,
      })),
    };
    res.send(result);
  } catch (error) {
    res.status(500).send({
      message: "Error",
    });
  }
};

const getProductAll = async (req, res) => {
  try {
    const products = await Product.find({});
    const productsData = [];
    for (let index = 0; index < products.length; index++) {
      element = products[index];
      const object = {
        productName: element.productName,
        productCategoryName: element.productCategory,
        productImage: process.env.IMAGE_PATH_LINK + element.productImage,
        description: element.description,
        price: element.salePrice,
        _id: element._id,
      };
      productsData.push(object);
    }
    const result = {
      totalCount: products.length,
      items: productsData,
    };
    res.status(200).send(result);
  } catch (error) {
    res.status(500).send({
      message: "Error",
    });
  }
};

const getProductsById = async (req, res) => {
  try {
    const productId = req.params.id;
    const product = await Product.findById(productId);

    const data = {
      _id: product._id,
      productName: product.productName,
      productCategoryName: product.productCategory,
      productImage: process.env.IMAGE_PATH_LINK + product?.productImage,
      description: product.description,
      images: null,
      images: [
        {
          productId: product._id,
          imageUrl: process.env.IMAGE_PATH_LINK + product?.productImage,
        },
      ],
      price: product.salePrice,
      quatity: product.pieces,
    };

    res.send(data);
  } catch (error) {
    res.status(500).send({
      message: error.message,
    });
  }
};

const addNewOrder = async (req, res) => {
  try {
    const newOrder = new Order({
      ...req.body,
    });

    const customer = await Customer.findOne({ customerId: req.body.userId });
    console.log("customer", customer);
    let ttk = [];
    const tok = customer.token;
    ttk.push(tok);

    const order = await newOrder.save();
    const pushMessg =
      "Your order has been received, your order is #" + order.orderId;
    const message = "Please check your email to reset password!";
    const NotificationMessage = "Your order has been placed\nsuccessfully!";
    createNotificationBack(req.body.userId, NotificationMessage);
    sendMail(OrderProcedeMail(newOrder), res, message);
    exposendPushNotification(ttk, pushMessg);
    return res.status(200).send(order);
  } catch (err) {
    return res.status(500).send({
      message: err.message,
    });
  }
};

const createSubscription = async (req, res) => {
  const prducts = [];

  console.log("req.body", req.body);
  for (i = 0; i <= req?.body?.cart?.length; i++) {
    const element = req?.body?.cart[i];

    if (element !== undefined) {
      const obj = {
        id: element?._id,
        count: element?.quantity,
        userId: req?.body?.userId,
      };
      prducts.push(obj);
    }
  }

  let orderData;

  if (req.body.subscriptionType === "Monthly") {
    orderData = 30;
  } else if (req.body.subscriptionType === "Bimonthly") {
    orderData = 60;
  } else if (req.body.subscriptionType === "Quarterly") {
    orderData = 90;
  }

  try {
    const subscription_data = {
      userId: req.body.userId,
      subscriptionType: req.body.subscriptionType,
      products: prducts,
      status: true,
      lastOrderDate: moment().format("DD/MM/YYYY"),
      nextOrderDate: moment().add(orderData, "days").format("DD/MM/YYYY"),
      address: req.body.address,
      city: req.body.city,
      country: req.body.country,
      contact: req.body.contact,
      nextOrderDate: moment(req.body.nextOrderDate)
        .add(30, "days")
        .format("DD/MM/YYYY"),
    };

    console.log("prducts", subscription_data);

    const customer_data = {
      phone: req.body.number,
      address: req.body.address,
      country: req.body.country,
      postalcode: req.body.postalcode,
    };
    const order_data = {
      userId: req.body.userId,
      cart: req.body.cart,
      name: req.body.name,
      address: req.body.address,
      city: req.body.city,
      contact: req.body.contact,
      country: req.body.country,
      zipCode: req.body.postalcode,
      subTotal: req.body.total,
      shippingCost: req.body.shippingCost,
      discount: req.body.discount,
      total: req.body.total,
      shippingOption: req.body.shippingOption,
      paymentMethod: req.body.paymentMethod,
      cardInfo: req.body.cardInfo,
      subscriptionType: req.body.subscriptionType,
      email: req.body.email,
    };
    console.log("order_data", order_data);
    const customer = await Customer.findOne({ customerId: req.body.userId });

    const newSubscription = new Subscription(subscription_data);
    await newSubscription.save();
    const newOrder = new Order(order_data);
    await newOrder.save();

    const SubscriptionMainData = {
      cart: newOrder.cart,
      subscriptionType: newSubscription.subscriptionType,
      name: newOrder.name,
      email: newOrder.email,
    };

    let ttk = [];
    const tok = customer.token;
    ttk.push(tok);

    const NotificationMessage =
      "You've successfully subscribed to\nan auto-repeat plan!";
    createNotificationBack(req.body.userId, NotificationMessage);

    const pushNotificationMessage =
      "You've successfully subscribed to an auto-repeat plan!";

    exposendPushNotification(ttk, pushNotificationMessage);

    sendMail(SubscriptionProcedeMail(SubscriptionMainData));
    sendMail(OrderProcedeMail(newOrder));
    res.status(200).send(newOrder);
  } catch (err) {
    res.status(400).json(err);
  }
};

const deleteUser = (req, res) => {
  Customer.deleteOne({ _id: req.params.id }, (err) => {
    if (err) {
      res.status(500).send({
        message: err.message,
      });
    } else {
      res.status(200).send({
        message: "User Deleted Successfully!",
      });
    }
  });
};

const Get = async (req, res) => {
  const MenstrualData = await Menstrual.find({
    user_id: req.body.user_id,
  });
  const newobj = {
    Good: true,
    data: { Cycles: MenstrualData },
  };

  res.json(MenstrualData);
};

const createMenstrualCycle = async (req, res) => {
  const iddd = await Menstrual.find().sort({ id: -1 }).limit(1);

  let idd = 0;
  if (iddd.length > 0 && iddd[0].id) {
    idd = iddd[0].id;
  }

  const cycleLength = 28;
  var incId = idd + 1;
  var start_date = req.body.start_date;
  var end_date = moment(start_date, "YYYY-MM-DD")
    .add(cycleLength - 1, "days")
    .format("YYYY-MM-DD");
  var user_id = req.body.user_id;
  var last_current_cycle = await Menstrual.find({
    user_id: user_id,
    is_current: 1,
  });
  if (last_current_cycle.length > 0) {
    var filter = {
      id: last_current_cycle[0].id,
    };
    var last_cycle_end_date = moment(start_date, "YYYY-MM-DD")
      .subtract(1, "days")
      .format("YYYY-MM-DD");
    var last_is_current = 0;
    var last_cycle_start_date = last_current_cycle[0].start_date;
    var last_totalcycedays = moment(last_cycle_end_date).diff(
      moment(last_cycle_start_date, "YYYY-MM-DD"),
      "days"
    );
    var last_cycle_type = "normal";
    if (last_totalcycedays < 21 || last_totalcycedays > 35) {
      last_cycle_type = "abnormal";
    }
    var last_ovulation_end_date = last_current_cycle[0].ovulation_end_date;
    var last_ovulation_start_date = last_current_cycle[0].ovulation_start_date;
    var last_ovulation_date = last_current_cycle[0].ovulation_date;

    if (last_totalcycedays <= 16 && last_totalcycedays >= 14) {
      last_ovulation_end_date = null;
    }
    if (last_totalcycedays <= 12) {
      last_ovulation_end_date = null;
      last_ovulation_start_date = null;
      last_ovulation_date = null;
    }
    var lastupdatedvalue = {
      end_date: last_cycle_end_date,
      totalcycledays: last_totalcycedays,
      cycle_type: last_cycle_type,
      is_current: last_is_current,
      ovulation_date: last_ovulation_date,
      ovulation_start_date: last_ovulation_start_date,
      ovulation_end_date: last_ovulation_end_date,
    };
    const categorieds = await Menstrual.updateOne(filter, {
      $set: lastupdatedvalue,
    });
  }
  var bleed_start_date = start_date;
  var bleed_end_date = moment(bleed_start_date, "YYYY-MM-DD")
    .add(4, "days")
    .format("YYYY-MM-DD");
  var ovulation_date = moment(start_date, "YYYY-MM-DD")
    .add(13, "days")
    .format("YYYY-MM-DD");
  var ovulation_start_date = moment(ovulation_date, "YYYY-MM-DD")
    .subtract(2, "days")
    .format("YYYY-MM-DD");
  var ovulation_end_date = moment(ovulation_date, "YYYY-MM-DD")
    .add(2, "days")
    .format("YYYY-MM-DD");
  var totalcycledays = moment(end_date, "YYYY-MM-DD").diff(
    moment(start_date, "YYYY-MM-DD"),
    "days"
  );
  var cycle_type = "normal";
  if (totalcycledays < 21 || totalcycledays > 35) {
    cycle_type = "abnormal";
  }

  var updatedValue = {
    id: incId,
    user_id: user_id,
    start_date: start_date,
    end_date: end_date,
    bleed_start_date: bleed_start_date,
    bleed_end_date: bleed_end_date,
    ovulation_date: ovulation_date,
    ovulation_start_date: ovulation_start_date,
    ovulation_end_date: ovulation_end_date,
    totalcycledays: totalcycledays + 1,
    cycle_type: cycle_type,
    is_current: 1,
  };
  // return res.json(updatedValue)
  const categories = await Menstrual.create(updatedValue);
  if (categories) {
    const newObj = {
      Good: true,
      data: "Record has Been Updated",
    };
    res.json(newObj);
  } else {
    const obj = {
      Good: false,
      data: "Un-Athunticated request",
    };
    return res.status(200).send(obj);
  }
};

const nextCycle = async (req, res) => {
  const user_id = req.params.user_id;
  const last_current_cycle = await Menstrual.find({
    is_current: 1,
    user_id: user_id,
  });

  let nextCycle = [];
  let cycleLength = 28;
  var p = 0;

  let dates = [];

  var symptons = await UserSymptoms.find({ user_id: user_id });
  for (var i = 0; i < symptons.length; i++) {
    let tm = moment(symptons[i].current_date, "YYYY-MM-DD").format(
      "YYYY-MM-DD"
    );
    dates.push(tm);
  }
  var prev_current_cycle = await Menstrual.find({
    is_current: 0,
    user_id: user_id,
  });

  for (var p = 0; p < prev_current_cycle.length; p++) {
    var pCycle = {
      user_id: user_id,
      start_date: prev_current_cycle[p].start_date,
      end_date: prev_current_cycle[p].end_date,
      bleed_start_date: prev_current_cycle[p].bleed_start_date,
      bleed_end_date: prev_current_cycle[p].bleed_end_date,
      ovulation_date: prev_current_cycle[p].ovulation_date,
      ovulation_start_date: prev_current_cycle[p].ovulation_start_date,
      ovulation_end_date: prev_current_cycle[p].ovulation_end_date,
      totalcycledays: prev_current_cycle[p].totalcycledays,
      cycle_type: prev_current_cycle[p].cycle_type,
      is_current: 0,
      symptons: dates,
    };
    nextCycle.push(pCycle);
  }

  var currentCycle = {
    user_id: user_id,
    start_date: last_current_cycle[0].start_date,
    end_date: last_current_cycle[0].end_date,
    bleed_start_date: last_current_cycle[0].bleed_start_date,
    bleed_end_date: last_current_cycle[0].bleed_end_date,
    ovulation_date: last_current_cycle[0].ovulation_date,
    ovulation_start_date: last_current_cycle[0].ovulation_start_date,
    ovulation_end_date: last_current_cycle[0].ovulation_end_date,
    totalcycledays: last_current_cycle[0].totalcycledays,
    cycle_type: last_current_cycle[0].cycle_type,
    is_current: 1,
    symptons: dates,
  };
  nextCycle.push(currentCycle);

  for (var i = 1; i <= 12; i++) {
    var factor = i * cycleLength;
    var start_date = moment(last_current_cycle[0].start_date, "YYYY-MM-DD")
      .add(factor, "days")
      .format("YYYY-MM-DD");
    var end_date = moment(start_date, "YYYY-MM-DD")
      .add(cycleLength - 1, "days")
      .format("YYYY-MM-DD");
    p++;
    var bleed_start_date = start_date;
    var bleed_end_date = moment(bleed_start_date, "YYYY-MM-DD")
      .add(4, "days")
      .format("YYYY-MM-DD");
    var ovulation_date = moment(start_date, "YYYY-MM-DD")
      .add(13, "days")
      .format("YYYY-MM-DD");
    var ovulation_start_date = moment(ovulation_date, "YYYY-MM-DD")
      .subtract(2, "days")
      .format("YYYY-MM-DD");
    var ovulation_end_date = moment(ovulation_date, "YYYY-MM-DD")
      .add(2, "days")
      .format("YYYY-MM-DD");
    var totalcycledays = moment(end_date, "YYYY-MM-DD").diff(
      moment(start_date, "YYYY-MM-DD"),
      "days"
    );
    var cycle_type = "normal";
    //  if (totalcycledays < 21 || totalcycledays > 35) {
    //     cycle_type = 'abnormal';
    //   }
    var updatedValue = {
      //id: incId,
      user_id: user_id,
      start_date: start_date,
      end_date: end_date,
      bleed_start_date: bleed_start_date,
      bleed_end_date: bleed_end_date,
      ovulation_date: ovulation_date,
      ovulation_start_date: ovulation_start_date,
      ovulation_end_date: ovulation_end_date,
      totalcycledays: cycleLength,
      cycle_type: cycle_type,
      is_current: 0,
    };
    nextCycle.push(updatedValue);
  }

  console.log("last_current_cycle", nextCycle[0]);

  const obj = {
    Good: true,
    data: nextCycle,
  };
  return res.status(200).send(obj);
};

const Detail = async (req, res) => {
  var id = req.params.user_id,
    categories = await Menstrual.findOne({ user_id: id, is_current: 1 });
  if (categories) {
    res.json(categories);
  } else {
    const obj = {
      Good: false,
      data: "Un-Athunticated request",
    };
    return res.status(200).send(obj);
  }
};

const DaysLeft = async (req, res) => {
  var current_date = req.params.current_date;
  var user_id = req.params.user_id;

  var msg = "";
  var marray = ["1st", "2nd", "3rd", "4th", "5th"];
  var current_cycle = await Menstrual.find({ is_current: 1, user_id: user_id });
  var cycle_start_date = moment(
    current_cycle[0]?.start_date,
    "YYYY-MM-DD"
  ).format("YYYY-MM-DD");

  var cycle_end_date = moment(current_cycle[0]?.end_date, "YYYY-MM-DD").format(
    "YYYY-MM-DD"
  );
  var bleed_end_date = moment(
    current_cycle[0]?.bleed_end_date,
    "YYYY-MM-DD"
  ).format("YYYY-MM-DD");

  var start = moment(cycle_start_date, "YYYY-MM-DD");
  var end = moment(current_date, "YYYY-MM-DD");
  var diff = end.diff(start, "days");

  var cycleendate = moment(cycle_end_date, "YYYY-MM-DD");
  var leftdays = cycleendate.diff(end, "days");
  var lateDays = end.diff(cycleendate, "days");
  if (current_date < cycle_start_date) {
    msg = " ";
  }
  //  if(current_date >= cycle_start_date && current_date <= bleed_end_date){
  //     msg = marray[diff]+' day of the period';
  //  }
  if (diff < 5) {
    msg = marray[diff] + " day of period";
  } else if (diff >= 5 && diff <= 10) {
    // msg = leftdays + " days left in next period cycle";
    var odDays = 11 - diff;

    if (odDays === 1) {
      msg = "Ovulation in " + odDays + " day ";
    } else {
      msg = "Ovulation in " + odDays + " days ";
    }
  }
  // else if(diff >10 && diff <=11 ){
  else if (diff === 11) {
    msg = "High chances of pregnancy";
  }
  //else if(diff >11 && diff <=12 ){
  else if (diff === 12) {
    msg = "High chances of pregnancy";
  } else if (diff === 13) {
    msg = "Ovulation day";
  } else if (diff === 14) {
    msg = "High chances of pregnancy";
  } else if (diff === 15) {
    msg = "High chances of pregnancy";
  } else if (diff > 27 && lateDays > 0) {
    if (lateDays <= 5) {
      msg = marray[lateDays - 1] + " day of period";
    } else if (lateDays > 5 && lateDays <= 10) {
      // msg = leftdays + " days left in next period cycle";
      var odDayss = 11 - lateDays;
      if (odDayss === 1) {
        msg = "Ovulation in " + odDayss + " day ";
      } else {
        msg = "Ovulation in " + odDayss + " days ";
      }
    } else if (lateDays === 11) {
      msg = "High chances of pregnancy";
    }
    //else if(diff >11 && diff <=12 ){
    else if (lateDays === 12) {
      msg = "High chances of pregnancy";
    } else if (lateDays === 13) {
      msg = "Ovulation day";
    } else if (lateDays === 14) {
      msg = "High chances of pregnancy";
    } else if (lateDays === 15) {
      msg = "High chances of pregnancy";
    } else {
      var leftdays = 28 - lateDays;
      if (leftdays === 1) {
        msg = "Next cycle in " + leftdays + " day";
      } else if (leftdays > 5 && leftdays < 10) {
        msg = "Low chances of pregnancy";
      } else if (leftdays === 0) {
        msg = "Next cycle in 1 day";
      } else {
        msg = "Next cycle in " + leftdays + " days";
      }
    }
    // if (lateDays === 1) {
    //   msg = lateDays + " day late";
    // } else {
    //   msg = lateDays + " days late";
    // }
  } else {
    if (leftdays === 1) {
      msg = "Next cycle in " + leftdays + " day";
    } else if (leftdays > 5 && leftdays < 10) {
      msg = "Low chances of pregnancy";
    } else if (leftdays === 0) {
      msg = "Next cycle in 1 day";
    } else {
      msg = "Next cycle in " + leftdays + " days";
    }
  }
  //res.json(lateDays);
  //return;
  // console.log("asd".odDays);
  const newobj = {
    Good: true,
    data: { Message: msg },
  };

  res.json(msg);
};

const favBlog = async (req, res) => {
  const userID = req.params.userid;
  try {
    const customer = await Customer.findOne({ customerId: userID });
    const favBlogs = new Set(customer.favBlogs);
    if (!favBlogs.has(req.body.blogId)) {
      favBlogs.add(req.body.blogId);
      customer.favBlogs = Array.from(favBlogs);
      await customer.save();
      res.json({ message: "Blog added to customer successfully" });
    } else {
      res
        .status(400)
        .json({ message: "Blog already exists in customer's favorites" });
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const removeFavorite = async (req, res) => {
  try {
    const blogId = req.body.blogId;
    const updatedCount = await Customer.updateOne(
      { customerId: req.params.userid },
      { $pull: { favBlogs: blogId } }
    );

    res.status(200).json(`Unfavorited the blog`);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const getFavBlogbyUserID = async (req, res) => {
  const userID = req.params.userid;
  try {
    const customer = await Customer.findOne({ customerId: userID });

    const BlogPosts = await Posts.find({
      _id: { $in: customer.favBlogs },
    });

    const blogsData = BlogPosts.map((post) => ({
      _id: post._id,
      title: post.title,
      image: process.env.IMAGE_PATH_LINK + post.image,
    }));

    res.status(200).json(blogsData);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const getCustomerName = async (req, res) => {
  const userID = req.params.id;
  try {
    const customer = await Customer.findOne({ customerId: userID });
    res.status(200).json(customer.full_name);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const getCycleHistorybyUserID = async (req, res) => {
  const userID = req.params.userid;
  try {
    const userMenstrual = await Menstrual.find({ user_id: userID }).sort({
      is_current: -1,
    });
    let Data = [];
    for (let i = 0; i < userMenstrual.length; i++) {
      const element = userMenstrual[i];
      const obj = {
        _id: element._id,
        uniqueKey: element.user_id,
        cycleDay: element.totalcycledays,
        ovulation_date: element.ovulation_date,
        last_Mens_Start: element.bleed_start_date,
        last_Mens_End: element.bleed_end_date,
        ovulation_Window_Start: element.ovulation_start_date,
        ovulation_Window_End: element.ovulation_end_date,
        cycle_type: element.cycle_type,
        is_current: element.is_current,
      };
      Data.push(obj);
    }
    res.status(200).json(Data);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const getCycleHistoryLast3byUserID = async (req, res) => {
  const userID = req.params.userid;
  try {
    const userMenstrual = await Menstrual.find({ user_id: userID })
      .sort({ end_date: -1 })
      .limit(3);
    let Data = [];
    for (let i = 0; i < userMenstrual.length; i++) {
      const element = userMenstrual[i];
      const obj = {
        _id: element._id,
        uniqueKey: element.user_id,
        cycleDay: element.totalcycledays,
        ovulation_date: element.ovulation_date,
        last_Mens_Start: element.start_date,
        last_Mens_End: element.end_date,
        ovulation_Window_Start: element.ovulation_start_date,
        ovulation_Window_End: element.ovulation_end_date,
        is_current: element.is_current,
      };
      Data.push(obj);
    }
    res.status(200).json(Data);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const changeUsersStatus = async (req, res) => {
  const userID = req.params.userId;
  try {
    const customer = await Customer.findOne({ customerId: userID });

    if (!customer) {
      return res.status(404).json({
        success: false,
        error: "Customer not found",
      });
    }

    customer.isActive = !customer.isActive;
    await customer.save();

    res.status(200).json(customer);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const addSymptons = async (req, res) => {
  console.log("Hi");
  var user_id = req.params.user_id;
  var current_date = req.body.current_date;
  var symptons = req.body.sympton;
  const iddd = await UserSymptoms.find().sort({ id: -1 }).limit(1);

  let idd = 0;
  if (iddd.length > 0 && iddd[0].id) {
    idd = iddd[0].id;
  }

  var incId = idd + 1;
  var updatedValue = {
    id: incId,
    user_id: user_id,
    current_date: current_date,
    sympton: symptons,
  };
  // return res.json(updatedValue)
  const categories = await UserSymptoms.create(updatedValue);

  if (categories) {
    const newObj = {
      Good: true,
      data: "Record added successfully",
    };

    const customer = await Customer.findOne({ customerId: user_id });
    console.log("customer", customer);
    let ttk = [];
    const tok = customer.token;
    ttk.push(tok);

    const pushMessg = "Symptom marked successfully!";
    const NotificationMessage = "Symptom marked successfully!";
    createNotificationBack(user_id, NotificationMessage);
    exposendPushNotification(ttk, pushMessg);

    res.json(newObj);
  } else {
    const obj = {
      Good: false,
      data: "Un-Athunticated request",
    };
    return res.status(200).send(obj);
  }
};

const showSymptons = async (req, res) => {
  try {
    var filter = {
      user_id: req.params.user_id,
      current_date: req.body.current_date,
    };

    const userSymptoms = await UserSymptoms.find(filter);

    let Data = [];
    if (userSymptoms.length > 0) {
      for (let index = 0; index < userSymptoms.length; index++) {
        const symptoms = await Symptoms.find({
          name: userSymptoms[index].sympton,
        });
        const element = symptoms[0];
        const obj = {
          id: element._id,
          subCategoryId: 0,
          subCategoryName: element.name,
          dateAndTime: req.body.current_date,
          imageUrl: process.env.IMAGE_PATH_LINK + element.image,
        };
        Data.push(obj);
      }
    }
    res.json(Data);
  } catch (error) {
    res.status(500).json(error.message);
  }
};
const getSymptoms = async (req, res) => {
  try {
    const symptoms = await Symptoms.find();
    let data = [];
    for (let index = 0; index < symptoms.length; index++) {
      const element = symptoms[index];

      let imageBulk = [];
      for (let j = 0; j < element.story.length; j++) {
        const element_new = element.story[j];
        const obj = {
          id: j + 1,
          subCategoryId: element._id,
          imageUrl: process.env.IMAGE_PATH_LINK + element_new,
        };

        imageBulk.push(obj);
      }
      const obj = {
        id: element._id,
        categoryName: element.category,
        name: element.name,
        imageUrl: process.env.IMAGE_PATH_LINK + element.image,
        bulkImage: imageBulk,
      };
      data.push(obj);
    }

    res.send(data);
  } catch (err) {
    res.status(500).send(err);
  }
};

const periodDateChecker = async (req, res) => {
  try {
    const { customerId, date } = req.body;
    const menstrualData = await Menstrual.findOne({ user_id: customerId });
    const bleedStartDate = new Date(menstrualData.bleed_start_date);
    const bleedEndDate = new Date(menstrualData.bleed_end_date);
    const ovulationStartDate = new Date(menstrualData.ovulation_start_date);
    const ovulationEndDate = new Date(menstrualData.ovulation_end_date);
    const ovulationDate = new Date(menstrualData.ovulation_date);
    const queryDate = new Date(date);

    if (queryDate >= bleedStartDate && queryDate <= bleedEndDate) {
      const bleedDay =
        Math.floor(
          (queryDate.getTime() - bleedStartDate.getTime()) /
            (1000 * 60 * 60 * 24)
        ) + 1;
      res.send(`Bleeding Day ${bleedDay}`);
    } else if (
      queryDate >= ovulationStartDate &&
      queryDate <= ovulationEndDate &&
      queryDate.getTime() !== ovulationDate.getTime()
    ) {
      const ovulationDay =
        Math.floor(
          (queryDate.getTime() - ovulationStartDate.getTime()) /
            (1000 * 60 * 60 * 24)
        ) + 1;
      res.send(`Ovulation Day ${ovulationDay}`);
    } else if (queryDate.getTime() === ovulationDate.getTime()) {
      res.send("Ovulation Day");
    } else {
      res.send(null);
    }
  } catch (err) {
    res.status(500).send("Server error");
  }
};

const getAllBlogs = async (req, res) => {
  const { title, category, page, limit } = req.query;

  const queryObject = {};
  if (title) {
    queryObject.$or = [{ title: { $regex: `${title}`, $options: "i" } }];
  }
  if (category) {
    queryObject.category = { $regex: category, $options: "i" };
  }

  const pages = Number(page);
  const limits = Number(limit);
  const skip = (pages - 1) * limits;
  try {
    const posts = await Posts.find(queryObject).sort({ _id: -1 });
    // .skip(skip)
    // .limit(limits);

    let blogsData = [];

    for (let i = 0; i < posts.length; i++) {
      const element = posts[i];
      const object = {
        _id: element._id,
        title: element.title,
        image: process.env.IMAGE_PATH_LINK + element.image,
      };
      blogsData.push(object);
    }

    res.send({
      blogsData,
      limits,
      pages,
    });
  } catch (err) {
    res.status(500).send({
      message: err.message,
    });
  }
};

// const getAllProducts = async (req, res) => {
//   const { category, page, limit } = req.query;
//   const queryObject = {};

//   if (category) {
//     queryObject.productCategory = {
//       $regex: category,
//       $options: "i",
//     };
//   }

//   const pages = Number(page);
//   const limits = Number(limit);
//   const skip = (pages - 1) * limits;

//   try {
//     const products = await Product.find(queryObject)
//       // .find({ status: "Published" })
//       .sort({ _id: 1 })
//       .skip(skip)
//       .limit(limits);

//     let productsData = [];

//     for (let i = 0; i < products.length; i++) {
//       const element = products[i];
//       const object = {
//         status: element.status,
//         _id: element._id,
//         productName: element.productName,
//         sku: element.sku,
//         description: element.description,
//         pieces: element.pieces,
//         price: element.price,
//         salePrice: element.salePrice,
//         productImage: element.productImage.map(
//           (el) => process.env.IMAGE_PATH_LINK + el
//         ),
//         productCategory: element.productCategory,
//         createdAt: element.createdAt,
//         updatedAt: element.updatedAt,
//       };
//       productsData.push(object);
//     }
//     res.send({
//       productsData,
//       limits,
//       pages,
//     });
//   } catch (err) {
//     res.status(500).send({
//       message: err.message,
//     });
//   }
// };

const getAllProducts = async (req, res) => {
  const { category, page, limit } = req.query;
  const queryObject = {};

  if (category) {
    queryObject.productCategory = {
      $regex: category,
      $options: "i",
    };
  }

  const pages = Number(page);
  const limits = Number(limit);
  const skip = (pages - 1) * limits;

  try {
    const products = await Product.find(queryObject)
      .sort({ _id: 1 })
      .skip(skip)
      .limit(limits);

    let productsData = [];

    for (let i = 0; i < products.length; i++) {
      const element = products[i];
      const object = {
        status: element.status,
        _id: element._id,
        productName: element.productName,
        sku: element.sku,
        description: element.description,
        pieces: element.pieces,
        price: element.price,
        salePrice: element.salePrice,
        productImage: element.productImage.map(
          (el) => process.env.IMAGE_PATH_LINK + el
        ),
        productCategory: element.productCategory,
        createdAt: element.createdAt,
        updatedAt: element.updatedAt,
      };

      const reviews = await Review.find({
        productId: element._id,
        isApproved: true,
      });

      console.log(reviews);

      // Calculate the average star rating
      const totalStars = reviews.reduce((sum, review) => sum + review.stars, 0);
      const averageRating = totalStars / reviews.length;

      object.reviews = reviews.length;
      object.averageRating = averageRating;

      productsData.push(object);
    }

    res.send({
      productsData,
      limits,
      pages,
    });
  } catch (err) {
    res.status(500).send({
      message: err.message,
    });
  }
};

const couponCheck = async (req, res) => {
  try {
    const { code, ammount, customerId } = req.body;

    const customer = await Customer.findOne({ customerId: customerId });

    Coupon.findOne({ couponCode: code }, (err, coupon) => {
      const endDate = coupon?.endTime;
      const today = new Date();
      if (err) {
        console.log("Coupon not found");
        return res.status(400).json({ error: "Coupon not found" });
      } else {
        if (coupon?.status !== true) {
          console.log("Coupon is not active");
          return res.status(400).json({ error: "Coupon is not active" });
        }
        if (endDate < today) {
          console.log("Coupon is not active");
          return res.status(400).json({ error: "Coupon is not active" });
        }
        if (coupon?.totalUsed >= coupon?.maximumUsage) {
          console.log("Coupon usage limit reached");
          return res.status(400).json({ error: "Coupon usage limit reached" });
        }
        if (coupon?.minimumAmount >= ammount) {
          console.log("Coupon is not active");
          return res.status(400).json({ error: "Coupon is not active" });
        }
        if (coupon?.multi) {
          if (customer?.applyedCoupon.some((el) => el === code)) {
            coupon.totalUsed += 1;
            if (coupon?.totalUsed === coupon?.maximumUsage)
              coupon.status = "inactive";
            coupon.save((err, updatedCoupon) => {
              if (err) {
                console.log("Coupon update failed");
                return res.status(400).json({ error: "Coupon update failed" });
              }
              return res.json({
                message: "Coupon used successfully",
                updatedCoupon,
              });
            });
          } else {
            coupon.totalUsed += 1;
            if (coupon?.totalUsed === coupon?.maximumUsage)
              coupon.status = "inactive";
            coupon.save((err, updatedCoupon) => {
              if (err) {
                console.log("Coupon update failed");
                return res.status(400).json({ error: "Coupon update failed" });
              }
              return res.json({
                message: "Coupon used successfully",
                updatedCoupon,
              });
            });
          }
        } else {
          if (customer?.applyedCoupon.some((el) => el === code)) {
            return res.status(400).json({ error: "Coupon is not active" });
          } else {
            coupon.totalUsed += 1;
            if (coupon?.totalUsed === coupon?.maximumUsage)
              coupon.status = "inactive";
            coupon.save((err, updatedCoupon) => {
              if (err)
                return res.status(400).json({ error: "Coupon update failed" });
              return res.json({
                message: "Coupon used successfully",
                updatedCoupon,
              });
            });
          }
        }
      }
    });
  } catch (err) {
    res.status(500).send({
      message: err.message,
    });
  }
};

const symptonsDates = async (req, res) => {
  var user_id = req.params.user_id;
  var msg = "";
  var marray = ["1st", "2nd", "3rd", "4th", "5th"];
  var current_cycle = await Menstrual.find({
    is_current: 1,
    user_id: user_id,
  });
  var cycle_start_date = moment(
    current_cycle[0].start_date,
    "YYYY-MM-DD"
  ).format("YYYY-MM-DD");

  var cycle_end_date = moment(current_cycle[0].end_date, "YYYY-MM-DD").format(
    "YYYY-MM-DD"
  );
  var bleed_end_date = moment(
    current_cycle[0].bleed_end_date,
    "YYYY-MM-DD"
  ).format("YYYY-MM-DD");

  var start = moment(cycle_start_date, "YYYY-MM-DD");
  var end = moment(cycle_end_date, "YYYY-MM-DD");
  var diff = end.diff(start, "days");

  var cycleendate = moment(cycle_end_date, "YYYY-MM-DD");
  var leftdays = cycleendate.diff(end, "days");
  var j = 0;
  var dt = [];
  for (var i = 1; i <= diff; i++) {
    if (i > 1) {
      j = i;
    }
    var std = moment(current_cycle[0].start_date)
      .add(j, "days")
      .format("YYYY-MM-DD");
    const iddd = await UserSymptoms.find({
      user_id: user_id,
      current_date: std,
    });
    if (iddd.length > 0) {
      dt.push(std);
    }
  }
  const newobj = {
    Good: true,
    data: dt,
  };

  res.json(newobj);
};

const addAddress = async (req, res) => {
  try {
    // Step 1: Find all addresses with the same customerId where isDefault is true
    const customerId = req.body.customerId;

    // Find all addresses with the same customerId where isDefault is true
    const previousDefaultAddresses = await Address.find({
      customerId: customerId,
      isDefault: true,
    });

    // Step 2: Update the isDefault field to false for all previous default addresses
    await Promise.all(
      previousDefaultAddresses.map(async (address) => {
        address.isDefault = false;
        await address.save();
      })
    );

    // Step 3: Create the new address with the provided data and set isDefault to true
    const address = new Address({
      customerId: customerId,
      name: req.body.name,
      address: req.body.address,
      city: req.body.city,
      state: req.body.state,
      zipCode: req.body.zipCode,
      country: req.body.country,
      email: req.body.email,
      contact: req.body.contact,
      isDefault: true, // Set the new address as the default
    });

    await address.save();
    res.send("Address Added successfully");
  } catch (err) {
    res.status(500).send({
      message: err.message,
    });
  }
};

const getAddress = async (req, res) => {
  try {
    const customerAddress = await Address.find({
      customerId: req.params.user_id,
    });
    res.send(customerAddress);
  } catch (err) {
    res.status(500).send({
      message: err.message,
    });
  }
};

const getAddressById = async (req, res) => {
  try {
    const customerAddress = await Address.findById(req.params.id);
    res.send(customerAddress);
  } catch (err) {
    res.status(500).send({
      message: err.message,
    });
  }
};

const updateAddressById = async (req, res) => {
  try {
    const customerAddress = await Address.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
      }
    );
    res.send(customerAddress);
  } catch (err) {
    res.status(500).send({
      message: err.message,
    });
  }
};

const changeAddressStatus = async (req, res) => {
  try {
    const { userId, addressId } = req.body;

    // Find all addresses belonging to the specified user
    const customerAddresses = await Address.find({
      customerId: userId,
    });

    // Set the isDefault property of all customer addresses to false
    customerAddresses.forEach((address) => {
      address.isDefault = false;
      address.save();
    });

    // Find the address with the specified ID
    const address = await Address.findById(addressId);

    if (!address) {
      return res.status(404).json({ message: "Address not found" });
    }

    // Set the isDefault property of the specified address to true
    address.isDefault = true;
    await address.save();

    return res
      .status(200)
      .json({ message: "Address status updated successfully" });
  } catch (err) {
    res
      .status(500)
      .json({ success: false, message: "Failed to update address status" });
  }
};

const getDefaultAddress = async (req, res) => {
  const userId = req.params.user_id;
  try {
    const customerAddresses = await Address.findOne({
      customerId: userId,
      isDefault: true,
    });
    res.send(customerAddresses);
  } catch (err) {
    res.status(500).send({
      message: err.message,
    });
  }
};

const getActiveCities = async (req, res) => {
  try {
    const cities = await Cities.find({ isActive: true }).sort({ label: 1 });

    res.send(cities);
  } catch (err) {
    res.status(500).json(err.message);
  }
};

const addPreviousCycle = async (req, res) => {
  const iddd = await Menstrual.find().sort({ id: -1 }).limit(1);

  let idd = 0;
  if (iddd.length > 0 && iddd[0].id) {
    idd = iddd[0].id;
  }
  const cycleLength = 28;
  var incId = idd + 1;

  var dt = req.body.start_date;
  var edt = req.body.end_date;
  var user_id = req.body.user_id;

  var start_date = moment(dt, "DD/MM/YYYY").format("YYYY-MM-DD"); //req.body.start_date;
  var end_date = moment(edt, "DD/MM/YYYY").format("YYYY-MM-DD");

  var last_current_cycle = await Menstrual.find({ is_current: 1 });

  var bleed_start_date = start_date;
  var bleed_end_date = end_date;
  var totalcycledays = moment(end_date, "YYYY-MM-DD").diff(
    moment(start_date, "YYYY-MM-DD"),
    "days"
  );
  var cycle_type = "normal";
  if (totalcycledays < 21 || totalcycledays > 35) {
    cycle_type = "abnormal";
  }
  var updatedValue = {
    id: incId,
    user_id: user_id,
    start_date: start_date,
    end_date: end_date,
    bleed_start_date: bleed_start_date,
    bleed_end_date: bleed_end_date,
    totalcycledays: totalcycledays + 1,
    cycle_type: cycle_type,
    is_current: 0,
  };
  const categories = await Menstrual.create(updatedValue);
  if (categories) {
    const newObj = {
      Good: true,
      data: "Record has Been Updated",
    };
    res.json(newObj);
  } else {
    const obj = {
      Good: false,
      data: "Un-Athunticated request",
    };
    return res.status(200).send(obj);
  }
};

const getAllUserOrder = async (req, res) => {
  const { userid } = req.params;
  try {
    const orders = await Order.find({ userId: userid }).sort({ createdAt: -1 });

    res.send(orders);
  } catch (err) {
    res.status(500).send({
      message: err.message,
    });
  }
};

const getOrderById = async (req, res) => {
  try {
    const order = await Order.findOne({ orderId: req.params.id });
    res.send(order);
  } catch (err) {
    res.status(500).send({
      message: err.message,
    });
  }
};

const getUserById = async (req, res) => {
  try {
    const customer = await Customer.findOne({ customerId: req.params.id });
    res.send(customer);
  } catch (err) {
    res.status(500).send({
      message: err.message,
    });
  }
};

const checkSubscrtiption = async (req, res) => {
  try {
    const subscription = await Subscription.find({
      userId: req.params.userId,
      status: true,
    });

    if (subscription.length === 0) {
      res.send(false);
    } else {
      res.send(true);
    }
  } catch (err) {
    res.status(500).send({
      message: err.message,
    });
  }
};

const getSubscrtiption = async (req, res) => {
  try {
    const subscription = await Subscription.findOne({
      userId: req.params.userId,
      status: true,
    });

    res.send(subscription);
  } catch (err) {
    res.status(500).send({
      message: err.message,
    });
  }
};

const editSubscription = async (req, res) => {
  try {
    console.log(req.body);
    const { userId, subscriptionType, products, lastOrderDate } = req.body;

    // Check if subscription exists
    const subscription = await Subscription.findById(req.params.id);
    if (!subscription) {
      return res.status(404).json({ message: "Subscription not found" });
    }

    // Check if user is authorized to update subscription
    if (subscription.userId !== userId) {
      return res
        .status(401)
        .json({ message: "Not authorized to update subscription" });
    }

    // Update subscription details
    subscription.subscriptionType = subscriptionType;
    subscription.products = products;
    subscription.lastOrderDate = lastOrderDate;

    // Calculate next order date based on subscription type
    if (subscriptionType !== subscription.subscriptionType) {
      subscription.subscriptionType = subscriptionType;
      subscription.nextOrderDate = calculateNextOrderDate(subscriptionType);
    } else {
      subscription.nextOrderDate = calculateNextOrderDate(
        subscription.subscriptionType
      );
    }

    // Save updated subscription to database
    const updatedSubscription = await subscription.save();

    const customer = await Customer.findOne({ customerId: userId });
    console.log("customer", customer);
    let ttk = [];
    const tok = customer.token;
    ttk.push(tok);

    const message = "You've successfully updated your\nsubscribed plan!";
    createNotificationBack(userId, message);
    exposendPushNotification(ttk, message);

    res.status(200).json({
      message: "Subscription updated successfully",
      subscription: updatedSubscription,
    });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};

const calculateNextOrderDate = (subscriptionType) => {
  const today = new Date();
  let nextOrderDate;

  switch (subscriptionType) {
    case "Monthly":
      nextOrderDate = new Date(today.getFullYear(), today.getMonth() + 1, 1);
      break;
    case "Bimonthly":
      const currentMonth = today.getMonth();
      const nextMonth = currentMonth + 2 > 11 ? 0 : currentMonth + 2;
      const year =
        nextMonth === 0 ? today.getFullYear() + 1 : today.getFullYear();
      nextOrderDate = new Date(year, nextMonth, 1);
      break;
    case "Quarterly":
      const currentQuarter = Math.floor(today.getMonth() / 3) + 1;
      const nextQuarter = currentQuarter + 1 > 4 ? 1 : currentQuarter + 1;
      const nextYear =
        nextQuarter === 1 ? today.getFullYear() + 1 : today.getFullYear();
      nextOrderDate = new Date(nextYear, (nextQuarter - 1) * 3, 1);
      break;
    default:
      throw new Error("Invalid subscription type");
  }

  // Set next order date to the last day of the month/quarter
  nextOrderDate.setDate(nextOrderDate.getDate() - 1);

  return nextOrderDate.toLocaleDateString();
};

const changeSubscriptionStatus = async (req, res) => {
  const subscriptionId = req.params.id;

  console.log("HELLO!!");
  console.log("req.params.id", subscriptionId);

  try {
    const subscription = await Subscription.findById(subscriptionId);

    // console.log("subscription", subscription);

    if (!subscription) {
      return res.status(404).json({ message: "Subscription not found" });
    }

    subscription.status = false;
    await subscription.save();

    const customer = await Customer.findOne({
      customerId: subscription.userId,
    });
    let token = [];
    const tok = customer.token;

    // console.log("customer", customer);

    token.push(tok);
    // console.log("token", token);

    const pushMessg = "You've successfully un-subscribed from auto-repeat plan";
    const NotificationMessage =
      "You've successfully un-subscribed from\nauto-repeat plan";
    exposendPushNotification(token, pushMessg);
    createNotificationBack(subscription.userId, NotificationMessage);

    return res.status(200).json({
      message: "Subscription status updated successfully",
      subscription,
    });
  } catch (error) {
    return res.status(500).json({ message: "Internal server error" });
  }
};

const couponAddtoCustomers = async (req, res) => {
  try {
    const { coupons, customeId } = req.body;

    const customer = await Customer.findOne({ customerId: customeId });

    console.log(customer);
    if (customer) {
      customer.applyedCoupon = [...customer.applyedCoupon, coupons];
      await customer.save();
      res.send({ message: "Coupon Added Successfully!" });
    }
  } catch (error) {
    return res.status(500).json({ message: "Internal server error" });
  }
};

const getActivePromotions = async (req, res) => {
  try {
    const propmotion = await Promotion.findOne({ isActive: true });

    res.status(200).json(propmotion);
  } catch (err) {
    res.status(500).send({
      message: err.message,
    });
  }
};

const editProfile = async (req, res) => {
  try {
    const { name, date } = req.body;
    const { customerId } = req.params;

    const customer = await Customer.findOne({ customerId: customerId });

    if (!customer) {
      return res.status(404).send({
        message: "Customer not found",
      });
    }

    customer.full_name = name;
    customer.dob = date;

    await customer.save();

    let token = [];
    const tok = customer.token;
    token.push(tok);

    const message = "Profile information updated!";
    exposendPushNotification(token, message);
    createNotificationBack(customerId, message);

    res.status(200).send({
      message: "Profile updated successfully",
      customer: customer,
    });
  } catch (error) {
    res.status(500).send({
      message: err.message,
    });
  }
};

const submitReview = async (req, res) => {
  try {
    const { comment, stars, customerId, productId } = req.body;

    const body = {
      comment: comment,
      stars: stars,
      customerId: customerId,
      productId: productId,
    };

    const newReview = new Review(body);

    const customer = await Customer.findOne({ customerId: customerId });
    console.log("customer", customer);
    let token = [];
    const tok = customer.token;
    token.push(tok);

    await newReview.save();

    res.status(200).json({ message: "Review Submitted" });
    const pushMessg = "Your review is submitted!";
    const NotificationMessage = "Your review is submitted!";
    exposendPushNotification(token, pushMessg);
    createNotificationBack(customerId, NotificationMessage);
  } catch (error) {
    res.status(500).send({
      message: error.message,
    });
  }
};

const getAllReviesofProduct = async (req, res) => {
  try {
    const { productId } = req.params;

    console.log("productId", productId);

    const revies = await Review.find({
      productId: productId,
      isApproved: true,
    });

    let data = [];

    for (let i = 0; i < revies.length; i++) {
      console.log(revies[i].customerId);
      const element = revies[i];

      const customers = await Customer.findOne({
        customerId: element.customerId,
      });

      console.log("customers", customers);

      let obj = {
        comment: element.comment,
        stars: element.stars,
        userName: customers.full_name,
        createdAt: moment(element.createdAt).format("DD/MMM/YYYY"),
      };
      data.push(obj);
    }
    console.log("data", data);

    res.status(200).json(data);
  } catch (error) {
    res.status(500).send({
      message: error.message,
    });
  }
};

const trackActivity = async (req, res) => {
  console.log(req.body);
  try {
    const { userId, action, timestamp } = req.body;
    const activityLog = new ActivityLog({
      userId,
      action,
      timestamp,
    });
    activityLog
      .save()
      .then(() => {
        res.status(200);
      })
      .catch((error) => {
        res.status(500).json({ error: "Failed to track activity" });
      });
  } catch (error) {
    res.status(500).send(error.message);
  }
};

const getActivityTracker = async (req, res) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0); // Set time to midnight

  const twentyFourHoursAgo = new Date(today);
  twentyFourHoursAgo.setDate(twentyFourHoursAgo.getDate() - 1);

  ActivityLog.distinct("userId", {
    timestamp: { $gte: twentyFourHoursAgo, $lt: today },
  })
    .then((uniqueUserIds) => {
      const dauCount = uniqueUserIds.length;
      console.log("DAU:", dauCount);

      const dailyDAU = new DailyDAU({
        date: today,
        count: dauCount,
      });

      dailyDAU
        .save()
        .then(() => {
          console.log("DAU count saved successfully");
        })
        .catch((error) => {
          console.error("Failed to save DAU count:", error);
        });

      res.status(200).send(dailyDAU);
    })
    .catch((error) => {
      res.status(500).send(error);
      console.error("Failed to calculate DAU:", error);
    });
};

const trackScreen = async (req, res) => {
  try {
    const { userId, screenName, eventName } = req.body;

    console.log(userId);

    const trackingData = new ActivityLog({ userId, screenName, eventName });
    trackingData.save();
    res.status(200).send("Data Recorded");
  } catch (error) {
    res.status(500).send(error);
  }
};

module.exports = {
  trackScreen,
  editProfile,
  couponCheck,
  getPostsByCategory,
  getAllCategory,
  getPostsById,
  GetPostsBySingleCategory,
  Customerlogin,
  CustomersLastPeriodEnd,
  getProductByCategory,
  getProductsById,
  addNewOrder,
  getProductAll,
  createSubscription,
  deleteUser,
  createMenstrualCycle,
  nextCycle,
  Detail,
  Get,
  DaysLeft,
  favBlog,
  getFavBlogbyUserID,
  removeFavorite,
  getCycleHistorybyUserID,
  getCycleHistoryLast3byUserID,
  changeUsersStatus,
  addSymptons,
  showSymptons,
  getSymptoms,
  login,
  addLastPeriodDate,
  periodDateChecker,
  getAllBlogs,
  getAllProductsCategories,
  getAllProducts,
  symptonsDates,
  addAddress,
  getAddress,
  changeAddressStatus,
  getDefaultAddress,
  getActiveCities,
  getAddressById,
  updateAddressById,
  addPreviousCycle,
  getAllUserOrder,
  getOrderById,
  checkSubscrtiption,
  getSubscrtiption,
  editSubscription,
  changeSubscriptionStatus,
  getCustomerName,
  couponAddtoCustomers,
  getUserById,
  getActivePromotions,
  submitReview,
  getAllReviesofProduct,
};
