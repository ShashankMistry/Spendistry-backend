const mongoose = require('mongoose');

const authBusinessSchema = new mongoose.Schema({
    _id : {
        type: String
    },
    password : {
        type: String
    },
    LoggedIn : {
        type: Boolean,
        default: false
    },
    isVerified : {
        type: Boolean,
        default: false
    }
});

module.exports = mongoose.model('AuthBusiness', authBusinessSchema);