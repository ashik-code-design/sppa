const express = require("express");
const router = express.Router();
const crypto = require("crypto");
const bcrypt = require("bcryptjs");

const Staff = require("../models/Staff");
const Admin = require("../models/Admin");

// Generates a readable random password, e.g. "aZ4kQ9mT"
function generatePassword(length = 8) {
  const chars =
    "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz23456789";
  let pwd = "";
  const bytes = crypto.randomBytes(length);
  for (let i = 0; i < length; i++) {
    pwd += chars[bytes[i] % chars.length];
  }
  return pwd;
}

// POST /sppa/forget
// body: { id, name, role }  where role is 'staff' or 'admin'
// Looks up the user, generates a new password, stores its hash,
// and returns the new plaintext password once so it can be shown to the user.
router.post("/", async (req, res) => {
  try {
    const { id, name, role } = req.body;

    if (!id?.trim() || !name?.trim() || !role?.trim()) {
      return res.json({
        status: "error",
        message: "All fields are required",
      });
    }

    let user;

    if (role === "admin") {
      user = await Admin.findOne({
        admin_id: id.trim().toUpperCase(),
        admin_name: name.trim(),
      });
    } else {
      user = await Staff.findOne({
        staff_id: id.trim(),
        staff_name: name.trim(),
      });
    }

    if (!user) {
      return res.json({
        status: "error",
        message: `Invalid ${role === "admin" ? "Admin ID" : "Staff ID"} or Name`,
      });
    }

    const newPassword = generatePassword(8);
    const hash = await bcrypt.hash(newPassword, 10);
    user.password = hash;

    // Staff has a password_changed flag used elsewhere (e.g. resetPassword route);
    // Admin has no such field, so only set it for staff.
    if (role !== "admin") {
      user.password_changed = 1;
    }

    await user.save();

    return res.json({
      status: "success",
      message: "Password generated successfully",
      password: newPassword,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      status: "error",
      message: "Unable to fetch password",
    });
  }
});

module.exports = router;
