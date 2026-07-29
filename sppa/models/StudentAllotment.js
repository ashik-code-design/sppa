const mongoose = require("mongoose");

const studentAllotmentSchema = new mongoose.Schema({

    department: {
        type: String,
        required: true
    },

    section: {
        type: String,
        required: true
    },

    subject: {
        type: String,
        required: true
    },

    staff_name: {
        type: String,
        required: true
    },

    roll_from: {
        type: String,
        required: true
    },

    roll_to: {
        type: String,
        required: true
    }

}, { timestamps: true });

module.exports = mongoose.model(
    "StudentAllotment",
    studentAllotmentSchema
);
