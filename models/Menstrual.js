const mongoose = require("mongoose");

const menstrualSchema = new mongoose.Schema(
  {
    id: { type: Number },
    user_id: { type: String },
    start_date: { type: Date },
    end_date: { type: Date },
    bleed_start_date: { type: Date },
    bleed_end_date: { type: Date },
    ovulation_date: { type: Date },
    ovulation_start_date: { type: Date },
    ovulation_end_date: { type: Date },
    totalcycledays: { type: Number },
    cycle_type: { type: String },
    is_current: { type: Number },
  },
  {
    timestamps: true,
  }
);

const Menstrual =
  mongoose.models.Menstrual || mongoose.model("Menstrual", menstrualSchema);

module.exports = Menstrual;
