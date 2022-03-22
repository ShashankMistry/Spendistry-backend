const express = require('express');
const router = express.Router();
const PDFDocument = require('pdfkit');
const fs = require('fs');
const multer = require('multer');

const doc = new PDFDocument();

//setting up storage to save pdf
const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, './upload/pdf');
    },
    filename: function(req, file, cb) {
        cb(null, file.originalname);
    }
});

//store a pdf file
const upload = multer({ storage: storage });

//create a pdf
router.post('/pdf', upload.single('pdf'), (req, res) => {
    
});


//create a new PDF file
// router.get('/', (req, res) => {
//     doc.pipe(fs.createWriteStream('invoice.pdf'));
//     doc.pipe(res);
//     doc.text('Hello World1');
//     doc.end();
//     res.download('invoice.pdf');
// });


module.exports = router;