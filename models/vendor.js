const mongoose = require('mongoose');

const vendorSchema = new mongoose.Schema({
    fname: {
        type: String,
        // required: true
    },
    lname: {
        type: String,
        // required: true
    },
    email: {
        type: String,
        // required: true
    },
    _id: {
        type: String,
    },
    mobileNumber: {
        type: String,
        // required: true
    },
    address: {
        type: String,
        // required: true
    },
    city : {
        type: String
    },
    state : {
        type: String
    },
    lat: {
        type: String,
    },
    lng: {
        type: String,
    },
    vendorName: {
        type: String,
        // required: true
    },
    tollFreeNumber: {
        type: String,
    },
    website: {
        type: String,
    },
    currentInvoiceNumber: {
        type: Number,
        default: 0
    },
    panNumber: {
        type: String,
    //    required: true
    },
    gstNumber: {
        type: String,
    //    required: true
    }, 
    vendorDescription: {
        type: String,
    },
    extra1: {
        type: String,
    },
    extra2: {
        type: String,
    },
    extra3: {
        type: String,
    },
    extra4: {
        type: String,
    },
    extra5: {
        type: String,
    },
});

module.exports = mongoose.model('Vendor', vendorSchema);