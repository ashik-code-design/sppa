const express = require("express");
const router = express.Router();

const StudentAllotment = require("../models/StudentAllotment");

// SAVE STUDENT ALLOTMENT
router.post("/allotStudents", async (req, res) => {

    try {

        const {
            department,
            section,
            subject,
            staff_name,
            roll_from,
            roll_to
        } = req.body;

        if (
            !department ||
            !section ||
            !subject ||
            !staff_name ||
            !roll_from ||
            !roll_to
        ) {
            return res.json({
                status: "error",
                message: "All fields are required"
            });
        }

        await StudentAllotment.create({
            department,
            section,
            subject,
            staff_name,
            roll_from,
            roll_to
        });

        res.json({
            status: "success",
            message: "Student Allotment Saved Successfully"
        });

    } catch (err) {

        console.log(err);

        res.json({
            status: "error",
            message: "Server Error"
        });

    }

});

module.exports = router;
