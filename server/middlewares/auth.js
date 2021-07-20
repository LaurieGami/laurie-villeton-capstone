const jwt = require('jsonwebtoken');

require('dotenv').config();

const JWT_SECRET = process.env.JWT_SECRET;

const authorize = (req, res, next) => {
    if (!req.headers.authorization) return res.status(401).json({ message: 'This route requires authentication token' });

    const token = req.headers.authorization.split(' ')[1];

    jwt.verify(token, JWT_SECRET, (err, decoded) => {
        if (err) return res.status(401).json({ message: 'The authentication token is invalid' });

        req.decoded = decoded;
        next();
    })
}

module.exports = authorize;