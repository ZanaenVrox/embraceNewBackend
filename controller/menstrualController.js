const Menstrual = require("../models/Menstrual");
const moment = require("moment");

const Get = async (req, res) => {
  const jobStatuses = await Menstrual.find({
    user_id: req.query.user_id,
  });
  const newobj = {
    Good: true,
    data: { Cycles: jobStatuses },
  };

  res.json(newobj);
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
  var last_current_cycle = await Menstrual.find({ is_current: 1 });
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
  var user_id = req.body.user_id;
  var last_current_cycle = await Menstrual.find({
    is_current: 1,
    user_id: user_id,
  });
  let nextCycle = [];
  let cycleLength = 28;
  var p = 0;
  for (var i = 1; i <= 3; i++) {
    var factor = i * cycleLength + 1;
    var start_date = moment(last_current_cycle[0].end_date, "YYYY-MM-DD").add(
      factor + p,
      "days"
    );
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

  const obj = {
    Good: true,
    data: nextCycle,
  };
  return res.status(200).send(obj);
};

const Detail = async (req, res) => {
  var filter = {
    id: req.params.id,
  };
  categories = await Menstrual.find({ is_current: 1 });
  if (categories) {
    const newObj = {
      Good: true,
      data: { cycle: categories },
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

const DaysLeft = async (req, res) => {
  var current_date = req.body.current_date;
  var user_id = req.body.user_id;
  var msg = "";
  var marray = ["1st", "2nd", "3rd", "4th", "5th"];
  var current_cycle = await Menstrual.find({ is_current: 1, user_id: user_id });
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
  var end = moment(current_date, "YYYY-MM-DD");
  var diff = end.diff(start, "days");

  var cycleendate = moment(cycle_end_date, "YYYY-MM-DD");

  var leftdays = cycleendate.diff(end, "days");

  if (current_date < cycle_start_date) {
    msg = " ";
  }

  if (diff < 5) {
    msg = marray[diff] + " day of the period";
  } else if (diff >= 5 && diff <= 10) {
    msg = leftdays + " days left in next period cycle";
  }
  // else if(diff >10 && diff <=11 ){
  else if (diff === 11) {
    msg = " low chance of pregnancy";
  }
  //else if(diff >11 && diff <=12 ){
  else if (diff === 12) {
    msg = " low chance of pregnancy";
  } else if (diff === 13) {
    msg = " High chance of pregnancy";
  } else if (diff === 14) {
    msg = " low chance of pregnancy";
  } else if (diff === 15) {
    msg = " low chance of pregnancy";
  } else {
    msg = leftdays + " days left in next period cycle";
  }

  const newobj = {
    Good: true,
    data: { Message: msg },
  };

  res.json(newobj);
};

module.exports = {
  createMenstrualCycle,
  nextCycle,
  Detail,
  Get,
  DaysLeft,
};
