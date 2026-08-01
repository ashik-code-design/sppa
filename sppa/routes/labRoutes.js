const express = require("express");
const router = express.Router();

const Lab = require("../models/Lab");

// ================= ADD LAB =================
// POST /lab/addLab
// body: { lab_name, experiments: ["Exp 1", "Exp 2", ...] }
router.post("/addLab", async (req, res) => {
  try {
    const { lab_name, experiments } = req.body;

    if (!lab_name?.trim()) {
      return res.json({
        status: "error",
        message: "Lab name is required",
      });
    }

    const exist = await Lab.findOne({ lab_name: lab_name.trim() });

    if (exist) {
      return res.json({
        status: "error",
        message: "Lab already exists",
      });
    }

    const cleanExperiments = Array.isArray(experiments)
      ? experiments.map((e) => e.trim()).filter((e) => e.length > 0)
      : [];

    await Lab.create({
      lab_name: lab_name.trim(),
      experiments: cleanExperiments,
    });

    res.json({
      status: "success",
      message: "Lab Added Successfully",
    });
  } catch (err) {
    console.error(err);
    res.json({
      status: "error",
      message: "Server Error",
    });
  }
});

// ================= VIEW LABS =================
// GET /lab/labs
router.get("/labs", async (req, res) => {
  try {
    const labs = await Lab.find({}).sort({ lab_name: 1 });

    res.json({
      status: "success",
      labs: labs,
    });
  } catch (err) {
    console.error(err);
    res.json({
      status: "error",
      message: "Server Error",
    });
  }
});

// ================= UPDATE LAB (rename + replace experiments) =================
// PUT /lab/updateLab/:id
// body: { lab_name, experiments: [...] }
router.put("/updateLab/:id", async (req, res) => {
  try {
    const { lab_name, experiments } = req.body;

    if (!lab_name?.trim()) {
      return res.json({
        status: "error",
        message: "Lab name is required",
      });
    }

    const cleanExperiments = Array.isArray(experiments)
      ? experiments.map((e) => e.trim()).filter((e) => e.length > 0)
      : [];

    await Lab.findByIdAndUpdate(req.params.id, {
      lab_name: lab_name.trim(),
      experiments: cleanExperiments,
    });

    res.json({
      status: "success",
      message: "Lab Updated Successfully",
    });
  } catch (err) {
    console.error(err);
    res.json({
      status: "error",
      message: "Server Error",
    });
  }
});

// ================= DELETE LAB =================
// DELETE /lab/deleteLab/:id
router.delete("/deleteLab/:id", async (req, res) => {
  try {
    await Lab.findByIdAndDelete(req.params.id);

    res.json({
      status: "success",
      message: "Lab Deleted Successfully",
    });
  } catch (err) {
    console.error(err);
    res.json({
      status: "error",
      message: "Server Error",
    });
  }
});

module.exports = router;
