const express = require("express");
const router = express.Router();

const StudentAllotment = require("../models/StudentAllotment");


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
            roll_to
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
            roll_to

        } = req.body;

        await StudentAllotment.findByIdAndUpdate(

            req.params.id,

            {

                department,
                section,
                subject,
                roll_from,
                roll_to

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

        const from = parseInt(allotment.roll_from.match(/\d+/)[0]);
        const to = parseInt(allotment.roll_to.match(/\d+/)[0]);

        const prefix = allotment.roll_from.replace(/\d+/g, "");

        List = [];

        const students = [];

        for (let i = from; i <= to; i++) {
            students.push(prefix + i);
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
