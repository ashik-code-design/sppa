const mongoose = require("mongoose");

const markSchema = new mongoose.Schema(
  {
    register_number: {
      type: String,
      required: true,
    },
    department: {
      type: String,
      required: true,
    },
    section: {
      type: String,
      required: true,
    },
    lab: {
      type: String,
      required: true,
    },
    experiment: {
      type: String,
      required: true,
    },
    // Mixed instead of Number: a mark can now be a numeric score (0-5,
    // 0-10) OR the status string "A" (Absent) / "L" (Left).
    preparation: {
      type: mongoose.Schema.Types.Mixed,
      default: 0,
    },
    output: {
      type: mongoose.Schema.Types.Mixed,
      default: 0,
    },
    total: {
      type: mongoose.Schema.Types.Mixed,
      default: 0,
    },
    date: {
      type: String,
      default: "",
    },
    staff_id: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

// Prevent duplicate records for the same student & experiment
markSchema.index(
  {
    register_number: 1,
    department: 1,
    section: 1,
    lab: 1,
    experiment: 1,
  },
  { unique: true }
);

module.exports = mongoose.model("Mark", markSchema);
