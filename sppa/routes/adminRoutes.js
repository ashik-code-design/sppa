const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const Admin = require("../models/Admin");

router.post("/login", async (req,res)=>{

    const {adminId,password}=req.body;

    const admin=await Admin.findOne({
        admin_id:adminId
    });

    if(!admin){

        return res.json({
            status:"error",
            message:"Invalid Admin"
        });

    }

    const match=await bcrypt.compare(password,admin.password);

    if(!match){

        return res.json({
            status:"error",
            message:"Invalid Password"
        });

    }

    res.json({
        status:"success",
        message:"Admin Login Successful"
    });

});

module.exports=router;
