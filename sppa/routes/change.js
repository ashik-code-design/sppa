const express = require("express");
const router = express.Router();

const Staff = require("../models/Staff");

router.post("/", async (req, res) => {
    try {

        const { staffId, oldPassword, newPassword } = req.body;

        if (!staffId || !oldPassword || !newPassword) {
            return res.status(400).json({
                status: "error",
                message: "All fields are required"
            });
        }

        const staff = await Staff.findOne({ staff_id: staffId });

        if (!staff) {
            return res.status(404).json({
                status: "error",
                message: "Staff not found"
            });
        }

        if (staff.password !== oldPassword) {
            return res.status(400).json({
                status: "error",
                message: "Old password is incorrect"
            });
        }

        staff.password = newPassword;
        staff.password_changed = 1;

        await staff.save();

        res.json({
            status: "success",
            message: "Password changed successfully"
        });

    } catch (err) {

        console.log(err);

        res.status(500).json({
            status: "error",
            message: "Server Error"
        });

    }
});

module.exports = router;
