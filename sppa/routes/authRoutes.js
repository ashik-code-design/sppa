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

    console.log("Staff ID:", staffId);
    console.log("Password:", password);

    const user = await Staff.findOne({ staff_id: staffId });

    console.log("User Found:", user);

    if (!user) {
      return res.json({
        status: "error",
        message: "Invalid Staff ID or Password"
      });
    }
    console.log("Entered Password:", password);
    console.log("Stored Password:", user.password);

    console.log("Before compare");

let isMatch;

try {
  isMatch = await bcrypt.compare(password, user.password);
  console.log("After compare");
  console.log("Password Match:", isMatch);
} catch (e) {
  console.error("Compare Error:", e);
  return res.status(500).json({
    status: "error",
    message: "Compare failed",
    error: e.message,
  });
}

    console.log("Password Match:", isMatch);

    if (!isMatch) {
      return res.json({
        status: "error",
        message: "Invalid Staff ID or Password"
      });
    }

    res.json({
      status: "success",
      message: "Login Successful"
    });

  } catch (err) {
    console.log(err);
    res.json({
      status: "error",
      message: "Server Error"
    });
  }
});
module.exports = router;
