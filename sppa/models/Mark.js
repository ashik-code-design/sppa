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
}, {
  timestamps: {
    createdAt: "created_at",
    updatedAt: false
  }
});

// ADD THIS
markSchema.index(
  {
    register_number: 1,
    department: 1,
    section: 1,
    lab: 1,
    experiment: 1
  },
  {
    unique: true
  }
);

module.exports = mongoose.model("Mark", markSchema);
