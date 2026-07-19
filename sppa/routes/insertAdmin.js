const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const dotenv = require("dotenv");

dotenv.config();

const Admin = require("./models/Admin");

mongoose.connect(process.env.MONGO_URI)
.then(async () => {

    const hash = await bcrypt.hash("admin123",10);

    await Admin.create({
        admin_id:"ADMIN001",
        password:hash
    });

    console.log("Admin Created");

    process.exit();

})
.catch(err=>{
    console.log(err);
});
