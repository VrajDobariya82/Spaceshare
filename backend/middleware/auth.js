const jwt = require('jsonwebtoken');

// Verify JWT token and attach user to request
const auth = (req, res, next) => {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    if (!token) {
        return res.status(401).json({ message: 'No token, access denied' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback_secret');
        req.user = decoded.user; // { id, role }
        next();
    } catch (err) {
        res.status(401).json({ message: 'Token is not valid' });
    }
};

// Role-based middleware
const isOwner = (req, res, next) => {
    if (req.user.role !== 'owner') {
        return res.status(403).json({ message: `Access denied. Owners only. Your role: ${req.user.role}` });
    }
    next();
};

const isRenter = (req, res, next) => {
    if (req.user.role !== 'renter') {
        return res.status(403).json({ message: 'Access denied. Renters only.' });
    }
    next();
};

const isAdmin = (req, res, next) => {
    if (req.user.role !== 'admin') {
        return res.status(403).json({ message: 'Access denied. Admins only.' });
    }
    next();
};

module.exports = { auth, isOwner, isRenter, isAdmin };
