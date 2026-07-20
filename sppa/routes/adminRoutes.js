const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");

const Admin = require("../models/Admin");
const Staff = require("../models/Staff");


// ================= ADMIN LOGIN =================
router.post("/login", async (req, res) => {

    try {

        const { adminId, password } = req.body;

        if (!adminId || !password) {
            return res.json({
                status: "error",
                message: "Admin ID and Password are required"
            });
        }

        const admin = await Admin.findOne({
            admin_id: adminId
        });

        if (!admin) {
            return res.json({
                status: "error",
                message: "Invalid Admin ID"
            });
        }

        const match = await bcrypt.compare(password, admin.password);

        if (!match) {
            return res.json({
                status: "error",
                message: "Invalid Password"
            });
        }

        res.json({
            status: "success",
            message: "Admin Login Successful"
        });

    } catch (err) {

        console.log(err);

        res.json({
            status: "error",
            message: "Server Error"
        });

    }

});


// ================= ADD STAFF =================
router.post("/addStaff", async (req, res) => {

    try {

        const { staffId } = req.body;

        if (!staffId) {
            return res.json({
                status: "error",
                message: "Staff ID is required"
            });
        }

        const exist = await Staff.findOne({
            staff_id: staffId
        });

        if (exist) {
            return res.json({
                status: "error",
                message: "Staff already exists"
            });
        }

        const hash = await bcrypt.hash("147852", 10);

        await Staff.create({
            staff_id: staffId,
            password: hash,
            password_changed: false
        });

        res.json({
            status: "success",
            message: "Staff Added Successfully"
        });

    } catch (err) {

        console.log(err);

        res.json({
            status: "error",
            message: "Server Error"
        });

    }

});


// ================= VIEW STAFF =================
router.get("/staffs", async (req, res) => {

    try {

        const staffs = await Staff.find(
            {},
            {
                password: 0,
                __v: 0
            }
        );

        res.json({
            status: "success",
            staffs: staffs
        });

    } catch (err) {

        console.log(err);

        res.json({
            status: "error",
            message: "Server Error"
        });

    }

});


// ================= RESET PASSWORD =================
router.put("/resetPassword/:id", async (req, res) => {

    try {

        const hash = await bcrypt.hash("147852", 10);

        await Staff.findByIdAndUpdate(req.params.id, {
            password: hash,
            password_changed: false
        });

        res.json({
            status: "success",
            message: "Password Reset Successfully"
        });

    } catch (err) {

        console.log(err);

        res.json({
            status: "error",
            message: "Server Error"
        });

    }

});


// ================= DELETE STAFF =================
router.delete("/deleteStaff/:id", async (req, res) => {

    try {

        await Staff.findByIdAndDelete(req.params.id);

        res.json({
            status: "success",
            message: "Staff Deleted Successfully"
        });

    } catch (err) {

        console.log(err);

        res.json({
            status: "error",
            message: "Server Error"
        });

    }

});
// ================= UPDATE STAFF =================
router.put("/updateStaff/:id", async (req, res) => {

    try {

        const { staffId } = req.body;

        if (!staffId) {
            return res.json({
                status: "error",
                message: "Staff ID is required"
            });
        }

        const exist = await Staff.findOne({
            staff_id: staffId
        });

        if (exist) {
            return res.json({
                status: "error",
                message: "Staff ID already exists"
            });
        }

        await Staff.findByIdAndUpdate(req.params.id, {
            staff_id: staffId
        });

        res.json({
            status: "success",
            message: "Staff Updated Successfully"
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
