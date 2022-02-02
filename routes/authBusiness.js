const express = require('express');
const router = express.Router();
const AuthBusiness = require('../models/authBusiness');

// getting all
router.get('/', async (req, res) => {
    // res.send('getting all users');
    try {
    const auth = await AuthBusiness.find();
    res.json(auth);
    } catch (err) {
        res.status(500).json({message: err.message});
    }
})

// getting one
router.get('/:id', getAuth, (req, res) => {
    // res.send(`getting user ${req.params.id}`);
    res.json(res.auth);
})

// creating one
router.post('/', async (req, res) => {
    // res.send(`creating user ${req.body.name}`);
    const auth = new AuthBusiness({
        _id : req.body._id,
        password : req.body.password,
        LoggedIn : req.body.LoggedIn,
        isVerified : req.body.isVerified
    });
    try{
        const savedAuth = await auth.save();
        res.status(201).json(savedAuth);
        
    }
    catch (err) {
        res.status(400).json({message: err.message});
    }
})

// updating one
router.patch('/:id', getAuth, async (req, res) => {
    // res.send(`updating user ${req.params.id}`);
    if(req.body.password != null){
        res.auth.password = req.body.password;
    }
    if(req.body.LoggedIn != null){
        res.auth.LoggedIn = req.body.LoggedIn;
    }
    if(req.body.isVerified != null){
        res.auth.isVerified = req.body.isVerified;
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