const express = require('express');
const router = express.Router();
const invoice = require('../models/invoice');
const mongoose = require('mongoose');
const report = require('../models/report');
const vendor = require('../models/vendor');

router.get('/:id', async (req, res) => {
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
                $lookup: {
                    from: 'Invoice',
                    localField: '_id',
                    foreignField: 'businessName._id',
                    as: 'invoice'
                },
                $unwind: '$invoice',
                vendor:{
                    $push: '$invoice'
                }

            }
        },
        

        // count of all invoices

        {$project: {
            // _id: 0,
            monthlyIncome: '$monthly',
            yearlyIncome: '$yearly',
            totalIncome: '$totalAll',
            issuedInvoices: {
                $size: '$invoice'
            },
            vendor: '$vendor'
        }},

        //get the vendor name

        // {$lookup: {
        //     from: 'Invoice',
        //     localField: '_id',
        //     foreignField: 'businessName._id',
        //     as: 'vendor'
        // }},
        // {$unwind: '$vendor'},
        // {$project: {
        //     vendorName: '$vendor',
        // }},


    //     // get vendor
    //     {$lookup: {
    //         from: "invoice",
    //         localField: '$businessName._id',
    //         foreignField: '_id',
    //         as: 'vendor'
    //     }
    // },
    // {$unwind: '$vendor'},



    // {$unwind: '$vendor.businessName'},
    // {$unwind: '$vendor.businessName.invoices'},
    // {$match: {'vendor.businessName._id': req.params.id}},
    // {$project: {
    //     vendorDetails:{
    //         "vendor._id": 0,
    //         "vendor.fname": 0,
    //         "vendor.lname": 0,
    //         "vendor.email": 0,
    //         "vendor.mobileNumber": 0,
    //         "vendor.address": 0,
    //         "vendor.city": 0,
    //         "vendor.state": 0,
    //         "vendor.lat": 0,
    //         "vendor.lng": 0,
    //         "vendor.vendorName": 0,
    //         "vendor.tollFreeNumber": 0,
    //         "vendor.website": 0,
    //         "vendor.currentInvoiceNumber": 0,
    //         "vendor.panNumber": 0,
    //         "vendor.gstNumber": 0,
    //         "vendor.extra1": 0

    //     }
    // }},
    ]);
    res.send(mvd);
});

module.exports = router;