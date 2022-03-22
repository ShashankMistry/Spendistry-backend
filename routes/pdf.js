const express = require('express');
const router = express.Router();
const PDFDocument = require('pdfkit');
const fs = require('fs');
const Invoice = require('../models/invoice');



//get a new PDF file
// router.get('/', (req, res) => {
//     res.download('upload/pdf/invoice.pdf');
// });

//create a new PDF file inside upload/pdf folder
// router.get('/',  (req, res) => {
//     doc.pipe(fs.createWriteStream('upload/pdf/invoice.pdf'));
//     doc.pipe(res);
//     doc.text('Hello Om');
//     doc.end();
//     // delete pdf file after download
    
//     // fs.unlink('upload/pdf/invoice.pdf', (err) => {
//     //     // if (err) throw err;
//     //     console.log('successfully deleted');
//     // })
    
    
// });

//creat a new PDF file inside upload/pdf folder
router.get('/',  (req, res) => {
    try {
        const doc = new PDFDocument();
        res.setHeader('Content-disposition', 'attachment; filename=invoice.pdf');
        doc.pipe(res);
        doc.text('Hello Om2');
        doc.end();
        
    } catch (error) {
        console.log(error);
    }
});

//create a pdf for a specific invoice
router.post('/', async (req, res) => {
    try {
        const invoice = await Invoice.aggregate([
            {$match: {_id: req.body.userId}},
            {$unwind: '$businessName'},
            {$match: {"businessName._id": req.body.vendorId}},
            {$unwind: "$businessName.invoices"},
            {$match: {"businessName.invoices._id": mongoose.Types.ObjectId(req.body.invoiceId) }},

        ]);
        
    } catch (error) {
        console.log(error);
    }
});



module.exports = router;