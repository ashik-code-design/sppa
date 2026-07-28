const mongoose = require("mongoose");

const adminSchema = new mongoose.Schema({
  admin_id: {
    type: String,
    required: true,
    unique: true,
    uppercase: true,
    trim: true
  },
  password: {
    type: String,
    required: true
  },
  role: {
    type: String,
    enum: ["admin", "staff"],
    default: "staff"
  }
});

module.exports = mongoose.model("Admin", adminSchema);
