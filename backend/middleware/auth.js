const jwt = require('jsonwebtoken');

module.exports = function (req, res, next) {
    // Get token from header
    const token = req.header('x-auth-token');

    // Check if no token
    if (!token) {
        return res.status(401).json({ msg: 'Ruxsat berilmadi, token yo\'q' });
    }

    // Verify token
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secretkey');
        req.user = decoded.user;
        next();
    } catch (err) {
        console.error('JWT Verification Error:', err.message);
        if (err.name === 'TokenExpiredError') {
            return res.status(401).json({ msg: 'Sessiya muddati tugagan', error: 'expired' });
        }
        res.status(401).json({ msg: 'Token noto\'g\'ri', error: 'invalid' });
    }
};
