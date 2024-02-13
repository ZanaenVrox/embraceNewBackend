const dayjs = require("dayjs");
const axios = require("axios");
const Order = require("../models/Order");
const Customer = require("../models/Customers");
const {
  exposendPushNotification,
} = require("../pushnotifications/expoNotifications");
const { async } = require("@firebase/util");

require("dotenv").config();

// const getAllOrders = async (req, res) => {
//   const { email, status, page, limit, day, invoice, customers } = req.query;

//   let date = new Date();
//   const today = date.toString();
//   date.setDate(date.getDate() - Number(day));
//   const dateTime = date.toString();

//   const beforeToday = new Date();
//   beforeToday.setDate(beforeToday.getDate() - 1);

//   const queryObject = {};

//   if (email) {
//     queryObject.email = { $regex: `${email}`, $options: "i" };
//   }
//   if (customers) {
//     queryObject.$or = [
//       { firstName: { $regex: `${customers}`, $options: "i" } },
//       { lastName: { $regex: `${customers}`, $options: "i" } },
//     ];
//   }

//   if (invoice) {
//     queryObject.invoice = { $regex: `${invoice}`, $options: "i" };
//   }

//   if (day) {
//     queryObject.createdAt = { $gte: dateTime, $lte: today };
//   }

//   if (status) {
//     queryObject.status = { $regex: `${status}`, $options: "i" };
//   }

//   const pages = Number(page) || 1;
//   const limits = Number(limit) || 8;
//   const skip = (pages - 1) * limits;

//   try {
//     // total orders count
//     const totalDoc = await Order.countDocuments(queryObject);
//     // today order amount

//     // query for orders
//     const orders = await Order.find(queryObject)
//       .sort({ _id: -1 })
//       .skip(skip)
//       .limit(limits);

//     res.send({
//       orders,
//       limits,
//       pages,
//       totalDoc,
//     });
//   } catch (err) {
//     res.status(500).send({
//       message: err.message,
//     });
//   }
// };

// const getAllOrders = async (req, res) => {
//   try {
//     const orders = await Order.find({}).sort({ createdAt: -1 });

//     if (orders) {
//       const updatedOrders = [];
//       for (let i = 0; i < orders.length; i++) {
//         const orderTrackingNo = orders[i].trackingnumber;
//         const orderObj = { ...orders[i]._doc };
//         if (orderTrackingNo) {
//           await axios
//             .get(
//               `${process.env.SWIFTAPI_BASE_URL}/${process.env.SWIFT_API_KEY}/get-parcel-history/${orderTrackingNo}`,
//               {
//                 headers: {
//                   Authorization: `${process.env.SWIFT_API_AUTH_TOKEN}`,
//                   "Content-Type": "application/json",
//                 },
//               }
//             )
//             .then((response) => {
//               const responseData = response.data;
//               const currentStatus = responseData.length - 1;
//               orderObj.swiftStatus = responseData[currentStatus].status;
//               updatedOrders.push(orderObj);
//             });
//         } else {
//           updatedOrders.push(orderObj);
//         }
//       }
//       res.send(updatedOrders);
//     }
//   } catch (err) {
//     res.status(500).send({
//       message: err.message,
//     });
//   }
// };

const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find().sort({ _id: -1 });

    if (orders) {
      const updatedOrders = [];
      for (let i = 0; i < orders.length; i++) {
        const orderTrackingNo = orders[i].trackingnumber;
        const orderObj = { ...orders[i]._doc };
        // if (orderTrackingNo) {
        //   await axios
        //     .get(
        //       `${process.env.SWIFTAPI_BASE_URL}/${process.env.SWIFT_API_KEY}/get-parcel-history/${orderTrackingNo}`,
        //       {
        //         headers: {
        //           Authorization: `${process.env.SWIFT_API_AUTH_TOKEN}`,
        //           "Content-Type": "application/json",
        //         },
        //       }
        //     )
        //     .then((response) => {
        //       const responseData = response.data;
        //       const currentStatus = responseData.length - 1;
        //       orderObj.swiftStatus = responseData[currentStatus].status;
        //       updatedOrders.push(orderObj);
        //     });
        // } else {
        //   updatedOrders.push(orderObj);
        // }
        updatedOrders.push(orderObj);
      }
      res.send(updatedOrders);
    }
  } catch (err) {
    res.status(500).send({
      message: err.message,
    });
  }
};

const updateSwyftStatus = async (req, res) => {
  try {
    const orders = await Order.find().sort({ _id: -1 });

    if (orders) {
      const updatedOrders = [];
      for (let i = 0; i < orders.length; i++) {
        const orderTrackingNo = orders[i].trackingnumber;
        const orderObj = { ...orders[i]._doc };
        if (orderTrackingNo) {
         // res.json(orders[i]);return;
          await axios
            .get(
              `${process.env.SWIFTAPI_BASE_URL}/${process.env.SWIFT_API_KEY}/get-parcel-history/${orderTrackingNo}`,
              {
                headers: {
                  Authorization: `${process.env.SWIFT_API_AUTH_TOKEN}`,
                  "Content-Type": "application/json",
                },
              }
            )
            .then(async(response) => {
              const responseData = response.data;
              const currentStatus = responseData.length - 1;
              orderObj.swiftStatus = responseData[currentStatus].status;
              //updatedOrders.push(orderObj);
            // res.json(orders[i].orderId);return;
            var updatedValue = {
              swyft_status: responseData[currentStatus].status,
             };
             const categorieds = await Order.updateOne({orderId:orders[i].orderId}, {
              $set: updatedValue,
            });

            });
        } else {
         // updatedOrders.push(orderObj);
        }
      //  updatedOrders.push(orderObj);
      }
      res.send("data has been updated");
    }
  } catch (err) {
    res.status(500).send({
      message: err.message,
    });
  }
};

const updateSwyftOrderStatus = async (req, res) => {
  try {
   var order_id = req.params.oid;
   var tracking = req.params.tr;
   //const orders = await Order.find({orderId:order_id});
 var obj ={};
    if (order_id) {
      if (tracking) {
         // res.json(orders[i]);return;
          await axios
            .get(
              `${process.env.SWIFTAPI_BASE_URL}/${process.env.SWIFT_API_KEY}/get-parcel-history/${tracking}`,
              {
                headers: {
                  Authorization: `${process.env.SWIFT_API_AUTH_TOKEN}`,
                  "Content-Type": "application/json",
                },
              }
            )
            .then(async(response) => {
              const responseData = response.data;
              const currentStatus = responseData.length - 1;
             // orderObj.swiftStatus = responseData[currentStatus].status;
              //updatedOrders.push(orderObj);
            // res.json(orders[i].orderId);return;
            var updatedValue = {
              swyft_status: responseData[currentStatus].status,
             };
             const categorieds = await Order.updateOne({orderId:order_id}, {
              $set: updatedValue,
            });
            if(categorieds){
              obj.status=responseData[currentStatus].status;
              obj.orderId=order_id;
              obj.tracking=tracking;

            }

            });
        } else {
         // updatedOrders.push(orderObj);
        }
      //  updatedOrders.push(orderObj);
     
      res.send({"data":"data has been updated","obj":obj});
    }
  } catch (err) {
    res.status(500).send({
      message: err.message,
    });
  }
};
const updateSwyftOrderTracking = async (req, res) => {
  try {
   var order_id = req.params.oid;
   var tracking = req.body.tracking;
   //const orders = await Order.find({orderId:order_id});
   var obj ={};
    if (order_id) {
      if (tracking) {
         // res.json(orders[i]);return;
         
            var updatedValue = {
              trackingnumber: tracking,
             };
             const categorieds = await Order.updateOne({orderId:order_id}, {
              $set: updatedValue,
            });
            if(categorieds){
             
              obj.orderId=order_id;
              obj.tracking=tracking;

            }

           
        }  
      
     
      res.send({"data":"data has been updated","obj":obj});
    }
  } catch (err) {
    res.status(500).send({
      message: err.message,
    });
  }
};

// const getAllOrders = async (req, res) => {
//   try {
//     const orders = await Order.find().sort({ _id: -1 });
//     if (orders) {
//       for (let i = 0; i < orders.length; i++) {
//         const orderTrackingNo = orders[i].trackingnumber;
//         const orderObj = orders[i];
//         if (orderTrackingNo) {
//           axios.get(`${process.env.SWIFTAPI_BASE_URL}/${process.env.SWIFT_API_KEY}/get-parcel-history/${orderTrackingNo}`, {
//             headers: {
//               Authorization: `${process.env.SWIFT_API_AUTH_TOKEN}`,
//               "Content-Type": "application/json",
//             },
//           }).then((response) => {
//             const responseData = response.data;
//             const currentStaus = responseData.length - 1;
//             orders[i].swiftapi = responseData[currentStaus].status;
//           })

//         }

//       }
//     }
//     res.send(orders);
//   } catch (err) {
//     res.status(500).send({
//       message: err.message,
//     });
//   }
// };

const getOrderByUser = async (req, res) => {
  try {
    const orders = await Order.find({ userId: req.params.id }).sort({
      _id: -1,
    });
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

const addOrderParcelId = (req, res) => {
  const parcelID = req.body.trackingnumber;
  Order.updateOne(
    {
      _id: req.params.id,
    },
    {
      $set: {
        trackingnumber: parcelID,
      },
    },
    (err) => {
      if (err) {
        res.status(500).send({
          message: err.message,
        });
      } else {
        res.status(200).send({
          message: "Parcel Id Added Successfully!",
        });
      }
    }
  );
};

const updateOrder = (req, res) => {
  const newStatus = req.body.status;
  Order.updateOne(
    {
      _id: req.params.id,
    },
    {
      $set: {
        status: newStatus,
      },
    },
    (err) => {
      if (err) {
        res.status(500).send({
          message: err.message,
        });
      } else {
        res.status(200).send({
          message: "Order Updated Successfully!",
        });
      }
    }
  );
};

const deleteOrder = (req, res) => {
  Order.deleteOne({ _id: req.params.id }, (err) => {
    if (err) {
      res.status(500).send({
        message: err.message,
      });
    } else {
      res.status(200).send({
        message: "Order Deleted Successfully!",
      });
    }
  });
};

const bestSellerProductChart = async (req, res) => {
  try {
    const totalDoc = await Order.countDocuments({});
    const bestSellingProduct = await Order.aggregate([
      {
        $unwind: "$cart",
      },
      {
        $group: {
          _id: "$cart.title",

          count: {
            $sum: "$cart.quantity",
          },
        },
      },
      {
        $sort: {
          count: -1,
        },
      },
      {
        $limit: 4,
      },
    ]);

    res.send({
      totalDoc,
      bestSellingProduct,
    });
  } catch (err) {
    res.status(500).send({
      message: err.message,
    });
  }
};

const getDashboardOrders = async (req, res) => {
  const { page, limit } = req.query;

  const pages = Number(page) || 1;
  const limits = Number(limit) || 8;
  const skip = (pages - 1) * limits;

  let week = new Date();
  week.setDate(week.getDate() - 10);

  const start = new Date().toDateString();

  // (startDate = '12:00'),
  // (endDate = '23:59'),

  try {
    const totalDoc = await Order.countDocuments({});

    // query for orders
    const orders = await Order.find({})
      .sort({ _id: -1 })
      .skip(skip)
      .limit(limits);

    const totalAmount = await Order.aggregate([
      {
        $group: {
          _id: null,
          tAmount: {
            $sum: "$total",
          },
        },
      },
    ]);

    // total order amount
    const todayOrder = await Order.find({ createdAt: { $gte: start } });

    // this month order amount
    const totalAmountOfThisMonth = await Order.aggregate([
      {
        $group: {
          _id: {
            year: {
              $year: "$createdAt",
            },
            month: {
              $month: "$createdAt",
            },
          },
          total: {
            $sum: "$total",
          },
        },
      },
      {
        $sort: { _id: -1 },
      },
      {
        $limit: 1,
      },
    ]);

    // total padding order count
    const totalPendingOrder = await Order.aggregate([
      {
        $match: {
          status: "Pending",
        },
      },
      {
        $group: {
          _id: null,
          total: { $sum: "$total" },
          count: {
            $sum: 1,
          },
        },
      },
    ]);

    // total delivered order count
    const totalProcessingOrder = await Order.aggregate([
      {
        $match: {
          status: "Processing",
        },
      },
      {
        $group: {
          _id: null,
          total: { $sum: "$total" },
          count: {
            $sum: 1,
          },
        },
      },
    ]);

    // total delivered order count
    const totalDeliveredOrder = await Order.aggregate([
      {
        $match: {
          status: "Delivered",
        },
      },
      {
        $group: {
          _id: null,
          total: { $sum: "$total" },
          count: {
            $sum: 1,
          },
        },
      },
    ]);

    //weekly sale report
    // filter order data
    const weeklySaleReport = await Order.find({
      $or: [{ status: { $regex: `Delivered`, $options: "i" } }],
      createdAt: {
        $gte: week,
      },
    });

    res.send({
      totalOrder: totalDoc,
      totalAmount:
        totalAmount.length === 0
          ? 0
          : parseFloat(totalAmount[0].tAmount).toFixed(2),
      todayOrder: todayOrder,
      totalAmountOfThisMonth:
        totalAmountOfThisMonth.length === 0
          ? 0
          : parseFloat(totalAmountOfThisMonth[0].total).toFixed(2),
      totalPendingOrder:
        totalPendingOrder.length === 0 ? 0 : totalPendingOrder[0],
      totalProcessingOrder:
        totalProcessingOrder.length === 0 ? 0 : totalProcessingOrder[0].count,
      totalDeliveredOrder:
        totalDeliveredOrder.length === 0 ? 0 : totalDeliveredOrder[0].count,
      orders,
      weeklySaleReport,
    });
  } catch (err) {
    res.status(500).send({
      message: err.message,
    });
  }
};

const updateStatus = async (req, res) => {
  const newStatus = req.body.status;

  let ttk = [];
  const orderId = await Order.find({ _id: req.params.id });
  const user = await Customer.find({ customerId: orderId[0].userId });
  const tok = user[0].token;
  ttk.push(tok);
  let pushMesg = "";
  if (newStatus === "In Process") {
    pushMesg =
      "Shipping process of your order no.#" +
      orderId[0].orderId +
      " has been started.";
  }
  if (newStatus === "Delivered") {
    pushMesg =
      "Your order no.#" +
      orderId[0].orderId +
      " has been delivered to you, thank you for your trust with us!";
  }
  if (newStatus === "Cancelled") {
    pushMesg =
      "Your order no.#" +
      orderId[0].orderId +
      " has been cancelled, please contact our customer support team for more details.";
  }

  console.log("toke", tok);
  Order.updateOne(
    { _id: req.params.id },
    {
      $set: {
        status: newStatus,
      },
    },
    (err) => {
      if (err) {
        res.status(500).send({
          message: err.message,
        });
      } else {
        res.status(200).send({
          message: `Order Status Changed!`,
          ttk: ttk,
          pushMesg: pushMesg,
        });
        exposendPushNotification(ttk, pushMesg);
      }
    }
  );
};

const addOrderRejectionReason = async (req, res) => {
  try {
    const { orderId } = req.params;

    const { rejection_reason } = req.body;

    console.log(orderId, rejection_reason);

    Order.updateOne(
      { orderId: orderId },
      {
        $set: {
          rejection_reason: rejection_reason,
        },
      },
      (err) => {
        if (err) {
          res.status(500).send({
            message: err.message,
          });
        } else {
          res.status(200).send({
            message: `Order Rejected with reason!`,
          });
        }
      }
    );
  } catch (error) {
    res.status(500).send({
      message: error.message,
    });
  }
};

module.exports = {
  getAllOrders,
  getOrderById,
  getOrderByUser,
  updateOrder,
  deleteOrder,
  bestSellerProductChart,
  addOrderParcelId,
  getDashboardOrders,
  updateStatus,
  addOrderRejectionReason,
  updateSwyftStatus,
  updateSwyftOrderStatus,
  updateSwyftOrderTracking
};
