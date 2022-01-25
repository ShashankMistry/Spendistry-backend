const mongoose = require('mongoose');

const returnSchema = new mongoose.Schema({
    reportNumber: {
        type: String
    },
    reportDate: {
        type: String
    },
    reportBy: {
        type: String
    },
    reportTitle: {
        type: String
    },
    reportTime: {
        type: Date,
        default: Date.now
    },
    reportCustomerNumber : {
        type: String
    },
    reportCustomerName : {
        type: String
    },
    InvoiceID : {
        type: String
    },
    extra1 : {
        type: String
    },
    extra2 : {
        type: String
    },
    extra3 : {
        type: String
    },
    extra4 : {
        type: String
    },
    extra5 : {
        type: String
    }
});

module.exports = mongoose.model('Return', returnSchema);