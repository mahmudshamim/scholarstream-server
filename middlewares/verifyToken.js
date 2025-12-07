const jwt = require('jsonwebtoken');
const { getDB } = require('../config/db');

// Verify Token Middleware
const verifyToken = (req, res, next) => {
    if (!req.headers.authorization) {
        return res.status(401).send({ message: 'unauthorized access' });
    }
    const token = req.headers.authorization.split(' ')[1];
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
        if (err) {
            return res.status(401).send({ message: 'unauthorized access' });
        }
        req.decoded = decoded;
        next();
    });
};

// Verify Admin Middleware
const verifyAdmin = async (req, res, next) => {
    const email = req.decoded.email;
    const db = getDB();
    const query = { email: email };
    const user = await db.collection("users").findOne(query);
    const isAdmin = user?.role === 'admin';
    if (!isAdmin) {
        return res.status(403).send({ message: 'forbidden access' });
    }
    next();
};

// Verify Moderator Middleware
const verifyModerator = async (req, res, next) => {
    const email = req.decoded.email;
    const db = getDB();
    const query = { email: email };
    const user = await db.collection("users").findOne(query);
    const isModerator = user?.role === 'moderator' || user?.role === 'admin'; // Admin can also act as mod usually, or strictly mod
    if (!isModerator) {
        return res.status(403).send({ message: 'forbidden access' });
    }
    next();
};

module.exports = {
    verifyToken,
    verifyAdmin,
    verifyModerator
};
