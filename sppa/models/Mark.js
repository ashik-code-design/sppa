const mongoose = require("mongoose");

const markSchema = new mongoose.Schema({
  register_number: {
    type: String,
    required: true
  },
  department: {
    type: String,
    required: true
  },
  section: {
    type: String,
    required: true
  },
  lab: {
    type: String,
    required: true
  },
  experiment: {
    type: String,
    required: true
  },
  preparation: {
    type: Number,
    default: 0
  },
  output: {
    type: Number,
    default: 0
  },
  total: {
    type: Number,
    default: 0
  }
}, { timestamps: { createdAt: "created_at", updatedAt: false } });

module.exports = mongoose.model("Mark", markSchema);
