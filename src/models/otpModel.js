const mongoose = require("mongoose");

const otpSchema = new mongoose.Schema({
    useremail: {
        type: String,
        required: true
    },
    code: {
        type: String,
        required: true
    },
    expireIn: {
        type: Number
    }
})

const otp = new mongoose.model("otp", otpSchema, "otp");

module.exports = otp;