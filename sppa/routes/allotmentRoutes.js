const express = require("express");
const router = express.Router();

const StudentAllotment = require("../models/StudentAllotment");


// Normalizes one excluded-roll entry against the same prefix/padding
// convention used to build roll_from/roll_to into full register
// numbers: plain digits ("114") get the prefix prepended and padded
// to 3 digits ("24UCS114"); anything else is just uppercased as-is,
// in case the admin already typed the full register number.
function normalizeRoll(raw, prefix) {
    const val = raw.toString().trim().toUpperCase();

    if (/^\d+$/.test(val)) {
        return prefix + val.padStart(3, "0");
    }

    return val;
}


// ================= SAVE STUDENT ALLOTMENT =================
router.post("/allotStudents", async (req, res) => {

    try {

        const {
            department,
            section,
            subject,
            staff_id,
            staff_name,
            roll_from,
            roll_to,
            excluded_rolls
        } = req.body;

        if (
            !department ||
            !section ||
            !subject ||
            !staff_id ||
            !staff_name ||
            !roll_from ||
            !roll_to
        ) {
            return res.json({
                status: "error",
                message: "All fields are required"
            });
        }

        // Check if this staff already has an allotment
        const exist = await StudentAllotment.findOne({
            staff_id: staff_id
        });

        if (exist) {
            return res.json({
                status: "error",
                message: "This staff already has an allotted class."
            });
        }

        await StudentAllotment.create({

            department,
            section,
            subject,
            staff_id,
            staff_name,
            roll_from,
            roll_to,
            excluded_rolls: Array.isArray(excluded_rolls) ? excluded_rolls : []

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


// ================= VIEW ALL ALLOTMENTS =================
router.get("/allotments", async (req, res) => {

    try {

        const allotments = await StudentAllotment.find().sort({
            department: 1
        });

        res.json({

            status: "success",
            allotments

        });

    } catch (err) {

        console.log(err);

        res.json({

            status: "error",
            message: "Server Error"

        });

    }

});


// ================= GET STAFF ALLOTMENT =================
router.get("/staff/:staffId", async (req, res) => {

    try {

        const allotment = await StudentAllotment.findOne({

            staff_id: req.params.staffId

        });

        if (!allotment) {

            return res.json({

                status: "error",
                message: "No Student Allotment Found"

            });

        }

        res.json({

            status: "success",
            allotment

        });

    } catch (err) {

        console.log(err);

        res.json({

            status: "error",
            message: "Server Error"

        });

    }

});


// ================= UPDATE ALLOTMENT =================
router.put("/update/:id", async (req, res) => {

    try {

        const {

            department,
            section,
            subject,
            roll_from,
            roll_to,
            excluded_rolls

        } = req.body;

        await StudentAllotment.findByIdAndUpdate(

            req.params.id,

            {

                department,
                section,
                subject,
                roll_from,
                roll_to,
                excluded_rolls: Array.isArray(excluded_rolls) ? excluded_rolls : []

            }

        );

        res.json({

            status: "success",
            message: "Student Allotment Updated Successfully"

        });

    } catch (err) {

        console.log(err);

        res.json({

            status: "error",
            message: "Server Error"

        });

    }

});


// ================= DELETE ALLOTMENT =================
router.delete("/delete/:id", async (req, res) => {

    try {

        await StudentAllotment.findByIdAndDelete(req.params.id);

        res.json({

            status: "success",
            message: "Student Allotment Deleted Successfully"

        });

    } catch (err) {

        console.log(err);

        res.json({

            status: "error",
            message: "Server Error"

        });

    }

});
router.post("/getStudents", async (req, res) => {
    try {

        const {
            department,
            section,
            subject,
            staff_name
        } = req.body;
        console.log("Request Body:", req.body);

        const allotment = await StudentAllotment.findOne({
            department,
            section,
            subject,
            staff_name
        });
        console.log("Found:", allotment);

        if (!allotment) {
            return res.json({
                status: "error",
                message: "No students allotted"
            });
        }

        const rollFrom = allotment.roll_from.toUpperCase();
const rollTo = allotment.roll_to.toUpperCase();

// Prefix = everything except the last 3 digits
const prefix = rollFrom.substring(0, rollFrom.length - 3);

// Last 3 digits
const from = parseInt(rollFrom.substring(rollFrom.length - 3));
const to = parseInt(rollTo.substring(rollTo.length - 3));

// Excluded roll numbers (students who left) get normalized against
// the same prefix so "114" matches the generated "PREFIX114", then
// skipped while building the range below instead of ever being added.
const excludedSet = new Set(
    (allotment.excluded_rolls || []).map((r) => normalizeRoll(r, prefix))
);

const students = [];

for (let i = from; i <= to; i++) {
    const reg = prefix + i.toString().padStart(3, "0");

    if (!excludedSet.has(reg)) {
        students.push(reg);
    }
}

        res.json({
            status: "success",
            students: students
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
