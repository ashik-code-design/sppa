const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const dotenv = require("dotenv");

dotenv.config();

const Admin = require("./models/Admin");

async function insertAdmins() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB Connected");

    // Remove old admin records
    await Admin.deleteMany({});

    // Hash password
    const hash = await bcrypt.hash("admin123", 10);

    // Insert admins
    await Admin.insertMany([
      {
        admin_id: "ADMIN001",
        password: hash,
        role: "admin",
      },
      {
        admin_id: "24FCS02",
        password: hash,
        role: "staff",
      },
    ]);

    console.log("Admins Created Successfully");

    await mongoose.connection.close();
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

insertAdmins();
