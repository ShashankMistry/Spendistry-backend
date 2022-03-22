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
        const doc = new PDFDocument();
        res.setHeader('Content-disposition', 'attachment; filename='+req.params.vendorId+"_"+Date.now+'.pdf');
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
            doc.text("qnt"+item.quantity);
            doc.text("price"+item.price);
            doc.text("total"+item.total);

        });
        doc.text(`Lorem ipsum dolor sit amet consectetur adipisicing elit. Maxime mollitia,
        molestiae quas vel sint commodi repudiandae consequuntur voluptatum laborum
        numquam blanditiis harum quisquam eius sed odit fugiat iusto fuga praesentium
        optio, eaque rerum! Provident similique accusantium nemo autem. Veritatis
        obcaecati tenetur iure eius earum ut molestias architecto voluptate aliquam
        nihil, eveniet aliquid culpa officia aut! Impedit sit sunt quaerat, odit,
        tenetur error, harum nesciunt ipsum debitis quas aliquid. Reprehenderit,
        quia. Quo neque error repudiandae fuga? Ipsa laudantium molestias eos 
        sapiente officiis modi at sunt excepturi expedita sint? Sed quibusdam
        recusandae alias error harum maxime adipisci amet laborum. Perspiciatis 
        minima nesciunt dolorem! Officiis iure rerum voluptates a cumque velit 
        quibusdam sed amet tempora. Sit laborum ab, eius fugit doloribus tenetur 
        fugiat, temporibus enim commodi iusto libero magni deleniti quod quam 
        consequuntur! Commodi minima excepturi repudiandae velit hic maxime
        doloremque. Quaerat provident commodi consectetur veniam similique ad 
        earum omnis ipsum saepe, voluptas, hic voluptates pariatur est explicabo 
        fugiat, dolorum eligendi quam cupiditate excepturi mollitia maiores labore 
        suscipit quas? Nulla, placeat. Voluptatem quaerat non architecto ab laudantium
        modi minima sunt esse temporibus sint culpa, recusandae aliquam numquam 
        totam ratione voluptas quod exercitationem fuga. Possimus quis earum veniam 
        quasi aliquam eligendi, placeat qui corporis!`);
    

        doc.end();

        });
       
        
       

       

      

       
      
        
    } catch (error) {
        console.log(error);
    }
});



module.exports = router;