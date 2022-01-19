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
        name: req.body.name,
        email: req.body.email,
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
    if(req.body.name != null){
        res.user.name = req.body.name;
    } 
    if(req.body.email != null){
        res.user.email = req.body.email;
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