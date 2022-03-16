const express = require('express');
const router = express.Router();
const invoice = require('../models/invoice');
const mongoose = require('mongoose');
const report = require('../models/report');
const vendor = require('../models/vendor');

router.get('/:id', async (req, res) => {
    
    try {

    //getting vendor details
    const vendorDetails = await vendor.findById(req.params.id);

    //getting number of reports 
    const reportCount = await report.countDocuments({reportTo: req.params.id});

   const mvd  = await invoice.aggregate([
        {$match: {"businessName._id": req.params.id}},
            {$unwind: '$businessName'},    
            {$unwind: '$businessName.invoices'},
            //this group is for monthly and yearly income
            {$group: {
                     _id: req.params.id,
                    monthly: {
                       $sum : {
                              $cond: {
                                if: {
                                    $gte: [
                                        '$businessName.invoices.invoiceTime',
                                        new Date(Date.now() - (1000 * 60 * 60 * 24 * 30))
                                    ],  
                                },
                                then: '$businessName.invoices.roundoff',
                                else: 0   
                            }
                        }
                    },
                    yearly: {
                        $sum : {
                                $cond: {
                                    if: {
                                        $gte: [
                                            '$businessName.invoices.invoiceTime',
                                            new Date(Date.now() - (1000 * 60 * 60 * 24 * 365))
                                        ],  
                                    },
                                    then: '$businessName.invoices.roundoff',
                                    else: 0
                                       }
                            }
                    },
                    totalAll:{
                        $sum:'$businessName.invoices.roundoff'
                    },
                    invoice:{
                        $push: '$businessName.invoices'
                    },
                    roundoff:{
                        $push:'$businessName.invoices.roundoff'
                    }
    
                }
            },
            
    
            // invoice details
    
            {$project: {
                monthlyIncome: '$monthly',
                yearlyIncome: '$yearly',
                totalIncome: '$totalAll',
                issuedInvoices: {
                    $size: '$invoice'
                },
                roundoff: '$roundoff',

            }},

        ]);
        
        if(mvd.length > 0){
            var send = Object.assign({}, mvd[0], {vendorDetails: vendorDetails, reportCount: reportCount});

        }else {
            var send = Object.assign({},{
                _id:req.params.id,
                monthlyIncome: 0,
            yearlyIncome: 0,
            totalIncome: 0,
            issuedInvoices: 0,
            roundoff: [0,0]},{vendorDetails: vendorDetails, reportCount: 0});
        }
        

        // res.send({
        //     invoiceDetails: mvd, vendorDetails: vendorDetails, reportCount: reportCount
        // });
        res.send(send);
    } catch (err) {
        res.status(500).json({message: err.message});
    }


});

module.exports = router;