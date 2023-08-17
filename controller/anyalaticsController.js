const ActivityLog = require("../models/ActivityLog");
const DailyDAU = require("../models/DailyActiveUsers");
const moment = require("moment");

const dailyActiveUsers = async (req, res) => {
  try {
    // Set the start and end of the day
    const today = new Date();
    const startOfDay = new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate()
    );
    const endOfDay = new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate() + 1
    );

    // Query the database for unique users and DAU within the day
    const uniqueUsers = await ActivityLog.distinct("userId", {
      timestamp: { $gte: startOfDay, $lt: endOfDay },
    }).countDocuments();
    const dauCount = await ActivityLog.countDocuments({
      timestamp: { $gte: startOfDay, $lt: endOfDay },
    });

    // Store DAU data in the database
    const dauData = new DailyDAU({
      date: startOfDay,
      count: dauCount,
      uniqueUsers: uniqueUsers,
    });
    dauData.save();

    const allDauData = await DailyDAU.find({});

    // console.log(allDauData);

    res.status(200).send(dauData);
  } catch (error) {
    console.error("Failed to retrieve Daily Active Users count", error);
    res.status(500).send(error);
  }
};

const getAllDauData = async (req, res) => {
  try {
    const start_date = req.query.start_date;
    const end_date = req.query.end_date;

    const stDate = moment(start_date, "YYYY-MM-DD", true);
    const enDate = moment(end_date, "YYYY-MM-DD", true);

    if (!stDate.isValid() || !enDate.isValid()) {
      throw new Error("Invalid date format");
    }

    console.log("stDate", stDate);
    console.log("enDate", enDate);

    const usersData = await ActivityLog.find({
      createdAt: {
        $gte: stDate.toDate(),
        $lte: enDate.toDate(),
      },
    });

    let uniqueCounts = {};

    console.log("usersData", usersData);

    for (let i = 0; i < usersData.length; i++) {
      let date = moment(usersData[i].createdAt).format("DD/MM/YYYY");
      let userId = usersData[i].userId;

      if (uniqueCounts[date]) {
        if (!uniqueCounts[date][userId]) {
          uniqueCounts[date][userId] = true;
          uniqueCounts[date].count++;
        }
      } else {
        uniqueCounts[date] = {
          [userId]: true,
          count: 1,
        };
      }
    }

    let result = [];

    for (let date in uniqueCounts) {
      result.push({
        Date: date,
        count: uniqueCounts[date].count,
      });
    }

    // Output the result
    res.status(200).json(result);
  } catch (error) {
    console.error("Failed to retrieve unique Daily Active Users", error);
    res.sendStatus(500);
  }
};

const test = async (req, res) => {
  try {
    const getData = await DailyDAU.find({});

    res.status(200).send(getData);
  } catch (error) {
    console.error("Failed to retrieve Daily Active Users count", error);
    res.status(500).send(error);
  }
};

module.exports = { dailyActiveUsers, getAllDauData };
