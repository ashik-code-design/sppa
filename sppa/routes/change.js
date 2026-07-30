const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const Staff = require("../models/Staff");

// ================= CHANGE PASSWORD =================
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

    console.log("==================================");
    console.log("CHANGE PASSWORD REQUEST");
    console.log("Staff ID:", staffId);
    console.log("Old Password:", oldPassword);
    console.log("New Password:", newPassword);

    // Find staff
    const staff = await Staff.findOne({
      staff_id: staffId,
    });

    if (!staff) {
      console.log("Staff not found");

      return res.status(404).json({
        status: "error",
        message: "Staff not found",
      });
    }

    console.log("Staff Found:", staff.staff_id);
    console.log("Stored Password:", staff.password);

    // Compare old password
    const isMatch = await bcrypt.compare(
      oldPassword,
      staff.password
    );

    console.log("Password Match:", isMatch);

    if (!isMatch) {
      return res.status(400).json({
        status: "error",
        message: "Old password is incorrect",
      });
    }

    // Check if new password is same as old password
    const samePassword = await bcrypt.compare(
      newPassword,
      staff.password
    );

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

    console.log("Password Updated Successfully");

    return res.status(200).json({
      status: "success",
      message: "Password changed successfully",
    });

  } catch (err) {
    console.error("Change Password Error:", err);

    return res.status(500).json({
      status: "error",
      message: "Server Error",
      error: err.message,
    });
  }
});

module.exports = router;
