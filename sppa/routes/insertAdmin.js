const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const dotenv = require("dotenv");

dotenv.config();

const Admin = require("./models/Admin");

async function insertAdmins() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB Connected");

    // Remove old admin records (optional)
    await Admin.deleteMany({});

    const adminPassword = await bcrypt.hash("admin123", 10);

    await Admin.insertMany([
      {
        admin_id: "ADMIN001",
        password: hash,
        role: "admin"
      },
      {
        admin_id: "24FCS02",
        password: hash,
        role: "staff"
      }
    ]);

    console.log("Admins Created Successfully");

    mongoose.connection.close();
  } catch (err) {
    console.error(err);
    mongoose.connection.close();
  }
}

insertAdmins();
