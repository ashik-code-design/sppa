const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");

const Staff = require("../models/Staff");

router.post("/", async (req, res) => {
  try {
    const { staffId, oldPassword, newPassword } = req.body;

    // Validate input
    if (!staffId || !oldPassword || !newPassword) {
      return res.status(400).json({
        status: "error",
        message: "All fields are required",
      });
    }

    // Find staff (case-insensitive by converting to uppercase)
    const staff = await Staff.findOne({
      staff_id: staffId.toUpperCase(),
    });

    if (!staff) {
      return res.status(404).json({
        status: "error",
        message: "Staff not found",
      });
    }

    // Compare old password with hashed password
    const isPasswordCorrect = await bcrypt.compare(
      oldPassword,
      staff.password
    );

    if (!isPasswordCorrect) {
      return res.status(400).json({
        status: "error",
        message: "Old password is incorrect",
      });
    }

    // Prevent using the same password again
    const isSamePassword = await bcrypt.compare(
      newPassword,
      staff.password
    );

    if (isSamePassword) {
      return res.status(400).json({
        status: "error",
        message: "New password must be different from old password",
      });
    }

    // Hash the new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Save new password
    staff.password = hashedPassword;
    staff.password_changed = true;

    await staff.save();

    return res.json({
      status: "success",
      message: "Password changed successfully",
    });

  } catch (err) {
    console.error("Change Password Error:", err);

    return res.status(500).json({
      status: "error",
      message: "Server Error",
    });
  }
});

module.exports = router;
