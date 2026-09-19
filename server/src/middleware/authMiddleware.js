import jwt from 'jsonwebtoken'
import { prisma } from '../config/db.js';

const authMiddleware = async (req, res, next) => {
    if (process.env.NODE_ENV === 'development' && process.env.AUTH_BYPASS === 'true') {
        if (!process.env.DEV_USER_ID) {
            return res.status(500).json({ message: "DEV_USER_ID is not configured" });
        }

        const user = await prisma.user.findUnique({
            where: { id: process.env.DEV_USER_ID }
        });

        if (!user) {
            return res.status(401).json({ message: "Development user not found" });
        }

        req.user = user;
        return next();
    }

    let token;
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        token = req.headers.authorization.split(' ')[1];
    } else if (req.cookies?.jwt) {
        token = req.cookies.jwt;
    }

    if (!token) {
        return res.status(401).json({ message: "Not authorized, no token" });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await prisma.user.findUnique({
            where: { id: decoded.id }
        });
        if (!user) {
            return res.status(401).json({ message: "Not authorized, user not found" });
        }
        req.user = user;
        next();

    } catch (error) {
        console.error(error);
        res.status(401).json({ message: "Not authorized, token failed" });
    }
};


export default authMiddleware;