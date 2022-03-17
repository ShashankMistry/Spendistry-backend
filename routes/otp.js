const express = require('express');
const router = express.Router();
const AuthBusiness = require('../models/authBusiness');
const nodeMailer = require('nodemailer');
const otp = require('../models/otp');
const auth = require('../models/auth');


//get otp
router.get('/getOtp/all', async (req, res) => {
    try {
        const otp1 = await otp.find();
        res.json(otp1);
    } catch (err) {
        res.status(400).json({message: err.message});
    }
});

//mailer 
const mailer = (email, subject, text) => {
    try {
    var transporter = nodeMailer.createTransport({
        host: process.env.HOST,
        service: process.env.SERVICE,
        port: 465,
        secure: true,
        auth: {
            user: process.env.USER,
            pass: process.env.PASS
        },
        tls: {
            rejectUnauthorized: false
        }

        });

        var mailOptions = {
            from: process.env.USER,
            to: email,
            subject: subject,
            text: text
        };

        transporter.sendMail(mailOptions, function(error, info){
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
router.post('/forgotPassword', async (req, res) => {
    try {
        const vendor = await AuthBusiness.findOne({_id: req.body.email});
        if (vendor) {
            let otpcode = Math.floor(100000 + Math.random() * 900000);
            let subject = 'OTP for your spendistry account';
            let text = 'Your OTP is ' + otpcode;
            let email = req.body.email;
            mailer(email, subject, text);

            //hash the otp
            // const salt = await bcrypt.genSalt(10);
            // const hashedOtp = await bcrypt.hash(otpcode, salt);

            const otpData = new otp({
                email : req.body.email,
                otp : otpcode
            });
            const savedOtp = await otpData.save();

            //delete otp
            // const deleteOtp = await otp.findOneAndDelete({email: req.body.email});

            res.status(201).json("OTP sent");

        } else{
            res.status(404).json("Cannot find vendor");
        }
        
    } catch (err) {
        res.status(400).json({message: err.message});
    }
});


//verify otp
router.post('/verifyOtp', async (req, res) => {
    try {
        const email = await otp.findOne({email: req.body.email});
        console.log("om", email);
        if (!email) {
            return res.status(401).json({message: 'Cannot find email'});
        
        }
        const otpData = await otp.findOne({otp: req.body.otp});
        if (!otpData) {
            return res.status(401).json({message: 'Incorrect otp'});
        }
        if(email && otpData){
        const deleteOtp = await otp.findOneAndDelete({otp: req.body.otp});
        res.json("OTP verified");
        console.log(email);
        }
        
    } catch (error) {
        res.status(400).json({message: error.message});
        
    }
});


//delete by email in otp
router.delete('/deleteOtp/:email', async (req, res) => {
    try {
        const deleteOtp = await otp.findOneAndDelete({email: req.params.email});
        res.json(deleteOtp);
    } catch (err) {
        res.status(400).json({message: err.message});
    }
});

//delte all email in otp
router.delete('/deleteAllOtp', async (req, res) => {
    try {
        const deleteAllOtp = await otp.deleteMany();
        res.json(deleteAllOtp);
    } catch (err) {
        res.status(400).json({message: err.message});
    }
});


module.exports = router;
