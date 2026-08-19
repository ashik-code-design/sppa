const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const dotenv = require("dotenv");

dotenv.config();

const Staff = require("./models/Staff");

async function insertStaff() {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    console.log("✅ MongoDB Connected");

    const staffs = [
      {
        staff_id: "12FCS01",
        staff_name: "Dr. S. BRITTO RAMESH KUMAR",
      },
      {
        staff_id: "12FCS02",
        staff_name: "Dr. A. ALOYSIUS",
      },
      {
        staff_id: "16FCS01",
        staff_name: "Dr. V. JUDE NIRMAL",
      },
      {
        staff_id: "17FCS01",
        staff_name: "Rev. Dr. S. ARUL OLI SJ",
      },
      {
        staff_id: "21FCS01",
        staff_name: "Rev. Dr. S. SANTIAGO SJ",
      },
      {
        staff_id: "23FCS01",
        staff_name: "Dr. A. VIMAL JERALD",
      },
      {
        staff_id: "23FCS02",
        staff_name: "Dr. GEORGE GABRIEL RICHARD ROY",
      },
      {
        staff_id: "24FCS01",
        staff_name: "Dr. A. ANGELPREETHI",
      },
      {
        staff_id: "24FCS02",
        staff_name: "Dr. G. AROCKIA SAHAYA SHEELA",
      },
      {
        staff_id: "24FCS03",
        staff_name: "Dr. P. JOSEPH CHARLES",
      },
      {
        staff_id: "25FCS01",
        staff_name: "Dr. A. JENIFER JOTHI MARY",
      },
      {
        staff_id: "10TCS03",
        staff_name: "Dr. K. MAHESWARAN",
      },
      {
        staff_id: "26SCS01",
        staff_name: "Mr. A. SHREENATH",
      },
    ];

    // Default password: 12345678
    const hashedPassword = await bcrypt.hash("12345678", 10);

    for (const staff of staffs) {
      const exists = await Staff.findOne({
        staff_id: staff.staff_id,
      });

      if (exists) {
        console.log(`${staff.staff_id} already exists`);
        continue;
      }

      await Staff.create({
        staff_id: staff.staff_id,
        staff_name: staff.staff_name,
        password: hashedPassword,
        password_changed: false,
      });

      console.log(`${staff.staff_id} inserted`);
    }

    console.log("✅ Staff insertion completed.");
  } catch (err) {
    console.error("Error:", err);
  } finally {
    await mongoose.connection.close();
    process.exit(0);
  }
}

insertStaff();
