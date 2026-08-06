const express = require("express");
const router = express.Router();
const Mark = require("../models/Mark");

// Expected mount: app.use("/mark", markRoutes)  ->  POST /mark/gmark
router.post("/gmark", async (req, res) => {
  try {
    const { department, section, lab, experiment } = req.body;

    if (!department || !section) {
      return res.json([]);
    }

    // ============================
    // PARTICULAR EXPERIMENT (lab + experiment given)
    // ============================
    if (lab && experiment) {
      const marks = await Mark.find({
        department,
        section,
        lab,
        experiment,
      })
        .select("register_number preparation output total date -_id")
        .sort({ register_number: 1 });

      return res.json(marks);
    }

    // ============================
    // ALL EXPERIMENTS IN ONE LAB (lab given, no experiment)
    // ============================
    if (lab) {
      const marks = await Mark.find({
        department,
        section,
        lab,
      })
        .select("register_number experiment total -_id")
        .sort({ register_number: 1 });

      let data = {};
      let experimentMap = {};

      marks.forEach((row) => {
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
            grand_total: 0,
          };
        }

        // Map experiment name -> exp1, exp2 ...
        if (!experimentMap[row.experiment]) {
          experimentMap[row.experiment] =
            Object.keys(experimentMap).length + 1;
        }

        const expNo = experimentMap[row.experiment];

        if (expNo <= 10) {
          data[reg]["exp" + expNo] = row.total;
        }

        data[reg].grand_total += row.total;
      });

      return res.json(Object.values(data));
    }

    // ============================
    // ALL LABS, ALL EXPERIMENTS (no lab, no experiment given)
    // Section-wide flat list, used by experiment1.dart ->
    // downloadAllExperimentsPdf() for the "All Experiments" PDF.
    // ============================
    const marks = await Mark.find({
      department,
      section,
    })
      .select("register_number lab experiment total -_id")
      .sort({ register_number: 1 });

    return res.json({
      status: "success",
      marks,
    });
  } catch (error) {
    console.error(error);
    res.json([]);
  }
});

module.exports = router;
