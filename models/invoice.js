const mongoose = require("mongoose");

const invoiceSchema = new mongoose.Schema({
  _id: {
    type: String, //user email
  },
  businessName: {
    type: [
      {
        _id: {
          type: String, //business email
        },
        invoices: {
          type: [
            {
              // _id:{
              //     type: String,
              // },
              invoiceNumber: {
                type: Number,
              },
              invoiceDate: {
                type: String,
              },
              invoiceAmount: {
                type: String,
              },
              invoiceStatus: {
                type: String,
              },
              invoiceTitle: {
                type: String,
              },
              invoiceTotalitems: {
                type: Array,
              },
              invoiceHST: {
                type: String,
              },
              invoiceSentTo: {
                type: String,
              },
              invoiceSentBy: {
                type: String,
              },
              invoicePaymentMode: {
                type: String,
              },
              invoicePDF: {
                type: String,
              },
              invoiceReport: {
                type: String,
              },
              invoiceDescription: {
                type: String,
              },
              reportReason: {
                type: String,
              },
              invoiceTime: {
                type: Number,
                default: Date.now,
              },
              discount: {
                type: String,
              },
              roundoff: {
                type: Number,
              },
              city: {
                type: String,
              },
              businessAddress: {
                type: String,
              },
              businessContactNo: {
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
            },
          ],
        },
      },
    ],
  },
});

module.exports = mongoose.model("Invoice", invoiceSchema);
