const mongoose = require("mongoose");

const labSchema = new mongoose.Schema({
  lab_name: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },

  experiments: {
    type: [String],
    default: [],
  },
});

module.exports = mongoose.model("Lab", labSchema);
