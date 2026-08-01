const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");

const sppaRoutes = require("./routes/authroutes");
const markRoutes = require("./routes/markRoutes");
const markRoute = require("./routes/mark");
const changeRoute = require("./routes/change");
const forgetRoute = require("./routes/forget");
const adminRoutes=require("./routes/adminRoutes");
const allotmentRoutes = require("./routes/allotmentRoutes");
const labRoutes = require("./routes/labRoutes");

dotenv.config();
console.log("MONGO_URI:", process.env.MONGO_URI);

const app = express();

app.use(cors());
app.use(express.json());

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("✅ MongoDB Connected");
    console.log("Database:", mongoose.connection.name);
    console.log("Host:", mongoose.connection.host);
  })
  .catch((err) => {
    console.log(err);
  });

// Routes
app.use("/sppa", sppaRoutes);
app.use("/sppa/marks", markRoutes);
app.use("/sppa/mark", markRoute);
app.use("/sppa/change", changeRoute);
app.use("/sppa/forget", forgetRoute);
app.use("/admin",adminRoutes);
app.use("/allotment", allotmentRoutes);
app.use("/lab", labRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running on port ${PORT}`);
});
