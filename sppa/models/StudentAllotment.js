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

    students: [{
        type: String
    }]

}, {
    timestamps: true
});

module.exports = mongoose.model(
    "StudentAllotment",
    studentAllotmentSchema
);
