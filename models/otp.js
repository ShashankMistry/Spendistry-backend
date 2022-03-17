const mongoose = require('mongoose');

const otpSchema = new mongoose.Schema({
    _id : {
        type: String
    },
    otp : {
        type: String
    },
});

module.exports = mongoose.model('Otp', otpSchema);