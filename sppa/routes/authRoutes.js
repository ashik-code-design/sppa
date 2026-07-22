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
  console.time("LOGIN");

  try {
    const { staffId, password } = req.body;

    console.time("Find User");
    const user = await Staff.findOne({ staff_id: staffId });
    console.timeEnd("Find User");

    if (!user) {
      console.timeEnd("LOGIN");
      return res.json({
        status: "error",
        message: "Invalid Staff ID or Password",
      });
    }

    console.time("Compare Password");
    const isMatch = await bcrypt.compare(password, user.password);
    console.timeEnd("Compare Password");

    if (!isMatch) {
      console.timeEnd("LOGIN");
      return res.json({
        status: "error",
        message: "Invalid Staff ID or Password",
      });
    }

    console.timeEnd("LOGIN");

    res.json({
      status: "success",
      message: "Login Successful",
    });
  } catch (err) {
    console.error(err);
    console.timeEnd("LOGIN");
    res.json({
      status: "error",
      message: "Server Error",
    });
  }
});
module.exports = router;
