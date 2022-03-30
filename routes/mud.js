const express = require('express');
const router = express.Router();
const Invoice = require('../models/invoice');
const User = require('../models/user');
const cryptoJS = require('crypto-js');
const report = require('../models/report');
s

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
            {$project: {
                MonthlyTotalAll: '$MonthlyTotalAll',
                AllTimeTotal:  '$AllTimeTotal',
            }
        },
    
        ]);

        const userDetails = await User.findById(req.params.id);

        const businessDetails = await Invoice.aggregate([
            {$match: { _id: req.params.id}},
            {$unwind: '$businessName'},
            {$unwind: '$businessName.invoices'},
            {$group: {
                _id: req.params.id,
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
                    AllTotal: {$sum: '$businessName.invoices.roundoff'},
                    invoiceTitle: '$businessName.invoices.invoiceTitle',
                   
                }
            }
            }},
            {$unwind: '$business'},
            {$group: {      
                _id:'$business._id',            
                businessTotal:{
                    $sum: '$business.MonthlyTotal'
                },
                businessAllTimeTotal: {$sum: '$business.AllTotal'},
            }
        },
            
            {$project: {
                _id: '$_id',
                AllTotal: '$businessAllTimeTotal',
                MonthlyTotal: '$businessTotal',
                invoiceTitle: '$business.invoiceTitle',
            }
        },
        

        ]);

        const reportDetails = await report.find({reportBy: req.params.id});



        if(total.length > 0){
            var send = Object.assign({}, total[0], {encryptedQr, userDetails, businessDetails, reportDetails});
        } else {
            var send = Object.assign({}, {_id: req.params.id,MonthlyTotalAll:0, AllTimeTotal:0, reportDetails:0}, {encryptedQr, userDetails, businessDetails:[]});
        }

        res.json(send);

    } catch (error) {
        res.status(500).send(error);
        
    }
});

module.exports = router;