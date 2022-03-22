const express = require('express');
const router = express.Router();
const PDFDocument = require('pdfkit');
const fs = require('fs');
const Invoice = require('../models/invoice');
const mongoose = require('mongoose');



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
            {$project: {
                "invoices": "$businessName.invoices",
            }}
           

        ]).then(invoice => {
        const doc = new PDFDocument();
        res.setHeader('Content-disposition', 'attachment; filename='+req.body.vendorId+Date.now+'.pdf');
        doc.pipe(res);
        doc.text('Hello Om');
        doc.text('Invoice Number: '+invoice[0].invoices.invoiceNumber);
        doc.text('reason'+invoice[0].invoices.reportReason);

        // doc.text(invoice[0].businessName.invoices.invoiceDate);
        doc.text(invoice[0].invoices.invoiceSentBy);
        doc.text(invoice[0].invoices.invoiceSentTo);
        doc.text(invoice[0].invoices.invoiceTitle);
        doc.text(invoice[0].invoices.invoiceTime);
        // doc.text(invoice[0].businessName.invoices.customerNumber);
        // doc.text(invoice[0].businessName.invoices.customerName);
        // doc.text(invoice[0].businessName.invoices.businessName);
        doc.text(invoice[0].invoices.businessContactNo);
        // doc.text(invoice[0].businessName.invoices.reportReason);
        // doc.text(invoice[0].businessName.invoices.InvoiceID);
        doc.text(invoice[0].invoices.invoiceAmount);
        doc.text(invoice[0].invoices.invoiceIGST);
        doc.text(invoice[0].invoices.invoiceCGST);
        doc.text(invoice[0].invoices.invoiceSGST);
        invoice[0].invoices.invoiceTotalitems.map(item => {
            doc.text("name: "+item.itemName);
            doc.text("qnt"+item.itemQuantity);
            doc.text("price"+item.itemPrice);
            doc.text("total"+item.itemTotal);

        });
        doc.text(invoice[0].invoices.invoiceTotalitems);

        doc.end();

        });
       
        
       

       

      

       
      
        
    } catch (error) {
        console.log(error);
    }
});



module.exports = router;