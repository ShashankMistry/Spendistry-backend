const express = require('express');
const router = express.Router();
const AuthBusiness = require('../models/authBusiness');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const nodeMailer = require('nodemailer');
const otp = require('../models/otp');


router.get('/', async (req, res) => {
    // res.send('getting all users');
    try {
    const auth = await AuthBusiness.find();
    // enable cors
    // res.header('Access-Control-Allow-Origin', '*');

    res.json(auth);
    } catch (err) {
        res.status(500).json({message: err.message});
    }
})

// getting one

router.get('/:id',  getAuth, (req, res) => {
    // res.send(`getting user ${req.params.id}`);
    res.json(res.auth);
})

// creating one
router.post('/', async (req, res) => {
    // hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);

    const auth = new AuthBusiness({
        _id : req.body._id,
        password : hashedPassword,
        // LoggedIn : req.body.LoggedIn,
        // isVerified : req.body.isVerified
    });
    try{
        const savedAuth = await auth.save();
        res.status(201).json(savedAuth);
        
    }
    catch (err) {
        res.status(400).json({message: err.message});
    }
})

//vendor login
router.post('/vendorLogin', async (req, res) => {
    try {
        // console.log(req.body);
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
        // console.log(vendor);



    } catch (err) {
        res.status(500).json({message: err.message});
    }
})


// updating one
router.patch('/:id', getAuth, async (req, res) => {

    //hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);

    if(req.body.password != null){
        res.auth.password = hashedPassword;
    }
    // if(req.body.LoggedIn != null){
    //     res.auth.LoggedIn = req.body.LoggedIn;
    // }
    // if(req.body.isVerified != null){
    //     res.auth.isVerified = req.body.isVerified;
    // }
    try{
        const updatedAuth = await res.auth.save();
        res.json(updatedAuth);
        
    } catch (err) {
        res.status(400).json({message: err.message});
    }
})

//mailer 
const mailer = async (email, subject, text) => {
    try {
    var transporter = nodeMailer.createTransport({
        host: process.env.HOST,
        service: process.env.SERVICE,
        port: 465,
        secure: true,
        auth: {
            user: process.env.USER,
            pass: process.env.PASS
        }
        });

        var mailOptions = {
            from: process.env.USER,
            to: email,
            subject: subject,
            text: text
        };

      await  transporter.sendMail(mailOptions, function(error, info){
            if (error) {
                console.log(error);
            } else {
                console.log('Email sent: ' + info.response);
            }
        });
        
    } catch (error) {
        console.log(error);
        
    }

}

//send otp if password is forgotten
router.post('/forgetPassword', async (req, res) => {
    try {
        const vendor = await AuthBusiness.findOne({_id: req.body._id});
        if (vendor) {
            let otpcode = Math.floor(100000 + Math.random() * 900000);
            let subject = 'OTP for your account';
            let text = 'Your OTP is ' + otpcode;
            await mailer(req.body.email, subject, text);
            const otp = new otp({
                _id : req.body._id,
                otp : otpcode
            });
            const savedOtp = await otp.save();
            res.status(201).json("OTP sent");

        } else{
            res.status(404).json("Cannot find vendor");
        }
        
    } catch (err) {
        res.status(400).json({message: err.message});
    }
});

// deleting one
router.delete('/:id', getAuth, async (req, res) => {
    // res.send(`deleting user ${req.params.id}`);
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