const express = require('express');
const router = express.Router();
const Auth = require('../models/auth');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// getting all

// router.get('/', async (req, res) => {
//     // res.send('getting all users');
//     try {
//     const auth = await Auth.find();
//     res.json(auth);
//     } catch (err) {
//         res.status(500).json({message: err.message});
//     }
// })

// getting one

// router.get('/:id', getAuth, (req, res) => {
//     // res.send(`getting user ${req.params.id}`);
//     res.json(res.auth);
// })

// creating one
router.post('/', async (req, res) => {

    //hashing the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);

    const auth = new Auth({
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


//user login
router.post('/userLogin', async (req, res) => {
    try {
        const user = await Auth.findOne({_id: req.body._id});
        if (!user) {
            // return res.status(404).json({message: 'Cannot find user email'});
            return res.send({message: 'Cannot find user email'});
        }
        const passwordIsValid = await bcrypt.compare(req.body.password, user.password);
        if (!passwordIsValid) {
            // return res.status(401).json({message: 'Invalid Password'});
            return res.send({message: 'Invalid Password'});
        }

        //create and assing a token
        const token = jwt.sign({_id: user._id}, process.env.TOKEN_SECRET_USER);
        res.header('auth-token', token).send(token);


        // res.status(200).json({message: 'Successfully logged in'});


    } catch (err) {
        return res.status(500).json({message: err.message});
    }
})   


// updating one
router.patch('/:id', getAuth, async (req, res) => {
    // hash the password
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
        auth = await Auth.findById(req.params.id);
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