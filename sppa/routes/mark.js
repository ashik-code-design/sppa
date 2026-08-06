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
            date: mark.date,
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
      date,
    } = req.body;

    const updateFields = {
      preparation,
      output,
      total,
    };

    // Only touch the stored date if the caller actually sent one, so
    // existing dates aren't wiped out by callers (like the current
    // edit dialog) that don't send this field yet.
    if (date !== undefined) {
      updateFields.date = date;
    }

    const result = await Mark.findOneAndUpdate(
      {
        register_number,
        department,
        section,
        lab,
        experiment,
      },
      {
        $set: updateFields,
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
