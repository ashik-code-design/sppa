const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const sppaRoutes = require("./routes/authRoutes");
const markRoutes = require("./routes/markRoutes");

const markRoute = require("./routes/mark");
const changeRoute = require("./routes/change");
const forgetRoute = require("./routes/forget");
const adminRoutes=require("./routes/adminRoutes");

dotenv.config();
console.log("MONGO_URI:", process.env.MONGO_URI);
const app = express();

app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected"))
  .catch(err => console.log(err));

app.use("/sppa", sppaRoutes);
app.use("/sppa/marks", markRoutes);
app.use("/sppa/mark", markRoute);
app.use("/sppa/change", changeRoute);
app.use("/sppa/forget", forgetRoute);
app.use("/admin",adminRoutes);

const PORT = 5000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`);
});
