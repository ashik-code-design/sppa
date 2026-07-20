const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const dotenv = require("dotenv");

dotenv.config();

const Staff = require("./models/Staff");

mongoose.connect(process.env.MONGO_URI)
.then(async () => {

    console.log("MongoDB Connected");

    const ids = [
        "12FCS01",
        "12FCS02",
        "16FCS01",
        "17FCS01",
        "21FCS01",
        "23FCS01",
        "23FCS02",
        "24FCS01",
        "24FCS02",
        "24FCS03",
        "25FCS01",
        "10TCS03",
        "26SCS01"
    ];

    const hash = await bcrypt.hash("12345678", 20);

    for (const id of ids) {

        const exist = await Staff.findOne({ staff_id: id });

        if (!exist) {

            await Staff.create({
                staff_id: id,
                password: hash,
                password_changed: false
            });

            console.log(id + " inserted");

        } else {

            console.log(id + " already exists");

        }
    }

    console.log("Finished");
    process.exit();

})
.catch(err => {
    console.log(err);
});
