const Address = require("../models/Address");

const getAddressById = async (req, res) => {
  try {
    const address = await Address.find({
      customerId: req.params.id,
    });

    res.status(200).send(address);
  } catch (err) {
    res.status(500).send({
      message: err.message,
    });
  }
};

module.exports = {
  getAddressById,
};
