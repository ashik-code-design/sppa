const express = require("express");
const router = express.Router();
const Mark = require("../models/Mark");

router.post("/gmark", async (req, res) => {
  try {
    const { department, section, lab, experiment } = req.body;

    if (!department || !section || !lab) {
      return res.json([]);
    }

    // ============================
    // PARTICULAR EXPERIMENT
    // ============================
    if (experiment) {

      const marks = await Mark.find({
        department,
        section,
        lab,
        experiment
      })
      .select("register_number preparation output total -_id")
      .sort({ register_number: 1 });

      return res.json(marks);
    }

    // ============================
    // ALL EXPERIMENTS
    // ============================

    const marks = await Mark.find({
      department,
      section,
      lab
    })
    .select("register_number experiment total -_id")
    .sort({ register_number: 1 });

    let data = {};
    let experimentMap = {};

    marks.forEach(row => {
      const reg = row.register_number;

      if (!data[reg]) {
        data[reg] = {
          register_number: reg,
          exp1: 0,
          exp2: 0,
          exp3: 0,
          exp4: 0,
          exp5: 0,
          exp6: 0,
          exp7: 0,
          exp8: 0,
          exp9: 0,
          exp10: 0,
          grand_total: 0
        };
      }

      // Map experiment → exp1, exp2...
      if (!experimentMap[row.experiment]) {
        experimentMap[row.experiment] = Object.keys(experimentMap).length + 1;
      }

      const expNo = experimentMap[row.experiment];

      if (expNo <= 10) {
        data[reg]["exp" + expNo] = row.total;
      }

      data[reg].grand_total += row.total;
    });

    return res.json(Object.values(data));

  } catch (error) {
    console.error(error);
    res.json([]);
  }
});

module.exports = router;
