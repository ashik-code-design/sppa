const express = require("express");
const router = express.Router();
const Mark = require("../models/Mark");

// Called by experiment1.dart -> submitMarks()
// Expected mount: app.use("/sppa", markInsertRouter)  ->  POST /sppa/mark
router.post("/mark", async (req, res) => {
  try {
    const { marks } = req.body;

    if (!Array.isArray(marks) || marks.length === 0) {
      return res.json({
        status: "error",
        message: "No marks provided",
      });
    }

    for (const m of marks) {
      const {
        register_number,
        department,
        section,
        lab,
        experiment,
        preparation,
        output,
        total,
        staff_id,
      } = m;

      if (
        !register_number ||
        !department ||
        !section ||
        !lab ||
        !experiment
      ) {
        continue;
      }

      await Mark.findOneAndUpdate(
        { register_number, department, section, lab, experiment },
        {
          preparation,
          output,
          total,
          ...(staff_id ? { staff_id } : {}),
        },
        { upsert: true, new: true, setDefaultsOnInsert: true }
      );
    }

    return res.json({
      status: "success",
      message: "Marks saved successfully",
    });
  } catch (error) {
    console.error(error);
    return res.json({
      status: "error",
      message: "Something went wrong while saving marks",
    });
  }
});

// Called by details.dart -> updateMark()
// Expected mount: same router as above -> POST /sppa/mark/umark
router.post("/mark/umark", async (req, res) => {
  try {
    const {
      department,
      section,
      lab,
      experiment,
      register_number,
      preparation,
      output,
      total,
    } = req.body;

    if (
      !department ||
      !section ||
      !lab ||
      !experiment ||
      !register_number
    ) {
      return res.status(400).json({
        status: "error",
        message: "Missing required fields",
      });
    }

    const updated = await Mark.findOneAndUpdate(
      { department, section, lab, experiment, register_number },
      { preparation, output, total },
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({
        status: "error",
        message: "Mark record not found",
      });
    }

    return res.json({
      status: "success",
      message: "Marks updated successfully",
      mark: updated,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      status: "error",
      message: "Something went wrong while updating marks",
    });
  }
});

module.exports = router;
