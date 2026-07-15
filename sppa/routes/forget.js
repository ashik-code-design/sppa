const express = require("express");
const router = express.Router();
const Staff = require("../models/Staff");

// POST /sppa/forget
router.post("/", async (req, res) => {
  try {
    const { staffId, email, newPassword } = req.body;

    // Check required fields
    if (
      !staffId?.trim() ||
      !email?.trim() ||
      !newPassword?.trim()
    ) {
      return res.json({
        status: "error",
        message: "All fields are required",
      });
    }

    // Find staff by staff ID and email
    const staff = await Staff.findOne({
      staff_id: staffId,
      email: email,
    });

    if (!staff) {
      return res.json({
        status: "error",
        message: "Invalid Staff ID or Email",
      });
    }

    // Update password
    staff.password = newPassword;
    staff.password_changed = 1;

    await staff.save();

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
