const express = require('express');
const router = express.Router();
const Report = require('../models/report');

//getting all
router.get('/', async (req, res) => {
    // res.send('getting all users');
    try {
    const report = await Report.find();
    res.json(report);
    } catch (err) {
        res.status(500).json({message: err.message});
    }
})

//getting one
router.get('/:id', getReport, (req, res) => {
    res.json(res.report);
})

//creating one
router.post('/', async (req, res) => {
    // res.send(`creating user ${req.body.name}`);
    const report = new Report({
        reportNumber: req.body.reportNumber,
        reportDate: req.body.reportDate,
        reportBy: req.body.reportBy,
        reportTitle: req.body.reportTitle,
        reportTime: req.body.reportTime,
        reportCustomerNumber : req.body.reportCustomerNumber,
        reportCustomerName : req.body.reportCustomerName,
        InvoiceID : req.body.InvoiceID,
        extra1 : req.body.extra1,
        extra2 : req.body.extra2,
        extra3 : req.body.extra3,
        extra4 : req.body.extra4,
        extra5 : req.body.extra5
    });
    try {
        const newReport = await report.save();
        res.status(201).json(newReport);
    } catch (err) {
        res.status(400).json({message: err.message});
    }
})


//updating one
router.patch('/:id', getReport, async (req, res) => {
    if (req.body.reportNumber != null) {
        res.report.reportNumber = req.body.reportNumber;
    }
    if (req.body.reportDate != null) {
        res.report.reportDate = req.body.reportDate;
    }
    if (req.body.reportBy != null) {
        res.report.reportBy = req.body.reportBy;
    }
    if (req.body.reportTitle != null) {
        res.report.reportTitle = req.body.reportTitle;
    }
    if (req.body.reportTime != null) {
        res.report.reportTime = req.body.reportTime;
    }
    if (req.body.reportCustomerNumber != null) {
        res.report.reportCustomerNumber = req.body.reportCustomerNumber;
    }
    if (req.body.reportCustomerName != null) {
        res.report.reportCustomerName = req.body.reportCustomerName;
    }
    if (req.body.InvoiceID != null) {
        res.report.InvoiceID = req.body.InvoiceID;
    }
    if (req.body.extra1 != null) {
        res.report.extra1 = req.body.extra1;
    }
    if (req.body.extra2 != null) {
        res.report.extra2 = req.body.extra2;
    }
    if (req.body.extra3 != null) {
        res.report.extra3 = req.body.extra3;
    }
    if (req.body.extra4 != null) {
        res.report.extra4 = req.body.extra4;
    }
    if (req.body.extra5 != null) {
        res.report.extra5 = req.body.extra5;
    }
    try {
        const updatedReport = await res.report.save();
        res.json(updatedReport);
    } catch (err) {
        res.status(400).json({message: err.message});
    }
})

//deleting one
router.delete('/:id', getReport, async (req, res) => {
    try {
        await res.report.remove();
        res.json({message: 'Deleted this report'});
    } catch (err) {
        res.status(500).json({message: err.message});
    }
})

async function getReport(req, res, next) {
    let report;
    try {
        report = await Report.findById(req.params.id);
        if (report == null) {
            return res.status(404).json({message: 'Cannot find report'});
    } } catch (err) {
        return res.status(500).json({message: err.message});
    }}


 module.exports = router