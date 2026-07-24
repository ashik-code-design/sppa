const express = require("express");
const router = express.Router();
const Mark = require("../models/Mark");


// ================= SAVE MARKS =================
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

    for (const mark of marks) {
      await Mark.findOneAndUpdate(
        {
          register_number: mark.register_number,
          department: mark.department,
          section: mark.section,
          lab: mark.lab,
          experiment: mark.experiment,
        },
        {
          $set: {
            preparation: mark.preparation,
            output: mark.output,
            total: mark.total,
          },
        },
        {
          upsert: true,
          new: true,
        }
      );
    }

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


// ================= UPDATE SINGLE MARK =================
router.post("/umark", async (req, res) => {
  try {
    const {
      register_number,
      department,
      section,
      lab,
      experiment,
      preparation,
      output,
      total,
    } = req.body;

    const result = await Mark.findOneAndUpdate(
      {
        register_number,
        department,
        section,
        lab,
        experiment,
      },
      {
        $set: {
          preparation,
          output,
          total,
        },
      },
      {
        new: true,
      }
    );

    if (!result) {
      return res.status(404).json({
        status: "error",
        message: "Student mark not found",
      });
    }

    res.status(200).json({
      status: "success",
      message: "Mark updated successfully",
      data: result,
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
