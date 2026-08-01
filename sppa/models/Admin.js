const mongoose = require("mongoose");

const adminSchema = new mongoose.Schema({
  admin_id: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    uppercase: true,
  },

  admin_name: {
    type: String,
    trim: true,
  },

  password: {
    type: String,
    required: true,
  },

  role: {
    type: String,
    required: true,
    enum: ["admin", "staff"],
    default: "staff",
  },
});

module.exports = mongoose.model("Admin", adminSchema);
