const mongoose = require("../database"); // import your DB connection

// User schema
const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    }, img: {
        type: String,
        required: true
    },
    studentId: {  // renamed 'id' to 'studentId' to avoid conflicts
        type: String,
        required: true,
        unique: true
    },
    gender: {
        type: String,
        enum: ["Male", "Female", "Other"], // optional validation
        required: true
    },
    dep: {
        type: String,
        required: true
    },
    year: {
        type: Number,
        required: true
    },
    interests: {
        type: [String],  // list of strings
        default: []
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    }
}, { timestamps: true }); // automatically adds createdAt and updatedAt

// create model
const User = mongoose.model("User", userSchema);

module.exports = User;
