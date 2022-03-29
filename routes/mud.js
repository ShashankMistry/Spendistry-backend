const express = require('express');
const router = express.Router();
const Invoice = require('../models/invoice');
const mongoose = require('mongoose');
const report = require('../models/report');
const user = require('../models/user');
const cryptoJS = require('crypto-js');

//get user dashboard
router.get('/:id', async (req, res) => {

     //hash the id with cryptoJS
     var encryptedQr = cryptoJS.AES.encrypt(req.params.id, process.env.QR_HASH_KEY).toString();

    try {
        const invoices = await Invoice.find({
            userId: req.params.id
        });
        const reports = await report.find({
            userId: req.params.id
        });
        const users = await user.find({
            _id: req.params.id
        });
        res.render('dashboard', {
            invoices: invoices,
            reports: reports,
            users: users,
            qr: encryptedQr
        });
                
    } catch (error) {
        res.status(500).send(error);
        
    }
});

module.exports = router;