const mongoose = require("mongoose");

const studentSchema = new mongoose.Schema({

    roll_no: {
        type: String,
        required: true,
        unique: true
    },

    student_name: {
        type: String,
        required: true
    },

    department: {
        type: String,
        required: true
    },

    section: {
        type: String,
        required: true
    }

});

module.exports = mongoose.model("Student", studentSchema);
