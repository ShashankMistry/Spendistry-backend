const express = require('express');
const router = express.Router();
const AuthBusiness = require('../models/authBusiness');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const nodeMailer = require('nodemailer');
const otp = require('../models/otp');
const itemsPrices = require('../models/ItemPricesList');
const vendor = require('../models/vendor');


router.get('/', async (req, res) => {
    try {
    const auth = await AuthBusiness.find();
    res.json(auth);
    } catch (err) {
        res.status(500).json({message: err.message});
    }
})

// getting one
router.get('/:id',  getAuth, (req, res) => {
    res.json(res.auth);
})

// creating one
router.post('/', async (req, res) => {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);

    const auth = new AuthBusiness({
        _id : req.body._id,
        password : hashedPassword,
    });
    try{
        const savedAuth = await auth.save();
        await new itemsPrices({
            _id : req.body._id,
        }).save();
        res.status(201).json(savedAuth);
        
    }
    catch (err) {
        res.status(400).json({message: err.message});
    }
})

//vendor login
router.post('/vendorLogin', async (req, res) => {
    try {
        const vendor = await AuthBusiness.findOne({_id: req.body._id});
        if (!vendor) {
            return res.status(404).json({message: 'Cannot find vendor email'});
        }
        const passwordIsValid = await bcrypt.compare(req.body.password, vendor.password);
        if (!passwordIsValid) {
            return res.status(401).json({message: 'Invalid Password'});
        }
        const token = jwt.sign({_id: vendor._id}, process.env.TOKEN_SECRET_VENDOR);
        res.header('auth-token-vendor', token).send(token);
    } catch (err) {
        res.status(500).json({message: err.message});
    }
})


// updating one
router.patch('/:id', getAuth, async (req, res) => {

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);

    if(req.body.password != null){
        res.auth.password = hashedPassword;
    }
    try{
        const updatedAuth = await res.auth.save();
        res.json(updatedAuth);
        
    } catch (err) {
        res.status(400).json({message: err.message});
    }
})


// deleting one
router.delete('/:id', getAuth, async (req, res) => {
    try{
        await res.auth.remove();
        res.json({message: 'Deleted This Auth'});
    } catch (err) {
        res.status(500).json({message: err.message});
    }
})

async function getAuth(req, res, next) {
    let auth;
    try {
        auth = await AuthBusiness.findById(req.params.id);
        if (auth == null) {
            return res.status(404).json({message: 'Cannot find auth'});
        }
    } catch (err) {
        return res.status(500).json({message: err.message});
    }
    res.auth = auth;
    next();
}


module.exports = router;