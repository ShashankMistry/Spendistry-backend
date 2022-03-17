const mongoose = require('mongoose');

const reportSchema = new mongoose.Schema({
    reportNumber: {
        type: String
    },
    reportDate: {
        type: String
    },
    reportBy: {
        type: String
    },
    reportTo: {
        type: String
    },
    reportTitle: {
        type: String
    },
    reportTime: {
        type: Date,
        default: Date.now
    },
    customerNumber : {
        type: String
    },
    customerName : {
        type: String
    },
    businessName : {
        type: String
    },
    businessNumber : {
        type: String
    },
    reportReason : {
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

module.exports = mongoose.model('Report', reportSchema);