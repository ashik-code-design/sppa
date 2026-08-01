const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");

const Staff = require("../models/Staff");
const Admin = require("../models/Admin");

// POST /sppa/forget
// body: { id, name, newPassword, role }  where role is 'staff' or 'admin'
router.post("/", async (req, res) => {
  try {
    const { id, name, newPassword, role } = req.body;

    if (
      !id?.trim() ||
      !name?.trim() ||
      !newPassword?.trim() ||
      !role?.trim()
    ) {
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
      message: "Password reset successfully",
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      status: "error",
      message: "Unable to reset password",
    });
  }
});

module.exports = router;
