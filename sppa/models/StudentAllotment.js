const mongoose = require("mongoose");

const studentAllotmentSchema = new mongoose.Schema(
  {
    department: {
      type: String,
      required: true,
    },

    section: {
      type: String,
      required: true,
    },

    subject: {
      type: String,
      required: true,
    },

    staff_id: {
      type: String,
      required: true,
    },

    staff_name: {
      type: String,
      required: true,
    },

    roll_from: {
      type: String,
      required: true,
    },

    roll_to: {
      type: String,
      required: true,
    },

    // Roll numbers within [roll_from, roll_to] that should NOT be
    // allotted (e.g. students who left). Stored as raw entries the way
    // the admin typed them — either bare digits ("114") or a full
    // register number ("24UCS114"). Normalized/matched at read time in
    // the /getStudents route, against whichever prefix that allotment's
    // roll_from uses.
    excluded_rolls: {
      type: [String],
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model(
  "StudentAllotment",
  studentAllotmentSchema
);
