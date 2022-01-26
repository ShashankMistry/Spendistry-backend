const express = require('express');
const router = express.Router();
const User = require('../models/user');

//getting all
router.get('/', async (req, res) => {
    // res.send('getting all users');
    try {
    const user = await User.find();
    res.json(user);
    } catch (err) {
        res.status(500).json({message: err.message});
    }
})

//getting one
router.get('/:id', getUser, (req, res) => {
    res.json(res.user);
})

//creating one
router.post('/', async (req, res) => {
    // res.send(`creating user ${req.body.name}`);
    const user = new User({ 
        fname: req.body.fname,
        lname: req.body.lname,
        email: req.body.email,
        password: req.body.password,
        mobileNumber: req.body.mobileNumber,
        address: req.body.address,
        _id : req.body._id,
        Date : req.body.Date,
        loggedIn: req.body.loggedIn,
        extra1 : req.body.extra1,
        extra2 : req.body.extra2,
        extra3 : req.body.extra3,
        extra4 : req.body.extra4,
        extra5 : req.body.extra5
    });
    try{
        const savedUser = await user.save();
        res.status(201).json(savedUser);
        
    } catch (err) {
        res.status(400).json({message: err.message});
    }
})

// updating one
router.patch('/:id',getUser, async (req, res) => {
    // res.send(`updating user ${req.params.id}`);
    if(req.body.fname != null){
        res.user.fname = req.body.fname;
    } 
    if(req.body.lname != null){
        res.user.lname = req.body.lname;
    }
    if(req.body.email != null){
        res.user.email = req.body.email;
    }
    if(req.body.password != null){
        res.user.password = req.body.password;
    }
    if(req.body.mobileNumber != null){
        res.user.mobileNumber = req.body.mobileNumber;
    }
    if(req.body.address){
        res.user.address = req.body.address;
    }
    if(req.body.extra1 != null){
        res.user.extra1 = req.body.extra1;
    }
    if(req.body.extra2 != null){
        res.user.extra2 = req.body.extra2;
    }
    if(req.body.extra3 != null){
        res.user.extra3 = req.body.extra3;
    }
    if(req.body.extra4 != null){
        res.user.extra4 = req.body.extra4;
    }
    if(req.body.extra5 != null){
        res.user.extra5 = req.body.extra5;
    }
    if(req.body.loggedIn != null){
        res.user.loggedIn = req.body.loggedIn;
    }
    if(req.body.Date != null){
        res.user.Date = req.body.Date;
    }
    try{
        const updatedUser = await res.user.save();
        res.json(updatedUser);
    } catch (err) {
        res.status(400).json({message: err.message});
    }
})

// deleting one
router.delete('/:id', getUser, async (req, res) => {
    // res.send(`deleting user ${req.params.id}`);
    try {
        await res.user.remove();
        res.json({ message: 'Deleted user' });

    } catch (err) {
        res.status(500).json({ message: err.message });
    }

})

//getting user by email
router.get('/email/:email', async (req, res) => {
    // res.send(`getting user by email ${req.params.email}`);
    try {
        const user = await User.find({email: req.params.email});
        res.json(user);
    } catch (err) {
        res.status(500).json({message: err.message});
    }
})

async function getUser(req, res, next) {
    let user
    try {
        user = await User.findById(req.params.id);
        if (user == null) {
            return res.status(404).json({ message: 'Cannot find user' });
        }
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
    res.user = user;
    next();

}

module.exports = router