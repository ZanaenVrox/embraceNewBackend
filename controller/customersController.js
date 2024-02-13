require("dotenv").config();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/Customers");
const Orders = require("../models/Order");
const UserSymtonss = require("../models/UserSymptoms");
const Usercycle = require("../models/Menstrual");

const { signInToken, tokenForVerify, sendEmail } = require("../config/auth");

const verifyEmailAddress = async (req, res) => {
  const isAdded = await User.findOne({ email: req.body.email });
  if (isAdded) {
    return res.status(403).send({
      message: "This Email already Added!",
    });
  } else {
    const token = tokenForVerify(req.body);
    const body = {
      from: "noreply@embracecomfort.com",
      to: `${req.body.email}`,
      subject: "Email Activation",
      subject: "Verify Your Email",
      html: `<h2>Hello ${req.body.email}</h2>
      <p>Verify your email address to complete the signup and login into your <strong>KachaBazar</strong> account.</p>

        <p>This link will expire in <strong> 15 minute</strong>.</p>

        <p style="margin-bottom:20px;">Click this link for active your account</p>

        <a href=${process.env.STORE_URL}/user/email-verification/${token} style="background:#22c55e;color:white;border:1px solid #22c55e; padding: 10px 15px; border-radius: 4px; text-decoration:none;">Verify Account</a>

        <p style="margin-top: 35px;">If you did not initiate this request, please contact us immediately at support@kachabazar.com</p>

        <p style="margin-bottom:0px;">Thank you</p>
        <strong>Kachabazar Team</strong>
             `,
    };

    const message = "Please check your email to verify!";
    sendEmail(body, res, message);
  }
};

const registerUser = async (req, res) => {
  const token = req.params.token;
  const { name, email, password } = jwt.decode(token);
  const isAdded = await User.findOne({ email: email });

  let currentInvoiceNumber = 10000;

  if (isAdded) {
    const token = signInToken(isAdded);
    return res.send({
      token,
      name: isAdded.name,
      email: isAdded.email,
      message: "Email Already Verified!",
    });
  }

  if (token) {
    jwt.verify(token, process.env.JWT_SECRET_FOR_VERIFY, (err, decoded) => {
      if (err) {
        return res.status(401).send({
          message: "Token Expired, Please try again!",
        });
      } else {
        const newUser = new User({
          first_name,
          last_name,
          Street,
          Appartments,
          country,
          postalcode,
          city,
          email,
          phone,
          notes,
          password: bcrypt.hashSync(password),
          customerId: ++currentInvoiceNumber,
        });
        newUser.save();
        const token = signInToken(newUser);
        res.send({
          token,
          _id: newUser._id,
          name: newUser.name,
          email: newUser.email,
          message: "Email Verified, Please Login Now!",
        });
      }
    });
  }
};

const loginUser = async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.registerEmail });

    if (
      user &&
      user.password &&
      bcrypt.compareSync(req.body.password, user.password)
    ) {
      const token = signInToken(user);
      res.send({
        token,
        _id: user._id,
        first_name: user.first_name,
        last_name: user.last_name,
        Street: user.Street,
        Appartments: user.Appartments,
        country: user.country,
        postalcode: user.postalcode,
        city: user.city,
        email: user.email,
        phone: user.phone,
        notes: user.notes,
      });
    } else {
      res.status(401).send({
        message: "Invalid user or password!",
      });
    }
  } catch (err) {
    res.status(500).send({
      message: err.message,
    });
  }
};

const forgetPassword = async (req, res) => {
  const isAdded = await User.findOne({ email: req.body.verifyEmail });
  if (!isAdded) {
    return res.status(404).send({
      message: "User Not found with this email!",
    });
  } else {
    const token = tokenForVerify(isAdded);
    const body = {
      from: "noreply@embracecomfort.com",
      to: `${req.body.verifyEmail}`,
      subject: "Password Reset",
      html: `<h2>Hello ${req.body.verifyEmail}</h2>
      <p>A request has been received to change the password for your <strong>Kachabazar</strong> account </p>

        <p>This link will expire in <strong> 15 minute</strong>.</p>

        <p style="margin-bottom:20px;">Click this link for reset your password</p>

        <a href=${process.env.STORE_URL}/user/forget-password/${token} style="background:#22c55e;color:white;border:1px solid #22c55e; padding: 10px 15px; border-radius: 4px; text-decoration:none;">Reset Password</a>

        <p style="margin-top: 35px;">If you did not initiate this request, please contact us immediately at support@kachabazar.com</p>

        <p style="margin-bottom:0px;">Thank you</p>
        <strong>Kachabazar Team</strong>
             `,
    };

    const message = "Please check your email to reset password!";
    sendEmail(body, res, message);
  }
};

const resetPassword = async (req, res) => {
  const token = req.body.token;
  const { email } = jwt.decode(token);
  const user = await User.findOne({ email: email });

  if (token) {
    jwt.verify(token, process.env.JWT_SECRET_FOR_VERIFY, (err, decoded) => {
      if (err) {
        return res.status(500).send({
          message: "Token expired, please try again!",
        });
      } else {
        user.password = bcrypt.hashSync(req.body.newPassword);
        user.save();
        res.send({
          message: "Your password change successful, you can login now!",
        });
      }
    });
  }
};

const changePassword = async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (!user.password) {
      return res.send({
        message:
          "For change password,You need to sign in with email & password!",
      });
    } else if (
      user &&
      bcrypt.compareSync(req.body.currentPassword, user.password)
    ) {
      user.password = bcrypt.hashSync(req.body.newPassword);
      await user.save();
      res.send({
        message: "Your password change successfully!",
      });
    } else {
      res.status(401).send({
        message: "Invalid email or current password!",
      });
    }
  } catch (err) {
    res.status(500).send({
      message: err.message,
    });
  }
};

const signUpWithProvider = async (req, res) => {
  try {
    const isAdded = await User.findOne({ email: req.body.email });
    if (isAdded) {
      const token = signInToken(isAdded);
      res.send({
        token,
        _id: isAdded._id,
        name: isAdded.name,
        email: isAdded.email,
        address: isAdded.address,
        phone: isAdded.phone,
        image: isAdded.image,
      });
    } else {
      const newUser = new User({
        name: req.body.name,
        email: req.body.email,
        image: req.body.image,
      });

      const user = await newUser.save();
      const token = signInToken(user);
      res.send({
        token,
        _id: user._id,
        name: user.name,
        email: user.email,
        image: user.image,
      });
    }
  } catch (err) {
    res.status(500).send({
      message: err.message,
    });
  }
};

const getAllUsers = async (req, res) => {
  try {
    const users = await User.find({}).sort({ _id: -1 });
    res.send(users);
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
};

const getUserById = async (req, res) => {
  try {
    const user = await User.findOne({ customerId: req.params.id });
    res.send(user);
  } catch (err) {
    res.status(500).send({
      message: err.message,
    });
  }
};

const updateUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (user) {
      user.name = req.body.name;
      user.email = req.body.email;
      user.address = req.body.address;
      user.phone = req.body.phone;
      user.image = req.body.image;
      const updatedUser = await user.save();
      const token = signInToken(updatedUser);
      res.send({
        token,
        _id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        address: updatedUser.address,
        phone: updatedUser.phone,
        image: updatedUser.image,
      });
    }
  } catch (err) {
    res.status(404).send({
      message: "Your email is not valid!",
    });
  }
};

const deleteUser = (req, res) => {
  User.deleteOne({ _id: req.params.id }, (err) => {
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

const getCustomerByCategory = async (req, res) => {
  try {
    const users = await User.find({});

    const filter = {};
    const customerWithOrders = await User.aggregate([
      { $match: filter },
      {
        $lookup: {
          from: "orders",
          //  pipeline: [{ $match: { date: { $gte: startDate, $lte: endDate } } }],
          localField: "customerId",
          foreignField: "userId",
          as: "orderCustomers",
        },
      },

      {
        $project: {
          customerId: 1,
          full_name: 1,
          Street: 1,
          Appartments: 1,
          country: 1,
          postalcode: 1,
          city: 1,
          email: 1,
          phone: 1,
          notes: 1,
          dob: 1,
          periodStartDate: 1,
          periodEndDate: 1,
          favBlogs: 1,
          usedCouponCode: 1,
          isActive: 1,
          token: 1,
          applyedCoupon: 1,
          createdAt: 1,
          "orderCustomers.userId": 1,
        },
      },
    ]);
    //res.json(customerWithOrders);return
    let customersWithOrders = [];
    let customersWithoutOrders = [];
    for (let j = 0; j < customerWithOrders.length; j++) {
      if (customerWithOrders[j].orderCustomers.length > 0) {
        customersWithOrders.push(customerWithOrders[j]);
      } else {
        customersWithoutOrders.push(customerWithOrders[j]);
      }
    }
    // for (let i = 0; i < users.length; i++) {
    //   let customer = users[i];
    //   for (let j = 0; j < customerWithOrders.length; j++) {
    //     let orderCustomer = customerWithOrders[j].orderCustomers;
    //     if (orderCustomer.length === 0) {
    //       customersWithoutOrders.push(customer);
    //     } else if (orderCustomer[0].customerId === customer.customerId) {
    //       customersWithOrders.push(customer);
    //     } else {
    //       break;
    //     }
    //   }
    // }

    // const uniqueCustomersWithoutOrders = new Set(customersWithoutOrders);
    // const uniqueCustomersWithOrders = new Set(customersWithOrders);

    // const customersWithoutOrdersArray = [...uniqueCustomersWithoutOrders];
    // const customersWithOrdersArray = [...uniqueCustomersWithOrders];
    const data = {
      customersWithOrders: customersWithOrders,
      customersWithoutOrders: customersWithoutOrders,
    };

    res.json(data);
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
};

const PercentagegetCustomerByCategory = async (req, res) => {
  try {
    const users = await User.find({}).countDocuments();

    const userSym = (await UserSymtonss.find({}).distinct("user_id")).length;
    const userCy = (await Usercycle.find({}).distinct("user_id")).length;
    // res.json(userSym);return
    const filter = {};
    const customerWithOrders = await User.aggregate([
      { $match: filter },
      {
        $lookup: {
          from: "orders",
          //  pipeline: [{ $match: { date: { $gte: startDate, $lte: endDate } } }],
          localField: "customerId",
          foreignField: "userId",
          as: "orderCustomers",
        },
      },

      {
        $project: {
          customerId: 1,
          full_name: 1,
          Street: 1,
          Appartments: 1,
          country: 1,
          postalcode: 1,
          city: 1,
          email: 1,
          phone: 1,
          notes: 1,
          dob: 1,
          periodStartDate: 1,
          periodEndDate: 1,
          favBlogs: 1,
          usedCouponCode: 1,
          isActive: 1,
          token: 1,
          applyedCoupon: 1,
          createdAt: 1,
          "orderCustomers.userId": 1,
        },
      },
    ]);

    let customersWithOrders = [];
    let customersWithoutOrders = [];
    for (let j = 0; j < customerWithOrders.length; j++) {
      if (customerWithOrders[j].orderCustomers.length > 0) {
        customersWithOrders.push(customerWithOrders[j]);
      } else {
        customersWithoutOrders.push(customerWithOrders[j]);
      }
    } //res.json(customersWithOrders );
    var customerOrderPercentage = (customersWithOrders.length / users) * 100;
    var customerwithoutOrderPercentage =
      (customersWithoutOrders.length / users) * 100;
    var customerwithSymtonsPercentage = (userSym / users) * 100;
    var customerwithcycePercentage = (userCy / users) * 100;
    const data = {
      customersWithOrders: Math.round(customerOrderPercentage),
      customerwithcyclePercentage: Math.round(customerwithcycePercentage),
      customerwithSymtons: Math.round(customerwithSymtonsPercentage),
    };

    res.json(data);
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
};
const inactvepercentage = async (req, res) => {
  try {
    const currentDate = new Date();
    const currentDate1 = new Date();
    currentDate.setMonth(currentDate.getMonth() - 3);
    const oldformattedDate = new Date(currentDate.toISOString());
    const users = await User.find({}).countDocuments();
    const userSym = await UserSymtonss.find({
      createdAt: {
        $gte: oldformattedDate,
        $lte: currentDate1,
      },
    }).distinct("user_id");
    const userOrders = await Orders.find({
      createdAt: {
        $gte: oldformattedDate,
        $lte: currentDate1,
      },
    }).distinct("userId");
    const usercy = await Usercycle.find({
      createdAt: {
        $gte: oldformattedDate,
        $lte: currentDate1,
      },
    }).distinct("user_id");
    const result = unionOfArrays(usercy, userOrders, userSym);
    // console.log(result);
    const uss = await User.find({ customerId: { $nin: result } });
    var inactiveUsers = (uss.length / users) * 100;
    const data = {
      inactiveusers: Math.round(inactiveUsers),
    };
    res.json(data);
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
};
function unionOfArrays(arr1, arr2, arr3) {
  // Concatenate the three arrays
  const combinedArray = arr1.concat(arr2, arr3);

  // Use a Set to remove duplicate values
  const uniqueValues = new Set(combinedArray);

  // Convert the Set back to an array
  const unionArray = Array.from(uniqueValues);

  return unionArray;
}

const graphPercentage = async (req, res) => {
  try {
    var start_date = req.query.start_date;
    var end_date = req.query.end_date;
    let calculatedData = [];
    let calculatedDatac = [];
    let calculatedDatao = [];

    let tableData = [];
    let nob = {};
    let mData = [];
    let mnData = [];
    const arr = [];
    const arrc = [];
    const mn = [
      "",
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];

    var stDate = new Date(start_date);
    var enDate = new Date(end_date);
    var filter = {
      createdAt: {
        $gte: stDate,
        $lte: enDate,
      },
    };
    var diffInMs = enDate.getTime() - stDate.getTime();

    var diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));
    // console.log("diff",diffInDays);
    //return;
    const users = await User.find(filter).countDocuments();
    const result = await UserSymtonss.aggregate([
      {
        $match: filter,
      },
      {
        $project: {
          user_id: 1,
          sympton: 1,
          year: { $year: "$createdAt" },
          month: { $month: "$createdAt" },
        },
      },

      {
        $group: {
          _id: {
            user_id: "$user_id",
            year: "$year",
            month: "$month",
          },
        },
      },
      {
        $group: {
          _id: "$_id.month",
          count: { $sum: 1 },
        },
      },
      { $sort: { count: -1 } },
    ]);
    //res.json(result);return;
    const er = [];
    var objjj = {};
    for (var t = 0; t < result.length; t++) {
      mData.push(mn[result[t]._id]);
      tableData.push(result[t]._id);
      var customerwithSymtonsPercentagef = Math.ceil(
        (result[t].count / users) * 100
      );

      arr.push(customerwithSymtonsPercentagef);
    }
    objjj = { name: "userwithsymtons", data: arr };

    // calculatedData.push(objjj)

    ////////////////// user cycle
    // const resultc = await Usercycle.aggregate([
    //   {
    //     $project: {
    //       month: { $month: "$createdAt" }
    //     }
    //   },
    //   {
    //     $match: {
    //       month: { $in: tableData },
    //     }
    //   },
    //   {
    //     $group: {
    //       _id: "$month",
    //       count: { $sum: 1 }
    //     }
    //   },

    // ])

    // const erc = [];
    // var objjjc = {};
    // for (var t = 0; t < resultc.length; t++) {

    //   var customerwithSymtonsPercentagefc = Math.ceil(((resultc[t].count)/users) * 100);

    //   arrc.push(customerwithSymtonsPercentagefc);
    // }
    // objjjc={"name":"userwithcycle",data:arrc}
    // calculatedData.push(objjjc)
    ///////////////////////////
    const obj = [
      objjj,
      {
        month: mData,
      },
    ];

    res.json(obj);
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
};
const graphpercentagecycle = async (req, res) => {
  try {
    var start_date = req.query.start_date;
    var end_date = req.query.end_date;
    let calculatedData = [];
    let calculatedDatac = [];
    let calculatedDatao = [];

    let tableData = [];
    let nob = {};
    let mData = [];
    let mnData = [];
    const arr = [];
    const arrc = [];
    const mn = [
      "",
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];

    var stDate = new Date(start_date);
    var enDate = new Date(end_date);
    var filter = {
      createdAt: {
        $gte: stDate,
        $lte: enDate,
      },
    };
    var diffInMs = enDate.getTime() - stDate.getTime();

    var diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));
    // console.log("diff",diffInDays);
    //return;
    const users = await User.find(filter).countDocuments();
    const result = await Usercycle.aggregate([
      {
        $match: filter,
      },
      {
        $project: {
          user_id: 1,
          sympton: 1,
          year: { $year: "$createdAt" },
          month: { $month: "$createdAt" },
        },
      },

      {
        $group: {
          _id: {
            user_id: "$user_id",
            year: "$year",
            month: "$month",
          },
        },
      },
      {
        $group: {
          _id: "$_id.month",
          count: { $sum: 1 },
        },
      },
      { $sort: { count: -1 } },
    ]);
    //res.json(result);return;
    const er = [];
    var objjj = {};
    for (var t = 0; t < result.length; t++) {
      mData.push(mn[result[t]._id]);
      tableData.push(result[t]._id);
      var customerwithSymtonsPercentagef = Math.ceil(
        (result[t].count / users) * 100
      );

      arr.push(customerwithSymtonsPercentagef);
    }
    objjj = { name: "userwithcycle", data: arr };

    

    
    const obj = [
      objjj,
      {
        month: mData,
      },
    ];

    res.json(obj);
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
};
const graphpercentageorders = async (req, res) => {
  try {
    var start_date = req.query.start_date;
    var end_date = req.query.end_date;
    let calculatedData = [];
    let calculatedDatac = [];
    let calculatedDatao = [];

    let tableData = [];
    let nob = {};
    let mData = [];
    let mnData = [];
    const arr = [];
    const arrc = [];
    const mn = [
      "",
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];

    var stDate = new Date(start_date);
    var enDate = new Date(end_date);
    var filter = {
      createdAt: {
        $gte: stDate,
        $lte: enDate,
      },
    };
    var diffInMs = enDate.getTime() - stDate.getTime();

    var diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));
    // console.log("diff",diffInDays);
    //return;
    const users = await User.find(filter).countDocuments();
    const result = await Orders.aggregate([
      {
        $match: filter,
      },
      {
        $project: {
          userId: 1,
          sympton: 1,
          year: { $year: "$createdAt" },
          month: { $month: "$createdAt" },
        },
      },

      {
        $group: {
          _id: {
            userId: "$userId",
            year: "$year",
            month: "$month",
          },
        },
      },
      {
        $group: {
          _id: "$_id.month",
          count: { $sum: 1 },
        },
      },
      { $sort: { count: -1 } },
    ]);
    //res.json(result);return;
    const er = [];
    var objjj = {};
    for (var t = 0; t < result.length; t++) {
      mData.push(mn[result[t]._id]);
      tableData.push(result[t]._id);
      var customerwithSymtonsPercentagef = Math.ceil(
        (result[t].count / users) * 100
      );

      arr.push(customerwithSymtonsPercentagef);
    }
    objjj = { name: "userwithorders", data: arr };

    

    
    const obj = [
      objjj,
      {
        month: mData,
      },
    ];

    res.json(obj);
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
};

module.exports = {
  loginUser,
  registerUser,
  signUpWithProvider,
  verifyEmailAddress,
  forgetPassword,
  changePassword,
  resetPassword,
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
  getCustomerByCategory,
  PercentagegetCustomerByCategory,
  inactvepercentage,
  graphPercentage,
  graphpercentagecycle,
  graphpercentageorders
};
