const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
    const authHeader = req.headers.authorization;
    const token = authHeader?.split(' ')[1] || req.cookies.accessToken;

    if (!token) {
        return res.status(401).json({ message: "Токен не предоставлен" });
    }

    try {
        const payload = jwt.verify(token, process.env.JWT_SECRET);
        req.user = payload;
        return next();
    } catch (error) {
        console.error(`[${new Date().toISOString()}] Token error:`, error.message);
        return res.status(401).json({ message: 'Invalid or expired token' });
    }
};
