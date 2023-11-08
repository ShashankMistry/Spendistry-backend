const mongoose = require('mongoose');

const ReturnSchema = new mongoose.Schema({

    invoiceNumber: {
        type: Number   
    },
    invoiceDate: {
        type: String
    },
    invoiceAmount: {
        type: String
        
    },
    invoiceStatus: {
        type: String
        
    },
    invoiceTitle: {
        type: String
      
    },
    invoiceTotalitems: {
        type: Array
        // type: [{
        //     itemName: {
        //         type: String
        //     },
        //     itemPrice: {
        //         type: String
        //     }
        // }]
    },
    invoiceSentTo: {
        type: String
      
    },
    invoiceSentBy: {
        type: String
      
    },
    invoicePaymentMode: {
        type: String
     
    },
    invoicePDF: {
        type: String
     
    },
    invoiceReport: {
        type: String
   
    },
    invoiceDescription: {
        type: String
    },
    reportReason: {
        type: String
    },
    invoiceTime : {
        type: Number,
        default: Date.now
    },
    discount : {
        type: String
    },
    roundoff : {
        type: Number
    },
    city : {
        type: String
    },
    oldInvoiceId:{
        type: String
    },
    businessAddress : {
        type: String
    },
    businessContactNo : {
        type: String
    },
    extra1: {
        type: String
    },
    extra2: {
        type: String
    },
    extra3: {
        type: String
    },
    extra4: {
        type: String
    },
    extra5: {
        type: String
    }
    // invoiceNumber: {
    //     type: String
       
    // },
    // invoiceDate: {
    //     type: String
    
    // },
    // invoiceAmount: {
    //     type: String
        
    // },
    // invoiceStatus: {
    //     type: String
        
    // },
    // invoiceTitle: {
    //     type: String
      
    // },
    // invoiceTotalitems: {
    //     type: String
        
    // },
    // invoiceIGST: {
    //     type: Array
      
    // },
    // invoiceCGST: {
    //     type: String
       
    // },
    // invoiceSGST: {
    //     type: String
   
    // },
    // invoiceUTGST: {
    //     type: String
    
    // },
    // invoiceSentTo: {
    //     type: String
      
    // },
    // invoiceSentBy: {
    //     type: String
      
    // },
    // invoicePaymentMode: {
    //     type: String
     
    // },
    // invoicePDF: {
    //     type: String
     
    // },
    // invoiceReport: {
    //     type: String
   
    // },
    // invoiceTime : {
    //     type: Number,
    //     default: Date.now
    // },
    // discount : {
    //     type: String
    // },
    // roundoff : {
    //     type: String
    // },
    // reportReason : {
    //     type: String
    // },
    // extra1: {
    //     type: String
    // },
    // extra2: {
    //     type: String
    // },
    // extra3: {
    //     type: String
    // },
    // extra4: {
    //     type: String
    // },
    // extra5: {
    //     type: String
    // }
});

module.exports = mongoose.model('Return', ReturnSchema);