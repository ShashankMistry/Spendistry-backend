const express = require('express');
const router = express.Router();
const invoice = require('../models/invoice');
const mongoose = require('mongoose');
const report = require('../models/report');
const vendor = require('../models/vendor');

router.get('/:id', async (req, res) => {
    res.send('MVD');
    const mvd  = await invoice.aggregate([
    {$match: {"businessName._id": req.params.id}},
        {$unwind: '$businessName'},    
        {$unwind: '$businessName.invoices'},
        {$group: {
                 "$businessName._id": req.params.id,
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
                }
            }
        },





    ]);
    res.send(mvd);
});

module.exports = router;