const express = require("express");
const router = express.Router();
const Staff = require("../models/Staff");
const bcrypt = require("bcryptjs");

// Escapes regex special characters so a staffId containing them (e.g.
// ".", "+") can't break the case-insensitive lookup below.
function escapeRegex(text) {
  return text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

// ================= TEST =================
router.get("/test", (req, res) => {
  res.send("Auth route is working");
});

// ================= VERSION =================
router.get("/version", (req, res) => {
  res.json({
    message: "New authroutes.js is deployed"
  });
});

// ================= REGISTER =================
router.post("/register", async (req, res) => {
  try {
    let { staffId, password } = req.body;

    if (!staffId || !password) {
      return res.json({
        status: "error",
        message: "Staff ID and Password are required",
      });
    }

    staffId = staffId.trim();

    // Case-insensitive check so "09fcs01" and "09FCS01" are treated
    // as the same account when checking for duplicates.
    const existingUser = await Staff.findOne({
      staff_id: { $regex: new RegExp(`^${escapeRegex(staffId)}$`, "i") },
    });

    if (existingUser) {
      return res.json({
        status: "error",
        message: "Staff ID already exists",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newStaff = new Staff({
      staff_id: staffId.toUpperCase(),
      password: hashedPassword,
      password_changed: false,
    });

    await newStaff.save();

    return res.json({
      status: "success",
      message: "Registration Successful",
    });

  } catch (error) {
    console.error(error);

    return res.json({
      status: "error",
      message: "Server Error",
    });
  }
});

// ================= LOGIN =================
router.post("/login", async (req, res) => {
  console.log("========== LOGIN REQUEST ==========");
  console.log("Body:", req.body);

  try {
    let { staffId, password } = req.body;

    if (!staffId || !password) {
      return res.json({
        status: "error",
        message: "Staff ID and Password are required",
      });
    }

    staffId = staffId.trim();

    console.log("Searching for:", staffId);

    // Case-insensitive lookup: existing records may have been saved in
    // lowercase (e.g. "09fcs01") while newer ones are stored uppercase,
    // so match regardless of case instead of forcing one case here.
    const user = await Staff.findOne({
      staff_id: { $regex: new RegExp(`^${escapeRegex(staffId)}$`, "i") },
    });

    console.log("User Found:", user);

    if (!user) {
      return res.json({
        status: "error",
        message: "Invalid Staff ID or Password",
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    console.log("Password Match:", isMatch);

    if (!isMatch) {
      return res.json({
        status: "error",
        message: "Invalid Staff ID or Password",
      });
    }

    return res.json({
      status: "success",
      message: "Login Successful",
      staffId: user.staff_id,
      password_changed: user.password_changed,
    });

  } catch (err) {
    console.error("LOGIN ERROR:", err);

    return res.json({
      status: "error",
      message: "Server Error",
    });
  }
});

module.exports = router;
