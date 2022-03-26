const mongoose = require('mongoose');

const authBusinessSchema = new mongoose.Schema({
    _id : {
        type: String
    },
    password : {
        type: String
    }
});

module.exports = mongoose.model('AuthBusiness', authBusinessSchema);