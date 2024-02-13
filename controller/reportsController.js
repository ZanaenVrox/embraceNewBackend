const orders = require("../models/Order");
const customers = require("../models/Customers");
const subscription = require("../models/Subscription");
const products = require("../models/Products");
const cities = require("../models/Cities");
const userSymptoms = require("../models/UserSymptoms");
const moment = require("moment");

const monthlyCombinedStats = async (req, res) => {
  try {
    var month = req.query.month;
    let calculatedData = [];
    let custData = [];
    let sucData = [];
    for (var i = 0; i < month.length; i++) {
      const startOfMonth = new Date(
        Date.UTC(new Date().getFullYear(), month[i] - 1, 1)
      );
      const endOfMonth = new Date(
        Date.UTC(new Date().getFullYear(), month[i], 0, 23, 59, 59, 999)
      );
      console.log("startOfMonth", startOfMonth);
      console.log("endOfMonth", endOfMonth);
      const result = await orders.aggregate([
        {
          $match: {
            createdAt: {
              $gte: startOfMonth,
              $lte: endOfMonth,
            },
          },
        },
        {
          $group: {
            _id: null,
            count: { $sum: 1 },
          },
        },
        {
          $project: {
            _id: 0,
            count: 1,
          },
        },
      ]);

      calculatedData.push(result.length > 0 ? result[0].count : 0);
    }
    const obj = [{ name: "Orders", data: calculatedData }];

    res.json(obj);
  } catch (err) {
    res.status(500).json(err.message);
  }
};

const getTopTenCities = async (req, res) => {
  try {
    var start_date = new Date(req.query.start_date);
    var end_date = new Date(req.query.end_date);
    // console.log("start_date", start_date);
    // console.log("end_date", end_date);
    let calculatedData = [];
    let tableData = [];
    let nob = {};
    let mData = [];

    const result = await orders.aggregate([
      {
        $match: {
          createdAt: {
            $gte: start_date,
            $lte: end_date,
          },
        },
      },

      {
        $group: {
          _id: "$city",
          ordersCount: { $sum: 1 },
        },
      },
      { $sort: { ordersCount: -1 } },
      { $limit: 10 },

      {
        $project: {
          _id: 1,
          ordersCount: 1,
        },
      },
    ]);
    //res.json(result);return
    let cityy = [];
    for (var i = 0; i < result.length; i++) {
      calculatedData.push(result[i].ordersCount);
      const getCities = await cities.find({ label: result[i]._id });
      for (let k = 0; k < getCities.length; k++) {
        mData.push(getCities[k].label);
        nob = {
          month: getCities[k].label,
          orders: result[i].ordersCount,
        };
      }
      tableData.push(nob);
    }

    const obj = [
      { name: "Orders", data: calculatedData },
      {
        month: mData,
      },
      {
        table: tableData,
      },
    ];

    res.json(obj);
  } catch (err) {
    res.status(500).json(err.message);
  }
};
const getOrdersStatuses = async (req, res) => {
  try {
    var start_date = new Date(req.query.start_date);
    var end_date = new Date(req.query.end_date);
    console.log("start_date", start_date);
    console.log("end_date", end_date);
    let calculatedData = [];
    let tableData = [];
    let nob = {};
    let mData = [];
    const mn = [
      "Pending",
      "In Process",
      "Dispatched",
      "Delivered",
      "Cancelled",
    ];

    for (var i = 0; i < mn.length; i++) {
      const ord = await orders.find({
        status: mn[i],
        createdAt: {
          $gte: start_date,
          $lt: end_date,
        },
      });
      calculatedData.push(ord.length);
      mData.push(mn[i]);
      nob = {
        month: mn[i],
        orders: ord.length,
      };
      tableData.push(nob);
    }

    // console.log("res",result);

    const obj = [
      { name: "Orders", data: calculatedData },
      {
        month: mData,
      },
      {
        table: tableData,
      },
    ];

    res.json(obj);
  } catch (err) {
    res.status(500).json(err.message);
  }
};

const getmonthlyOrders = async (req, res) => {
  try {
    const start_date = req.query.start_date;
    const end_date = req.query.end_date;
    const mn = [
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

    const stDate = new Date(start_date);
    const enDate = new Date(end_date);
    const diffInMs = enDate.getTime() - stDate.getTime();
    const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));
    console.log(stDate);
    const result = await orders.aggregate([
      {
        $match: {
          createdAt: {
            $gte: stDate,
            $lte: enDate,
          },
        },
      },
      {
        $group: {
          _id: {
            month: { $month: "$createdAt" },
            status: "$status",
          },
          count: { $sum: 1 },
        },
      },
      {
        $group: {
          _id: "$_id.month",
          statuses: {
            $push: {
              status: "$_id.status",
              count: "$count",
            },
          },
        },
      },
    ]);

    const tableData = [];
    for (let i = 1; i <= 12; i++) {
      const month = mn[i - 1];
      const monthData = result.find((item) => item._id === i);

      const statusCounts = {};
      if (monthData) {
        monthData.statuses.forEach((statusItem) => {
          statusCounts[statusItem.status] = statusItem.count;
        });
      }

      tableData.push({
        month,
        orders: monthData
          ? monthData.statuses.reduce(
              (sum, statusItem) => sum + statusItem.count,
              0
            )
          : 0,
        ...statusCounts,
      });
    }

    const calculatedData = tableData.map((item) => item.orders);

    const obj = [
      { name: "Orders", data: calculatedData },
      { month: mn }, // Use the desired month order
      { table: tableData },
    ];

    res.json(obj);
  } catch (err) {
    res.status(500).json(err.message);
  }
};

const recurringOrders = async (req, res) => {
  try {
    var start_date = req.query.start_date;
    var end_date = req.query.end_date;
    let calculatedData = [];
    let tableData = [];
    let nob = {};
    let mData = [];
    const mn = [
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

    var diffInMs = enDate.getTime() - stDate.getTime();

    var diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));
    // console.log("diff",diffInDays);
    //return;
    const result = await orders.aggregate([
      {
        $match: {
          createdAt: {
            $gte: stDate,
            $lte: enDate,
          },
        },
      },
      {
        $group: {
          _id: "$userId",
          count: { $sum: 1 },
        },
      },
      {
        $project: {
          _id: 1,
          count: 1,
          createdAt: 1,
        },
      },
    ]);
    // console.log("res",result);
    const er = [];
    const objjj = {};
    for (var t = 0; t < result.length; t++) {
      var tr = await orders.find({ userId: result[t]._id });
      //objjj ={}
      er.push(tr[0].createdAt);
    }
    // console.log("er",er);

    let jcount = 0;
    let fecount = 0;
    let macount = 0;
    let apcount = 0;
    let mcount = 0;
    let jncount = 0;
    let jucount = 0;
    let gucount = 0;
    let scount = 0;
    let ocount = 0;
    let ncount = 0;
    let dcount = 0;

    for (var i = 0; i < er.length; i++) {
      //console.log("monght",new Date(result[i].createdAt).getMonth() );
      let mnn = new Date(er[i]).getMonth();
      console.log("mn", mn);
      if (mnn == 0) {
        jcount = jcount + 1;
      }
      if (mnn == 1) {
        fecount = fecount + 1;
      }
      if (mnn == 2) {
        macount = macount + 1;
      }
      if (mnn == 3) {
        apcount = apcount + 1;
      }
      if (mnn == 4) {
        mcount = mcount + 1;
      }
      if (mnn == 5) {
        jncount = jncount + 1;
      }
      if (mnn == 6) {
        jucount = jucount + 1;
      }
      if (mnn == 7) {
        gucount = gucount + 1;
      }
      if (mnn == 8) {
        scount = scount + 1;
      }
      if (mnn == 9) {
        ocount = ocount + 1;
      }
      if (mnn == 10) {
        ncount = ncount + 1;
      }
      if (mnn == 11) {
        dcount = dcount + 1;
      }
    }
    //  console.log("res",d);
    if (jcount > 0) {
      calculatedData.push(jcount - 1);
      mData.push("Jan");
      nob = { month: "Jan", orders: jcount - 1 };
      tableData.push(nob);
    }
    if (fecount > 0) {
      calculatedData.push(fecount - 1);
      mData.push("Feb");
      nob = { month: "Feb", orders: fecount - 1 };
      tableData.push(nob);
    }
    if (macount > 0) {
      calculatedData.push(macount - 1);
      mData.push("Mar");
      nob = { month: "Mar", orders: macount - 1 };
      tableData.push(nob);
    }
    if (apcount > 0) {
      calculatedData.push(apcount - 1);
      mData.push("Apr");
      nob = { month: "Apr", orders: apcount - 1 };
      tableData.push(nob);
    }
    if (mcount > 0) {
      calculatedData.push(mcount - 1);
      mData.push("May");
      nob = { month: "May", orders: mcount - 1 };
      tableData.push(nob);
    }
    if (jncount > 0) {
      calculatedData.push(jncount - 1);
      mData.push("Jun");
      nob = { month: "Jun", orders: jncount - 1 };
      tableData.push(nob);
    }
    if (jucount > 0) {
      calculatedData.push(jucount - 1);
      mData.push("Jul");
      nob = { month: "Jul", orders: jucount - 1 };
      tableData.push(nob);
    }
    if (gucount > 0) {
      calculatedData.push(gucount - 1);
      mData.push("Aug");
      nob = { month: "Aug", orders: gucount - 1 };
      tableData.push(nob);
    }
    if (scount > 0) {
      calculatedData.push(scount - 1);
      mData.push("Sep");
      nob = { month: "Sep", orders: scount - 1 };
      tableData.push(nob);
    }
    if (ocount > 0) {
      calculatedData.push(ocount - 1);
      mData.push("Oct");
      nob = { month: "Oct", orders: ocount - 1 };
      tableData.push(nob);
    }
    if (ncount > 0) {
      calculatedData.push(ncount - 1);
      mData.push("Nov");
      nob = { month: "Nov", orders: ncount - 1 };
      tableData.push(nob);
    }

    if (dcount > 0) {
      calculatedData.push(dcount - 1);
      mData.push("Dec");
      nob = { month: "Dec", orders: dcount - 1 };
      tableData.push(nob);
    }

    const obj = [
      { name: "Orders", data: calculatedData },
      {
        month: mData,
      },
      {
        table: tableData,
      },
    ];

    res.json(obj);
  } catch (err) {
    res.status(500).json(err.message);
  }
};

const getskuTrends = async (req, res) => {
  try {
    var start_date = req.query.start_date;
    var end_date = req.query.end_date;
    console.log("start_date", start_date);
    console.log("end_date", end_date);
    let calculatedData = [];
    let pro = [];
    let tabledata = [];
    let objj = {};

    const result = await orders.find({
      createdAt: {
        $gte: start_date,
        $lt: end_date,
      },
    });
    // console.log("res",result);
    const prods = await products.find({});

    for (var p = 0; p < prods.length; p++) {
      let count = 0;
      result.forEach((cat) => {
        for (var c = 0; c < cat.cart.length; c++) {
          if (cat.cart[c].sku === prods[p].sku) {
            count += cat.cart[c].count || cat.cart[c].quantity || 1;
          }
        }
      });
      if (count > 0) {
        calculatedData.push(count);
        pro.push(prods[p].sku);
        objj = {
          name: prods[p].sku,
          orders: count,
          category: prods[p].productCategory + " " + prods[p].productName,
        };
        tabledata.push(objj);
      }
    }

    //  console.log("res",d);

    const obj = [
      { name: "Orders", data: calculatedData },
      {
        products: pro,
      },
      { table: tabledata.sort((a, b) => b.orders - a.orders) },
    ];

    res.json(obj);
  } catch (err) {
    res.status(500).json(err.message);
  }
};

const getmonthlyOrdersProducts = async (req, res) => {
  try {
    var start_date = req.query.start_date;
    var end_date = req.query.end_date;
    let calculatedData = [];
    let mData = [];
    let pro = [];
    const mn = [
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

    var diffInMs = enDate.getTime() - stDate.getTime();

    var diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));
    // console.log("diff",diffInDays);
    //return;
    const result = await orders.aggregate([
      {
        $match: {
          createdAt: {
            $gte: stDate,
            $lte: enDate,
          },
        },
      },

      {
        $project: {
          _id: 1,
          createdAt: 1,
          cart: 1,
        },
      },
    ]);
    // console.log("res",result);
    const prods = await products.find({});
    for (var p = 0; p < prods.length; p++) {
      let count = 0;
      result.forEach((cat) => {
        // console.log("cat",cat.cart);
        for (var c = 0; c < cat.cart.length; c++) {
          //cat.cart.foreach((prodd)=>{
          //console.log("c",cat.cart[c]);
          if (cat.cart[c].productName === prods[p].productName) {
            count += cat.cart[c].count || cat.cart[c].quantity || 1;
          }
        }
      });
      if (count > 0) {
        calculatedData.push(count);
        pro.push(prods[p].productName);
      }
    }

    let jcount = 0;
    let fecount = 0;
    let macount = 0;
    let apcount = 0;
    let mcount = 0;
    let jncount = 0;
    let jucount = 0;
    let gucount = 0;
    let scount = 0;
    let ocount = 0;
    let ncount = 0;
    let dcount = 0;

    for (var i = 0; i < result.length; i++) {
      //console.log("monght",new Date(result[i].createdAt).getMonth() );
      let mnn = new Date(result[i].createdAt).getMonth();
      if (mnn == 0) {
        jcount = jcount + 1;
      }
      if (mnn == 1) {
        fecount = fecount + 1;
      }
      if (mnn == 2) {
        macount = macount + 1;
      }
      if (mnn == 3) {
        apcount = apcount + 1;
      }
      if (mnn == 4) {
        mcount = mcount + 1;
      }
      if (mnn == 5) {
        jncount = jncount + 1;
      }
      if (mnn == 6) {
        jucount = jucount + 1;
      }
      if (mnn == 7) {
        gucount = gucount + 1;
      }
      if (mnn == 8) {
        scount = scount + 1;
      }
      if (mnn == 9) {
        ocount = ocount + 1;
      }
      if (mnn == 10) {
        ncount = ncount + 1;
      }
      if (mnn == 11) {
        dcount = dcount + 1;
      }
    }
    //  console.log("res",d);
    if (jcount > 0) {
      //calculatedData.push ( jcount);
      mData.push("Jan");
    }
    if (fecount > 0) {
      //calculatedData.push ( fecount);
      mData.push("Feb");
    }
    if (macount > 0) {
      //calculatedData.push ( macount);
      mData.push("Mar");
    }
    if (apcount > 0) {
      //calculatedData.push ( apcount);
      mData.push("Apr");
    }
    if (mcount > 0) {
      //calculatedData.push ( mcount);
      mData.push("May");
    }
    if (jncount > 0) {
      //calculatedData.push ( jncount);
      mData.push("Jun");
    }
    if (jucount > 0) {
      //calculatedData.push ( jucount);
      mData.push("Jul");
    }
    if (gucount > 0) {
      // calculatedData.push ( gucount);
      mData.push("Aug");
    }
    if (scount > 0) {
      //calculatedData.push ( scount);
      mData.push("Sep");
    }
    if (ocount > 0) {
      // calculatedData.push ( ocount);
      mData.push("Oct");
    }
    if (ncount > 0) {
      // calculatedData.push ( ncount);
      mData.push("Nov");
    }

    if (dcount > 0) {
      // calculatedData.push ( dcount);
      mData.push("Dec");
    }
    //  console.log("res",d);

    const obj = [
      { name: "Orders", data: calculatedData },
      {
        products: pro,
      },
      {
        month: mData,
      },
    ];

    res.json(obj);
  } catch (err) {
    res.status(500).json(err.message);
  }
};

const getmonthlyOrdersCities = async (req, res) => {
  try {
    var start_date = req.query.start_date;
    var end_date = req.query.end_date;
    let calculatedData = [];
    let mData = [];
    let pro = [];
    const mn = [
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

    var diffInMs = enDate.getTime() - stDate.getTime();

    var diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));
    // console.log("diff",diffInDays);
    //return;
    const result = await orders.aggregate([
      {
        $match: {
          createdAt: {
            $gte: stDate,
            $lte: enDate,
          },
        },
      },

      {
        $project: {
          _id: 1,
          createdAt: 1,

          city: 1,
        },
      },
    ]);
    //console.log("res",result);
    const prods = await cities.find({});
    for (var p = 0; p < prods.length; p++) {
      let count = 0;
      result.forEach((cart) => {
        //console.log("res",cart);
        if (cart.city === prods[p].label) {
          count++;
        }
      });
      if (count > 0) {
        calculatedData.push(count);
        pro.push(prods[p].label);
      }
    }

    let jcount = 0;
    let fecount = 0;
    let macount = 0;
    let apcount = 0;
    let mcount = 0;
    let jncount = 0;
    let jucount = 0;
    let gucount = 0;
    let scount = 0;
    let ocount = 0;
    let ncount = 0;
    let dcount = 0;

    for (var i = 0; i < result.length; i++) {
      //console.log("monght",new Date(result[i].createdAt).getMonth() );
      let mnn = new Date(result[i].createdAt).getMonth();
      if (mnn == 0) {
        jcount = jcount + 1;
      }
      if (mnn == 1) {
        fecount = fecount + 1;
      }
      if (mnn == 2) {
        macount = macount + 1;
      }
      if (mnn == 3) {
        apcount = apcount + 1;
      }
      if (mnn == 4) {
        mcount = mcount + 1;
      }
      if (mnn == 5) {
        jncount = jncount + 1;
      }
      if (mnn == 6) {
        jucount = jucount + 1;
      }
      if (mnn == 7) {
        gucount = gucount + 1;
      }
      if (mnn == 8) {
        scount = scount + 1;
      }
      if (mnn == 9) {
        ocount = ocount + 1;
      }
      if (mnn == 10) {
        ncount = ncount + 1;
      }
      if (mnn == 11) {
        dcount = dcount + 1;
      }
    }
    //  console.log("res",d);
    if (jcount > 0) {
      //calculatedData.push ( jcount);
      mData.push("Jan");
    }
    if (fecount > 0) {
      //calculatedData.push ( fecount);
      mData.push("Feb");
    }
    if (macount > 0) {
      //calculatedData.push ( macount);
      mData.push("Mar");
    }
    if (apcount > 0) {
      //calculatedData.push ( apcount);
      mData.push("Apr");
    }
    if (mcount > 0) {
      //calculatedData.push ( mcount);
      mData.push("May");
    }
    if (jncount > 0) {
      //calculatedData.push ( jncount);
      mData.push("Jun");
    }
    if (jucount > 0) {
      //calculatedData.push ( jucount);
      mData.push("Jul");
    }
    if (gucount > 0) {
      // calculatedData.push ( gucount);
      mData.push("Aug");
    }
    if (scount > 0) {
      //calculatedData.push ( scount);
      mData.push("Sep");
    }
    if (ocount > 0) {
      // calculatedData.push ( ocount);
      mData.push("Oct");
    }
    if (ncount > 0) {
      // calculatedData.push ( ncount);
      mData.push("Nov");
    }

    if (dcount > 0) {
      // calculatedData.push ( dcount);
      mData.push("Dec");
    }
    //  console.log("res",d);

    const obj = [
      { name: "Orders", data: calculatedData },
      {
        Cities: pro,
      },
      {
        month: mData,
      },
    ];

    res.json(obj);
  } catch (err) {
    res.status(500).json(err.message);
  }
};
const getmonthlyCustomers = async (req, res) => {
  try {
    var start_date = req.query.start_date;
    var end_date = req.query.end_date;
    let calculatedData = [];
    let mData = [];
    const mn = [
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

    var diffInMs = enDate.getTime() - stDate.getTime();

    var diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));
    // console.log("diff",diffInDays);
    //return;
    const result = await customers.aggregate([
      {
        $match: {
          createdAt: {
            $gte: stDate,
            $lte: enDate,
          },
        },
      },

      {
        $project: {
          _id: 1,
          createdAt: 1,
        },
      },
    ]);
    // console.log("res",result);
    let jcount = 0;
    let fecount = 0;
    let macount = 0;
    let apcount = 0;
    let mcount = 0;
    let jncount = 0;
    let jucount = 0;
    let gucount = 0;
    let scount = 0;
    let ocount = 0;
    let ncount = 0;
    let dcount = 0;

    for (var i = 0; i < result.length; i++) {
      //console.log("monght",new Date(result[i].createdAt).getMonth() );
      let mnn = new Date(result[i].createdAt).getMonth();
      if (mnn == 0) {
        jcount = jcount + 1;
      }
      if (mnn == 1) {
        fecount = fecount + 1;
      }
      if (mnn == 2) {
        macount = macount + 1;
      }
      if (mnn == 3) {
        apcount = apcount + 1;
      }
      if (mnn == 4) {
        mcount = mcount + 1;
      }
      if (mnn == 5) {
        jncount = jncount + 1;
      }
      if (mnn == 6) {
        jucount = jucount + 1;
      }
      if (mnn == 7) {
        gucount = gucount + 1;
      }
      if (mnn == 8) {
        scount = scount + 1;
      }
      if (mnn == 9) {
        ocount = ocount + 1;
      }
      if (mnn == 10) {
        ncount = ncount + 1;
      }
      if (mnn == 11) {
        dcount = dcount + 1;
      }
    }
    //  console.log("res",d);
    if (jcount > 0) {
      calculatedData.push(jcount);
      mData.push("Jan");
    }
    if (fecount > 0) {
      calculatedData.push(fecount);
      mData.push("Feb");
    }
    if (macount > 0) {
      calculatedData.push(macount);
      mData.push("Mar");
    }
    if (apcount > 0) {
      calculatedData.push(apcount);
      mData.push("Apr");
    }
    if (mcount > 0) {
      calculatedData.push(mcount);
      mData.push("May");
    }
    if (jncount > 0) {
      calculatedData.push(jncount);
      mData.push("Jun");
    }
    if (jucount > 0) {
      calculatedData.push(jucount);
      mData.push("Jul");
    }
    if (gucount > 0) {
      calculatedData.push(gucount);
      mData.push("Aug");
    }
    if (scount > 0) {
      calculatedData.push(scount);
      mData.push("Sep");
    }
    if (ocount > 0) {
      calculatedData.push(ocount);
      mData.push("Oct");
    }
    if (ncount > 0) {
      calculatedData.push(ncount);
      mData.push("Nov");
    }

    if (dcount > 0) {
      calculatedData.push(dcount);
      mData.push("Dec");
    }

    const obj = [
      { name: "Customers", data: calculatedData },
      {
        month: mData,
      },
    ];

    res.json(obj);
  } catch (err) {
    res.status(500).json(err.message);
  }
};
const getmonthlySubscriptions = async (req, res) => {
  try {
    var start_date = req.query.start_date;
    var end_date = req.query.end_date;
    let calculatedData = [];
    let tableData = [];
    let nob = {};
    let mData = [];
    const mn = [
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

    var diffInMs = enDate.getTime() - stDate.getTime();

    var diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));
    // console.log("diff",diffInDays);
    //return;
    const result = await subscription.aggregate([
      {
        $match: {
          createdAt: {
            $gte: stDate,
            $lte: enDate,
          },
        },
      },

      {
        $project: {
          _id: 1,
          createdAt: 1,
        },
      },
    ]);
    // console.log("res",result);
    let jcount = 0;
    let fecount = 0;
    let macount = 0;
    let apcount = 0;
    let mcount = 0;
    let jncount = 0;
    let jucount = 0;
    let gucount = 0;
    let scount = 0;
    let ocount = 0;
    let ncount = 0;
    let dcount = 0;

    for (var i = 0; i < result.length; i++) {
      //console.log("monght",new Date(result[i].createdAt).getMonth() );
      let mnn = new Date(result[i].createdAt).getMonth();
      if (mnn == 0) {
        jcount = jcount + 1;
      }
      if (mnn == 1) {
        fecount = fecount + 1;
      }
      if (mnn == 2) {
        macount = macount + 1;
      }
      if (mnn == 3) {
        apcount = apcount + 1;
      }
      if (mnn == 4) {
        mcount = mcount + 1;
      }
      if (mnn == 5) {
        jncount = jncount + 1;
      }
      if (mnn == 6) {
        jucount = jucount + 1;
      }
      if (mnn == 7) {
        gucount = gucount + 1;
      }
      if (mnn == 8) {
        scount = scount + 1;
      }
      if (mnn == 9) {
        ocount = ocount + 1;
      }
      if (mnn == 10) {
        ncount = ncount + 1;
      }
      if (mnn == 11) {
        dcount = dcount + 1;
      }
    }
    //  console.log("res",d);
    if (jcount > 0) {
      calculatedData.push(jcount);
      mData.push("Jan");
      nob = { month: "Jan", orders: jcount };
      tableData.push(nob);
    }
    if (fecount > 0) {
      calculatedData.push(fecount);
      mData.push("Feb");
      nob = { month: "Feb", orders: fecount };
      tableData.push(nob);
    }
    if (macount > 0) {
      calculatedData.push(macount);
      mData.push("Mar");
      nob = { month: "Mar", orders: macount };
      tableData.push(nob);
    }
    if (apcount > 0) {
      calculatedData.push(apcount);
      mData.push("Apr");
      nob = { month: "Apr", orders: apcount };
      tableData.push(nob);
    }
    if (mcount > 0) {
      calculatedData.push(mcount);
      mData.push("May");
      nob = { month: "May", orders: mcount };
      tableData.push(nob);
    }
    if (jncount > 0) {
      calculatedData.push(jncount);
      mData.push("Jun");
      nob = { month: "Jun", orders: jncount };
      tableData.push(nob);
    }
    if (jucount > 0) {
      calculatedData.push(jucount);
      mData.push("Jul");
      nob = { month: "Jul", orders: jucount };
      tableData.push(nob);
    }
    if (gucount > 0) {
      calculatedData.push(gucount);
      mData.push("Aug");
      nob = { month: "Aug", orders: gucount };
      tableData.push(nob);
    }
    if (scount > 0) {
      calculatedData.push(scount);
      mData.push("Sep");
      nob = { month: "Sep", orders: scount };
      tableData.push(nob);
    }
    if (ocount > 0) {
      calculatedData.push(ocount);
      mData.push("Oct");
      nob = { month: "Oct", orders: ocount };
      tableData.push(nob);
    }
    if (ncount > 0) {
      calculatedData.push(ncount);
      mData.push("Nov");
      nob = { month: "Nov", orders: ncount };
      tableData.push(nob);
    }

    if (dcount > 0) {
      calculatedData.push(dcount);
      mData.push("Dec");
      nob = { month: "Dec", orders: dcount };
      tableData.push(nob);
    }

    const obj = [
      { name: "Subscriptions", data: calculatedData },
      {
        month: mData,
      },
      {
        table: tableData,
      },
    ];

    res.json(obj);
  } catch (err) {
    res.status(500).json(err.message);
  }
};

const getDailyOrders = async (req, res) => {
  try {
    const start_date = req.query.start_date;
    const end_date = req.query.end_date;
    const mn = [
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

    const stDate = new Date(start_date);
    const enDate = new Date(end_date);
    const calculatedData = [];
    const mData = [];
    const tableData = [];

    for (
      let date = new Date(stDate);
      date <= enDate;
      date.setDate(date.getDate() + 1)
    ) {
      const dtt = date.toISOString().substring(0, 10);
      const dt = new Date(date.toISOString().substring(0, 10));

      const startOfDay = new Date(
        Date.UTC(dt.getUTCFullYear(), dt.getUTCMonth(), dt.getUTCDate())
      );
      const endOfDay = new Date(
        Date.UTC(
          dt.getUTCFullYear(),
          dt.getUTCMonth(),
          dt.getUTCDate(),
          23,
          59,
          59,
          999
        )
      );

      const result = await orders.aggregate([
        {
          $match: {
            createdAt: {
              $gte: startOfDay,
              $lte: endOfDay,
            },
          },
        },
        {
          $group: {
            _id: {
              date: {
                $dateToString: { format: "%Y-%m-%d", date: "$createdAt" },
              },
              status: "$status",
            },
            count: { $sum: 1 },
          },
        },
        {
          $group: {
            _id: "$_id.date",
            statuses: {
              $push: {
                status: "$_id.status",
                count: "$count",
              },
            },
          },
        },
      ]);

      const statusCounts = {};
      if (result.length > 0) {
        result[0].statuses.forEach((statusItem) => {
          statusCounts[statusItem.status] = statusItem.count;
        });
      }

      calculatedData.push(
        result.length > 0
          ? result[0].statuses.reduce(
              (sum, statusItem) => sum + statusItem.count,
              0
            )
          : 0
      );
      mData.push(dtt);

      const nobj = {
        date: dtt,
        orders:
          result.length > 0
            ? result[0].statuses.reduce(
                (sum, statusItem) => sum + statusItem.count,
                0
              )
            : 0,
        ...statusCounts,
      };
      tableData.push(nobj);
    }

    const obj = [
      { name: "Orders", data: calculatedData },
      { month: mData },
      { table: tableData },
    ];

    res.json(obj);
  } catch (err) {
    res.status(500).json(err.message);
  }
};

const getDailyCustomers = async (req, res) => {
  try {
    var start_date = req.query.start_date;
    var end_date = req.query.end_date;
    let calculatedData = [];
    let mData = [];
    const mn = [
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
    var diffInMs = enDate.getTime() - stDate.getTime();
    var diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));
    for (
      let date = new Date(stDate);
      date <= enDate;
      date.setDate(date.getDate() + 1)
    ) {
      var dtt = date.toISOString().substring(0, 10);
      var dt = new Date(date.toISOString().substring(0, 10));
      // console.log(dt);

      const startOfDay = new Date(
        Date.UTC(dt.getUTCFullYear(), dt.getUTCMonth(), dt.getUTCDate())
      );
      const endOfDay = new Date(
        Date.UTC(
          dt.getUTCFullYear(),
          dt.getUTCMonth(),
          dt.getUTCDate(),
          23,
          59,
          59,
          999
        )
      );

      const result = await customers.aggregate([
        {
          $match: {
            createdAt: {
              $gte: startOfDay,
              $lte: endOfDay,
            },
          },
        },
        {
          $group: {
            _id: null,
            count: { $sum: 1 },
          },
        },
        {
          $project: {
            _id: 0,
            count: 1,
          },
        },
      ]);
      calculatedData.push(result.length > 0 ? result[0].count : 0);
      mData.push(dtt);
      //console.log("res",result);
    }
    var obj = {
      name: "Customers",
      data: calculatedData,
      dates: mData,
    };

    res.json(obj);
  } catch (err) {
    res.status(500).json(err.message);
  }
};

const getDailySubscriptions = async (req, res) => {
  try {
    var start_date = req.query.start_date;
    var end_date = req.query.end_date;
    let calculatedData = [];
    let mData = [];
    const mn = [
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
    var diffInMs = enDate.getTime() - stDate.getTime();
    var diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));
    for (
      let date = new Date(stDate);
      date <= enDate;
      date.setDate(date.getDate() + 1)
    ) {
      var dtt = date.toISOString().substring(0, 10);
      var dt = new Date(date.toISOString().substring(0, 10));
      // console.log(dt);

      const startOfDay = new Date(
        Date.UTC(dt.getUTCFullYear(), dt.getUTCMonth(), dt.getUTCDate())
      );
      const endOfDay = new Date(
        Date.UTC(
          dt.getUTCFullYear(),
          dt.getUTCMonth(),
          dt.getUTCDate(),
          23,
          59,
          59,
          999
        )
      );

      const result = await subscription.aggregate([
        {
          $match: {
            createdAt: {
              $gte: startOfDay,
              $lte: endOfDay,
            },
          },
        },
        {
          $group: {
            _id: null,
            count: { $sum: 1 },
          },
        },
        {
          $project: {
            _id: 0,
            count: 1,
          },
        },
      ]);
      calculatedData.push(result.length > 0 ? result[0].count : 0);
      mData.push(dtt);
      //console.log("res",result);
    }
    var obj = {
      name: "Subscriptions",
      data: calculatedData,
      dates: mData,
    };

    res.json(obj);
  } catch (err) {
    res.status(500).json(err.message);
  }
};

const getMostlyUserSymptoms = async (req, res) => {
  try {
    const symotoms = await userSymptoms.find({});
    console.log(symotoms.length);

    const symptomCounts = {};
    for (const record of symotoms) {
      const symptom = record.sympton;
      symptomCounts[symptom] = (symptomCounts[symptom] || 0) + 1;
    }

    // Extract the unique symptoms
    const uniqueSymptoms = Object.keys(symptomCounts);

    // Counting the occurrences of each symptom
    const symptomCountss = {};
    symotoms.forEach((record) => {
      const symptom = record.symptom;
      if (symptomCounts.hasOwnProperty(symptom)) {
        symptomCountss[symptom]++;
      } else {
        symptomCountss[symptom] = 1;
      }
    });

    // Transforming the data into the desired format
    const csvData = Object.keys(symptomCounts)
      .map((symptom) => {
        return {
          symptom: symptom,
          count: symptomCounts[symptom],
        };
      })
      .sort((a, b) => b.count - a.count);

    // Generate the desired response
    const response = [
      {
        name: "Symptoms Used",
        data: uniqueSymptoms
          .map((symptom) => symptomCounts[symptom])
          .sort((a, b) => b - a),
      },
      { month: uniqueSymptoms },
      { table: symotoms },
      { csv: csvData },
    ];
    res.json(response);
  } catch (err) {
    res.status(500).json(err.message);
  }
};

const promoCodeReport = async (req, res) => {
  try {
    const allOrdersWithPromoCode = await orders.find({
      usedPromoCode: { $exists: true },
    });

    const table = [];

    for (let i = 0; i < allOrdersWithPromoCode.length; i++) {
      const element = allOrdersWithPromoCode[i];

      const obj = {
        code: element.usedPromoCode,
        customerName: element.name,
        orderDate: moment(element.createdAt).format("DD/MM/YYYY"),
        contact: element.contact,
        products: element.cart.map((product) => product?.productName),
        discountAmmount: element.discount,
        totalAmmount: element.subTotal,
      };
      table.push(obj);
    }

    res.status(200).json(table);
  } catch (error) {
    res.status(500).json(error.message);
  }
};

const testONLD = async (req, res) => {
  try {
    // Step 1: Determine the current month
    const currentMonth = moment().month() + 1;

    // Step 2: Filter the customer data for previous months
    const filteredCustomers = await customers.find({
      createdAt: {
        $lt: moment().startOf("month").toDate(),
        $gte: moment().startOf("month").subtract(12, "months").toDate(),
      },
    });

    // Step 3: Get the customer IDs for previous months
    const customerIds = filteredCustomers.map(
      (customer) => customer.customerId
    );

    // Step 4: Filter the order data for previous months
    const filteredOrders = await orders.find({
      createdAt: {
        $gte: moment().startOf("month").subtract(12, "months").toDate(),
        $lt: moment().endOf("month").subtract(1, "month").toDate(),
      },
      userId: { $in: customerIds },
    });

    // Step 5: Match customers with orders for previous months and get the count
    const matchedCustomersCount = [];
    for (let i = 0; i < 12; i++) {
      const startOfMonth = moment().startOf("month").subtract(i, "months");
      const endOfMonth = moment(startOfMonth).endOf("month");
      const monthName = startOfMonth.format("MMMM");
      const currentMonthCustomers = filteredCustomers.filter((customer) => {
        const hasOrderInCurrentMonth = filteredOrders.some((order) => {
          const orderDate = moment(order.createdAt);
          return (
            order.userId === customer.customerId &&
            orderDate.isSameOrAfter(startOfMonth) &&
            orderDate.isSameOrBefore(endOfMonth)
          );
        });
        return hasOrderInCurrentMonth;
      });
      matchedCustomersCount.push({
        month: monthName,
        customers: currentMonthCustomers,
        count: currentMonthCustomers.length,
      });
    }

    // Return the response with the matched customers count for the past 12 months
    const data = {
      past12MonthsData: {
        matchedCustomersCount: matchedCustomersCount,
      },
    };

    res.json(data);
  } catch (error) {
    res.status(500).json(error.message);
  }
};

const CustomerRetentionAndAcquisitionReport = async (req, res) => {
  try {
    const monthsData = [];

    for (let i = 0; i < 12; i++) {
      const startOfMonth = moment()
        .subtract(i, "months")
        .startOf("month")
        .toDate();
      const endOfMonth = moment().subtract(i, "months").endOf("month").toDate();

      // PreviousMOnth

      const filteredCustomers = await customers.find({
        createdAt: {
          $lt: startOfMonth,
        },
      });

      const customerIds = filteredCustomers.map(
        (customer) => customer.customerId
      );

      const filteredOrders = await orders.find({
        createdAt: {
          $gte: startOfMonth,
          $lt: endOfMonth,
        },
        userId: { $in: customerIds },
      });

      // Current MOnth
      const filteredCustomersCurrentMonth = await customers.find({
        createdAt: {
          $gte: startOfMonth,
          $lt: endOfMonth,
        },
      });

      const customerIdsCurrentMonth = filteredCustomersCurrentMonth.map(
        (customer) => customer.customerId
      );

      const filteredOrdersCurrentMonth = await orders.find({
        createdAt: {
          $gte: startOfMonth,
          $lt: endOfMonth,
        },
        userId: { $in: customerIdsCurrentMonth },
      });

      const obj = {
        month: moment(startOfMonth).format("MMMM"),
        currentMonth: filteredOrders.length,
        beforeCurrentMOnth: filteredOrdersCurrentMonth.length,
      };

      monthsData.push(obj);
    }

    const data = monthsData.reverse();

    res.status(200).json(data);
  } catch (error) {
    res.status(500).json(error.message);
  }
};

module.exports = {
  monthlyCombinedStats,
  getmonthlyOrders,
  getmonthlyCustomers,
  getmonthlySubscriptions,
  getDailyOrders,
  getDailyCustomers,
  getDailySubscriptions,
  getmonthlyOrdersProducts,
  getmonthlyOrdersCities,
  getskuTrends,
  recurringOrders,
  getOrdersStatuses,
  getTopTenCities,
  getMostlyUserSymptoms,
  promoCodeReport,
  CustomerRetentionAndAcquisitionReport,
};
