
const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");

const Staff = require("../models/Staff");
router.get("/test", (req, res) => {
  res.send("Auth route is working");
});

router.post("/", async (req, res) => {
  try {
    let { staffId, oldPassword, newPassword } = req.body;

    // Validation
    if (!staffId || !oldPassword || !newPassword) {
      return res.status(400).json({
        status: "error",
        message: "All fields are required",
      });
    }

    // Convert Staff ID to uppercase
    staffId = staffId.trim().toUpperCase();

    // Find staff
    const staff = await Staff.findOne({
      staff_id: staffId,
    });

    console.log("Staff ID:", staffId);
    console.log("Staff Found:", staff);

    if (!staff) {
      return res.status(404).json({
        status: "error",
        message: "Staff not found",
      });
    }

    console.log("Entered Old Password:", oldPassword);
    console.log("Stored Password:", staff.password);

    // Compare old password
    const isMatch = await bcrypt.compare(oldPassword, staff.password);

    console.log("Password Match:", isMatch);

    if (!isMatch) {
      return res.status(400).json({
        status: "error",
        message: "Old password is incorrect",
      });
    }

    // Check if new password is same as old password
    const samePassword = await bcrypt.compare(newPassword, staff.password);

    if (samePassword) {
      return res.status(400).json({
        status: "error",
        message: "New password must be different from old password",
      });
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update password
    staff.password = hashedPassword;
    staff.password_changed = true;

    await staff.save();

    return res.json({
      status: "success",
      message: "Password changed successfully",
    });

  } catch (err) {
    console.error(err);

    return res.status(500).json({
      status: "error",
      message: "Server Error",
    });
  }
});

module.exports = router;
