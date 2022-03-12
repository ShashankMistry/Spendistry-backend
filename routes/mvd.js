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
                                then: '$businessName.invoices.invoiceNumber',
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
                                    then: '$businessName.invoices.invoiceNumber',
                                    else: 0
                                       }
                            }
                    },
                    totalAll:{
                        $sum:'$businessName.invoices.invoiceNumber'
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
                roundoff: '$roundoff'
            }},
        ]);
        
        res.send({
            invoiceDetails: mvd, vendorDetails: vendorDetails, reportCount: reportCount
        });
    } catch (err) {
        res.status(500).json({message: err.message});
    }


});

module.exports = router;