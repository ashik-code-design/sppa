const express = require("express");
const router = express.Router();
const Staff = require("../models/Staff");
const bcrypt = require("bcryptjs");


// ================= REGISTER =================
router.post("/register", async (req, res) => {
  try {
    const { staffId, password } = req.body;

    // Validation
    if (!staffId || !password) {
      return res.json({
        status: "error",
        message: "Staff ID and Password are required"
      });
    }

    // Check if user already exists
    const existingUser = await Staff.findOne({ staff_id: staffId });

    if (existingUser) {
      return res.json({
        status: "error",
        message: "Staff ID already exists"
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user
    const newStaff = new Staff({
      staff_id: staffId,
      password: hashedPassword,
      password_changed: false
    });

    await newStaff.save();

    return res.json({
      status: "success",
      message: "Registration Successful"
    });

  } catch (error) {
    console.error(error);
    res.json({
      status: "error",
      message: "Server error"
    });
  }
});


// ================= LOGIN =================
router.post("/login", async (req, res) => {
  try {
    const { staffId, password } = req.body;

    if (!staffId || !password) {
      return res.json({
        status: "error",
        message: "Staff ID and Password are required"
      });
    }

    const user = await Staff.findOne({ staff_id: staffId });

    if (!user) {
      return res.json({
        status: "error",
        message: "Invalid Staff ID or Password"
      });
    }

    // Compare password
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.json({
        status: "error",
        message: "Invalid Staff ID or Password"
      });
    }

    return res.json({
      status: "success",
      message: "Login Successful",
      password_changed: user.password_changed,
      staff: {
        id: user._id,
        staff_id: user.staff_id
      }
    });

  } catch (error) {
    console.error(error);
    res.json({
      status: "error",
      message: "Server error"
    });
  }
});

module.exports = router;
