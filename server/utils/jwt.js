const jwt = require('jsonwebtoken');

const generateToken = (payload, secret, expiresIn) => {
    return jwt.sign(payload, secret, { expiresIn });
};

module.exports = {
    generateAccessToken: (payload) => generateToken(payload, process.env.JWT_SECRET, process.env.JWT_ACCESS_EXPIRY),
    generateRefreshToken: (payload) => generateToken(payload, process.env.JWT_REFRESH_SECRET, process.env.JWT_REFRESH_EXPIRY),
};
