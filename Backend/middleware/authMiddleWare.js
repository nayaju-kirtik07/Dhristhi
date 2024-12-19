const jwt = require("jsonwebtoken");
const User = require('../models/user');

const protect = async (req, res, next) => {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            token = req.headers.authorization.split(' ')[1];
            const decoded = jwt.verify(token, process.env.AccessToken);
            req.user = {
                userId: decoded.userId,
                isAdmin: decoded.isAdmin
            };
            next();
        } catch (error) {
            return res.status(401).json({
                success: false,
                message: "Not authorized to access this route"
            });
        }
    }

    if (!token) {
        return res.status(401).json({
            success: false,
            message: "Not authorized, no token"
        });
    }
};

const admin = (req, res, next) => {
    if (req.user && req.user.isAdmin) {
        next();
    } else {
        return res.status(401).json({
            success: false,
            message: "Not authorized as admin"
        });
    }
};

module.exports = { protect, admin };
