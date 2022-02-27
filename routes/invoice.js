const express = require('express');
const router = express.Router();
const Invoice = require('../models/invoice');
const mongoose = require('mongoose');

//getting all
router.get('/', async (req, res) => {
    // res.send('getting all users');
    try {
    const invoice = await Invoice.find();
    res.json(invoice);
    } catch (err) {
        res.status(500).json({message: err.message});
    }
})

//getting one
router.get('/:id', getInvoice, (req, res) => {
    res.json(res.invoice);
})

//creating one
router.post('/', async (req, res) => {
    // res.send(`creating user ${req.body.name}`);
    const invoice = new Invoice({ 
        _id: req.body._id,
        businessName: req.body.businessName,
        // invoices: req.body.invoices
        // invoiceNumber: req.body.invoiceNumber,
        // invoiceDate: req.body.invoiceDate,
        // invoiceAmount: req.body.invoiceAmount,
        // invoiceStatus: req.body.invoiceStatus,
        // invoiceTitle: req.body.invoiceTitle,
        // invoiceTotalitems: req.body.invoiceTotalitems,
        // invoiceIGST: req.body.invoiceIGST,
        // invoiceCGST: req.body.invoiceCGST,
        // invoiceSGST: req.body.invoiceSGST,
        // invoiceUTGST: req.body.invoiceUTGST,
        // invoiceSentTo: req.body.invoiceSentTo,
        // invoiceSentBy: req.body.invoiceSentBy,
        // invoicePaymentMode: req.body.invoicePaymentMode,
        // invoicePDF: req.body.invoicePDF,
        // invoiceReport: req.body.invoiceReport,
        // invoiceTime : req.body.invoiceTime,
        // discount : req.body.discount,
        // roundoff : req.body.roundoff,
        // city : req.body.city,
        // extra1 : req.body.extra1,
        // extra2 : req.body.extra2,
        // extra3 : req.body.extra3,
        // extra4 : req.body.extra4,
        // extra5 : req.body.extra5
    });
    try{
        const savedInvoice = await invoice.save();
        res.status(201).json(savedInvoice);
        
    } catch (err) {
        res.status(400).json({message: err.message});
    }
})

// updating one
router.patch('/:id', getInvoice, async (req, res) => {
    // res.send(`updating user ${req.params.id}`);
    if(req.body.businessName != null){
        res.invoice.invoices = req.body.businessName;
    }

    // if(req.body.invoiceNumber != null){
    //     res.invoice.invoiceNumber = req.body.invoiceNumber;
    // }
    // if(req.body.invoiceDate != null){
    //     res.invoice.invoiceDate = req.body.invoiceDate;
    // }
    // if(req.body.invoiceAmount != null){
    //     res.invoice.invoiceAmount = req.body.invoiceAmount;
    // }
    // if(req.body.invoiceStatus != null){
    //     res.invoice.invoiceStatus = req.body.invoiceStatus;
    // }
    // if(req.body.invoiceTitle != null){
    //     res.invoice.invoiceTitle = req.body.invoiceTitle;
    // }
    // if(req.body.invoiceTotalitems != null){
    //     res.invoice.invoiceTotalitems = req.body.invoiceTotalitems;
    // }
    // if(req.body.invoiceIGST != null){
    //     res.invoice.invoiceIGST = req.body.invoiceIGST;
    // }
    // if(req.body.invoiceCGST != null){
    //     res.invoice.invoiceCGST = req.body.invoiceCGST;
    // }
    // if(req.body.invoiceSGST != null){
    //     res.invoice.invoiceSGST = req.body.invoiceSGST;
    // }
    // if(req.body.invoiceUTGST != null){
    //     res.invoice.invoiceUTGST = req.body.invoiceUTGST;
    // }
    // if(req.body.invoiceSentTo != null){
    //     res.invoice.invoiceSentTo = req.body.invoiceSentTo;
    // }
    // if(req.body.invoiceSentBy != null){
    //     res.invoice.invoiceSentBy = req.body.invoiceSentBy;
    // }
    // if(req.body.invoicePaymentMode != null){
    //     res.invoice.invoicePaymentMode = req.body.invoicePaymentMode;
    // }
    // if(req.body.invoicePDF != null){
    //     res.invoice.invoicePDF = req.body.invoicePDF;
    // }
    // if(req.body.invoiceReport != null){
    //     res.invoice.invoiceReport = req.body.invoiceReport;
    // }
    // if(req.body.invoiceTime != null){
    //     res.invoice.invoiceTime = req.body.invoiceTime;
    // }
    // if(req.body.discount != null){
    //     res.invoice.discount = req.body.discount;
    // }
    // if(req.body.roundoff != null){
    //     res.invoice.roundoff = req.body.roundoff;
    // }
    // if(req.body.city != null){
    //     res.invoice.city = req.body.city;
    // }
    // if(req.body.extra1 != null){
    //     res.invoice.extra1 = req.body.extra1;
    // }
    // if(req.body.extra2 != null){
    //     res.invoice.extra2 = req.body.extra2;
    // }
    // if(req.body.extra3 != null){
    //     res.invoice.extra3 = req.body.extra3;
    // }
    // if(req.body.extra4 != null){
    //     res.invoice.extra4 = req.body.extra4;
    // }
    // if(req.body.extra5 != null){
    //     res.invoice.extra5 = req.body.extra5;
    // }
    try{
        const updateInvoice = await res.invoice.save();
        res.json(updateInvoice);
    } catch (err) {
        res.status(400).json({message: err.message});
    }
})

//deleting one
router.delete('/:id', getInvoice, async (req, res) => {
    // res.send(`deleting user ${req.params.id}`);
    try{
        await res.invoice.remove();
        res.json({message: 'Deleted this invoice'});
    }
    catch (err) {
        res.status(500).json({message: err.message});
    }
})

// old getting user by invoiceSentTo

// router.get('/filter/:invoiceSentTo/:invoiceSentBy', async (req, res) => {
//     // res.send(`getting user by invoiceSentTo ${req.params.invoiceSentTo}`);
//     try {
//     const invoice = await Invoice.find({invoiceSentTo: req.params.invoiceSentTo , invoiceSentBy: req.params.invoiceSentBy});
//     res.json(invoice);
//     } catch (err) {
//         res.status(500).json({message: err.message});
//     }
// })

//getting vendor by user ID (version 2)

// router.get('/filter/:id/:invoices', async (req, res) => {
//     // res.send(`getting user by invoiceSentTo ${req.params.invoiceSentTo}`);
//     try {
//     const invoice = await Invoice.aggregate([
//         {$match : {"_id": req.params.id}}, {$unwind: "$invoices"}, {$match: {"invoices.invoiceSentBy": req.params.invoices}}
//     ])
//     res.json(invoice);
//     } catch (err) {
//         res.status(500).json({message: err.message});
//     }
// })

//getting vendor by user ID

router.get('/findELe/:userid/:vendorid', async (req, res) => {
    try {
        const invoice = await Invoice.aggregate([
            {$match: {"_id":req.params.userid}},
            {$project: {
                "bussinessName": {
                    $filter: {
                        input: "$businessName",
                        as: "businessName",
                        cond: {$eq: ["$$businessName._id", req.params.vendorid]}

                    }
                }
            }}

        ])
        res.json(invoice);
    } catch (error) {
        res.status(500).json({message: error.message});
    }
})

//getting invoice of specific vendor by user ID

router.get('/findEle/:userid/:vendorid/:invoiceid', async (req, res) => {
    try {
        const invoice = await Invoice.aggregate([
            {$match: {"_id":req.params.userid}},
            {$unwind: "$businessName"},
            {$match: {"businessName._id": req.params.vendorid}},
            {$unwind: "$businessName.invoices"},
            {$match: {"businessName.invoices._id": mongoose.Types.ObjectId(req.params.invoiceid) }},
        ])
        res.json(invoice);
        
    } catch (error) {
        res.status(500).json({message: error.message});
        
    }
})

//adding inside businessName

router.post('/addEle/:userid', async (req, res) => {
    try {
        const invoice = await Invoice.findOneAndUpdate(
            {_id: req.params.userid},
            {$push: {businessName: req.body.businessName}},
        );
        res.json(invoice);
    } catch (error) {
        res.status(500).json({message: error.message});
    }
})

//adding inside specific businessName

router.post('/addEle/:userid/:vendorid', async (req, res) => {
    try {
        const invoice = await Invoice.update(
            {_id: req.params.userid, "businessName._id": req.params.vendorid},
            {$push: {'businessName.$.invoices': req.body.invoices}},
            
        );
        res.json(invoice);
    } catch (error) {
        res.status(500).json({message: error.message});
    }
})



// old getting by invoiceSentBy

// router.get('/vendoremail/:invoiceSentBy', async (req, res) => {
//     // res.send(`getting user by invoiceSentBy ${req.params.invoiceSentBy}`);
//     try {
//     const invoice = await Invoice.find({invoiceSentBy: req.params.invoiceSentBy});
//     res.json(invoice);
//     } catch (err) {
//         res.status(500).json({message: err.message});
//     }
// })

//getting vendor by invoiceSentBy v2

// router.get('/vendoremail/:invoices', async (req, res) => {
//     try {
//     const invoice = await Invoice.aggregate([
//         {$unwind: "$invoices"}, {$match: {"invoices.invoiceSentBy": req.params.invoices}}
//     ])
//     res.json(invoice);
//     } catch (err) {
//         res.status(500).json({message: err.message});
//     }
// })



// old getting user by invoiceSentTo

// router.get('/useremail/:invoiceSentTo', async (req, res) => {
//     // res.send(`getting user by invoiceSentTo ${req.params.invoiceSentTo}`);
//     try {
//     const invoice = await Invoice.find({invoiceSentTo: req.params.invoiceSentTo});
//     res.json(invoice);
//     } catch (err) {
//         res.status(500).json({message: err.message});
//     }
// })


async function getInvoice(req, res, next) {
    let invoice;
    try {
        invoice = await Invoice.findById(req.params.id);
        if (invoice == null) {
            return res.status(404).json({message: 'Cannot find invoice'});
        }
    } catch (err) {
        return res.status(500).json({message: err.message});
    }
    res.invoice = invoice;
    next();
}

module.exports = router;

