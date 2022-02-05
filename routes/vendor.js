const express = require('express');
const router = express.Router();
const Vendor = require('../models/vendor');

//getting all
router.get('/', async (req, res) => {
    // res.send('getting all users');
    try {
    const vendor = await Vendor.find();
    res.json(vendor);
    } catch (err) {
        res.status(500).json({message: err.message});
    }
})

//getting one
router.get('/:id', getVendor, (req, res) => {
    res.json(res.vendor);
})

//creating one
router.post('/', async (req, res) => {
    // res.send(`creating user ${req.body.name}`);
    const vendor = new Vendor({ 
        fname: req.body.fname,
        lname: req.body.lname,
        email: req.body.email,
        password: req.body.password,
        mobileNumber: req.body.mobileNumber,
        address: req.body.address,
        _id : req.body._id,
        latlong: req.body.latlong,
        lat: req.body.lat,
        lng: req.body.lng,
        vendorName: req.body.vendorName,
        tollFreeNumber: req.body.tollFreeNumber,
        currentInvoicenumber: req.body.currentInvoicenumber,
        panNumber: req.body.panNumber,
        gstNumber: req.body.gstNumber,
        itemsPrices: req.body.itemsPrices,
        website: req.body.website,
        extra1: req.body.extra1,
        extra2: req.body.extra2,
        extra3: req.body.extra3,
        extra4: req.body.extra4,
        extra5: req.body.extra5
    });
    try{
        const savedUser = await vendor.save();
        res.status(201).json(savedUser);
        
    } catch (err) {
        res.status(400).json({message: err.message});
    }

})

// updating one
router.patch('/:id',getVendor, async (req, res) => {
    // res.send(`updating user ${req.params.id}`);
    if(req.body.fname != null){
        res.vendor.fname = req.body.fname;
    }
    if(req.body.lname != null){
        res.vendor.lname = req.body.lname;
    }
    if(req.body.email != null){
        res.vendor.email = req.body.email;
    }
    if(req.body.password != null){
        res.vendor.password = req.body.password;
    }
    if(req.body.mobileNumber != null){
        res.vendor.mobileNumber = req.body.mobileNumber;
    }
    if(req.body.address){
        res.vendor.address = req.body.address;
    }
    if(req.body.latlong){
        res.vendor.latlong = req.body.latlong;
    }
    if(req.body.vendorName){
        res.vendor.vendorName = req.body.vendorName;
    }
    if(req.body.tollFreeNumber){
        res.vendor.tollFreeNumber = req.body.tollFreeNumber;
    }
    if(req.body.website){
        res.vendor.website = req.body.website;
    }
    if(req.body.currentInvoicenumber){
        res.vendor.currentInvoicenumber = req.body.currentInvoicenumber;
    }
    if(req.body.panNumber){
        res.vendor.panNumber = req.body.panNumber;
    }
    if(req.body.gstNumber){
        res.vendor.gstNumber = req.body.gstNumber;
    }
    if(req.body.itemsPrices){
        res.vendor.itemsPrices = req.body.itemsPrices;
    }
    if(req.body.extra1){
        res.vendor.extra1 = req.body.extra1;
    }
    if(req.body.extra2){
        res.vendor.extra2 = req.body.extra2;
    }
    if(req.body.extra3){
        res.vendor.extra3 = req.body.extra3;
    }
    if(req.body.extra4){
        res.vendor.extra4 = req.body.extra4;
    }
    if(req.body.extra5){
        res.vendor.extra5 = req.body.extra5;
    }
    try{
        const savedVendor = await res.vendor.save();
        res.status(201).json(savedVendor);
    }
    catch (err) {
        res.status(400).json({message: err.message});
    }
})

//deleting one
router.delete('/:id', getVendor, async (req, res) => {
    // res.send(`deleting user ${req.params.id}`);
    try{
        await res.vendor.remove();
        res.json({message: 'Deleted this vendor'});
    }
    catch (err) {
        res.status(500).json({message: err.message});
    }
})

async function getVendor(req, res, next) {
    let vendor;
    try {
        vendor = await Vendor.findById(req.params.id);
        if (vendor == null) {
            return res.status(404).json({message: 'Cannot find Vendor'});
        }
    } catch (err) {
        return res.status(500).json({message: err.message});
    }
    res.vendor = vendor;
    next();
}

module.exports = router;