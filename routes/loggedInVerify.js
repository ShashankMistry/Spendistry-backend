const express = require('express');
const router = express.Router();
const verifyUserToken = require('../middleware/verifyUserToken');

router.post('/', verifyUserToken, async (req, res) => {
    res.send('User Verified');
});


module.exports = router;