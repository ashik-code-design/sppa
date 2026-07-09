const mongoose = require("mongoose");

const staffSchema = new mongoose.Schema({
  staff_id: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  password_changed: {
    type: Boolean,
    default: false
  }
}, { timestamps: true });

module.exports = mongoose.model("Staff", staffSchema);
