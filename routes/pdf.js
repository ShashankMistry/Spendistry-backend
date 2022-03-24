const express = require('express');
const router = express.Router();
const PDFDocument = require('pdfkit-table');
const fs = require('fs');
const Invoice = require('../models/invoice');
const mongoose = require('mongoose');
// const { fontSize } = require('pdfkit/js/mixins/fonts');



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
// router.get('/',  (req, res) => {
//     try {
//         const doc = new PDFDocument();
//         res.setHeader('Content-disposition', 'attachment; filename=invoice.pdf');
//         doc.pipe(res);
//         doc.text('Hello Om2');
//         doc.end();
        
//     } catch (error) {
//         console.log(error);
//     }
// });

//create a pdf for a specific invoice
router.get('/:userId/:vendorId/:invoiceId', async (req, res) => {
    try {

        const invoice = await Invoice.aggregate([
            {$match: {_id: req.params.userId}},
            {$unwind: '$businessName'},
            {$match: {"businessName._id": req.params.vendorId}},
            {$unwind: "$businessName.invoices"},
            {$match: {"businessName.invoices._id": mongoose.Types.ObjectId(req.params.invoiceId) }},
            {$project: {
                "invoices": "$businessName.invoices",
            }}
           

        ]).then(invoice => {
        
        // calling the function to create a pdf file
        const doc = new PDFDocument({
            size: 'A5',
        });


        // setting the header and sending the pdf file
        res.setHeader('Content-disposition', 'attachment; filename='+req.params.vendorId+"_"+Date.now()+'.pdf');
        doc.pipe(res);

        //setting meta data of the pdf file
        doc.info['Title'] = 'Invoice';
        doc.info['Author'] = req.params.vendorId;
        doc.info['Subject'] = 'Invoice';

        //title of the pdf file
        doc.fontSize(25).font('Helvetica').text(invoice[0].invoices.invoiceTitle.toUpperCase(), {
            underline: true
        });

        //business address
        doc.fontSize(12).font('Helvetica').text("Address: "+invoice[0].invoices.businessAddress, {
            align: 'left'
        });

        
      //city in upper case
      const city = invoice[0].invoices.city.toUpperCase();

        //subject to jurisdiction
        doc.fontSize(16).font('Helvetica').text('SUBJECT TO '+city+' JURISDICTION ONLY',{
            align: 'center'
        });

        //GST number
        doc.fontSize(12).font('Helvetica').text('GST No.: '+invoice[0].invoices.gstNumber, {
            align: 'left'
        });

        //vendor id
        doc.fontSize(12).font('Helvetica').text('Business ID: '+req.params.vendorId, {
            align: 'left'
        });

        //business contact number
        doc.fontSize(12).text('Contact No.: '+invoice[0].invoices.businessContactNo,{
            align: 'left'
        });

        //convert unix time to date
        const uxixDate = new Date(invoice[0].invoices.invoiceTime);
        const date = new Date(uxixDate * 1000);


        const dateString = date.toLocaleDateString();


        //invoice date and time
        doc.fontSize(12).text('Date: '+dateString, {
            align: 'left'
        });

        //user ID 
        doc.fontSize(12).text('User ID: '+req.params.userId);

        //Invoice number
        doc.fontSize(12).text('Invoice No.: '+invoice[0].invoices.invoiceNumber);

        
    
        const table = {
            headers: [
                {label: 'ITEM',  property: 'itemName'},
                {label: 'QUANTITY',  property: 'quantity'},
                {label: 'UNIT PRICE',  property: 'price'},
                {label: 'TOTAL', property: 'total'}
            ],
            datas:invoice[0].invoices.invoiceTotalitems
        }

        doc.table(table, {
            headerColor: '#000',
            prepareHeader: () => doc.fontSize(14).font('Helvetica'),
            prepareRow: () => doc.fontSize(12).font('Helvetica'),

        });


        //total amount
        doc.fontSize(12).font('Helvetica').text('Total: ₹'+invoice[0].invoices.invoiceAmount, {
            align: 'right'
        });

        //all kind of gst 
        doc.fontSize(12).font('Helvetica').text('IGST: '+invoice[0].invoices.invoiceIGST+'%', {
            align: 'left'
        });
        doc.fontSize(12).font('Helvetica').text('CGST: '+invoice[0].invoices.invoiceCGST+'%', {
            align: 'left'
        });
        doc.fontSize(12).font('Helvetica').text('SGST: '+invoice[0].invoices.invoiceSGST+'%', {
            align: 'left'
        });
        doc.fontSize(12).font('Helvetica').text('UTGST: '+invoice[0].invoices.invoiceUTGST+'%', {
            align: 'left'
        });

        //discount
        doc.fontSize(12).font('Helvetica').text('Discount: '+invoice[0].invoices.discount+'%', {
            align: 'left'
        });

        //payment method
        doc.fontSize(12).font('Helvetica').text('Payment Method: '+invoice[0].invoices.invoicePaymentMode, {
            align: 'left'
        });

        //net total (roundoff)
        doc.fontSize(12).font('Helvetica').text('Net Total: ₹'+invoice[0].invoices.roundoff, {
            align: 'left'
        });
        
        //invoice description
        doc.fontSize(12).font('Helvetica').text('Invoice Description: '+invoice[0].invoices.invoiceDescription,{
            align: 'left'
        });


        doc.end();

        });
       
        
    } catch (error) {
        console.log(error);
    }
});



module.exports = router;