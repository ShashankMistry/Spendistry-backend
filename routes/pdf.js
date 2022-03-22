const express = require('express');
const router = express.Router();
const PDFDocument = require('pdfkit');
const fs = require('fs');




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



module.exports = router;