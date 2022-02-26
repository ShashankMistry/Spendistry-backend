const mongoose = require('mongoose');

const invoiceSchema = new mongoose.Schema({
    _id: {
        type: String //user email
    },
    businessName: {
        type:[{
            _id:{
                type: String //business email
            },
         invoices:{
             type:[{
                    // _id:{
                    //     type: String,
                    // },
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
                        invoiceIGST: {
                            type: String
                          
                        },
                        invoiceCGST: {
                            type: String
                           
                        },
                        invoiceSGST: {
                            type: String
                       
                        },
                        invoiceUTGST: {
                            type: String
                        
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
                        invoiceTime : {
                            type: Date,
                            default: Date.now
                        },
                        discount : {
                            type: String
                        },
                        roundoff : {
                            type: String
                        },
                        city : {
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
        }]
    }
    }   
    ]
}
});

module.exports = mongoose.model('Invoice', invoiceSchema);

// const mongoose = require('mongoose');

// const invoiceSchema = new mongoose.Schema({
//     _id: {
//         type: String
//     },
//     invoices: {
    
//     type: [
//         {
//             invoiceNumber: {
//                 type: Number
               
//             },
//             invoiceDate: {
//                 type: String
            
//             },
//             invoiceAmount: {
//                 type: String
                
//             },
//             invoiceStatus: {
//                 type: String
                
//             },
//             invoiceTitle: {
//                 type: String
              
//             },
//             invoiceTotalitems: {
//                 type: Array
//                 // type: [{
//                 //     itemName: {
//                 //         type: String
//                 //     },
//                 //     itemPrice: {
//                 //         type: String
//                 //     }
//                 // }]
//             },
//             invoiceIGST: {
//                 type: String
              
//             },
//             invoiceCGST: {
//                 type: String
               
//             },
//             invoiceSGST: {
//                 type: String
           
//             },
//             invoiceUTGST: {
//                 type: String
            
//             },
//             invoiceSentTo: {
//                 type: String
              
//             },
//             invoiceSentBy: {
//                 type: String
              
//             },
//             invoicePaymentMode: {
//                 type: String
             
//             },
//             invoicePDF: {
//                 type: String
             
//             },
//             invoiceReport: {
//                 type: String
           
//             },
//             invoiceTime : {
//                 type: Date,
//                 default: Date.now
//             },
//             discount : {
//                 type: String
//             },
//             roundoff : {
//                 type: String
//             },
//             city : {
//                 type: String
//             },
//             extra1: {
//                 type: String
//             },
//             extra2: {
//                 type: String
//             },
//             extra3: {
//                 type: String
//             },
//             extra4: {
//                 type: String
//             },
//             extra5: {
//                 type: String
//             }
//         }
//     ]
// }
// });

// module.exports = mongoose.model('Invoice', invoiceSchema);

    



    