const express = require("express");
const router = express.Router();
const Mark = require("../models/Mark");

router.post("/", async (req, res) => {
  try {
    const marks = req.body.marks;

    console.log("Received:", marks);

    if (!marks || marks.length === 0) {
      return res.status(400).json({
        status: "error",
        message: "No marks received",
      });
    }

    const result = await Mark.insertMany(marks);

    console.log("Inserted:", result);

    const count = await Mark.countDocuments();
    console.log("Total Documents:", count);

    res.json({
      status: "success",
      message: "Marks Saved Successfully",
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      status: "error",
      message: error.message,
    });
  }
});

module.exports = router;
