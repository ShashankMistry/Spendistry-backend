const express = require('express');
const router = express.Router();
const Vendor = require('../models/vendor');
const multer = require('multer');
const req = require('express/lib/request');
const fs = require('fs');


//getting all
router.get('/', async (req, res) => {
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
    const vendor = new Vendor({ 
        fname: req.body.fname,
        lname: req.body.lname,
        email: req.body.email,
        mobileNumber: req.body.mobileNumber,
        address: req.body.address,
        _id : req.body._id,
        lat: req.body.lat,
        lng: req.body.lng,
        vendorName: req.body.vendorName,
        tollFreeNumber: req.body.tollFreeNumber,
        currentInvoicenumber: req.body.currentInvoicenumber,
        website: req.body.website,
        city: req.body.city,
        state: req.body.state,
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

//storage engine
const storage = multer.diskStorage({
    destination: "./upload/images",
    filename: (req, file, cb) => {
        cb(null, req.params.id+".jpeg");
    }
});

const upload = multer({storage: storage});

//upload image
router.post('/uploadImage/:id',upload.single('vendorProfile') ,(req, res) => {
    try {
        res.send('uploaded');
    } catch (error) {
        res.send(505).json({message: error.message});
        console.log(error);
    }

});

//delete stored image in upload/image folder
router.delete('/deleteImage/:id', async (req, res) => {
    try {
        if(fs.existsSync('./upload/images/'+req.params.id+'.jpeg')){
            fs.unlinkSync('./upload/images/'+req.params.id+'.jpeg');
            res.send('deleted');

        } else {
            res.status(404).send("no image found");
        }
    } catch (error) {
        res.status(505).json({message: error.message});
        console.log(error);
    }
});


// updating one
router.patch('/:id',getVendor, async (req, res) => {
    if(req.body.fname != null){
        res.vendor.fname = req.body.fname;
    }
    if(req.body.lname != null){
        res.vendor.lname = req.body.lname;
    }
    if(req.body.email != null){
        res.vendor.email = req.body.email;
    }
    if(req.body.mobileNumber != null){
        res.vendor.mobileNumber = req.body.mobileNumber;
    }
    if(req.body.address!= null){
        res.vendor.address = req.body.address;
    }
    if(req.body.lat!= null){
        res.vendor.lat = req.body.lat;
    }
    if(req.body.lng!= null){
        res.vendor.lng = req.body.lng;
    }
    if(req.body.vendorName!= null){
        res.vendor.vendorName = req.body.vendorName;
    }
    if(req.body.tollFreeNumber != null){
        res.vendor.tollFreeNumber = req.body.tollFreeNumber;
    }
    if(req.body.vendorDescription!= null){
        res.vendor.vendorDescription = req.body.vendorDescription;
    }
    if(req.body.website!= null){
        res.vendor.website = req.body.website;
    }
    if(req.body.currentInvoiceNumber!= null){
        res.vendor.currentInvoiceNumber = req.body.currentInvoiceNumber;
    }
    if(req.body.city!= null){
        res.vendor.city = req.body.city;
    }
    if(req.body.state!= null){
        res.vendor.state = req.body.state;
    }
    if(req.body.extra1!= null){
        res.vendor.extra1 = req.body.extra1;
    }
    if(req.body.extra2!= null){
        res.vendor.extra2 = req.body.extra2;
    }
    if(req.body.extra3!= null){
        res.vendor.extra3 = req.body.extra3;
    }
    if(req.body.extra4!= null){
        res.vendor.extra4 = req.body.extra4;
    }
    if(req.body.extra5!= null){
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