const Cities = require("../models/Cities");

const createCities = async (req, res) => {
  try {
    const newCities = new Cities(req.body);
    await newCities.save();
    res.send({ message: "City Added Successfully!" });
  } catch (err) {
    res.status(500).json(err.message);
  }
};

const getCities = async (req, res) => {
  try {
    const cities = await Cities.find({}).sort({ _id: -1 });
    res.send(cities);
  } catch (err) {
    res.status(500).json(err.message);
  }
};

const changeCityStatus = async (req, res) => {
  const cityId = req.params.id;

  try {
    const city = await Cities.findById(cityId);

    if (!city) {
      return res.status(404).json({ message: "City not found" });
    }

    city.isActive = !city.isActive;
    await city.save();

    return res
      .status(200)
      .json({ message: "City status updated successfully", city });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = {
  createCities,
  getCities,
  changeCityStatus,
};
