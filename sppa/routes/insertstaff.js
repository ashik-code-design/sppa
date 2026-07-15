const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const dotenv = require("dotenv");

dotenv.config();

const Staff = require("./models/Staff");

mongoose.connect(process.env.MONGO_URI)
.then(async () => {

    console.log("MongoDB Connected");

    const ids = [
        "ST001",
        "ST002",
        "ST003",
        "ST004",
        "ST005",
        "ST006",
        "ST007",
        "ST008",
        "ST009",
        "ST010",
        "ST011",
        "ST012"
    ];

    const hash = await bcrypt.hash("147852", 10);

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
