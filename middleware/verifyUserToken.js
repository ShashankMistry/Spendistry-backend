const jwt = require('jsonwebtoken');

module.exports = function(req, res, next){
    const token = req.header('auth-token');
    console.log(req.header);
    if (!token) {
        return res.status(401).send('Access denied. No token provided.');
    }
    try {
        const verify = jwt.verify(token, process.env.TOKEN_SECRET_USER);
        req.user = verify;
        next();
    } catch (error) {
        res.status(401).send('Invalid token.');
    }
}

