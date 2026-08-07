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

        const match = await bcrypt.compare(
            password,
            admin.password
        );

        if (!match) {
            return res.json({
                status: "error",
                message: "Invalid Password"
            });
        }

        res.json({
            status: "success",
            message: "Admin Login Successful",
            admin: {
                admin_id: admin.admin_id,
                role: admin.role
            }
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

        const { staffId, staffName } = req.body;

        if (!staffId || !staffName) {
            return res.json({
                status: "error",
                message: "Staff ID and Staff Name are required"
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

        const hash = await bcrypt.hash("12345678", 10);

        await Staff.create({
            staff_id: staffId,
            staff_name: staffName,
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
                staff_id: 1,
                staff_name: 1,
                password_changed: 1
            }
        ).sort({
            staff_name: 1
        });

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
// ================= RESET STAFF PASSWORD =================
router.put("/resetPassword/:id", async (req, res) => {

    try {

        const hash = await bcrypt.hash("147852", 10);

        await Staff.findByIdAndUpdate(
            req.params.id,
            {
                password: hash,
                password_changed: false
            }
        );

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


// ================= ADMIN CHANGE PASSWORD =================
router.put("/changePassword", async (req, res) => {

    try {

        const { adminId, oldPassword, newPassword } = req.body;

        if (!adminId || !oldPassword || !newPassword) {
            return res.json({
                status: "error",
                message: "All fields are required"
            });
        }

        const admin = await Admin.findOne({
            admin_id: adminId.trim()
        });

        if (!admin) {
            return res.json({
                status: "error",
                message: "Invalid Admin ID"
            });
        }

        const match = await bcrypt.compare(
            oldPassword,
            admin.password
        );

        if (!match) {
            return res.json({
                status: "error",
                message: "Old Password is incorrect"
            });
        }

        const hash = await bcrypt.hash(newPassword, 10);

        admin.password = hash;

        await admin.save();

        res.json({
            status: "success",
            message: "Password Changed Successfully"
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

        const { staffId, staffName } = req.body;

        if (!staffId || !staffName) {
            return res.json({
                status: "error",
                message: "Staff ID and Staff Name are required"
            });
        }

        const exist = await Staff.findOne({
            staff_id: staffId,
            _id: { $ne: req.params.id }
        });

        if (exist) {
            return res.json({
                status: "error",
                message: "Staff ID already exists"
            });
        }

        await Staff.findByIdAndUpdate(
            req.params.id,
            {
                staff_id: staffId,
                staff_name: staffName
            }
        );

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
