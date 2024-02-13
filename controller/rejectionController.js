const RejectionModal = require("../models/OrderRejection");

const createReasons = async (req, res) => {
  try {
    console.log("body: ", req.body)
    const newReason = new RejectionModal(req.body);
    await newReason.save();
    res.send({ message: "Reason Added Successfully!" });
  } catch (err) {
    res.status(500).json(err.message);
  }
};

const getReasons = async (req, res) => {
  try {
    const rejection = await RejectionModal.find({}).sort({ _id: -1 });
    res.send(rejection);
  } catch (err) {
    res.status(500).json(err.message);
  }
};

const deleteReason = (req, res) => {
  RejectionModal.deleteOne({ _id: req.params.id }, (err) => {
    if (err) {
      res.status(500).send({
        message: err.message,
      });
    } else {
      res.status(200).send({
        message: "Reason Deleted Successfully!",
      });
    }
  });
};


const updateRejectionReason = async (req, res) => {
  try {
    const reasons = await RejectionModal.findById(req.params.id);
    if (reasons) {
      reasons.label = req.body.label;
      reasons.value = req.body.value;
      await reasons.save();
      res.send({ message: "Reasons Updated Successfully!" });
    }

  } catch (error) {
    res.status(404).send({ message: "Reasons not found!" });
  }
}

module.exports = {
  createReasons,
  getReasons,
  updateRejectionReason,
  deleteReason,
};
