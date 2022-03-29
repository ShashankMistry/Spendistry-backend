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
                 business:{
                    $push:{
                    _id: '$businessName._id',
                    MonthlyTotal: {
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
                    AllTotal: {$sum: '$businessName.invoices.roundoff'}
                }
            }
            }},
            // {$unwind: '$business'},
            {$group: {      
                // _id:'$business._id',
                MonthlyTotalAll: {$last: '$MonthlyTotalAll'},
                AllTimeTotal:{$last: '$AllTimeTotal'},
               
                // businessTotal:{
                //     $sum: '$business.MonthlyTotal'
                // },
                // businessAllTimeTotal: {$sum: '$business.AllTotal'}
            
            }
        },
            
            {$project: {
                MonthlyTotalAll: '$MonthlyTotalAll',
                AllTimeTotal:  '$AllTimeTotal',
                qr: encryptedQr
            }
        },
    
        ]);
        
        if(total.length === 0){
            res.json([{_id:"No data found",
            MonthlyTotalAll: 0,
            AllTotal: 0,
            MonthlyTotal: 0,
            AllTimeTotal: 0,
            qr: cryptoJS.AES.encrypt(req.params.id, process.env.QR_HASH_KEY).toString()
        }]);
        } else {
        res.json(total);           
        }    

    } catch (error) {
        res.status(500).send(error);
        
    }
});

module.exports = router;