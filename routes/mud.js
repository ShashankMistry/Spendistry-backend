const express = require('express');
const router = express.Router();
const Invoice = require('../models/invoice');
const mongoose = require('mongoose');
const report = require('../models/report');
const user = require('../models/user');
const cryptoJS = require('crypto-js');

//get user dashboard
router.get('/:id', async (req, res) => {

     //hash the id with cryptoJS
     var encryptedQr = cryptoJS.AES.encrypt(req.params.id, process.env.QR_HASH_KEY).toString();

    try {
    const total = await Invoice.aggregate([
        {$match: { _id: req.params.id}
        },
        {$unwind: '$businessName'},    
        {$unwind: '$businessName.invoices'},
        {$group: {
            _id: req.params.id,
            MonthlyTotalAll: {
                $sum : {
                       $cond: {
                         if: {
                             $gte: [
                                 '$businessName.invoices.invoiceTime',
                                 Date.now - (1000 * 60 * 60 * 24 * 30)
                             ],  
                         },
                         then: '$businessName.invoices.roundoff',
                         else: 0
                     }
                 }
             },
             AllTimeTotal:{
                 $sum:'$businessName.invoices.roundoff'
             },
           
        }},
        {$unwind: '$business'},
        {$group: {      
            MonthlyTotalAll: {$last: '$MonthlyTotalAll'},
            AllTimeTotal:{$last: '$AllTimeTotal'},
        }
    },
        
        {$project: {
            MonthlyTotalAll: '$MonthlyTotalAll',
            AllTimeTotal:  '$AllTimeTotal',
            qr: encryptedQr
        }
    },

    ]);
    res.send(total);
    
        
    } catch (error) {
        
    }
});

module.exports = router;